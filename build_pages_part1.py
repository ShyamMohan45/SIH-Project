import os

base = r"C:\Users\shyam\.gemini\antigravity\scratch\n-lams-national-platform\field-app\src\pages"
os.makedirs(base, exist_ok=True)

# 1. LoginPage.jsx
with open(os.path.join(base, "LoginPage.jsx"), "w", encoding="utf-8") as f:
    f.write("""import React, { useState } from 'react';
import { Shield, KeyRound, UserCheck, AlertTriangle, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('FO-007');
  const [password, setPassword] = useState('Gov#Secure2026');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await api.login(email, password);
      onLoginSuccess(data.user);
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid government officer credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoPreset = () => {
    setEmail('FO-007');
    setPassword('Gov#Secure2026');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center px-4 py-8 max-w-md mx-auto relative overflow-hidden">
      {/* Background Subtle Accent */}
      <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full bg-blue-600/20 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full bg-sky-600/20 blur-3xl pointer-events-none"></div>

      {/* Official Government Identity Header */}
      <div className="text-center mb-8 relative z-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gov-800 border border-gov-700 shadow-2xl mb-3 text-sky-400">
          <Shield className="w-8 h-8 text-sky-400" />
        </div>
        <div className="text-[10px] uppercase font-bold tracking-widest text-amber-400 mb-1">
          Government of India • Ministry of Rural Development
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">N-LAMS Field</h1>
        <p className="text-xs font-semibold text-sky-200 mt-1">
          Ground Verification & Land Acquisition Inspection
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 relative z-10">
        <div className="mb-4 pb-3 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Officer Authentication</h2>
          <p className="text-xs text-slate-500">Authorized Cadastral Surveyors & Revenue Staff</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Officer ID / Official Email
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. FO-007 or field.surveyor@nlams.gov.in"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-700"
              />
              <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-700"
              />
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gov-800 hover:bg-gov-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Authenticating...' : 'LOGIN TO FIELD SYSTEM'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* SIH Fast Demo Fill Button */}
        <div className="mt-5 pt-4 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={handleDemoPreset}
            className="text-[11px] font-bold text-gov-700 hover:text-gov-800 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 shadow-sm"
          >
            ⚡ Fast Fill Demo: Field Officer (FO-007)
          </button>
        </div>
      </div>

      {/* Synthetic Data Disclaimer */}
      <div className="mt-6 text-center text-[10px] text-slate-400 leading-relaxed z-10">
        <span className="font-bold text-slate-300">NOTICE:</span> DEMO / SYNTHETIC DATA FOR SIH GROUND TRUTHING EVALUATION.
      </div>
    </div>
  );
}
""")

# 2. HomePage.jsx
with open(os.path.join(base, "HomePage.jsx"), "w", encoding="utf-8") as f:
    f.write("""import React from 'react';
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
  Sparkles
} from 'lucide-react';

export default function HomePage({
  stats = { assigned_today: 8, pending: 5, completed: 3, high_priority: 2 },
  officer = { name: 'Amit B. Parmar', officer_id: 'FO-007', district: 'Surendranagar / Rajkot' },
  onNavigate,
  onStartInspection
}) {
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

        {/* Today's Tasks KPI Strip */}
        <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-100 text-center">
          <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 block">Today</span>
            <span className="text-base font-black text-slate-900 font-mono">{stats.assigned_today}</span>
          </div>
          <div className="bg-amber-50 p-2 rounded-xl border border-amber-200">
            <span className="text-[10px] font-bold text-amber-700 block">Pending</span>
            <span className="text-base font-black text-amber-800 font-mono">{stats.pending}</span>
          </div>
          <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-200">
            <span className="text-[10px] font-bold text-emerald-700 block">Done</span>
            <span className="text-base font-black text-emerald-800 font-mono">{stats.completed}</span>
          </div>
          <div className="bg-red-50 p-2 rounded-xl border border-red-200">
            <span className="text-[10px] font-bold text-red-700 block">High Pri</span>
            <span className="text-base font-black text-red-800 font-mono">{stats.high_priority}</span>
          </div>
        </div>
      </div>

      {/* 2. HIGH PRIORITY DEMO CALLOUT TASK: KHASRA 1042 */}
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

      {/* 3. MAIN FIELD SHORTCUT BUTTONS */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
          Field Operations
        </h4>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => onNavigate('tasks')}
            className="p-3.5 bg-white border border-slate-200 rounded-2xl text-left hover:border-gov-700 transition shadow-sm active:scale-95 flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-gov-700 flex items-center justify-center">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-xs text-slate-900 block">MY TASKS</span>
                <span className="text-[10px] text-slate-500">5 Pending Review</span>
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
            onClick={() => onNavigate('history')}
            className="p-3.5 bg-white border border-slate-200 rounded-2xl text-left hover:border-gov-700 transition shadow-sm active:scale-95 flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-xs text-slate-900 block">HISTORY</span>
                <span className="text-[10px] text-slate-500">Completed Reports</span>
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
    </div>
  );
}
""")

# 3. TasksPage.jsx
with open(os.path.join(base, "TasksPage.jsx"), "w", encoding="utf-8") as f:
    f.write("""import React, { useState, useEffect } from 'react';
import { Search, Filter, PlayCircle, MapPin, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import { api } from '../services/api';

export default function TasksPage({ onSelectTask }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await api.getTasks(statusFilter);
      setTasks(data.tasks || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [statusFilter]);

  const filteredTasks = tasks.filter((t) => {
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

      {/* Filter Chips: Status */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
        {['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
              statusFilter === st
                ? 'bg-gov-800 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {st === 'ALL' ? 'All Tasks' : st.replace('_', ' ')}
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
          No inspection tasks found matching filters.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`bg-white rounded-2xl p-4 border transition shadow-sm ${
                task.khasra_number === '1042'
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
                    <StatusBadge status={task.status} size="xs" />
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

              {/* Reason */}
              {task.reason && (
                <p className="mt-2 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 leading-snug">
                  <span className="font-bold text-slate-700">Reason: </span>
                  {task.reason}
                </p>
              )}

              {/* Action Button */}
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  Project: NH-GJ-2026-001
                </span>
                <button
                  onClick={() => onSelectTask(task)}
                  className="px-4 py-2 bg-gov-800 hover:bg-gov-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
                >
                  <PlayCircle className="w-4 h-4 text-emerald-400" />
                  <span>{task.status === 'COMPLETED' ? 'VIEW REPORT' : 'START INSPECTION'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
""")

print("SUCCESS: LoginPage.jsx, HomePage.jsx, and TasksPage.jsx created!")
