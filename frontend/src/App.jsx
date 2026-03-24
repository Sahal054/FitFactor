import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RequireAdminAuth from './components/RequireAdminAuth';
import Home from './pages/Home';
import About from './pages/About';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import DailyLiveSession from './pages/DailyLiveSession';
import AdminLogin from './pages/AdminLogin';
import AdminSignup from './pages/AdminSignup';
import AdminLiveSessionManager from './pages/AdminLiveSessionManager';
import { mockAppShellData } from './data/mockdata';
import { api, USE_MOCK_API } from './services/api';

function RouteScrollManager() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      return;
    }

    window.scrollTo({
      top: 0,
      behavior: 'auto',
    });
  }, [location.pathname, location.hash]);

  return null;
}

function App() {
  const [appShellData, setAppShellData] = useState(USE_MOCK_API ? mockAppShellData : null);

  useEffect(() => {
    let isMounted = true;

    api
      .getAppShellData()
      .then((data) => {
        if (isMounted) {
          setAppShellData(data);
        }
      })
      .catch((error) => {
        console.error('Failed to load app shell data.', error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!appShellData) {
    return (
      <div className="min-h-screen bg-white text-brand-dark flex items-center justify-center">
        <p className="font-bold uppercase tracking-[0.2em] text-sm">Loading FitFactor...</p>
      </div>
    );
  }

  const { siteSettings, globalContent } = appShellData;

  return (
    <Router>
      <RouteScrollManager />
      <div className="antialiased font-sans text-brand-dark bg-white">
        <Navbar
          brand={siteSettings.brand}
          navigation={siteSettings.navigation}
          primaryCta={globalContent.navbar.primaryCta}
        />
        <main className="relative min-h-screen pt-[80px]">
          <Routes>
            <Route
              path="/"
              element={<Home siteSettings={siteSettings} offer={globalContent.offerPopup} />}
            />
            <Route path="/about" element={<About />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/daily-live-session" element={<DailyLiveSession />} />
            <Route path="/contact" element={<Contact siteSettings={siteSettings} />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/signup" element={<AdminSignup />} />
            <Route
              path="/admin/live-session"
              element={
                <RequireAdminAuth>
                  <AdminLiveSessionManager />
                </RequireAdminAuth>
              }
            />
          </Routes>
        </main>
        <Footer siteSettings={siteSettings} footerContent={globalContent.footer} />
      </div>
    </Router>
  );
}

export default App;
