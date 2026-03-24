import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  CircleX,
  CloudUpload,
  LogOut,
  PencilLine,
  RadioTower,
  RotateCcw,
  Save,
  Trash2,
} from 'lucide-react';
import { mockAdminPortalData } from '../data/mockdata';
import { api, USE_MOCK_API } from '../services/api';
import {
  cancelActiveAdminUpload,
  getAdminUploadState,
  hasActiveAdminUpload,
  resetAdminUploadState,
  startAdminUpload,
  subscribeToAdminUpload,
} from '../services/adminUploadManager';
import Seo from '../components/Seo';
import LiveSessionPlayer from '../components/LiveSessionPlayer';

function createEmptyFormData() {
  return {
    title: '',
    description: '',
    coachName: '',
    scheduledAt: '',
    accessNote: '',
  };
}

function formatForInput(value) {
  if (!value) {
    return '';
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
  const day = String(parsedDate.getDate()).padStart(2, '0');
  const hours = String(parsedDate.getHours()).padStart(2, '0');
  const minutes = String(parsedDate.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function formatReadableDate(value) {
  if (!value) {
    return 'Schedule pending';
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

function getAdminStatusLabel(session) {
  if (session.muxErrorMessage) {
    return 'Upload failed';
  }

  if (session.videoReady) {
    return 'Ready in Mux';
  }

  if (session.uploadStatus === 'waiting') {
    return 'Waiting for upload';
  }

  if (session.status === 'uploading') {
    return 'Uploading to Mux';
  }

  if (session.status === 'processing') {
    return 'Processing in Mux';
  }

  return 'Awaiting update';
}

const statusClasses = {
  live: 'bg-red-100 text-red-600',
  upcoming: 'bg-brand-orange/10 text-brand-orange',
  ended: 'bg-gray-100 text-gray-500',
  uploading: 'bg-blue-100 text-blue-700',
  processing: 'bg-amber-100 text-amber-700',
  'video-error': 'bg-red-100 text-red-600',
  'awaiting-update': 'bg-gray-100 text-gray-500',
};

export default function AdminLiveSessionManager() {
  const navigate = useNavigate();
  const [portalData, setPortalData] = useState(USE_MOCK_API ? mockAdminPortalData : null);
  const [sessions, setSessions] = useState([]);
  const [formData, setFormData] = useState(createEmptyFormData());
  const [editingSessionId, setEditingSessionId] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [uploadState, setUploadState] = useState(getAdminUploadState());
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const adminSession = api.getAdminSession();
  const editingSession = sessions.find((session) => session.sessionId === editingSessionId) || null;

  useEffect(() => {
    let isMounted = true;

    Promise.all([api.getAdminPortalData(), api.getAdminLiveSessions()])
      .then(([portalResponse, liveSessions]) => {
        if (!isMounted) {
          return;
        }

        setPortalData(portalResponse);
        setSessions(liveSessions);
      })
      .catch((error) => {
        console.error('Failed to load admin live session manager data.', error);
        if (isMounted) {
          setErrorMessage(error.message || 'Could not load the scheduled sessions.');
        }
      });

    const intervalId = window.setInterval(() => {
      api
        .getAdminLiveSessions()
        .then((liveSessions) => {
          if (isMounted) {
            setSessions(liveSessions);
          }
        })
        .catch((error) => {
          console.error('Failed to refresh live sessions.', error);
        });
    }, 10000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    return subscribeToAdminUpload((nextUploadState) => {
      setUploadState(nextUploadState);

      if (nextUploadState?.status === 'completed') {
        setStatusMessage('Video upload completed. Mux is now processing the workout.');
        refreshSessions().catch((error) => {
          console.error('Failed to refresh sessions after upload completion.', error);
        });
      }

      if (nextUploadState?.status === 'canceled') {
        setStatusMessage('Video upload canceled.');
        refreshSessions().catch((error) => {
          console.error('Failed to refresh sessions after canceling upload.', error);
        });
      }

      if (nextUploadState?.status === 'failed') {
        setErrorMessage(nextUploadState.error || 'Video upload failed.');
      }
    });
  }, []);

  useEffect(() => {
    if (!selectedFile) {
      setLocalPreviewUrl('');
      return undefined;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setLocalPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile]);

  const previewSession = useMemo(() => {
    if (localPreviewUrl) {
      return {
        title: formData.title || 'Session Preview',
        description: formData.description || 'Your scheduled session preview will appear here.',
        coachName: formData.coachName || adminSession?.user?.displayName || 'FitFactor Coach',
        scheduledAt: formData.scheduledAt ? new Date(formData.scheduledAt).toISOString() : '',
        status: 'preview',
        playbackEnabled: true,
        availabilityMessage:
          'Admin preview is showing the file selected on your device before it is uploaded to Mux.',
        accessNote:
          'This is a local preview only. Save the session to upload the actual workout file to Mux.',
        video: {
          sourceType: 'local-file',
          previewUrl: localPreviewUrl,
        },
      };
    }

    if (editingSession?.video?.sourceType === 'mux') {
      return {
        ...editingSession,
        playbackEnabled: true,
      };
    }

    return {
      title: formData.title || 'Session Preview',
      description: formData.description || 'Your scheduled session preview will appear here.',
      coachName: formData.coachName || adminSession?.user?.displayName || 'FitFactor Coach',
      scheduledAt: formData.scheduledAt ? new Date(formData.scheduledAt).toISOString() : '',
      status: 'awaiting-update',
      playbackEnabled: false,
      availabilityMessage:
        'Upload a workout video and save the session to preview the Mux-backed stream here.',
      accessNote:
        'Admin preview ignores the public timing gate once the video is ready, so you can verify the workout before it goes live.',
      video: {
        sourceType: 'unavailable',
      },
    };
  }, [adminSession, editingSession, formData, localPreviewUrl]);

  const handleChange = (field) => (event) => {
    const nextValue = event.target.value;
    setFormData((currentData) => ({
      ...currentData,
      [field]: nextValue,
    }));
  };

  const handleFileChange = (event) => {
    const nextFile = event.target.files?.[0] || null;
    setSelectedFile(nextFile);
  };

  const handleEditSession = (session) => {
    setEditingSessionId(session.sessionId);
    setStatusMessage('');
    setErrorMessage('');
    setSelectedFile(null);
    setFormData({
      title: session.title,
      description: session.description,
      coachName: session.coachName,
      scheduledAt: formatForInput(session.scheduledAt),
      accessNote: session.accessNote || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingSessionId('');
    setStatusMessage('');
    setErrorMessage('');
    setSelectedFile(null);
    setFormData(createEmptyFormData());
  };

  const refreshSessions = async () => {
    const nextSessions = await api.getAdminLiveSessions();
    setSessions(nextSessions);
    return nextSessions;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatusMessage('');
    setErrorMessage('');

    if (!editingSessionId && !selectedFile) {
      setErrorMessage('Please choose a workout video file before saving the session.');
      return;
    }

    if (hasActiveAdminUpload()) {
      setErrorMessage('A video upload is already in progress. Please wait or cancel it first.');
      return;
    }

    try {
      setIsSaving(true);
      const response = await api.saveDailyLiveSession({
        sessionId: editingSessionId,
        ...formData,
        originalFileName: selectedFile?.name || '',
      });

      if (response.upload?.uploadUrl && selectedFile) {
        startAdminUpload({
          sessionId: response.session.sessionId,
          uploadUrl: response.upload.uploadUrl,
          file: selectedFile,
          mode: editingSessionId ? 'replace' : 'create',
        });
      }

      const nextSessions = await refreshSessions();
      const savedSession =
        nextSessions.find((session) => session.sessionId === response.session.sessionId) || response.session;

      setEditingSessionId(savedSession.sessionId);
      setFormData({
        title: savedSession.title,
        description: savedSession.description,
        coachName: savedSession.coachName,
        scheduledAt: formatForInput(savedSession.scheduledAt),
        accessNote: savedSession.accessNote || '',
      });
      setSelectedFile(null);
      setStatusMessage(
        response.upload?.uploadUrl
          ? 'Session saved and video upload sent to Mux. Give Mux a moment to finish processing the workout.'
          : editingSessionId
            ? 'Scheduled session updated successfully.'
            : 'New scheduled live session created successfully.',
      );
    } catch (error) {
      console.error('Failed to save live session.', error);
      setErrorMessage(error.message || 'Could not save the live session.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSession = async (session) => {
    const shouldDelete = window.confirm(`Delete "${session.title}" and remove its uploaded video from Mux?`);

    if (!shouldDelete) {
      return;
    }

    try {
      if (uploadState?.sessionId === session.sessionId && uploadState.status === 'uploading') {
        cancelActiveAdminUpload();
      }

      await api.deleteAdminLiveSession(session.sessionId);

      if (uploadState?.sessionId === session.sessionId) {
        resetAdminUploadState();
      }

      if (editingSessionId === session.sessionId) {
        resetForm();
      }

      await refreshSessions();
      setStatusMessage('Session deleted successfully.');
      setErrorMessage('');
    } catch (error) {
      console.error('Failed to delete session.', error);
      setErrorMessage(error.message || 'Could not delete the session.');
    }
  };

  const handleCancelUpload = () => {
    const didCancel = cancelActiveAdminUpload();

    if (!didCancel) {
      return;
    }

    if (uploadState?.mode === 'create' && uploadState.sessionId) {
      api
        .deleteAdminLiveSession(uploadState.sessionId)
        .then(() => {
          resetAdminUploadState();
          return refreshSessions();
        })
        .catch((error) => {
          console.error('Failed to clean up canceled upload session.', error);
        });
    }
  };

  const handleLogout = async () => {
    if (hasActiveAdminUpload()) {
      cancelActiveAdminUpload();

      if (uploadState?.mode === 'create' && uploadState.sessionId) {
        try {
          await api.deleteAdminLiveSession(uploadState.sessionId);
        } catch (error) {
          console.error('Failed to clean up the canceled upload before logout.', error);
        }
      }
    }

    resetAdminUploadState();
    await api.logoutAdmin();
    navigate('/admin/login', { replace: true });
  };

  if (!portalData) {
    return (
      <section className="py-24 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400">Loading live session manager...</p>
      </section>
    );
  }

  return (
    <>
      <Seo
        title={portalData.manager.title}
        description={portalData.manager.description}
        path="/admin/live-session"
        noindex
      />

      <div className="bg-brand-gray/40 min-h-[calc(100vh-80px)] py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-orange/10 text-brand-orange px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] mb-4">
                <RadioTower className="w-4 h-4" />
                Admin Console
              </div>
              <h1 className="text-4xl font-black text-brand-dark tracking-tight">{portalData.manager.title}</h1>
              <p className="text-gray-600 font-medium mt-3 max-w-3xl">{portalData.manager.description}</p>
              {adminSession?.user?.displayName && (
                <p className="text-sm text-gray-500 font-medium mt-4">
                  Signed in as {adminSession.user.displayName} ({adminSession.user.username})
                </p>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-5 py-3 font-bold uppercase tracking-[0.2em] text-sm text-brand-dark hover:bg-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              {portalData.manager.logoutLabel}
            </button>
          </div>

          <div className="grid xl:grid-cols-[1.15fr_0.85fr] gap-8 items-start">
            <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-brand-dark/5 p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-brand-purple uppercase tracking-[0.2em] mb-2">
                    {editingSessionId ? 'Edit Scheduled Session' : 'Create Scheduled Session'}
                  </p>
                  <h2 className="text-2xl font-black text-brand-dark tracking-tight">
                    {editingSessionId ? 'Update the selected session' : 'Queue a new live workout'}
                  </h2>
                </div>

                {editingSessionId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-3 text-sm font-bold uppercase tracking-[0.2em] text-brand-dark hover:bg-gray-50 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    {portalData.manager.resetLabel}
                  </button>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-[0.2em]">Session Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={handleChange('title')}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 text-brand-dark focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-[0.2em]">Coach Name</label>
                  <input
                    type="text"
                    value={formData.coachName}
                    onChange={handleChange('coachName')}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 text-brand-dark focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-[0.2em]">Date & Start Time</label>
                  <input
                    type="datetime-local"
                    value={formData.scheduledAt}
                    onChange={handleChange('scheduledAt')}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 text-brand-dark focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-[0.2em]">Workout Video</label>
                  <label className="w-full rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-4 text-brand-dark flex items-center gap-3 cursor-pointer hover:border-brand-purple transition-colors">
                    <CloudUpload className="w-5 h-5 text-brand-purple" />
                    <span className="font-medium text-sm">
                      {selectedFile
                        ? selectedFile.name
                        : editingSession
                          ? 'Choose a new file to replace the current Mux upload'
                          : 'Choose the workout file to upload to Mux'}
                    </span>
                    <input type="file" accept="video/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-[0.2em]">Session Description</label>
                <textarea
                  value={formData.description}
                  onChange={handleChange('description')}
                  className="w-full min-h-[140px] rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 text-brand-dark focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-[0.2em]">Access Note</label>
                <textarea
                  value={formData.accessNote}
                  onChange={handleChange('accessNote')}
                  className="w-full min-h-[100px] rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 text-brand-dark focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20"
                  placeholder="Optional note shown on the public live-session page"
                ></textarea>
              </div>

              <div className="rounded-2xl bg-brand-gray/50 border border-gray-100 p-5 text-sm text-gray-600 font-medium leading-relaxed">
                The public site uses the scheduled start time plus the actual Mux video duration. Members who join late will land on the current live point automatically.
              </div>

              {uploadState?.status === 'uploading' && (
                <div className="rounded-2xl border border-brand-purple/20 bg-brand-purple/5 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-brand-dark font-medium">
                      Uploading <span className="font-bold">{uploadState.fileName}</span> to Mux: {uploadState.progress}%
                    </div>
                    <button
                      type="button"
                      onClick={handleCancelUpload}
                      className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <CircleX className="w-4 h-4" />
                      Cancel Upload
                    </button>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-white overflow-hidden">
                    <div
                      className="h-full bg-brand-purple transition-all"
                      style={{ width: `${uploadState.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {errorMessage && <p className="text-sm font-medium text-red-500">{errorMessage}</p>}
              {statusMessage && <p className="text-sm font-medium text-green-600">{statusMessage}</p>}

              <button
                type="submit"
                disabled={isSaving || hasActiveAdminUpload()}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-purple text-white px-6 py-4 font-black uppercase tracking-[0.2em] text-sm hover:bg-brand-dark transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {isSaving
                  ? 'Saving...'
                  : editingSessionId
                    ? portalData.manager.updateLabel
                    : portalData.manager.saveLabel}
              </button>
            </form>

            <div className="space-y-8">
              <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-brand-dark/5 p-6 space-y-6">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Preview</p>
                  <h2 className="text-2xl font-black text-brand-dark tracking-tight">{previewSession.title}</h2>
                </div>
                <LiveSessionPlayer session={previewSession} allowPreview />
                <div className="rounded-2xl bg-brand-gray/50 border border-gray-100 p-5 text-sm text-gray-600 font-medium leading-relaxed">
                  Local file previews are immediate. Once saved, the file uploads to Mux and the admin queue reflects the processing state automatically.
                </div>
              </div>

              <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-brand-dark/5 p-6">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Queue & Library</p>
                    <h2 className="text-2xl font-black text-brand-dark tracking-tight">{portalData.manager.listTitle}</h2>
                  </div>
                  <div className="text-sm font-medium text-gray-500">{sessions.length} saved</div>
                </div>

                <div className="space-y-4">
                  {sessions.length ? (
                    sessions.map((session) => (
                      <div key={session.sessionId} className="rounded-[1.5rem] border border-gray-100 bg-brand-gray/40 p-5">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                          <div>
                            <div className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] ${statusClasses[session.status] || statusClasses['awaiting-update']}`}>
                              {session.status}
                            </div>
                            <h3 className="text-xl font-black text-brand-dark mt-3">{session.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500 font-medium mt-3">
                              <CalendarDays className="w-4 h-4 text-brand-purple" />
                              {formatReadableDate(session.scheduledAt)}
                            </div>
                            <p className="text-sm text-gray-600 font-medium mt-3">
                              {session.coachName} | {getAdminStatusLabel(session)}
                            </p>
                            {session.sourceFileName && (
                              <p className="text-sm text-gray-500 mt-2">Source file: {session.sourceFileName}</p>
                            )}
                            {session.muxErrorMessage && (
                              <p className="text-sm text-red-500 mt-2">{session.muxErrorMessage}</p>
                            )}
                          </div>

                          <div className="flex flex-col gap-3">
                            <button
                              type="button"
                              onClick={() => handleEditSession(session)}
                              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-3 text-sm font-bold uppercase tracking-[0.2em] text-brand-dark hover:bg-white transition-colors"
                            >
                              <PencilLine className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSession(session)}
                              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-bold uppercase tracking-[0.2em] text-red-500 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[1.5rem] border border-dashed border-gray-200 bg-brand-gray/30 p-6 text-sm text-gray-500 font-medium">
                      No live sessions have been scheduled yet. Create the first one using the form.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
