import React, { useState, useEffect } from 'react';
import FieldLayout from './components/layout/FieldLayout';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import TasksPage from './pages/TasksPage';
import FieldMapPage from './pages/FieldMapPage';
import HistoryPage from './pages/HistoryPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import InspectionWorkflowPage from './pages/InspectionWorkflowPage';
import { api } from './services/api';
import { offlineStorage } from './services/offlineStorage';
import { nativeService } from './services/nativeService';

export default function App() {
  const [user, setUser] = useState(() => {
    const stored = api.getStoredUser();
    return stored || {
      id: 'USR-004',
      officer_id: 'FO-007',
      name: 'Amit B. Parmar',
      email: 'field.surveyor@nlams.gov.in',
      role: 'FIELD_OFFICER',
      department: 'Cadastral Survey & Ground Verification Directorate',
      district: 'Surendranagar / Rajkot'
    };
  });

  const [activeTab, setActiveTab] = useState('home');
  const [inspectingTask, setInspectingTask] = useState(null);
  const [showBackDraftDialog, setShowBackDraftDialog] = useState(false);
  const [taskFilter, setTaskFilter] = useState('ALL');

  const handleNavigate = (tab, filter = 'ALL') => {
    setActiveTab(tab);
    if (tab === 'tasks') {
      setTaskFilter(filter || 'ALL');
    }
  };
  const [stats, setStats] = useState(() => offlineStorage.getDynamicStats());

  const refreshStats = async () => {
    // Instantly compute real-time dynamic stats from cached tasks & completed records
    const dynamic = offlineStorage.getDynamicStats();
    setStats(dynamic);

    // Also query backend if reachable
    try {
      const prof = await api.getProfile();
      if (prof?.stats) {
        setStats(prof.stats);
      }
    } catch {
      // Dynamic local stats preserved
    }
  };

  // Hide splash screen and set up Android hardware back button
  useEffect(() => {
    nativeService.hideSplashScreen();

    const cleanupBack = nativeService.registerBackButton(() => {
      if (inspectingTask) {
        setShowBackDraftDialog(true);
      } else if (activeTab !== 'home') {
        setActiveTab('home');
      } else {
        nativeService.exitApp();
      }
    });

    return () => {
      cleanupBack();
    };
  }, [inspectingTask, activeTab]);

  // Fetch initial profile stats
  useEffect(() => {
    refreshStats();
  }, [user]);

  const handleStartInspectionById = async (taskIdOrCode) => {
    try {
      const detail = await api.getTaskDetail(taskIdOrCode);
      if (detail && detail.task) {
        setInspectingTask(detail.task);
        return;
      }
    } catch {
      // Fallback to cached tasks
    }

    // Match any task in offline storage by id, code, or khasra number
    const cached = offlineStorage.getCachedTasks();
    const idStr = String(taskIdOrCode || '');
    const rawNum = idStr.replace(/[^0-9]/g, '');
    const found = cached.find((t) =>
      t.id === idStr ||
      t.task_code === idStr ||
      t.khasra_number === idStr ||
      (rawNum && t.khasra_number === rawNum)
    );

    if (found) {
      setInspectingTask(found);
      return;
    }

    // Default fallback task
    setInspectingTask({
      id: 'TASK-FO-1042',
      task_code: 'FO-1042',
      khasra_number: '1042',
      project_id: 'NH-GJ-2026-001',
      parcel_id: 'P-1042',
      village: 'Limbdi',
      district: 'Surendranagar',
      area_ha: 2.45,
      priority: 'HIGH',
      reason: 'Compensation pending, previous verification incomplete, AI risk 78%'
    });
  };

  const handleSyncNow = async () => {
    const queue = offlineStorage.getSyncQueue();
    const drafts = offlineStorage.getAllDrafts();
    const inspectionsToSync = [];

    // Bundle queued submissions
    for (const item of queue) {
      if (item.payload) inspectionsToSync.push(item.payload);
    }

    // Bundle any unsaved drafts marked as ready
    for (const [taskId, draft] of Object.entries(drafts)) {
      if (draft.step === 6) {
        inspectionsToSync.push({
          task_id: taskId,
          project_id: draft.project_id || 'NH-GJ-2026-001',
          parcel_id: draft.parcel_id || 'P-1042',
          officer_id: user?.officer_id || 'FO-007',
          officer_name: user?.name || 'Amit B. Parmar',
          latitude: draft.gps?.lat,
          longitude: draft.gps?.lng,
          khasra_expected: draft.khasra?.expected,
          khasra_observed: draft.khasra?.observed,
          boundary_status: draft.boundary?.matchesGis === 'YES' ? 'Matched' : 'Mismatch',
          land_use: draft.landUse?.actual,
          occupancy_status: draft.occupancy?.status,
          compensation_status: draft.compensation?.statusRecorded,
          checklist_data: draft.checklist,
          remarks: draft.remarks,
          photos: draft.photos || []
        });
      }
    }

    if (inspectionsToSync.length > 0) {
      try {
        await api.syncOfflineBundle({
          inspections: inspectionsToSync,
          photos: [],
          issues: []
        });
        offlineStorage.clearSyncQueue();
        alert(`Successfully synchronized ${inspectionsToSync.length} inspections with N-LAMS Central Server!`);
      } catch (e) {
        console.error('Sync failed:', e);
        alert('Server unreachable. Offline drafts preserved for next sync.');
      }
    } else {
      alert('All local field inspections are already synchronized.');
    }
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
  };

  // If not logged in, show LoginPage
  if (!user) {
    return <LoginPage onLoginSuccess={(u) => setUser(u)} />;
  }

  // If active inspection in progress, render workflow
  if (inspectingTask) {
    return (
      <div className="min-h-screen bg-slate-100 max-w-md mx-auto border-x border-slate-200 shadow-xl select-none relative">
        <InspectionWorkflowPage
          key={inspectingTask.id || inspectingTask.khasra_number}
          task={inspectingTask}
          onBack={() => setShowBackDraftDialog(true)}
          onComplete={() => {
            setInspectingTask(null);
            setTaskFilter('ALL');
            setActiveTab('tasks');
            refreshStats();
          }}
        />

        {/* Android Hardware Back Button / Cancel Prompt Modal */}
        {showBackDraftDialog && (
          <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl max-w-xs w-full p-5 shadow-2xl border border-slate-200 text-center space-y-3.5">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 mx-auto flex items-center justify-center font-black text-xl">
                !
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 font-serif">SAVE INSPECTION DRAFT?</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Unfinished ground inspection for Khasra <strong>{inspectingTask.khasra_number}</strong>. Save locally in offline storage?
                </p>
              </div>
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    setShowBackDraftDialog(false);
                    setInspectingTask(null);
                  }}
                  className="w-full py-2.5 bg-gov-800 hover:bg-gov-700 text-white font-bold text-xs rounded-xl shadow active:scale-95"
                >
                  SAVE DRAFT
                </button>
                <button
                  onClick={() => {
                    offlineStorage.clearDraft(inspectingTask.id);
                    setShowBackDraftDialog(false);
                    setInspectingTask(null);
                  }}
                  className="w-full py-2 text-rose-700 bg-rose-50 hover:bg-rose-100 font-bold text-xs rounded-xl border border-rose-200"
                >
                  DISCARD
                </button>
                <button
                  onClick={() => setShowBackDraftDialog(false)}
                  className="w-full py-1.5 text-slate-500 font-semibold text-xs hover:text-slate-700"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Master Layout with Bottom Navigation
  return (
    <FieldLayout
      activeTab={activeTab}
      onTabChange={handleNavigate}
      officer={user}
      onSyncNow={handleSyncNow}
    >
      {activeTab === 'home' && (
        <HomePage
          stats={stats}
          officer={user}
          onNavigate={handleNavigate}
          onStartInspection={handleStartInspectionById}
        />
      )}

      {activeTab === 'tasks' && (
        <TasksPage
          initialFilter={taskFilter}
          onSelectTask={(task) => {
            setInspectingTask(task);
          }}
        />
      )}

      {activeTab === 'map' && (
        <FieldMapPage
          onStartInspection={handleStartInspectionById}
        />
      )}

      {activeTab === 'history' && (
        <HistoryPage />
      )}

      {activeTab === 'notifications' && (
        <NotificationsPage />
      )}

      {activeTab === 'profile' && (
        <ProfilePage
          officer={user}
          onLogout={handleLogout}
          onSyncNow={handleSyncNow}
        />
      )}
    </FieldLayout>
  );
}
