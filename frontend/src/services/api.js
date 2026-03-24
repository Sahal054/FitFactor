import {
  mockAboutPageData,
  mockAdminPortalData,
  mockAppShellData,
  mockContactPageData,
  mockHomePageData,
  mockPricingPageData,
} from '../data/mockdata';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';

export const API_ENDPOINTS = {
  appShell: '/api/app-shell',
  homePage: '/api/pages/home',
  aboutPage: '/api/pages/about',
  pricingPage: '/api/pages/pricing',
  contactPage: '/api/pages/contact',
  dailyLiveSessionPage: '/api/pages/daily-live-session',
  consultationRequests: '/api/consultation-requests',
  adminSignup: '/api/admin/signup',
  adminLogin: '/api/admin/login',
  adminMe: '/api/admin/me',
  adminPortal: '/api/admin/portal',
  adminLiveSessions: '/api/admin/live-sessions',
};

const STORAGE_KEYS = {
  adminSession: 'fitfactor.adminSession',
};

function cloneData(data) {
  return JSON.parse(JSON.stringify(data));
}

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function readStorage(key) {
  if (!canUseStorage()) {
    return null;
  }

  const rawValue = window.localStorage.getItem(key);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue);
  } catch (error) {
    console.error(`Failed to read local storage key: ${key}`, error);
    return null;
  }
}

function writeStorage(key, value) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

function removeStorage(key) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(key);
}

function withMockResponse(data, delayMs = 150) {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(cloneData(data)), delayMs);
  });
}

function getStoredAdminSession() {
  return readStorage(STORAGE_KEYS.adminSession);
}

function persistAdminSession(session) {
  writeStorage(STORAGE_KEYS.adminSession, session);
  return session;
}

function normalizeScheduledAt(value) {
  const cleanedValue = value?.toString().trim() || '';

  if (!cleanedValue) {
    return '';
  }

  const parsedDate = new Date(cleanedValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return cleanedValue;
  }

  return parsedDate.toISOString();
}

function normalizeLiveSession(session) {
  if (!session) {
    return null;
  }

  const scheduledAt = normalizeScheduledAt(session.scheduledAt);
  const endsAt = normalizeScheduledAt(session.endsAt);
  const liveOffsetSeconds = Number(session.liveOffsetSeconds) || 0;
  const joinedAtOffsetSeconds = Number(session.joinedAtOffsetSeconds ?? liveOffsetSeconds) || 0;

  return {
    ...session,
    scheduledAt,
    endsAt,
    videoDurationSeconds: Number(session.videoDurationSeconds) || 0,
    liveOffsetSeconds,
    joinedAtOffsetSeconds,
    playbackEnabled: Boolean(session.playbackEnabled),
    videoReady: Boolean(session.videoReady),
    video: session.playbackId
      ? {
          sourceType: 'mux',
          playbackId: session.playbackId,
          startTime: liveOffsetSeconds,
        }
      : {
          sourceType: 'unavailable',
        },
  };
}

function withNormalizedLiveSession(pageData) {
  return {
    ...pageData,
    session: normalizeLiveSession(pageData.session),
  };
}

function normalizeLiveSessionPayload(payload) {
  return {
    sessionId: payload.sessionId || '',
    title: payload.title?.trim() || '',
    description: payload.description?.trim() || '',
    coachName: payload.coachName?.trim() || '',
    scheduledAt: normalizeScheduledAt(payload.scheduledAt),
    accessNote: payload.accessNote?.trim() || '',
    originalFileName: payload.originalFileName?.trim() || '',
  };
}

async function request(endpoint, options = {}) {
  const { auth = false, headers, body, ...fetchOptions } = options;
  const adminSession = getStoredAdminSession();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(auth && adminSession?.token ? { Authorization: `Bearer ${adminSession.token}` } : {}),
      ...(headers || {}),
    },
    body,
  });

  const rawText = await response.text();
  let parsedBody = null;

  if (rawText) {
    try {
      parsedBody = JSON.parse(rawText);
    } catch (error) {
      parsedBody = rawText;
    }
  }

  if (!response.ok) {
    throw new Error(parsedBody?.message || `API request failed with status ${response.status}`);
  }

  return parsedBody;
}

