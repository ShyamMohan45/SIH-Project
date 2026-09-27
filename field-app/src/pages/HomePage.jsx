import React, { useState, useEffect } from 'react';
import {
  ClipboardList,
  Map as MapIcon,
  PlayCircle,
  Clock,
  Bell,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Shield,
  MapPin,
  Sparkles,
  FileText,
  Printer,
  X
} from 'lucide-react';
import { offlineStorage } from '../services/offlineStorage';

export default function HomePage({
  stats = { assigned_today: 8, pending: 5, completed: 3, high_priority: 2 },
  officer = { name: 'Amit B. Parmar', officer_id: 'FO-007', district: 'Surendranagar / Rajkot' },
  onNavigate,
  onStartInspection
}) {
  const [is1042Completed, setIs1042Completed] = useState(false);
  const [completedDossier, setCompletedDossier] = useState(null);
  const [showDossierModal, setShowDossierModal] = useState(false);

  const currentStats = stats || offlineStorage.getDynamicStats();

  useEffect(() => {
    const isComp = offlineStorage.isTaskCompleted('TASK-FO-1042') || offlineStorage.isTaskCompleted('1042') || offlineStorage.isTaskCompleted('FO-1042');
    const compData = offlineStorage.getCompletedTasks();
    const item = compData['TASK-FO-1042'] || compData['1042'] || compData['FO-1042'];
    setIs1042Completed(Boolean(isComp));
    if (item) {
      setCompletedDossier(item);
    }
  }, [stats]);

  return (
    <div className="p-4 space-y-4">
      {/* 1. OFFICER GREETING CARD */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Good Morning, Field Officer
            </span>
            <h2 className="text-lg font-black text-slate-900 mt-0.5">{officer?.name || 'Amit B. Parmar'}</h2>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-600 font-medium">
              <span className="bg-slate-100 px-2 py-0.5 rounded font-mono font-bold text-gov-800">
                ID: {officer?.officer_id || 'FO-007'}
              </span>
              <span>•</span>
              <span className="truncate">{officer?.district || 'Surendranagar'}</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gov-50 border border-blue-200 flex items-center justify-center text-gov-800 shadow-sm">
            <Shield className="w-6 h-6 text-gov-700" />
          </div>
        </div>

        {/* Today's Tasks KPI Strip with Interactive Filters */}
        <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-100 text-center">
          <button
            onClick={() => onNavigate('tasks', 'ALL')}
            className="bg-slate-50 hover:bg-slate-100 p-2 rounded-xl border border-slate-200 transition active:scale-95"
          >
            <span className="text-[10px] font-bold text-slate-500 block">Today</span>
            <span className="text-base font-black text-slate-900 font-mono">{currentStats.assigned_today}</span>
          </button>
          <button
            onClick={() => onNavigate('tasks', 'PENDING')}
            className="bg-amber-50 hover:bg-amber-100 p-2 rounded-xl border border-amber-200 transition active:scale-95"
          >
            <span className="text-[10px] font-bold text-amber-700 block">Pending</span>
            <span className="text-base font-black text-amber-800 font-mono">{currentStats.pending}</span>
          </button>
          <button
            onClick={() => onNavigate('tasks', 'COMPLETED')}
            className="bg-emerald-50 hover:bg-emerald-100 p-2 rounded-xl border border-emerald-200 transition active:scale-95"
          >
            <span className="text-[10px] font-bold text-emerald-700 block">Done</span>
            <span className="text-base font-black text-emerald-800 font-mono">{currentStats.completed}</span>
          </button>
          <button
            onClick={() => onNavigate('tasks', 'ALL')}
            className="bg-red-50 hover:bg-red-100 p-2 rounded-xl border border-red-200 transition active:scale-95"
          >
            <span className="text-[10px] font-bold text-red-700 block">High Pri</span>
            <span className="text-base font-black text-red-800 font-mono">{currentStats.high_priority}</span>
          </button>
        </div>
      </div>

      {/* 2. HIGH PRIORITY DEMO CALLOUT TASK: KHASRA 1042 (DYNAMIC STATE) */}
      {is1042Completed ? (
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-400 rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <span className="bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1 w-fit">
                <CheckCircle2 className="w-3 h-3 text-emerald-200" />
                <span>GROUND VERIFICATION COMPLETED</span>
              </span>
              <h3 className="text-base font-black text-slate-900 mt-2 font-serif">
                Parcel Khasra No. 1042
              </h3>
              <p className="text-xs text-slate-700 mt-0.5">
                Dossier {completedDossier?.inspection_code || 'FO-1042-2026-001'} • Submitted for Revenue Approval
              </p>
            </div>
            <div className="bg-emerald-100 text-emerald-950 px-2 py-1 rounded-xl text-right font-mono text-xs font-bold border border-emerald-300">
              <span className="block text-[9px] text-emerald-700">STATUS</span>
              SUBMITTED
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gov-700" />
              <span>Village: <strong>Limbdi</strong></span>
            </div>
            <div>
              <span>Area: <strong>2.45 ha</strong></span>
            </div>
            <div className="col-span-2 text-[11px] text-emerald-900 bg-white/80 p-2 rounded-lg border border-emerald-200 space-y-0.5">
              <p className="font-bold flex items-center gap-1 text-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>GPS Geo-fence (±8m) & Cadastral Verification Logged</span>
              </p>
              <p className="text-slate-600 text-[10px]">
                Central delay risk recalculated to 84.0% HIGH (+82 days projected delay).
              </p>
            </div>
          </div>

          <div className="mt-3.5 pt-2 flex items-center gap-2">
            <button
              onClick={() => setShowDossierModal(true)}
              className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-1.5"
            >
              <FileText className="w-4 h-4" />
              <span>VIEW VERIFICATION DOSSIER</span>
            </button>
            <button
              onClick={() => onStartInspection('TASK-FO-1042')}
              className="px-3 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 shadow-sm active:scale-95 flex items-center gap-1"
              title="Re-inspect"
            >
              <PlayCircle className="w-4 h-4 text-slate-500" />
              <span>RE-INSPECT</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-400 rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <span className="bg-red-600 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                HIGH PRIORITY GROUND INSPECTION
              </span>
              <h3 className="text-base font-black text-slate-900 mt-2 font-serif">
                Parcel Khasra No. 1042
              </h3>
              <p className="text-xs text-slate-700 mt-0.5">
                Ahmedabad–Rajkot Green Highway (NH-GJ-2026-001)
              </p>
            </div>
            <div className="bg-amber-100 text-amber-900 px-2 py-1 rounded-xl text-right font-mono text-xs font-bold border border-amber-200">
              <span className="block text-[9px] text-amber-700">AI RISK</span>
              78% HIGH
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gov-700" />
              <span>Village: <strong>Limbdi</strong></span>
            </div>
            <div>
              <span>Area: <strong>2.45 ha</strong></span>
            </div>
            <div className="col-span-2 text-[11px] text-slate-500 bg-white/70 p-2 rounded-lg border border-amber-200/60">
              <strong>Reason:</strong> Compensation verification & boundary inspection
            </div>
          </div>

          <div className="mt-3.5 pt-2 flex items-center gap-2">
            <button
              onClick={() => onStartInspection('TASK-FO-1042')}
              className="flex-1 py-2.5 bg-gov-800 hover:bg-gov-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-1.5"
            >
              <PlayCircle className="w-4 h-4 text-emerald-400" />
              <span>START FIELD VERIFICATION</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. MAIN FIELD SHORTCUT BUTTONS */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
          Field Operations
        </h4>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => onNavigate('tasks', 'ALL')}
            className="p-3.5 bg-white border border-slate-200 rounded-2xl text-left hover:border-gov-700 transition shadow-sm active:scale-95 flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-gov-700 flex items-center justify-center">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-xs text-slate-900 block">MY TASKS</span>
                <span className="text-[10px] text-slate-500">
                  {currentStats.pending} Pending • {currentStats.completed} Done
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => onNavigate('map')}
            className="p-3.5 bg-white border border-slate-200 rounded-2xl text-left hover:border-gov-700 transition shadow-sm active:scale-95 flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
                <MapIcon className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-xs text-slate-900 block">FIELD MAP</span>
                <span className="text-[10px] text-slate-500">Cadastral GIS</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => onNavigate('tasks', 'COMPLETED')}
            className="p-3.5 bg-white border border-slate-200 rounded-2xl text-left hover:border-gov-700 transition shadow-sm active:scale-95 flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-xs text-slate-900 block">COMPLETED</span>
                <span className="text-[10px] text-emerald-600 font-bold">{stats.completed} Dossiers</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => onNavigate('notifications')}
            className="p-3.5 bg-white border border-slate-200 rounded-2xl text-left hover:border-gov-700 transition shadow-sm active:scale-95 flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-xs text-slate-900 block">ALERTS</span>
                <span className="text-[10px] text-slate-500">SLA Notices</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* 4. GROUND TRUTH QUOTE BANNER */}
      <div className="p-3.5 bg-slate-900 text-white rounded-2xl shadow border border-slate-800 text-xs">
        <p className="italic text-slate-300 font-serif leading-relaxed text-[11px]">
          "The central dashboard knows what the records say. The Field Officer verifies what is actually happening on the ground."
        </p>
        <span className="block text-[9px] font-mono text-sky-400 mt-2 font-bold uppercase">
          — N-LAMS Ground Truth Operational Mandate
        </span>
      </div>

      {/* HOME MODAL: OFFICIAL DOSSIER FOR KHASRA 1042 */}
      {showDossierModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-gov-900 text-white p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-emerald-300 uppercase font-bold tracking-wider">
                  Ground Verification Dossier
                </span>
                <h3 className="text-base font-black font-serif">
                  {completedDossier?.inspection_code || 'FO-1042-2026-001'}
                </h3>
              </div>
              <button
                onClick={() => setShowDossierModal(false)}
                className="p-1.5 rounded-lg bg-gov-800 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3.5 text-xs">
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <div>
                    <span className="font-black text-emerald-900 block">STATUS: VERIFIED ON GROUND</span>
                    <span className="text-[10px] text-emerald-700">Dossier Submitted to Central N-LAMS</span>
                  </div>
                </div>
                <span className="font-mono text-[10px] bg-white px-2 py-1 rounded border border-emerald-300 text-emerald-800 font-bold">
                  2026-03-12
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-700">
                <div className="bg-slate-50 p-2 rounded-lg">
                  <span className="text-slate-400 block text-[10px]">Khasra Number</span>
                  <strong className="text-slate-900 text-sm">1042</strong>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg">
                  <span className="text-slate-400 block text-[10px]">Village</span>
                  <strong className="text-slate-900">Limbdi, Surendranagar</strong>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg">
                  <span className="text-slate-400 block text-[10px]">Area</span>
                  <strong className="text-slate-900">2.45 ha</strong>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg">
                  <span className="text-slate-400 block text-[10px]">Project</span>
                  <strong className="text-slate-900">NH-GJ-2026-001</strong>
                </div>
              </div>

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
                  <span className="font-bold text-amber-700">Mismatch Flagged on Ground</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                  <span className="text-slate-600">Actual Land Use:</span>
                  <span className="font-bold text-slate-800">Agricultural (Dry-crop Kharif)</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                  <span className="text-slate-600">Compensation Grievance:</span>
                  <span className="font-bold text-red-600">Section 15 Dispute Recorded</span>
                </div>
              </div>

              <div className="p-3 bg-slate-900 text-white rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">AI Risk Recalculation</span>
                  <span className="bg-red-950 text-red-400 border border-red-800 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                    84.0% HIGH RISK
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Timeline delay predicted: <strong>+82 Days</strong> due to boundary mismatch & landowner dispute.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>PRINT DOSSIER</span>
              </button>
              <button
                onClick={() => setShowDossierModal(false)}
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
