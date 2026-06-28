import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './index.css';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import OnboardingTour from './components/OnboardingTour';
import HomePage from './pages/HomePage';
import MetricsPage from './pages/MetricsPage';
import GlossaryPage from './pages/GlossaryPage';
import AIToolsPage from './pages/AIToolsPage';
import AboutPage from './pages/AboutPage';
import FAQPage from './pages/FAQPage';
import BlogsPage from './pages/BlogsPage';
import BlogPostPage from './pages/BlogPostPage';
import NewsReaderPage from './pages/NewsReaderPage';
import BlogWritePage from './pages/BlogWritePage';
import ProfilePage from './pages/ProfilePage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  const [theme, setTheme] = useState('dark');
  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Scroll to top on route change
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  const isAdmin = pathname === '/_glancer/admin';
  const isHome = pathname === '/';

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

      {/* First-visit guided tour (home page only) + a "Show me" replay button. */}
      {isHome && <OnboardingTour onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} />}

      <main>
        <Routes>
          <Route path="/"                  element={<HomePage />} />
          <Route path="/blogs"             element={<BlogsPage />} />
          <Route path="/blog/write"        element={<BlogWritePage />} />
          <Route path="/blog/edit/:id"     element={<BlogWritePage />} />
          <Route path="/blog/:id"          element={<BlogPostPage />} />
          <Route path="/news/:id"          element={<NewsReaderPage />} />
          <Route path="/metrics"           element={<MetricsPage />} />
          <Route path="/glossary"          element={<GlossaryPage />} />
          <Route path="/ai-tools"          element={<AIToolsPage />} />
          <Route path="/profile"           element={<ProfilePage />} />
          <Route path="/reset-password"    element={<ResetPasswordPage />} />
          <Route path="/about"             element={<AboutPage />} />
          <Route path="/faq"               element={<FAQPage />} />
          <Route path="/_glancer/admin"    element={<AdminPage />} />
        </Routes>
      </main>

      {!isAdmin && <Footer />}
    </div>
  );
}
