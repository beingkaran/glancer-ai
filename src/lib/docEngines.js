/*
 * docEngines — in-browser document converters for the Custom AI Tools suite.
 *
 * Unlike toolEngines (which return { output: string }), these return a binary
 * result the ToolRunner downloads as a file:
 *   { blob: Blob, filename: string, stats?: [{label,value}], note?, error? }
 *
 * Everything runs client-side (no backend), matching the static Cloudflare
 * deploy. Fidelity is intentionally "good enough, free":
 *   • Word → PDF keeps text, headings, lists, tables and images.
 *   • PDF → Word rebuilds selectable text as editable paragraphs; PDF layout
 *     (columns, exact positioning, fonts) is not recoverable client-side, and
 *     scanned/image PDFs need OCR (reported as a friendly error).
 */

import { jsPDF } from 'jspdf';
import mammoth from 'mammoth/mammoth.browser';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// pdf.js needs its worker; Vite resolves the bundled worker via the ?url import.
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

const collapse = (s) => (s == null ? '' : String(s)).replace(/\s+/g, ' ').trim();
const wordsIn = (s) => (s ? s.split(/\s+/).filter(Boolean).length : 0);

/* ----------------------------------------------------------- Word → PDF */

export async function wordToPdf({ file }) {
  if (!file) return { error: 'Choose a Word .docx file first.' };
  if (!/\.docx$/i.test(file.name)) {
    return { error: /\.doc$/i.test(file.name)
      ? 'Old .doc files are not supported — open it in Word and "Save As" .docx, then try again.'
      : 'Please upload a Word .docx file.' };
  }

  let html;
  try {
    const arrayBuffer = await file.arrayBuffer();
    ({ value: html } = await mammoth.convertToHtml({ arrayBuffer }));
  } catch {
    return { error: 'Could not read this document — it may be corrupt or not a real .docx.' };
  }

  const dom = new DOMParser().parseFromString(html || '<p></p>', 'text/html');
  const pdf = new jsPDF({ unit: 'pt', format: 'a4', compress: true });
  const margin = 56;
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const maxW = pageW - margin * 2;
  let y = margin;
  let wordCount = 0;

  const ensure = (h) => { if (y + h > pageH - margin) { pdf.addPage(); y = margin; } };

  const writeBlock = (text, { size = 11, bold = false, gapBefore = 0, gapAfter = 6, bullet = false } = {}) => {
    if (!text) { y += gapAfter; return; }
    pdf.setFont('helvetica', bold ? 'bold' : 'normal');
    pdf.setFontSize(size);
    y += gapBefore;
    const indent = bullet ? 16 : 0;
    const lines = pdf.splitTextToSize((bullet ? '•  ' : '') + text, maxW - indent);
    const lh = size * 1.35;
    for (const ln of lines) { ensure(lh); pdf.text(ln, margin + indent, y); y += lh; }
    y += gapAfter;
  };

  const addImage = (src) => {
    if (!src || !src.startsWith('data:')) return;
    try {
      const props = pdf.getImageProperties(src);
      const w = Math.min(maxW, props.width);
      const h = (props.height / props.width) * w;
      ensure(h + 8);
      pdf.addImage(src, margin, y, w, h);
      y += h + 8;
    } catch { /* unsupported image — skip */ }
  };

  // Walk block elements in document order; tables are handled as a unit, so we
  // skip text nodes already inside one to avoid rendering them twice.
  const blocks = dom.body.querySelectorAll('h1,h2,h3,h4,p,li,img,table');
  blocks.forEach((el) => {
    const tag = el.tagName.toLowerCase();
    if (tag !== 'table' && el.closest('table')) return;

    if (tag === 'table') {
      el.querySelectorAll('tr').forEach((tr) => {
        const row = [...tr.querySelectorAll('td,th')].map((c) => collapse(c.textContent)).join('   |   ');
        wordCount += wordsIn(row);
        writeBlock(row, { size: 10, gapAfter: 3 });
      });
      y += 4;
      return;
    }
    if (tag === 'img') { addImage(el.getAttribute('src')); return; }

    const txt = collapse(el.textContent);
    wordCount += wordsIn(txt);
    if (tag === 'h1') writeBlock(txt, { size: 20, bold: true, gapBefore: 8, gapAfter: 8 });
    else if (tag === 'h2') writeBlock(txt, { size: 16, bold: true, gapBefore: 6, gapAfter: 6 });
    else if (tag === 'h3' || tag === 'h4') writeBlock(txt, { size: 13, bold: true, gapBefore: 6, gapAfter: 4 });
    else if (tag === 'li') writeBlock(txt, { size: 11, bullet: true, gapAfter: 3 });
    else writeBlock(txt, { size: 11 });

    // An image nested directly inside a paragraph still needs rendering.
    if (tag === 'p') el.querySelectorAll('img').forEach((im) => addImage(im.getAttribute('src')));
  });

  const blob = pdf.output('blob');
  return {
    blob,
    filename: file.name.replace(/\.docx$/i, '') + '.pdf',
    stats: [
      { label: 'Pages', value: pdf.getNumberOfPages() },
      { label: 'Words', value: wordCount.toLocaleString() },
    ],
    note: 'Text, headings, lists, tables and images are preserved. Complex layouts (multi-column, precise table styling, custom fonts) may shift — this is a free in-browser conversion.',
  };
}

/* ----------------------------------------------------------- PDF → Word */

export async function pdfToWord({ file }) {
  if (!file) return { error: 'Choose a PDF file first.' };
  if (!/\.pdf$/i.test(file.name)) return { error: 'Please upload a .pdf file.' };

  let pdf;
  try {
    const data = await file.arrayBuffer();
    pdf = await pdfjsLib.getDocument({ data }).promise;
  } catch {
    return { error: 'Could not open this PDF — it may be corrupt or password-protected.' };
  }

  const children = [];
  let wordCount = 0;

  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    const content = await page.getTextContent();

    // Each text item carries a position; group items into lines by y, ordered
    // top-to-bottom then left-to-right, to reconstruct reading order.
    const items = content.items
      .filter((it) => typeof it.str === 'string')
      .map((it) => ({ str: it.str, x: it.transform[4], y: it.transform[5] }))
      .sort((a, b) => (Math.abs(a.y - b.y) > 2 ? b.y - a.y : a.x - b.x));

    const pageParas = [];
    let line = null, lastY = null;
    for (const it of items) {
      if (lastY === null || Math.abs(it.y - lastY) > 4) { line = []; pageParas.push(line); lastY = it.y; }
      line.push(it.str);
    }

    pageParas.forEach((ln, i) => {
      const text = collapse(ln.join(' '));
      if (!text) return;
      wordCount += wordsIn(text);
      children.push(new Paragraph({
        children: [new TextRun(text)],
        // Force a page break before the first line of every page after page 1.
        pageBreakBefore: p > 1 && i === 0,
      }));
    });
  }

  if (!wordCount) {
    return { error: 'No selectable text found — this looks like a scanned or image-only PDF. Converting it to Word would require OCR, which this free tool does not run.' };
  }

  const doc = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(doc);
  return {
    blob,
    filename: file.name.replace(/\.pdf$/i, '') + '.docx',
    stats: [
      { label: 'Pages', value: pdf.numPages },
      { label: 'Words', value: wordCount.toLocaleString() },
    ],
    note: 'Text is extracted and rebuilt as fully editable paragraphs. Exact PDF layout (columns, positioning, images, fonts) is not preserved — that is an inherent limit of client-side PDF→Word.',
  };
}
