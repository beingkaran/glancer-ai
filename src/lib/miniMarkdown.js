/*
 * miniMarkdown — a tiny, dependency-free Markdown→HTML renderer used only to
 * preview tool output. It HTML-escapes first, so the output is safe to inject
 * with dangerouslySetInnerHTML. Supports headings, bold/italic, inline code,
 * links, blockquotes, hr, ordered/unordered lists and GFM pipe tables.
 */

const esc = (s) => s
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const inline = (s) => esc(s)
  .replace(/`([^`]+)`/g, '<code>$1</code>')
  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>')
  .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

function renderTable(rows) {
  const cells = (line) => line.replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
  const head = cells(rows[0]);
  const body = rows.slice(2).map(cells);
  return '<table><thead><tr>' +
    head.map((h) => `<th>${inline(h)}</th>`).join('') +
    '</tr></thead><tbody>' +
    body.map((r) => '<tr>' + head.map((_, i) => `<td>${inline(r[i] || '')}</td>`).join('') + '</tr>').join('') +
    '</tbody></table>';
}

export function renderMarkdown(md) {
  const lines = String(md).replace(/\r\n/g, '\n').split('\n');
  const html = [];
  let i = 0;

  const isTableSep = (l) => /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(l);

  while (i < lines.length) {
    const line = lines[i];

    // table: header | separator | rows
    if (line.includes('|') && lines[i + 1] && isTableSep(lines[i + 1])) {
      const block = [line, lines[i + 1]];
      i += 2;
      while (i < lines.length && lines[i].includes('|')) { block.push(lines[i]); i++; }
      html.push(renderTable(block));
      continue;
    }

    // headings
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) { html.push(`<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`); i++; continue; }

    // horizontal rule
    if (/^---+$/.test(line.trim())) { html.push('<hr/>'); i++; continue; }

    // blockquote
    if (/^>\s?/.test(line)) { html.push(`<blockquote>${inline(line.replace(/^>\s?/, ''))}</blockquote>`); i++; continue; }

    // unordered list
    if (/^[-*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) { items.push(`<li>${inline(lines[i].replace(/^[-*]\s+/, ''))}</li>`); i++; }
      html.push(`<ul>${items.join('')}</ul>`);
      continue;
    }

    // ordered list
    if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) { items.push(`<li>${inline(lines[i].replace(/^\d+\.\s+/, ''))}</li>`); i++; }
      html.push(`<ol>${items.join('')}</ol>`);
      continue;
    }

    // blank line
    if (!line.trim()) { i++; continue; }

    // paragraph (gather consecutive non-block lines)
    const para = [line];
    i++;
    while (i < lines.length && lines[i].trim() && !/^(#{1,6}\s|[-*]\s|\d+\.\s|>\s?|---+$)/.test(lines[i]) && !(lines[i].includes('|') && lines[i + 1] && isTableSep(lines[i + 1]))) {
      para.push(lines[i]); i++;
    }
    html.push(`<p>${inline(para.join(' '))}</p>`);
  }
  return html.join('\n');
}
