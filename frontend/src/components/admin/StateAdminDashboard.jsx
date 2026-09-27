import React, { useState } from 'react';
import { 
  Building, MapPin, Plus, FileText, CheckCircle2, AlertTriangle, 
  DollarSign, ArrowUpRight, Search, Filter, ShieldCheck, FolderCheck
} from 'lucide-react';

export default function StateAdminDashboard({ onCreateProject, onSelectProject }) {
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');

  const stateProjects = [
    { id: 'NH-GJ-2026-001', name: 'Ahmedabad–Rajkot Green Highway Expansion', district: 'Rajkot & Surendranagar', reqHa: 1250.0, acqHa: 780.0, pct: 62.4, risk: 82, status: 'UNDER_ACQUISITION' },
    { id: 'GJ-[#0b2545]-2026-004', name: 'Dholera Special Investment Region (SIR) Corridor', district: 'Ahmedabad', reqHa: 3400.0, acqHa: 3100.0, pct: 91.1, risk: 24, status: 'NEAR_COMPLETION' },
    { id: 'GJ-RAIL-2026-012', name: 'Vadodara–Surat Freight Railway Spur', district: 'Vadodara & Surat', reqHa: 890.0, acqHa: 520.0, pct: 58.4, risk: 76, status: 'SECTION_15_HEARING' },
    { id: 'GJ-SOLAR-2026-019', name: 'Kutch Renewable Energy Park Transmission', district: 'Kutch', reqHa: 2100.0, acqHa: 1950.0, pct: 92.8, risk: 18, status: 'POSSESSION_IN_PROGRESS' }
  ];

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 to-[#0b2545] p-6 rounded-2xl border border-emerald-800/60 shadow-xl flex flex-wrap justify-between items-center">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-400 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded uppercase tracking-wider">
              Level 2 — State Government Portal
            </span>
            <span className="text-xs text-emerald-200 font-semibold">• Jurisdiction: Gujarat State</span>
          </div>
          <h2 className="text-2xl font-black text-white font-serif tracking-tight">
            Revenue & Land Acquisition Department, Govt. of Gujarat
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            State Land Acquisition Cell • Single Window Project Creation & Administrative Sanctioning
          </p>
        </div>

        <button
          onClick={onCreateProject}
          className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-black rounded-xl shadow-lg transition-all flex items-center gap-2 text-xs uppercase tracking-wider"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create New Project</span>
        </button>
      </div>

      {/* 4 State KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 shadow">
          <div className="text-slate-400 text-xs font-bold mb-1">Total State Projects</div>
          <div className="text-2xl font-extrabold text-white font-mono">182</div>
          <div className="text-[11px] text-emerald-400 mt-1 font-semibold">Across 33 Districts</div>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 shadow">
          <div className="text-slate-400 text-xs font-bold mb-1">State Land Progress</div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">82.7%</div>
          <div className="text-[11px] text-slate-400 mt-1 font-semibold">68,200 / 82,400 ha Acquired</div>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 shadow">
          <div className="text-slate-400 text-xs font-bold mb-1">State Compensation Disbursed</div>
          <div className="text-2xl font-extrabold text-white font-mono">₹ 2,840 <span className="text-xs font-sans text-slate-400 font-semibold">Cr</span></div>
          <div className="text-[11px] text-emerald-400 mt-1 font-semibold">Direct PFMS Transfer</div>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 shadow">
          <div className="text-slate-400 text-xs font-bold mb-1">High Risk State Projects</div>
          <div className="text-2xl font-extrabold text-red-400 font-mono">14</div>
          <div className="text-[11px] text-amber-400 mt-1 font-semibold">Escalated to Cabinet</div>
        </div>
      </div>

      {/* Gujarat State Projects Directory Table */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
        <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <FolderCheck className="w-4 h-4 text-emerald-400" /> Active State Land Requisitions
          </h3>

          <div className="flex items-center gap-2 text-xs">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-white font-bold px-3 py-1.5 rounded-lg"
            >
              <option value="ALL">All Districts (33)</option>
              <option value="Rajkot">Rajkot District</option>
              <option value="Ahmedabad">Ahmedabad District</option>
              <option value="Vadodara">Vadodara District</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-200 uppercase tracking-wider text-[10px] font-bold border-b border-slate-800">
              <tr>
                <th className="p-3">Project ID</th>
                <th className="p-3">Project Name</th>
                <th className="p-3">Districts</th>
                <th className="p-3">Land Req (ha)</th>
                <th className="p-3">Acquired Progress</th>
                <th className="p-3">AI Risk</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-medium">
              {stateProjects.map((p) => (
                <tr key={p.id} className="hover:bg-slate-900/80 transition-colors">
                  <td className="p-3 font-mono font-bold text-emerald-400">{p.id}</td>
                  <td className="p-3 font-bold text-white">{p.name}</td>
                  <td className="p-3 text-slate-400">{p.district}</td>
                  <td className="p-3 font-mono">{p.reqHa.toLocaleString()} ha</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs">{p.pct}%</span>
                      <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${p.pct}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded font-mono font-extrabold text-[10px] ${
                      p.risk > 70 ? 'bg-red-950 text-red-300 border border-red-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {p.risk}% RISK
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onSelectProject && onSelectProject(p)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold text-[11px]"
                    >
                      Open Project →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
