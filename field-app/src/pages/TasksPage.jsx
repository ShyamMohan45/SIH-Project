import React, { useState, useEffect } from 'react';
import { Search, Filter, PlayCircle, MapPin, AlertTriangle, CheckCircle2, Clock, FileText, X, Shield, Printer, Share2 } from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import { api } from '../services/api';
import { offlineStorage } from '../services/offlineStorage';

const FALLBACK_TASKS = [
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
    status: 'COMPLETED',
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

export default function TasksPage({ onSelectTask, initialFilter = 'ALL' }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(initialFilter);
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingReport, setViewingReport] = useState(null);

  useEffect(() => {
    if (initialFilter) {
      setStatusFilter(initialFilter);
    }
  }, [initialFilter]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await api.getTasks('ALL');
      let fetched = (data && data.tasks && data.tasks.length > 0) ? data.tasks : offlineStorage.getCachedTasks();
      
      // Merge with completed tasks stored in offlineStorage
      const comp = offlineStorage.getCompletedTasks();
      const merged = fetched.map((t) => {
        const isComp = comp[t.id] || comp[t.task_code] || comp[t.khasra_number] || comp[`TASK-${t.khasra_number}`] || comp[`FO-${t.khasra_number}`];
        if (isComp || t.status === 'COMPLETED') {
          return {
            ...t,
            status: 'COMPLETED',
            inspection_code: isComp?.inspection_code || `FO-${t.khasra_number}-2026-001`
          };
        }
        return t;
      });
      offlineStorage.saveCachedTasks(merged);
      setTasks(merged);
    } catch (e) {
      console.warn('Tasks API fallback:', e);
      const cached = offlineStorage.getCachedTasks();
      const comp = offlineStorage.getCompletedTasks();
      const merged = cached.map((t) => {
        const isComp = comp[t.id] || comp[t.task_code] || comp[t.khasra_number] || comp[`TASK-${t.khasra_number}`] || comp[`FO-${t.khasra_number}`];
        return isComp ? { ...t, status: 'COMPLETED', inspection_code: isComp?.inspection_code || `FO-${t.khasra_number}-2026-001` } : t;
      });
      offlineStorage.saveCachedTasks(merged);
      setTasks(merged);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const pendingCount = tasks.filter((t) => t.status === 'PENDING').length;
  const completedCount = tasks.filter((t) => t.status === 'COMPLETED').length;
  const inProgressCount = tasks.filter((t) => t.status === 'IN_PROGRESS').length;

  const filteredTasks = tasks.filter((t) => {
    if (statusFilter === 'PENDING' && t.status !== 'PENDING') return false;
    if (statusFilter === 'COMPLETED' && t.status !== 'COMPLETED') return false;
    if (statusFilter === 'IN_PROGRESS' && t.status !== 'IN_PROGRESS') return false;
    if (priorityFilter !== 'ALL' && t.priority !== priorityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const khasra = (t.khasra_number || '').toLowerCase();
      const village = (t.village || '').toLowerCase();
      const code = (t.task_code || '').toLowerCase();
      return khasra.includes(q) || village.includes(q) || code.includes(q);
    }
    return true;
  });

  return (
    <div className="p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-slate-900">Inspection Tasks</h2>
          <p className="text-xs text-slate-500">Assigned Cadastral Verification Tasks</p>
        </div>
        <span className="bg-gov-800 text-white font-mono text-xs font-bold px-2 py-0.5 rounded-full">
          {filteredTasks.length} Tasks
        </span>
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Khasra (e.g. 1042) or Village..."
          className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-gov-700 shadow-sm"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
      </div>

      {/* Filter Chips: Status with Live Counts */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
        {[
          { key: 'ALL', label: `All Tasks (${tasks.length})` },
          { key: 'PENDING', label: `Pending (${pendingCount})` },
          { key: 'COMPLETED', label: `Completed (${completedCount})` },
          { key: 'IN_PROGRESS', label: `In Progress (${inProgressCount})` }
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setStatusFilter(f.key)}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
              statusFilter === f.key
                ? 'bg-gov-800 text-white shadow-sm ring-2 ring-gov-600/30'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Filter Chips: Priority */}
      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 overflow-x-auto pb-1">
        <span className="font-bold text-slate-400">Priority:</span>
        {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((p) => (
          <button
            key={p}
            onClick={() => setPriorityFilter(p)}
            className={`px-2 py-0.5 rounded-md font-semibold ${
              priorityFilter === p ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Task List */}
      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400">Loading assigned tasks...</div>
      ) : filteredTasks.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-200">
          No inspection tasks found matching selected filters.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const isCompleted = task.status === 'COMPLETED';
            return (
              <div
                key={task.id}
                className={`bg-white rounded-2xl p-4 border transition shadow-sm ${
                  isCompleted
                    ? 'border-emerald-300 ring-2 ring-emerald-500/10 bg-gradient-to-b from-emerald-50/20 to-white'
                    : task.khasra_number === '1042'
                    ? 'border-amber-400 ring-2 ring-amber-300/30'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Task Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {task.task_code || task.id}
                      </span>
                      {isCompleted ? (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>COMPLETED</span>
                        </span>
                      ) : (
                        <StatusBadge status={task.status} size="xs" />
                      )}
                    </div>
                    <h3 className="font-black text-sm text-slate-900 mt-1 font-serif">
                      Khasra No. {task.khasra_number}
                    </h3>
                  </div>

                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      task.priority === 'CRITICAL'
                        ? 'bg-red-600 text-white'
                        : task.priority === 'HIGH'
                        ? 'bg-amber-500 text-slate-950'
                        : task.priority === 'MEDIUM'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>

                {/* Task Details */}
                <div className="mt-2.5 grid grid-cols-2 gap-1.5 text-xs text-slate-600">
                  <div>
                    <span>Village: <strong>{task.village}</strong></span>
                  </div>
                  <div>
                    <span>District: <strong>{task.district}</strong></span>
                  </div>
                  <div>
                    <span>Area: <strong>{task.area_ha} ha</strong></span>
                  </div>
                  <div>
                    <span>Due: <strong>{task.due_date}</strong></span>
                  </div>
                </div>

                {/* Completed Banner Callout */}
                {isCompleted ? (
                  <div className="mt-2.5 p-2.5 bg-emerald-50/80 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1.5 text-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Ground Verification Dossier Submitted</span>
                      </span>
                      <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded text-emerald-900 border border-emerald-300">
                        {task.inspection_code || `FO-${task.khasra_number}-2026-001`}
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-800">
                      GPS Geo-fence verified (±8m) • Khasra cadastral boundary inspected • Submitted to Central N-LAMS Portal.
                    </p>
                  </div>
                ) : (
                  task.reason && (
                    <p className="mt-2 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 leading-snug">
                      <span className="font-bold text-slate-700">Reason: </span>
                      {task.reason}
                    </p>
                  )
                )}

                {/* Action Buttons */}
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400 truncate">
                    Project: NH-GJ-2026-001
                  </span>

                  {isCompleted ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setViewingReport(task)}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>VIEW REPORT</span>
                      </button>
                      <button
                        onClick={() => onSelectTask(task)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 flex items-center gap-1"
                        title="Re-inspect or Update Verification"
                      >
                        <PlayCircle className="w-3.5 h-3.5 text-slate-500" />
                        <span>RE-INSPECT</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => onSelectTask(task)}
                      className="px-4 py-2 bg-gov-800 hover:bg-gov-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
                    >
                      <PlayCircle className="w-4 h-4 text-emerald-400" />
                      <span>START INSPECTION</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* OFFICIAL VERIFICATION DOSSIER MODAL */}
      {viewingReport && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gov-900 text-white p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-emerald-300 uppercase font-bold tracking-wider">
                  Official Verification Dossier
                </span>
                <h3 className="text-base font-black font-serif">
                  {viewingReport.inspection_code || `FO-${viewingReport.khasra_number}-2026-001`}
                </h3>
              </div>
              <button
                onClick={() => setViewingReport(null)}
                className="p-1.5 rounded-lg bg-gov-800 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto space-y-4 text-xs">
              {/* Ministry Banner */}
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <p className="font-bold text-[11px] text-gov-800">
                  NATIONAL LAND ACQUISITION & MANAGEMENT SYSTEM (N-LAMS)
                </p>
                <p className="text-[10px] text-slate-500">
                  Cadastral Survey & Ground Verification Directorate • MoRD, Govt. of India
                </p>
              </div>

              {/* Status & Timestamp */}
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <div>
                    <span className="font-black text-emerald-900 block">STATUS: COMPLETED & SUBMITTED</span>
                    <span className="text-[10px] text-emerald-700">Verified by Field Officer on Ground</span>
                  </div>
                </div>
                <span className="font-mono text-[10px] bg-white px-2 py-1 rounded border border-emerald-300 text-emerald-800 font-bold">
                  2026-03-12
                </span>
              </div>

              {/* Parcel & Location Details */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 border-b border-slate-200 pb-1 uppercase tracking-wide text-[11px]">
                  1. Parcel & Cadastral Identity
                </h4>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">Khasra Number</span>
                    <strong className="text-slate-900 text-sm">{viewingReport.khasra_number}</strong>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">Parcel ID</span>
                    <strong className="text-slate-900">{viewingReport.parcel_id || 'P-1042'}</strong>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">Village</span>
                    <strong className="text-slate-900">{viewingReport.village}</strong>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">District</span>
                    <strong className="text-slate-900">{viewingReport.district}</strong>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">Acquisition Area</span>
                    <strong className="text-slate-900">{viewingReport.area_ha} Hectares</strong>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">Project ID</span>
                    <strong className="text-slate-900">NH-GJ-2026-001</strong>
                  </div>
                </div>
              </div>

              {/* Ground Truth Verification Checkpoints */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 border-b border-slate-200 pb-1 uppercase tracking-wide text-[11px]">
                  2. Ground Truth Audit Verification
                </h4>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                    <span className="text-slate-600">GPS Geo-Fence Check:</span>
                    <span className="font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified (±8.0m Accuracy)</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                    <span className="text-slate-600">Cadastral Boundary:</span>
                    <span className="font-bold text-amber-700">Flagged (Mismatch with GIS Map)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                    <span className="text-slate-600">Actual Land Use:</span>
                    <span className="font-bold text-slate-800">Agricultural (Dry-crop Kharif)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                    <span className="text-slate-600">Occupancy Status:</span>
                    <span className="font-bold text-slate-800">Owner Present (Govindbhai Patel)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                    <span className="text-slate-600">Compensation Status:</span>
                    <span className="font-bold text-red-600">Disputed (Sec 15 Objection Filed)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                    <span className="text-slate-600">R&R Entitlement:</span>
                    <span className="font-bold text-slate-800">Resettlement Assistance Required</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                    <span className="text-slate-600">Attached Evidence:</span>
                    <span className="font-bold text-slate-800">3 Geo-Tagged Photos Attached</span>
                  </div>
                </div>
              </div>

              {/* AI Delay Risk Impact */}
              <div className="p-3 bg-slate-900 text-white rounded-xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">N-LAMS AI Delay Prediction</span>
                  <span className="bg-red-950 text-red-400 border border-red-800 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                    84% HIGH RISK
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Inspection results updated Central Project Risk score from 78% to 84%. Predicted timeline impact: <strong>+82 Days</strong>.
                </p>
              </div>

              {/* Verifying Officer Signature */}
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 text-[11px]">
                <span className="text-slate-400 block text-[10px]">Verified & Signed By</span>
                <strong className="text-slate-900">Amit B. Parmar (FO-007)</strong>
                <span className="block text-slate-500 text-[10px]">Cadastral Surveyor, Surendranagar District</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>PRINT DOSSIER</span>
              </button>
              <button
                onClick={() => setViewingReport(null)}
                className="flex-1 py-2 bg-gov-800 hover:bg-gov-700 text-white font-bold text-xs rounded-xl shadow"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
