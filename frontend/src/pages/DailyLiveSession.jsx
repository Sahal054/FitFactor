import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Clock3, Radio, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';
import Seo from '../components/Seo';
import LiveSessionPlayer from '../components/LiveSessionPlayer';

function formatScheduledDate(value) {
  if (!value) {
    return 'Schedule will be updated soon';
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(parsedDate);
}

function getWindowLabel(session) {
  if (session?.endsAt) {
    return `Ends ${formatScheduledDate(session.endsAt)}`;
  }

  if (session?.status === 'uploading') {
    return 'Video is uploading to Mux';
  }

  if (session?.status === 'processing') {
    return 'Mux is still preparing the video';
  }

  if (session?.status === 'video-error') {
    return 'Admin needs to upload the workout again';
  }

  return 'Window updates automatically';
}

export default function DailyLiveSession() {
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadLiveSession = () => {
      api
        .getDailyLiveSessionData()
        .then((data) => {
          if (isMounted) {
            setPageData(data);
          }
        })
        .catch((error) => {
          console.error('Failed to load daily live session data.', error);
        });
    };

    loadLiveSession();
    const intervalId = window.setInterval(loadLiveSession, 10000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const statusLabel = useMemo(() => {
    if (!pageData?.session?.status) {
      return 'Awaiting Update';
    }

    return pageData.session.status.replace(/-/g, ' ');
  }, [pageData]);

  if (!pageData) {
    return (
      <section className="py-24 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400">Loading live session...</p>
      </section>
    );
  }

  return (
    <>
      <Seo
        title={pageData.seo.title}
        description={pageData.seo.description}
        path="/daily-live-session"
      />

      <div className="bg-white pb-24">
        <section className="bg-brand-dark text-white pt-20 pb-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,107,0,0.18),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(139,92,246,0.18),_transparent_40%)]"></div>
          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-brand-orange font-bold uppercase tracking-[0.2em] text-xs mb-6">
              <Radio className="w-4 h-4" />
              {pageData.hero.badge}
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight max-w-4xl">{pageData.hero.title}</h1>
            <p className="text-gray-300 text-lg mt-6 max-w-3xl font-medium">{pageData.hero.description}</p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 -mt-8 relative z-10">
          <div className="grid lg:grid-cols-[1.5fr_0.9fr] gap-8 items-start">
            <div className="bg-white rounded-[2rem] p-4 shadow-2xl shadow-brand-dark/10 border border-gray-100">
              <LiveSessionPlayer session={pageData.session} />
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-brand-dark/5 p-8">
              <div className="inline-flex items-center rounded-full bg-brand-orange/10 text-brand-orange px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] mb-5">
                {statusLabel}
              </div>
              <h2 className="text-3xl font-black text-brand-dark tracking-tight">{pageData.session.title}</h2>
              <p className="text-gray-600 font-medium mt-4 leading-relaxed">{pageData.session.description}</p>
              {pageData.session.availabilityMessage && (
                <p className="text-sm text-gray-500 font-medium mt-4 leading-relaxed">
                  {pageData.session.availabilityMessage}
                </p>
              )}

              <div className="space-y-4 mt-8">
                <div className="flex items-start gap-3 text-gray-700">
                  <CalendarDays className="w-5 h-5 text-brand-purple mt-0.5" />
                  <div>
                    <p className="font-bold uppercase text-xs tracking-[0.2em] text-gray-400">Schedule</p>
                    <p className="font-medium">{formatScheduledDate(pageData.session.scheduledAt)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-gray-700">
                  <Clock3 className="w-5 h-5 text-brand-purple mt-0.5" />
                  <div>
                    <p className="font-bold uppercase text-xs tracking-[0.2em] text-gray-400">Stream Window</p>
                    <p className="font-medium">{getWindowLabel(pageData.session)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-gray-700">
                  <ShieldCheck className="w-5 h-5 text-brand-purple mt-0.5" />
                  <div>
                    <p className="font-bold uppercase text-xs tracking-[0.2em] text-gray-400">Coach</p>
                    <p className="font-medium">{pageData.session.coachName}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-5 rounded-2xl bg-brand-gray/50 border border-gray-100">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Access Note</p>
                <p className="text-gray-600 font-medium">{pageData.session.accessNote}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 mt-12">
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-brand-dark/5 p-8 md:p-10">
            <h3 className="text-2xl font-black text-brand-dark tracking-tight mb-6">What This Setup Gives You</h3>
            <ul className="grid md:grid-cols-3 gap-4">
              {pageData.highlights.map((highlight) => (
                <li key={highlight} className="rounded-2xl bg-brand-gray/50 border border-gray-100 p-5 text-gray-700 font-medium">
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}
