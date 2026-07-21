import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './index.css';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NewsletterPopup from './components/NewsletterPopup';
import HomePage from './pages/HomePage';
import MetricsPage from './pages/MetricsPage';
import GlossaryPage from './pages/GlossaryPage';
import AIToolsPage from './pages/AIToolsPage';
import AboutPage from './pages/AboutPage';
import FAQPage from './pages/FAQPage';
import TopicsIndexPage from './pages/TopicsIndexPage';
import TopicHubPage from './pages/TopicHubPage';
import BlogPostPage from './pages/BlogPostPage';
import EventsPage from './pages/EventsPage';
import NewsReaderPage from './pages/NewsReaderPage';
import BlogWritePage from './pages/BlogWritePage';
import ProfilePage from './pages/ProfilePage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import PrivacyPage from './pages/PrivacyPage';
import ContactPage from './pages/ContactPage';
import TermsPage from './pages/TermsPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import ErrorBoundary from './components/ErrorBoundary';
import CookieConsent, { getCookieConsent } from './components/CookieConsent';
import { recordHit } from './lib/analytics';

export default function App() {
  // Light is the default; dark remains available via the toggle.
  const [theme, setTheme] = useState('light');
  const { pathname, state } = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Scroll to top on route change — except in-feed page switches (/ ↔ /news ↔
  // /news/topic/*), which pass keepScroll so the reader stays where they are.
  useEffect(() => {
    if (!state?.keepScroll) window.scrollTo(0, 0);
  }, [pathname, state]);

  // Count this page view (anonymous, fire-and-forget). Admin pages are excluded
  // so the dashboard's own traffic doesn't inflate the public visit stats.
  // Visitors who declined cookies are not counted.
  useEffect(() => {
    if (pathname.startsWith('/_glancer')) return;
    if (getCookieConsent() === 'declined') return;
    recordHit(pathname);
  }, [pathname]);

  // Admin dashboard renders its own full-screen chrome (no public navbar/footer).
  const isAdmin = pathname.startsWith('/_glancer-admin');

  return (
    <div className="app" data-theme={theme}>
      <div className="bg-canvas" aria-hidden="true">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
        <div className="bg-orb bg-orb-4" />
        <div className="bg-grid" />
      </div>

      {!isAdmin && <Navbar theme={theme} onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} />}

      <main>
        <ErrorBoundary>
        <Routes>
          <Route path="/"                  element={<HomePage />} />
          <Route path="/news"              element={<HomePage />} />
          <Route path="/news/topic/:topicSlug" element={<HomePage />} />
          <Route path="/blogs"             element={<Navigate to="/" replace />} />
          <Route path="/blog/write"        element={<BlogWritePage />} />
          <Route path="/blog/edit/:id"     element={<BlogWritePage />} />
          <Route path="/blog/:id"          element={<BlogPostPage />} />
          <Route path="/events"            element={<EventsPage />} />
          <Route path="/topics"            element={<TopicsIndexPage />} />
          <Route path="/topic/:slug"       element={<TopicHubPage />} />
          <Route path="/news/:id"          element={<NewsReaderPage />} />
          <Route path="/metrics"           element={<MetricsPage />} />
          <Route path="/glossary"          element={<GlossaryPage />} />
          <Route path="/ai-tools"          element={<AIToolsPage />} />
          <Route path="/profile"           element={<ProfilePage />} />
          <Route path="/reset-password"    element={<ResetPasswordPage />} />
          <Route path="/about"             element={<AboutPage />} />
          <Route path="/faq"               element={<FAQPage />} />
          <Route path="/privacy"           element={<PrivacyPage />} />
          <Route path="/contact"           element={<ContactPage />} />
          <Route path="/terms"             element={<TermsPage />} />
          <Route path="/_glancer-admin"    element={<AdminPage />} />
          <Route path="*"                  element={<NotFoundPage />} />
        </Routes>
        </ErrorBoundary>
      </main>

      {!isAdmin && <Footer />}

      {/* One-time newsletter invite for unsigned visitors (fires after ~1 min). */}
      <NewsletterPopup />

      {/* First-visit cookie/consent banner. */}
      <CookieConsent />
    </div>
  );
}
