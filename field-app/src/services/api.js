import axios from 'axios';

export const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('nlams_server_url');
    if (saved) return saved;
  }
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (typeof window !== 'undefined' && window.location) {
    const { hostname } = window.location;
    // In Capacitor native app, hostname is typically localhost on Android
    const isNative = Boolean(window.Capacitor?.isNativePlatform());
    if (isNative) {
      return 'http://192.168.0.117:8000/api';
    }
    if (hostname && hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return `http://${hostname}:8000/api`;
    }
  }
  return 'http://localhost:8000/api';
};

const API_BASE_URL = getBaseUrl();

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 6000,
  headers: {
    'Content-Type': 'application/json'
  }
});

client.interceptors.request.use((config) => {
  config.baseURL = getBaseUrl();
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
