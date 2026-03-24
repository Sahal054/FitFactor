import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldPlus } from 'lucide-react';
import { mockAdminPortalData } from '../data/mockdata';
import { api, USE_MOCK_API } from '../services/api';
import Seo from '../components/Seo';

export default function AdminSignup() {
  const navigate = useNavigate();
  const [pageData, setPageData] = useState(USE_MOCK_API ? mockAdminPortalData : null);
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
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

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    try {
      setIsSubmitting(true);
      await api.signupAdmin({
        displayName,
        username,
        password,
        inviteCode,
      });
      navigate('/admin/live-session', { replace: true });
    } catch (error) {
      console.error('Admin signup failed.', error);
      setErrorMessage(error.message || 'Unable to create the admin account right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!pageData) {
    return (
      <section className="py-24 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400">Loading admin signup...</p>
      </section>
    );
  }

  return (
    <>
      <Seo
        title={pageData.signup.title}
        description={pageData.signup.description}
        path="/admin/signup"
        noindex
      />

      <div className="min-h-[calc(100vh-80px)] bg-brand-gray/40 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-xl bg-white rounded-[2rem] border border-gray-100 shadow-2xl shadow-brand-dark/10 p-8 md:p-10">
          <div className="w-16 h-16 rounded-2xl bg-brand-orange text-white flex items-center justify-center mb-6">
            <ShieldPlus className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-brand-dark tracking-tight">{pageData.signup.title}</h1>
          <p className="text-gray-600 font-medium mt-4 leading-relaxed">{pageData.signup.description}</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-[0.2em]">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 text-brand-dark focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20"
                  placeholder="FitFactor Admin"
                  autoComplete="name"
                  required
                />
              </div>
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
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-[0.2em]">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 text-brand-dark focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20"
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-[0.2em]">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 text-brand-dark focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20"
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-[0.2em]">Invite Code</label>
              <input
                type="text"
                value={inviteCode}
                onChange={(event) => setInviteCode(event.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 text-brand-dark focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20"
                placeholder="Enter the backend invite code when signup is locked"
              />
            </div>

            {errorMessage && <p className="text-sm font-medium text-red-500">{errorMessage}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-brand-orange text-white py-4 font-black uppercase tracking-[0.2em] hover:bg-brand-orange-hover transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating Account...' : 'Create Admin Account'}
            </button>
          </form>

          <div className="mt-6 rounded-2xl bg-brand-dark text-white p-5">
            <p className="text-gray-300 text-sm leading-relaxed">{pageData.signup.helperText}</p>
          </div>

          <p className="mt-6 text-sm text-gray-500 font-medium">
            Already have admin access?{' '}
            <Link to="/admin/login" className="text-brand-purple hover:text-brand-dark transition-colors">
              Sign in here
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  );
}