function getResource(endpoint, mockData) {
  if (USE_MOCK_API) {
    return withMockResponse(mockData);
  }

  return request(endpoint);
}

function uploadVideoToMux(uploadUrl, file, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open('PUT', uploadUrl);
    xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');

    xhr.upload.addEventListener('progress', (event) => {
      if (!event.lengthComputable || typeof onProgress !== 'function') {
        return;
      }

      onProgress(Math.round((event.loaded / event.total) * 100));
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        if (typeof onProgress === 'function') {
          onProgress(100);
        }

        resolve({ success: true });
        return;
      }

      reject(new Error('Video upload to Mux failed. Please try again.'));
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Video upload to Mux failed. Please try again.'));
    });

    xhr.send(file);
  });
}

export const api = {
  getAppShellData() {
    return getResource(API_ENDPOINTS.appShell, mockAppShellData);
  },
  getHomePageData() {
    return getResource(API_ENDPOINTS.homePage, mockHomePageData);
  },
  getAboutPageData() {
    return getResource(API_ENDPOINTS.aboutPage, mockAboutPageData);
  },
  getPricingPageData() {
    return getResource(API_ENDPOINTS.pricingPage, mockPricingPageData);
  },
  getContactPageData() {
    return getResource(API_ENDPOINTS.contactPage, mockContactPageData);
  },
  getDailyLiveSessionData() {
    return request(API_ENDPOINTS.dailyLiveSessionPage).then((data) => withNormalizedLiveSession(data));
  },
  getAdminPortalData() {
    return getResource(API_ENDPOINTS.adminPortal, mockAdminPortalData);
  },
  submitConsultationRequest(payload) {
    if (USE_MOCK_API) {
      return withMockResponse(
        {
          success: true,
          requestId: `mock-${Date.now()}`,
          message: 'Consultation request submitted successfully.',
          lead: payload,
        },
        500,
      );
    }

    return request(API_ENDPOINTS.consultationRequests, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  signupAdmin(payload) {
    return request(API_ENDPOINTS.adminSignup, {
      method: 'POST',
      body: JSON.stringify(payload),
    }).then((response) => {
      persistAdminSession({
        token: response.token,
        user: response.user,
        loggedInAt: new Date().toISOString(),
      });

      return response;
    });
  },
  loginAdmin(credentials) {
    return request(API_ENDPOINTS.adminLogin, {
      method: 'POST',
      body: JSON.stringify(credentials),
    }).then((response) => {
      persistAdminSession({
        token: response.token,
        user: response.user,
        loggedInAt: new Date().toISOString(),
      });

      return response;
    });
  },
  getAdminMe() {
    return request(API_ENDPOINTS.adminMe, {
      auth: true,
    });
  },
  logoutAdmin() {
    removeStorage(STORAGE_KEYS.adminSession);
    return Promise.resolve({ success: true });
  },
  isAdminAuthenticated() {
    return Boolean(getStoredAdminSession()?.token);
  },
  getAdminSession() {
    return getStoredAdminSession();
  },
  getAdminLiveSessions() {
    return request(API_ENDPOINTS.adminLiveSessions, {
      auth: true,
    }).then((response) => response.sessions.map((session) => normalizeLiveSession(session)));
  },
  deleteAdminLiveSession(sessionId) {
    return request(`${API_ENDPOINTS.adminLiveSessions}/${sessionId}`, {
      method: 'DELETE',
      auth: true,
    });
  },
  saveDailyLiveSession(payload) {
    const normalizedPayload = normalizeLiveSessionPayload(payload);

    if (!normalizedPayload.sessionId && !normalizedPayload.originalFileName) {
      return Promise.reject(new Error('Please choose a workout video before saving the session.'));
    }

    const endpoint = normalizedPayload.sessionId
      ? `${API_ENDPOINTS.adminLiveSessions}/${normalizedPayload.sessionId}`
      : API_ENDPOINTS.adminLiveSessions;
    const method = normalizedPayload.sessionId ? 'PUT' : 'POST';

    return request(endpoint, {
      method,
      auth: true,
      body: JSON.stringify(normalizedPayload),
    }).then((response) => ({
      ...response,
      session: normalizeLiveSession(response.session),
    }));
  },
  uploadVideoToMux,
};
