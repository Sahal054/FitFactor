const subscribers = new Set();
let activeUpload = null;
let activeRequest = null;

function emit() {
  const snapshot = activeUpload ? { ...activeUpload } : null;
  subscribers.forEach((subscriber) => subscriber(snapshot));
}

function setActiveUpload(nextUpload) {
  activeUpload = nextUpload;
  emit();
}

function updateActiveUpload(patch) {
  if (!activeUpload) {
    return;
  }

  setActiveUpload({
    ...activeUpload,
    ...patch,
  });
}

function clearActiveUpload() {
  activeRequest = null;
  setActiveUpload(null);
}

export function subscribeToAdminUpload(listener) {
  subscribers.add(listener);
  listener(activeUpload ? { ...activeUpload } : null);

  return () => {
    subscribers.delete(listener);
  };
}

export function getAdminUploadState() {
  return activeUpload ? { ...activeUpload } : null;
}

export function hasActiveAdminUpload() {
  return Boolean(activeUpload && activeUpload.status === 'uploading');
}

export function startAdminUpload({ sessionId, uploadUrl, file, mode = 'create' }) {
  if (hasActiveAdminUpload()) {
    throw new Error('Another video upload is already in progress. Please wait or cancel it first.');
  }

  const xhr = new XMLHttpRequest();
  activeRequest = xhr;

  setActiveUpload({
    sessionId,
    fileName: file.name,
    mode,
    status: 'uploading',
    progress: 0,
    error: '',
    startedAt: new Date().toISOString(),
    completedAt: '',
    canceledAt: '',
  });

  xhr.open('PUT', uploadUrl);
  xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');

  xhr.upload.addEventListener('progress', (event) => {
    if (!event.lengthComputable) {
      return;
    }

    updateActiveUpload({
      progress: Math.round((event.loaded / event.total) * 100),
    });
  });

  xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      updateActiveUpload({
        status: 'completed',
        progress: 100,
        completedAt: new Date().toISOString(),
      });
      activeRequest = null;
      return;
    }

    updateActiveUpload({
      status: 'failed',
      error: 'Video upload to Mux failed. Please try again.',
    });
    activeRequest = null;
  });

  xhr.addEventListener('error', () => {
    updateActiveUpload({
      status: 'failed',
      error: 'Video upload to Mux failed. Please try again.',
    });
    activeRequest = null;
  });

  xhr.addEventListener('abort', () => {
    updateActiveUpload({
      status: 'canceled',
      canceledAt: new Date().toISOString(),
    });
    activeRequest = null;
  });

  xhr.send(file);

  return {
    cancel() {
      cancelActiveAdminUpload();
    },
  };
}

export function cancelActiveAdminUpload() {
  if (!activeRequest || !activeUpload || activeUpload.status !== 'uploading') {
    return false;
  }

  activeRequest.abort();
  return true;
}

export function resetAdminUploadState() {
  if (hasActiveAdminUpload()) {
    return false;
  }

  clearActiveUpload();
  return true;
}
