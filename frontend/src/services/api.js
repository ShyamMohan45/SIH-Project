import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Resilient API Service with fallback synthetic state
export const api = {
  // 1. Auth
  login: async (email, password) => {
    try {
      const res = await client.post('/api/auth/login', { email, password });
      return res.data;
    } catch (err) {
      console.warn('Backend login fallback:', err.message);
      const role = email.includes('central') ? 'CENTRAL_ADMIN' :
                   email.includes('collector') ? 'DISTRICT_OFFICER' :
                   email.includes('surveyor') ? 'FIELD_OFFICER' : 'STATE_OFFICER';
      return {
        access_token: 'demo_token_offline',
        user: {
          id: 'USR-DEMO',
          name: email.split('@')[0].replace('.', ' ').toUpperCase(),
          email,
          role,
          state: 'Gujarat',
          district: 'Rajkot'
        }
      };
    }
  },

  // 1b. Control Room Dashboard Summary (KPIs, Alerts, Risk Distribution, Recent Field Activity)
  getDashboardSummary: async (state = 'ALL', district = 'ALL') => {
    try {
      const res = await client.get(`/api/dashboard/summary?state=${state}&district=${district}`);
      return res.data;
    } catch (err) {
      console.warn('Backend dashboard summary fallback:', err.message);
      return {
        kpis: {
          total_projects: 10,
          land_required_ha: 25120.0,
          land_acquired_ha: 17630.0,
          acquisition_pct: 70.2,
          affected_families: 27320,
          displaced_families: 8560,
          pending_compensation_cr: 4590.0,
          pending_rr_families: 12320,
          legal_cases: 198,
          high_risk_projects: 4,
          overdue_activities: 18
        },
        risk_distribution: { CRITICAL: 2, HIGH: 2, MEDIUM: 3, LOW: 3 },
        projects_needing_attention: [
          {
            id: 'NH-GJ-2026-001',
            name: 'Ahmedabad–Rajkot Green Highway Expansion',
            state: 'Gujarat',
            district: 'Rajkot, Surendranagar',
            progress: 62.4,
            delay_days: 74,
            risk_level: 'HIGH',
            risk_score: 82.0,
            current_stage: 'Compensation',
            primary_issue: 'Compensation backlog + Section 15 inquiries',
            next_action: 'Review Compensation'
          }
        ],
        recent_field_activity: [],
        live_alerts: []
      };
    }
  },

  // 2. Dashboards
  getCentralDashboard: async () => {
    try {
      const res = await client.get('/api/dashboard/central');
      return res.data;
    } catch (err) {
      console.warn('Backend central dashboard fallback:', err.message);
      return {
        kpis: {
          total_projects: 128,
          total_land_required_ha: 18450.0,
          total_land_acquired_ha: 11720.0,
          overall_acquisition_pct: 63.5,
          compensation_disbursed_cr: 8420.0,
          affected_families: 48320,
          displaced_families: 12480,
          high_risk_projects: 17
        },
        state_breakdown: [
          { state: 'Gujarat', projects: 182, acq_pct: 82.7, high_risk: 14 },
          { state: 'Maharashtra', projects: 310, acq_pct: 74.2, high_risk: 28 },
          { state: 'Rajasthan', projects: 214, acq_pct: 68.5, high_risk: 19 },
          { state: 'Karnataka', projects: 195, acq_pct: 71.0, high_risk: 12 }
        ],
        stage_distribution: {
          Proposal: 12, Scrutiny: 18, Approval: 24, Notification: 32,
          Objection: 21, Award: 19, Compensation: 28, 'R&R': 15, Possession: 22, Closure: 16
        }
      };
    }
  },

  getStateDashboard: async (state = 'Gujarat') => {
    try {
      const res = await client.get(`/api/dashboard/state?state=${state}`);
      return res.data;
    } catch (err) {
      console.warn('Backend state dashboard fallback:', err.message);
      return {
        state,
        kpis: {
          total_projects: 182,
          land_required_ha: 82400.0,
          land_acquired_ha: 68200.0,
          acquisition_pct: 82.7,
          compensation_paid_cr: 2840.0,
          high_risk_projects: 14,
          rr_completion_pct: 76.4
        }
      };
    }
  },

  // 3. Projects
  getProjects: async (state = 'ALL', search = '') => {
    try {
      const res = await client.get(`/api/projects?state=${state}&search=${search}`);
      return res.data;
    } catch (err) {
      console.warn('Backend projects fallback:', err.message);
      return [];
    }
  },

  getProjectDetail: async (projectId = 'NH-GJ-2026-001') => {
    try {
      const res = await client.get(`/api/projects/${projectId}`);
      return res.data;
    } catch (err) {
      console.warn('Backend project detail fallback:', err.message);
      return null;
    }
  },

  getProject: async (projectId = 'NH-GJ-2026-001') => {
    try {
      const res = await client.get(`/api/projects/${projectId}`);
      return res.data?.project || res.data;
    } catch (err) {
      console.warn('Backend getProject fallback:', err.message);
      return null;
    }
  },

  createProject: async (projectData) => {
    try {
      const res = await client.post('/api/projects', projectData);
      return res.data;
    } catch (err) {
      console.warn('Backend create project fallback:', err.message);
      return { id: `PROJ-${Date.now()}`, ...projectData };
    }
  },

  // 4. Parcels & GIS
  getMap: async (params = {}) => {
    try {
      const res = await client.get('/api/map', { params });
      return res.data;
    } catch (err) {
      console.warn('Backend map GeoJSON fallback:', err.message);
      return null;
    }
  },

  getProjectMap: async (projectId = 'NH-GJ-2026-001') => {
    try {
      const res = await client.get(`/api/projects/${projectId}/map`);
      return res.data;
    } catch (err) {
      console.warn('Backend project map fallback:', err.message);
      return null;
    }
  },

  getParcelGeometry: async (parcelId) => {
    try {
      const res = await client.get(`/api/parcels/${parcelId}/geometry`);
      return res.data;
    } catch (err) {
      console.warn('Backend parcel geometry fallback:', err.message);
      return null;
    }
  },

  getStateGIS: async (state) => {
    try {
      const res = await client.get(`/api/gis/state/${encodeURIComponent(state)}`);
      return res.data;
    } catch (err) {
      console.warn('Backend state GIS fallback:', err.message);
      return null;
    }
  },

  getDistrictGIS: async (district) => {
    try {
      const res = await client.get(`/api/gis/district/${encodeURIComponent(district)}`);
      return res.data;
    } catch (err) {
      console.warn('Backend district GIS fallback:', err.message);
      return null;
    }
  },

  getProjectCorridor: async (projectId = 'NH-GJ-2026-001') => {
    try {
      const res = await client.get(`/api/gis/projects/${projectId}/corridor`);
      return res.data;
    } catch (err) {
      console.warn('Backend project corridor fallback:', err.message);
      return null;
    }
  },

  getProjectAffectedParcels: async (projectId = 'NH-GJ-2026-001') => {
    try {
      const res = await client.get(`/api/gis/projects/${projectId}/affected-parcels`);
      return res.data;
    } catch (err) {
      console.warn('Backend project affected parcels fallback:', err.message);
      return null;
    }
  },

  getFieldGPSPoints: async (projectId = 'ALL') => {
    try {
      const url = projectId && projectId !== 'ALL' ? `/api/gis/inspections/gps?project_id=${projectId}` : '/api/gis/inspections/gps';
      const res = await client.get(url);
      return res.data;
    } catch (err) {
      console.warn('Backend field GPS points fallback:', err.message);
      return null;
    }
  },

  getParcelsGeoJSON: async (projectId = 'NH-GJ-2026-001') => {
    try {
      const res = await client.get(`/api/map?project_id=${projectId}`);
      return res.data;
    } catch (err) {
      console.warn('Backend parcels GeoJSON fallback:', err.message);
      return null;
    }
  },

  getParcelDetail: async (parcelId) => {
    try {
      const res = await client.get(`/api/parcels/${parcelId}`);
      return res.data;
    } catch (err) {
      console.warn('Backend parcel detail fallback:', err.message);
      return null;
    }
  },

  verifyParcel: async (parcelId, data) => {
    try {
      const res = await client.post(`/api/parcels/${parcelId}/verify`, data);
      return res.data;
    } catch (err) {
      console.warn('Backend verify parcel fallback:', err.message);
      return { message: 'Verified in local simulation', parcel: { id: parcelId, field_verified: true } };
    }
  },

  // 5. Compensation, R&R, Legal
  getCompensation: async (projectId = 'NH-GJ-2026-001') => {
    try {
      const res = await client.get(`/api/compensation?project_id=${projectId}`);
      return res.data;
    } catch (err) {
      return [];
    }
  },

  getRRRecords: async (projectId = 'NH-GJ-2026-001') => {
    try {
      const res = await client.get(`/api/rr?project_id=${projectId}`);
      return res.data;
    } catch (err) {
      return [];
    }
  },

  getLegalCases: async (projectId = 'NH-GJ-2026-001') => {
    try {
      const res = await client.get(`/api/legal?project_id=${projectId}`);
      return res.data;
    } catch (err) {
      return [];
    }
  },

  // 6. Documents
  getDocuments: async (projectId = 'NH-GJ-2026-001') => {
    try {
      const res = await client.get(`/api/documents?project_id=${projectId}`);
      return res.data;
    } catch (err) {
      return [];
    }
  },

  // 7. AI Risk (PS17)
  predictRisk: async (features) => {
    try {
      const res = await client.post('/api/risk/predict', features);
      return res.data;
    } catch (err) {
      console.warn('Backend risk predict fallback:', err.message);
      return {
        delay_probability: 0.82,
        risk_percentage: 82.0,
        risk_level: 'HIGH',
        predicted_delay_days: 74,
        contributing_factors: [
          { factor: 'Legal Disputes & Section 15 Objections', contribution_pct: 42.0, severity: 'HIGH' },
          { factor: 'Compensation Payment Backlog (>30 Days)', contribution_pct: 28.0, severity: 'HIGH' },
          { factor: 'Administrative Approval Latency', contribution_pct: 18.0, severity: 'MEDIUM' }
        ],
        recommendations: [
          { id: 'REC-01', priority: 'CRITICAL', reason: '18 legal disputes pending', suggested_action: 'Deploy dedicated Land Acquisition Tribunal bench.' },
          { id: 'REC-02', priority: 'HIGH', reason: 'Compensation backlog at 45%', suggested_action: 'Authorize PFMS Direct Benefit Transfer batch release.' }
        ]
      };
    }
  },

  getRiskHistory: async (projectId = 'NH-GJ-2026-001') => {
    try {
      const res = await client.get(`/api/projects/${projectId}/risk-history`);
      return res.data;
    } catch (err) {
      return [
        { month: 'Month 1', risk_score: 18, status: 'LOW' },
        { month: 'Month 2', risk_score: 24, status: 'LOW' },
        { month: 'Month 3', risk_score: 39, status: 'MEDIUM' },
        { month: 'Month 4', risk_score: 61, status: 'HIGH' },
        { month: 'Month 5', risk_score: 82, status: 'CRITICAL' }
      ];
    }
  },

  // 8. Closed-Loop Intervention Action
  executeIntervention: async (projectId = 'NH-GJ-2026-001', actionData) => {
    try {
      const res = await client.post(`/api/projects/${projectId}/action`, actionData);
      return res.data;
    } catch (err) {
      console.warn('Backend intervention fallback:', err.message);
      return {
        before_intervention: { risk_score: 82.0, risk_level: 'HIGH' },
        after_intervention: { risk_score: 61.0, risk_level: 'MEDIUM', delay_days: 28 }
      };
    }
  },

  applyAction: async (projectId = 'NH-GJ-2026-001', actionType = 'FAST_TRACK_LOK_ADALAT') => {
    return api.executeIntervention(projectId, {
      action_type: actionType,
      officer_notes: 'Fast-track Lok Adalat intervention triggered by CALA'
    });
  },

  // 9. Alerts & Audit Logs
  getAlerts: async () => {
    try {
      const res = await client.get('/api/alerts');
      return res.data;
    } catch (err) {
      return [];
    }
  },

  updateAlertStatus: async (alertId, status) => {
    try {
      const res = await client.put(`/api/alerts/${alertId}?status=${status}`);
      return res.data;
    } catch (err) {
      return { message: 'Updated alert' };
    }
  },

  getAuditLogs: async () => {
    try {
      const res = await client.get('/api/audit-logs');
      return res.data;
    } catch (err) {
      return [];
    }
  },

  // 10. Demo Reset
  resetDemo: async () => {
    try {
      const res = await client.post('/api/demo/reset');
      return res.data;
    } catch (err) {
      return { message: 'Demo reset' };
    }
  },

  // 11. Mobile-First Field Officer APIs
  getFieldTasks: async (officerId = '', statusFilter = 'ALL') => {
    try {
      const res = await client.get(`/api/field/tasks?officer_id=${officerId}&status_filter=${statusFilter}`);
      return res.data;
    } catch (err) {
      console.warn('Backend field tasks fallback:', err.message);
      return {
        stats: { assigned_today: 8, pending: 5, completed: 3, high_priority: 2 },
        tasks: [
          {
            id: 'TASK-FO-1042',
            task_code: 'FO-1042',
            project_id: 'NH-GJ-2026-001',
            parcel_id: 'P-1042',
            khasra_number: '1042',
            village: 'Limbdi',
            district: 'Rajkot',
            area_ha: 2.45,
            priority: 'HIGH',
            reason: 'Compensation pending, AI risk 78%',
            status: 'PENDING',
            assigned_date: '2026-03-12',
            due_date: '2026-03-15'
          }
        ]
      };
    }
  },

  getFieldTaskDetail: async (taskId) => {
    try {
      const res = await client.get(`/api/field/tasks/${taskId}`);
      return res.data;
    } catch (err) {
      return null;
    }
  },

  assignFieldTask: async (data) => {
    try {
      const res = await client.post('/api/field/tasks/assign', data);
      return res.data;
    } catch (err) {
      return { message: 'Task assigned (simulated)', task: data };
    }
  },

  startFieldInspection: async (data) => {
    try {
      const res = await client.post('/api/field/inspection/start', data);
      return res.data;
    } catch (err) {
      return {
        message: 'Started locally',
        inspection: {
          id: `INSP-${Date.now()}`,
          inspection_code: `FO-${data.parcel_id || '1042'}-2026-001`,
          status: 'IN_PROGRESS',
          ...data
        }
      };
    }
  },

  verifyFieldGps: async (data) => {
    try {
      const res = await client.post('/api/field/inspection/gps', data);
      return res.data;
    } catch (err) {
      return {
        message: 'GPS verified locally',
        gps_verified: true,
        gps_mode: data.is_simulated ? 'DEMO_SIMULATED' : 'REAL',
        latitude: data.latitude,
        longitude: data.longitude,
        accuracy_m: data.accuracy_m || 8.0,
        distance_m: 12.0,
        location_matched: true
      };
    }
  },

  uploadFieldPhoto: async (data) => {
    try {
      const res = await client.post('/api/field/inspection/photos', data);
      return res.data;
    } catch (err) {
      return { message: 'Photo saved locally', photo: { id: `PH-${Date.now()}`, ...data } };
    }
  },

  updateFieldChecklist: async (data) => {
    try {
      const res = await client.post('/api/field/inspection/checklist', data);
      return res.data;
    } catch (err) {
      return { message: 'Checklist updated locally' };
    }
  },

  reportFieldIssue: async (data) => {
    try {
      const res = await client.post('/api/field/inspection/issues', data);
      return res.data;
    } catch (err) {
      return { message: 'Issue saved locally', issue: { id: `ISS-${Date.now()}`, ...data } };
    }
  },

  submitFieldInspection: async (data) => {
    try {
      const res = await client.post('/api/field/inspection/submit', data);
      return res.data;
    } catch (err) {
      return {
        message: 'Inspection submitted locally',
        inspection_code: 'FO-1042-2026-001',
        status: 'Submitted for Review',
        ai_risk_update: {
          old_risk_score: 78.0,
          new_risk_score: 87.0,
          risk_level: 'CRITICAL',
          predicted_delay_days: 86,
          reasons: [
            { factor: 'Owner dispute detected on ground', impact: '+12%' },
            { factor: 'Compensation payout grievance confirmed', impact: '+7%' }
          ]
        }
      };
    }
  },

  getFieldInspectionDetail: async (inspectionId) => {
    try {
      const res = await client.get(`/api/field/inspection/${inspectionId}`);
      return res.data;
    } catch (err) {
      return null;
    }
  },

  getFieldHistory: async (officerId = '') => {
    try {
      const res = await client.get(`/api/field/history?officer_id=${officerId}`);
      return res.data;
    } catch (err) {
      return [];
    }
  },

  // 12. Main Web Portal Extended APIs
  getProjectWorkflow: async (projectId = 'NH-GJ-2026-001') => {
    try {
      const res = await client.get(`/api/projects/${projectId}/workflow`);
      return res.data;
    } catch (err) {
      console.warn('Backend project workflow fallback:', err.message);
      return [];
    }
  },

  getProjectParcels: async (projectId = 'NH-GJ-2026-001') => {
    try {
      const res = await client.get(`/api/projects/${projectId}/parcels`);
      return res.data;
    } catch (err) {
      return [];
    }
  },

  getAllFieldInspections: async (status = 'ALL') => {
    try {
      const res = await client.get(`/api/field/inspections?status=${status}`);
      return res.data;
    } catch (err) {
      console.warn('Backend all field inspections fallback:', err.message);
      return [];
    }
  },

  reviewFieldInspection: async (inspectionId, actionData) => {
    try {
      const res = await client.post(`/api/field/inspection/${inspectionId}/review`, actionData);
      return res.data;
    } catch (err) {
      return { message: `Inspection reviewed (${actionData.action})` };
    }
  },

  getRecommendations: async (projectId = null) => {
    try {
      const url = projectId ? `/api/recommendations?project_id=${projectId}` : '/api/recommendations';
      const res = await client.get(url);
      return res.data;
    } catch (err) {
      return [];
    }
  },

  executeRecommendationAction: async (recId, actionData) => {
    try {
      const res = await client.post(`/api/recommendations/${recId}/action`, actionData);
      return res.data;
    } catch (err) {
      return { message: 'Action executed' };
    }
  },

  globalSearch: async (query) => {
    if (!query || !query.trim()) return { results: { projects: [], parcels: [], inspections: [], issues: [] } };
    try {
      const res = await client.get(`/api/search?q=${encodeURIComponent(query.trim())}`);
      return res.data;
    } catch (err) {
      return { query, results: { projects: [], parcels: [], inspections: [], issues: [] } };
    }
  },

  getReportsSummary: async () => {
    try {
      const res = await client.get('/api/reports');
      return res.data;
    } catch (err) {
      return {
        national_summary: { total_corridors: 10, total_land_required_ha: 25120, total_land_acquired_ha: 17630, national_acquisition_rate: 70.2 },
        state_performance_rankings: [],
        statutory_stage_delays: []
      };
    }
  }
};
