import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LockKeyhole, ShieldCheck } from 'lucide-react';
import { mockAdminPortalData } from '../data/mockdata';
import { api, USE_MOCK_API } from '../services/api';
import Seo from '../components/Seo';

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [pageData, setPageData] = useState(USE_MOCK_API ? mockAdminPortalData : null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (api.isAdminAuthenticated()) {
      navigate('/admin/live-session', { replace: true });
      return;
    }

    let isMounted = true;

    api
      .getAdminPortalData()
      .then((data) => {
        if (isMounted) {
          setPageData(data);
        }
      })
      .catch((error) => {
        console.error('Failed to load admin portal data.', error);
      });

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    try {
      setIsSubmitting(true);
      await api.loginAdmin({ username, password });
      const redirectPath = location.state?.from?.pathname || '/admin/live-session';
      navigate(redirectPath, { replace: true });
    } catch (error) {
      console.error('Admin login failed.', error);
      setErrorMessage(error.message || 'Unable to sign in right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!pageData) {
    return (
      <section className="py-24 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400">Loading admin portal...</p>
      </section>
    );
  }

  return (
    <>
      <Seo
        title={pageData.login.title}
        description={pageData.login.description}
        path="/admin/login"
        noindex
      />

      <div className="min-h-[calc(100vh-80px)] bg-brand-gray/40 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-white rounded-[2rem] border border-gray-100 shadow-2xl shadow-brand-dark/10 p-8 md:p-10">
          <div className="w-16 h-16 rounded-2xl bg-brand-purple text-white flex items-center justify-center mb-6">
            <LockKeyhole className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-brand-dark tracking-tight">{pageData.login.title}</h1>
          <p className="text-gray-600 font-medium mt-4 leading-relaxed">{pageData.login.description}</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-[0.2em]">Username</label>
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 text-brand-dark focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20"
                placeholder="fitfactoradmin"
                autoComplete="username"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-[0.2em]">Password</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 text-brand-dark focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20"
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </div>

            {errorMessage && <p className="text-sm font-medium text-red-500">{errorMessage}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-brand-purple text-white py-4 font-black uppercase tracking-[0.2em] hover:bg-brand-dark transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 rounded-2xl bg-brand-dark text-white p-5">
            <div className="flex items-center gap-2 text-brand-orange font-bold uppercase tracking-[0.2em] text-xs mb-3">
              <ShieldCheck className="w-4 h-4" />
              Admin Note
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">{pageData.login.helperText}</p>
          </div>

          <p className="mt-6 text-sm text-gray-500 font-medium">
            Need a new admin account?{' '}
            <Link to="/admin/signup" className="text-brand-purple hover:text-brand-dark transition-colors">
              Create one here
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  );
}
