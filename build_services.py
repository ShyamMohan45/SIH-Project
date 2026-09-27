import os

base = r"C:\Users\shyam\.gemini\antigravity\scratch\n-lams-national-platform\field-app\src\services"
os.makedirs(base, exist_ok=True)

# 1. api.js
with open(os.path.join(base, "api.js"), "w", encoding="utf-8") as f:
    f.write("""import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('nlams_field_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  // Auth
  login: async (email, password) => {
    const res = await client.post('/auth/login', { email, password });
    if (res.data && res.data.access_token) {
      localStorage.setItem('nlams_field_token', res.data.access_token);
      localStorage.setItem('nlams_field_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },
  
  logout: () => {
    localStorage.removeItem('nlams_field_token');
    localStorage.removeItem('nlams_field_user');
  },
  
  getStoredUser: () => {
    try {
      const u = localStorage.getItem('nlams_field_user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },

  // Profile
  getProfile: async () => {
    const res = await client.get('/field/profile');
    return res.data;
  },

  // Tasks
  getTasks: async (statusFilter = 'ALL') => {
    const user = api.getStoredUser();
    const officerId = user?.officer_id || user?.id || 'FO-007';
    const params = { officer_id: officerId };
    if (statusFilter && statusFilter !== 'ALL') {
      params.status_filter = statusFilter;
    }
    const res = await client.get('/field/tasks', { params });
    return res.data;
  },

  getTaskDetail: async (taskId) => {
    const res = await client.get(`/field/tasks/${taskId}`);
    return res.data;
  },

  // Map
  getFieldMap: async (projectId = 'NH-GJ-2026-001') => {
    const res = await client.get('/field/map', { params: { project_id: projectId } });
    return res.data;
  },

  // Inspection Workflow Steps
  startInspection: async (payload) => {
    const res = await client.post('/field/inspection/start', payload);
    return res.data;
  },

  verifyGps: async (payload) => {
    const res = await client.post('/field/inspection/gps', payload);
    return res.data;
  },

  uploadPhoto: async (payload) => {
    const res = await client.post('/field/inspection/photos', payload);
    return res.data;
  },

  uploadPhotoFile: async (formData) => {
    const res = await client.post('/field/inspection/photos/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  updateChecklist: async (payload) => {
    const res = await client.post('/field/inspection/checklist', payload);
    return res.data;
  },

  reportIssue: async (payload) => {
    const res = await client.post('/field/inspection/issues', payload);
    return res.data;
  },

  submitInspection: async (payload) => {
    const res = await client.post('/field/inspection/submit', payload);
    return res.data;
  },

  getInspectionDetail: async (id) => {
    const res = await client.get(`/field/inspection/${id}`);
    return res.data;
  },

  getHistory: async () => {
    const user = api.getStoredUser();
    const officerId = user?.officer_id || 'FO-007';
    const res = await client.get('/field/history', { params: { officer_id: officerId } });
    return res.data;
  },

  // Batch Sync
  syncOfflineBundle: async (bundle) => {
    const res = await client.post('/sync', bundle);
    return res.data;
  }
};

export default api;
""")

# 2. offlineStorage.js
with open(os.path.join(base, "offlineStorage.js"), "w", encoding="utf-8") as f:
    f.write("""const DRAFTS_KEY = 'nlams_field_drafts';
const SYNC_QUEUE_KEY = 'nlams_field_sync_queue';

export const offlineStorage = {
  // Save inspection draft
  saveDraft: (taskId, draftData) => {
    try {
      const drafts = offlineStorage.getAllDrafts();
      drafts[taskId] = {
        ...draftData,
        updated_at: new Date().toISOString()
      };
      localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
      return true;
    } catch (e) {
      console.error('Error saving draft:', e);
      return false;
    }
  },

  getDraft: (taskId) => {
    try {
      const drafts = offlineStorage.getAllDrafts();
      return drafts[taskId] || null;
    } catch {
      return null;
    }
  },

  getAllDrafts: () => {
    try {
      const d = localStorage.getItem(DRAFTS_KEY);
      return d ? JSON.parse(d) : {};
    } catch {
      return {};
    }
  },

  clearDraft: (taskId) => {
    try {
      const drafts = offlineStorage.getAllDrafts();
      delete drafts[taskId];
      localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
    } catch (e) {
      console.error('Error clearing draft:', e);
    }
  },

  // Offline submission queue
  queueSubmission: (inspectionPayload) => {
    try {
      const queue = offlineStorage.getSyncQueue();
      queue.push({
        id: `QUEUE-${Date.now()}`,
        payload: inspectionPayload,
        queued_at: new Date().toISOString()
      });
      localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
      return true;
    } catch (e) {
      console.error('Error queuing submission:', e);
      return false;
    }
  },

  getSyncQueue: () => {
    try {
      const q = localStorage.getItem(SYNC_QUEUE_KEY);
      return q ? JSON.parse(q) : [];
    } catch {
      return [];
    }
  },

  clearSyncQueue: () => {
    try {
      localStorage.removeItem(SYNC_QUEUE_KEY);
    } catch (e) {
      console.error('Error clearing queue:', e);
    }
  },

  getPendingCount: () => {
    const drafts = Object.keys(offlineStorage.getAllDrafts()).length;
    const queue = offlineStorage.getSyncQueue().length;
    return drafts + queue;
  }
};
""")

# 3. geoUtils.js
with open(os.path.join(base, "geoUtils.js"), "w", encoding="utf-8") as f:
    f.write("""// Geo Calculations & Demo Coordinates
export const DEMO_COORDS = {
  // Khasra 1042 centroid
  khasra1042: {
    lat: 22.386221,
    lng: 71.064316,
    khasra: '1042',
    village: 'Limbdi',
    district: 'Surendranagar'
  },
  // Simulated officer location standing 12m away
  officerGps: {
    lat: 22.386315,
    lng: 71.064390,
    accuracy: 8.0,
    distanceMeters: 12.4
  }
};

/**
 * Calculate distance between two coordinates using Haversine formula
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Format meters for government field display
 */
export function formatDistance(meters) {
  if (meters < 1000) {
    return `${meters} metres`;
  }
  return `${(meters / 1000).toFixed(2)} km`;
}
""")

print("SUCCESS: api.js, offlineStorage.js, and geoUtils.js written!")
