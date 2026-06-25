import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './index.css';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CursorHalo from './components/CursorHalo';
import HomePage from './pages/HomePage';
import MetricsPage from './pages/MetricsPage';
import GlossaryPage from './pages/GlossaryPage';
import AboutPage from './pages/AboutPage';
import BlogsPage from './pages/BlogsPage';
import BlogPostPage from './pages/BlogPostPage';
import NewsReaderPage from './pages/NewsReaderPage';
import BlogWritePage from './pages/BlogWritePage';
import ProfilePage from './pages/ProfilePage';
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

  return (
    <div className="app" data-theme={theme}>
      <div className="bg-canvas" aria-hidden="true">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
        <div className="bg-orb bg-orb-4" />
        <div className="bg-grid" />
      </div>

      {!isAdmin && <CursorHalo />}
      {!isAdmin && <Navbar theme={theme} onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} />}

      <main>
        <Routes>
          <Route path="/"                  element={<HomePage />} />
          <Route path="/blogs"             element={<BlogsPage />} />
          <Route path="/blog/write"        element={<BlogWritePage />} />
          <Route path="/blog/:id"          element={<BlogPostPage />} />
          <Route path="/news/:id"          element={<NewsReaderPage />} />
          <Route path="/metrics"           element={<MetricsPage />} />
          <Route path="/glossary"          element={<GlossaryPage />} />
          <Route path="/profile"           element={<ProfilePage />} />
          <Route path="/about"             element={<AboutPage />} />
          <Route path="/_glancer/admin"    element={<AdminPage />} />
        </Routes>
      </main>

      {!isAdmin && <Footer />}
    </div>
  );
}
