import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Maximize,
  Minimize,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from 'lucide-react';
import MuxPlayer from '@mux/mux-player-react/lazy';

function formatSchedule(value) {
  if (!value) {
    return '';
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(parsedDate);
}

function getPlaceholderContent(session, allowPreview, hasWindowEnded) {
  if (allowPreview) {
    return {
      title: 'Upload a workout video',
      message: 'Upload a workout video to Mux to preview the scheduled session here.',
    };
  }

  if (hasWindowEnded || session?.status === 'ended') {
    return {
      title: 'Stream ended',
      message: 'This live session has ended. The next scheduled session will appear here when available.',
    };
  }

  if (session?.status === 'upcoming') {
    return {
      title: 'Next live session',
      message: session?.scheduledAt
        ? `Starts on ${formatSchedule(session.scheduledAt)}.`
        : 'The next live session will appear here once the admin schedules it.',
    };
  }

  if (session?.status === 'processing' || session?.status === 'uploading') {
    return {
      title: 'Video is getting ready',
      message: session?.availabilityMessage || 'Mux is still preparing the scheduled workout video.',
    };
  }

  if (session?.status === 'video-error') {
    return {
      title: 'Video unavailable',
      message: session?.availabilityMessage || 'The uploaded workout needs attention from the admin team.',
    };
  }

  return {
    title: 'Daily live session',
    message: session?.availabilityMessage || 'The daily live session video will appear here once the admin publishes it.',
  };
}

export default function LiveSessionPlayer({ session, className = '', allowPreview = false }) {
  const wrapperRef = useRef(null);
  const playerRef = useRef(null);
  const [now, setNow] = useState(Date.now());
  const [isPaused, setIsPaused] = useState(!allowPreview);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerClassName = `w-full aspect-video rounded-[2rem] overflow-hidden bg-brand-dark ${className}`.trim();
  const sessionStartTime = Number.isNaN(new Date(session?.scheduledAt || '').getTime())
    ? 0
    : new Date(session.scheduledAt).getTime();
  const startTime = useMemo(
    () => (allowPreview ? 0 : Number(session?.video?.startTime ?? session?.liveOffsetSeconds) || 0),
    [allowPreview, session?.liveOffsetSeconds, session?.video?.startTime],
  );
  const minimumAllowedTime = allowPreview
    ? 0
    : Number(session?.joinedAtOffsetSeconds ?? startTime) || 0;
  const maximumAllowedTime = allowPreview
    ? Number.MAX_SAFE_INTEGER
    : Math.max(
        minimumAllowedTime,
        Math.min(
          Math.floor((now - sessionStartTime) / 1000),
          Number(session?.videoDurationSeconds) || 0,
        ),
      );
  const hasWindowEnded =
    !allowPreview &&
    Boolean(session?.endsAt) &&
    !Number.isNaN(new Date(session.endsAt).getTime()) &&
    now >= new Date(session.endsAt).getTime();
  const canPlayVideo =
    !hasWindowEnded &&
    (
      (session?.video?.sourceType === 'mux' && session?.video?.playbackId) ||
      (session?.video?.sourceType === 'local-file' && session?.video?.previewUrl)
    ) &&
    (allowPreview || session?.playbackEnabled !== false);
  const placeholderContent = getPlaceholderContent(session, allowPreview, hasWindowEnded);

  useEffect(() => {
    if (allowPreview || !session?.endsAt) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [allowPreview, session?.endsAt]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const keepPlaybackInsideWindow = () => {
    if (allowPreview || !playerRef.current) {
      return;
    }

    if (playerRef.current.currentTime + 0.25 < minimumAllowedTime) {
      playerRef.current.currentTime = minimumAllowedTime;
      return;
    }

    if (playerRef.current.currentTime - 0.25 > maximumAllowedTime) {
      playerRef.current.currentTime = maximumAllowedTime;
    }
  };

  const togglePlayback = async () => {
    if (!playerRef.current) {
      return;
    }

    if (playerRef.current.paused) {
      await playerRef.current.play();
      return;
    }

    playerRef.current.pause();
  };

  const toggleMute = () => {
    if (!playerRef.current) {
      return;
    }

    playerRef.current.muted = !playerRef.current.muted;
    setIsMuted(playerRef.current.muted);
  };

  const toggleFullscreen = async () => {
    if (!wrapperRef.current) {
      return;
    }

    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    await wrapperRef.current.requestFullscreen();
  };

  if (!canPlayVideo) {
    return (
      <div className={`${playerClassName} flex flex-col items-center justify-center text-center p-8`}>
        <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-orange mb-3">{placeholderContent.title}</p>
        <p className="text-gray-300 font-medium max-w-xl">{placeholderContent.message}</p>
      </div>
    );
  }

  if (session.video.sourceType === 'local-file') {
    return (
      <div className={playerClassName}>
        <video className="w-full h-full object-cover" controls playsInline>
          <source src={session.video.previewUrl} />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className={`${playerClassName} relative group`}>
      {!allowPreview && (
        <>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/55 via-black/10 to-transparent z-10"></div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/65 via-black/10 to-transparent z-10"></div>
          <div className="absolute top-4 left-4 z-20 inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white shadow-lg shadow-black/25">
            <span className="h-2.5 w-2.5 rounded-full bg-white"></span>
            Live
          </div>
          <div className="absolute top-4 right-4 z-20 rounded-full bg-black/45 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md">
            Join in progress
          </div>
        </>
      )}

      <MuxPlayer
        ref={playerRef}
        className="w-full h-full"
        playbackId={session.video.playbackId}
        streamType={allowPreview ? 'on-demand' : 'on-demand'}
        startTime={startTime}
        forwardSeekOffset={0}
        backwardSeekOffset={0}
        metadata={{
          video_title: session.title || 'Daily live session',
          viewer_user_id: allowPreview ? 'admin-preview' : 'public-viewer',
        }}
        autoPlay={!allowPreview}
        playsInline
        accentColor="#ff6b00"
        theme="minimal"
        fullscreenElement="host"
        onSeeking={keepPlaybackInsideWindow}
        onTimeUpdate={keepPlaybackInsideWindow}
        onPlay={() => setIsPaused(false)}
        onPause={() => setIsPaused(true)}
        onVolumeChange={() => setIsMuted(Boolean(playerRef.current?.muted))}
        style={
          allowPreview
            ? undefined
            : {
                '--controls': 'none',
              }
        }
      />

      {!allowPreview && (
        <div className="absolute inset-x-0 bottom-0 z-20 p-4">
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/12 bg-black/42 px-4 py-3 text-white backdrop-blur-xl shadow-[0_18px_40px_-24px_rgba(0,0,0,0.9)]">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={togglePlayback}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/14 hover:bg-white/22 transition-colors"
                aria-label={isPaused ? 'Play live session' : 'Pause live session'}
              >
                {isPaused ? <Play className="h-4 w-4 fill-current" /> : <Pause className="h-4 w-4 fill-current" />}
              </button>
              <button
                type="button"
                onClick={toggleMute}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/14 hover:bg-white/22 transition-colors"
                aria-label={isMuted ? 'Unmute live session' : 'Mute live session'}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
              <div className="hidden sm:block">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-white/70">Daily Live</p>
                <p className="text-sm font-semibold text-white/95">{session?.title || 'Workout session'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/80">
                <span className="h-2 w-2 rounded-full bg-red-500"></span>
                Live edge
              </div>
              <button
                type="button"
                onClick={toggleFullscreen}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/14 hover:bg-white/22 transition-colors"
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
