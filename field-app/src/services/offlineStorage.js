const DRAFTS_KEY = 'nlams_field_drafts';
const SYNC_QUEUE_KEY = 'nlams_field_sync_queue';
const COMPLETED_TASKS_KEY = 'nlams_completed_tasks';
const TASKS_CACHE_KEY = 'nlams_cached_tasks';

export const INITIAL_TASKS = [
  {
    id: 'TASK-FO-1042',
    task_code: 'FO-1042',
    khasra_number: '1042',
    project_id: 'NH-GJ-2026-001',
    parcel_id: 'P-1042',
    village: 'Limbdi',
    district: 'Surendranagar',
    area_ha: 2.45,
    assigned_date: '2026-03-12',
    due_date: '2026-03-15',
    priority: 'HIGH',
    status: 'PENDING',
    reason: 'Compensation pending, previous verification incomplete, AI risk 78%'
  },
  {
    id: 'TASK-FO-1038',
    task_code: 'FO-1038',
    khasra_number: '1038',
    project_id: 'NH-GJ-2026-001',
    parcel_id: 'P-1038',
    village: 'Ralol',
    district: 'Rajkot',
    area_ha: 3.1,
    assigned_date: '2026-03-12',
    due_date: '2026-03-16',
    priority: 'MEDIUM',
    status: 'PENDING',
    reason: 'Routine joint cadastral survey & marker check'
  },
  {
    id: 'TASK-FO-1039',
    task_code: 'FO-1039',
    khasra_number: '1039',
    project_id: 'NH-GJ-2026-001',
    parcel_id: 'P-1039',
    village: 'Ralol',
    district: 'Rajkot',
    area_ha: 1.85,
    assigned_date: '2026-03-12',
    due_date: '2026-03-16',
    priority: 'LOW',
    status: 'PENDING',
    reason: 'Boundary check post notification 3A'
  },
  {
    id: 'TASK-FO-1045',
    task_code: 'FO-1045',
    khasra_number: '1045',
    project_id: 'NH-GJ-2026-001',
    parcel_id: 'P-1045',
    village: 'Bamanbore',
    district: 'Rajkot',
    area_ha: 4.2,
    assigned_date: '2026-03-12',
    due_date: '2026-03-14',
    priority: 'HIGH',
    status: 'PENDING',
    reason: 'Tree and well valuation re-measurement'
  },
  {
    id: 'TASK-FO-1048',
    task_code: 'FO-1048',
    khasra_number: '1048',
    project_id: 'NH-GJ-2026-001',
    parcel_id: 'P-1048',
    village: 'Sayla Rural',
    district: 'Surendranagar',
    area_ha: 2.9,
    assigned_date: '2026-03-12',
    due_date: '2026-03-13',
    priority: 'CRITICAL',
    status: 'PENDING',
    reason: 'Disputed agricultural classification'
  },
  {
    id: 'TASK-FO-1040',
    task_code: 'FO-1040',
    khasra_number: '1040',
    project_id: 'NH-GJ-2026-001',
    parcel_id: 'P-1040',
    village: 'Ralol',
    district: 'Rajkot',
    area_ha: 2.1,
    assigned_date: '2026-03-08',
    due_date: '2026-03-10',
    priority: 'MEDIUM',
    status: 'COMPLETED',
    reason: 'Boundary verification'
  },
  {
    id: 'TASK-FO-1041',
    task_code: 'FO-1041',
    khasra_number: '1041',
    project_id: 'NH-GJ-2026-001',
    parcel_id: 'P-1041',
    village: 'Ralol',
    district: 'Rajkot',
    area_ha: 1.95,
    assigned_date: '2026-03-09',
    due_date: '2026-03-11',
    priority: 'LOW',
    status: 'COMPLETED',
    reason: 'Cultivation status verification'
  },
  {
    id: 'TASK-FO-1037',
    task_code: 'FO-1037',
    khasra_number: '1037',
    project_id: 'NH-GJ-2026-001',
    parcel_id: 'P-1037',
    village: 'Ralol',
    district: 'Rajkot',
    area_ha: 3.4,
    assigned_date: '2026-03-07',
    due_date: '2026-03-09',
    priority: 'MEDIUM',
    status: 'COMPLETED',
    reason: 'Pre-acquisition boundary check'
  }
];

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
  },

  // Local Cached Tasks list (Allows dynamic task updates in mobile offline mode)
  getCachedTasks: () => {
    try {
      const raw = localStorage.getItem(TASKS_CACHE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // ignore
    }
    return INITIAL_TASKS;
  },

  saveCachedTasks: (tasks) => {
    try {
      localStorage.setItem(TASKS_CACHE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('Error saving cached tasks:', e);
    }
  },

  // Completed task tracking (ensures local/offline submissions immediately reflect in Task list)
  markTaskCompleted: (taskId, meta = {}) => {
    try {
      const comp = offlineStorage.getCompletedTasks();
      const record = {
        completed_at: new Date().toISOString(),
        ...meta
      };
      comp[taskId] = record;

      // Also register aliases so lookup never fails regardless of key format
      const idStr = String(taskId || '');
      const rawNum = idStr.replace(/[^0-9]/g, '');
      if (rawNum) {
        comp[rawNum] = record;
        comp[`FO-${rawNum}`] = record;
        comp[`TASK-FO-${rawNum}`] = record;
        comp[`TASK-${rawNum}`] = record;
        comp[`P-${rawNum}`] = record;
      }
      if (meta.khasra_number) {
        const kStr = String(meta.khasra_number);
        comp[kStr] = record;
        comp[`FO-${kStr}`] = record;
        comp[`TASK-FO-${kStr}`] = record;
        comp[`TASK-${kStr}`] = record;
      }

      localStorage.setItem(COMPLETED_TASKS_KEY, JSON.stringify(comp));

      // Update cached tasks list directly
      const tasks = offlineStorage.getCachedTasks();
      const updated = tasks.map((t) => {
        const isMatch = t.id === taskId || t.task_code === taskId || t.khasra_number === meta.khasra_number || (rawNum && t.khasra_number === rawNum);
        if (isMatch) {
          return {
            ...t,
            status: 'COMPLETED',
            inspection_code: meta.inspection_code || `FO-${t.khasra_number}-2026-001`
          };
        }
        return t;
      });
      offlineStorage.saveCachedTasks(updated);

      return record;
    } catch (e) {
      console.error('Error marking task completed:', e);
      return null;
    }
  },

  getCompletedTasks: () => {
    try {
      const c = localStorage.getItem(COMPLETED_TASKS_KEY);
      return c ? JSON.parse(c) : {};
    } catch {
      return {};
    }
  },

  isTaskCompleted: (taskId) => {
    if (!taskId) return false;
    const comp = offlineStorage.getCompletedTasks();
    const idStr = String(taskId);
    const rawNum = idStr.replace(/[^0-9]/g, '');
    return Boolean(
      comp[idStr] ||
      comp[`TASK-${idStr}`] ||
      comp[idStr.replace('TASK-', '')] ||
      (rawNum && (comp[rawNum] || comp[`TASK-FO-${rawNum}`] || comp[`FO-${rawNum}`]))
    );
  },

  // Compute live dynamic KPI stats from tasks and completed status
  getDynamicStats: (customTasks = null) => {
    const tasks = customTasks || offlineStorage.getCachedTasks();
    const comp = offlineStorage.getCompletedTasks();

    let pending = 0;
    let completed = 0;
    let highPriority = 0;

    tasks.forEach((t) => {
      const isComp = comp[t.id] || comp[t.task_code] || comp[t.khasra_number] || comp[`TASK-${t.khasra_number}`] || t.status === 'COMPLETED';
      if (isComp) {
        completed += 1;
      } else {
        pending += 1;
        if (t.priority === 'HIGH' || t.priority === 'CRITICAL') {
          highPriority += 1;
        }
      }
    });

    return {
      assigned_today: tasks.length || 8,
      pending,
      completed,
      high_priority: highPriority
    };
  }
};
