import { useNavigate } from 'react-router-dom';
import { CalendarDays, Clock3, Edit3, Users, BookOpen } from 'lucide-react';
import LiveSessionPlayer from './LiveSessionPlayer';

const benefitIcons = {
  edit: Edit3,
  users: Users,
  book: BookOpen,
};

function formatSessionTime(value) {
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
    return `Ends ${formatSessionTime(session.endsAt)}`;
  }

  if (session?.status === 'uploading') {
    return 'Video is uploading to Mux';
  }

  if (session?.status === 'processing') {
    return 'Mux is still preparing the upload';
  }

  if (session?.status === 'video-error') {
    return 'Admin needs to upload the video again';
  }

  return 'Window updates automatically';
}

function getSessionEyebrow(session) {
  if (session?.status === 'live') {
    return "Today's Session";
  }

  if (session?.scheduledAt) {
    return 'Next Scheduled Session';
  }

  return 'Live Session Schedule';
}

export default function DailyLiveWorkouts({ content, session }) {
  const navigate = useNavigate();
  const fallbackSession = {
    title: content.titleBottom,
    description: 'The next live session will appear here once the admin schedules it.',
    scheduledAt: '',
    endsAt: '',
    coachName: 'FitFactor Coaching Team',
    status: 'awaiting-update',
    playbackEnabled: false,
    availabilityMessage: 'The next live session will appear here once the admin schedules it.',
    video: {
      sourceType: 'unavailable',
    },
  };
  const activeSession = session || fallbackSession;

  return (
    <section id="daily-live-section" className="py-24 bg-brand-gray/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto mb-14">
          <span className="inline-block py-1 px-3 rounded-full bg-brand-orange/10 text-brand-orange font-bold tracking-[0.2em] uppercase text-xs mb-4">
            {content.badge}
          </span>
          <h2 className="text-4xl lg:text-6xl font-black text-brand-dark mb-6 leading-[0.9] tracking-tight">
            {content.titleTop}
            <br className="hidden sm:block" />
            <span className="text-brand-purple">{content.titleBottom}</span>
          </h2>
          <p className="text-gray-600 font-medium text-lg lg:text-lg leading-snug">{content.description}</p>
        </div>

        <div className="relative rounded-[2rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] bg-brand-dark ring-1 ring-black/5 transform transition-transform hover:scale-[1.01] duration-500">
          <LiveSessionPlayer session={activeSession} className="rounded-none" />
        </div>

        <div className="mt-6 bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">{getSessionEyebrow(activeSession)}</p>
            <h3 className="text-2xl font-black text-brand-dark tracking-tight">{activeSession.title}</h3>
            {activeSession.status && (
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-orange mt-3">
                {activeSession.status.replace(/-/g, ' ')}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-4 mt-4 text-gray-600 font-medium">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-brand-purple" />
                {formatSessionTime(activeSession.scheduledAt)}
              </div>
              <div className="flex items-center gap-2">
                <Clock3 className="w-4 h-4 text-brand-purple" />
                {getWindowLabel(activeSession)}
              </div>
            </div>
            {activeSession.availabilityMessage && (
              <p className="mt-4 text-sm text-gray-500 font-medium max-w-xl">{activeSession.availabilityMessage}</p>
            )}
          </div>

          <button
            onClick={() => navigate(content.cta.path)}
            className="w-full md:w-auto px-6 py-4 rounded-xl bg-brand-purple text-white font-black uppercase tracking-[0.2em] text-sm hover:bg-brand-dark transition-colors"
          >
            {content.cta.label}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 px-4 lg:px-12">
          {content.benefits.map((benefit) => {
            const Icon = benefitIcons[benefit.iconKey];

            return (
              <div key={benefit.title} className="flex flex-col items-center text-center group">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-brand-purple mb-4 group-hover:-translate-y-1 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-lg text-brand-dark mb-1">{benefit.title}</h4>
                <p className="text-gray-500 font-sans text-sm">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
