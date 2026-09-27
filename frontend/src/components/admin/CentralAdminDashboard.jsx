import React, { useState } from 'react';
import { 
  Building2, Map, ShieldCheck, AlertTriangle, TrendingUp, DollarSign, 
  Layers, Filter, ArrowUpRight, Search, FileText, CheckCircle2, ChevronRight
} from 'lucide-react';

export default function CentralAdminDashboard({ onDrillDownProject }) {
  const [selectedStateFilter, setSelectedStateFilter] = useState('ALL');

  const highRiskProjects = [
    { id: 'NH-GJ-2026-001', name: 'Ahmedabad–Rajkot Green Highway Expansion', state: 'Gujarat', risk: 82, status: 'CRITICAL', delay: '74 Days', pending: 'Legal & Compensation' },
    { id: 'MH-RAIL-2026-014', name: 'Mumbai–Nagpur High-Speed Rail Corridor', state: 'Maharashtra', risk: 79, status: 'HIGH', delay: '62 Days', pending: 'Forest Clearance' },
    { id: 'RJ-SOLAR-2026-031', name: 'Bhadla Mega Solar Corridor Phase IV', state: 'Rajasthan', risk: 61, status: 'MODERATE', delay: '38 Days', pending: 'R&R Housing' },
    { id: 'KA-IND-2026-009', name: 'Bengaluru–Chennai Industrial Expressway', state: 'Karnataka', risk: 54, status: 'MODERATE', delay: '29 Days', pending: 'Gazette 3D Notice' }
  ];

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0b2545] to-[#134074] p-6 rounded-2xl border border-slate-700 shadow-xl flex flex-wrap justify-between items-center">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded uppercase tracking-wider">
              Level 1 — Central Government Portal
            </span>
            <span className="text-xs text-blue-200 font-semibold">• Jurisdiction: All-India</span>
          </div>
          <h2 className="text-2xl font-black text-white font-serif tracking-tight">
            National Land Acquisition Executive Command Center
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Department of Land Resources (DoLR), Ministry of Rural Development • Real-Time Inter-State Oversight
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-700 text-right">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Active National Projects</div>
            <div className="text-xl font-black text-emerald-400 font-mono">2,840</div>
          </div>
        </div>
      </div>

      {/* 4 National KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 shadow">
          <div className="flex justify-between items-center text-slate-400 text-xs font-bold mb-1">
            <span>Total Land Required</span>
            <Building2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">4,12,500 <span className="text-xs font-sans text-slate-400 font-semibold">ha</span></div>
          <div className="text-[11px] text-emerald-400 mt-1 font-semibold">72.4% Total Acquired</div>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 shadow">
          <div className="flex justify-between items-center text-slate-400 text-xs font-bold mb-1">
            <span>Compensation Disbursed</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">₹ 8,420 <span className="text-xs font-sans text-slate-400 font-semibold">Cr</span></div>
          <div className="text-[11px] text-slate-400 mt-1 font-semibold">PFMS DBT Direct Transfer</div>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 shadow">
          <div className="flex justify-between items-center text-slate-400 text-xs font-bold mb-1">
            <span>Affected & Displaced</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">1,48,200 <span className="text-xs font-sans text-slate-400 font-semibold">families</span></div>
          <div className="text-[11px] text-amber-400 mt-1 font-semibold">76.8% R&R Completed</div>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 shadow">
          <div className="flex justify-between items-center text-slate-400 text-xs font-bold mb-1">
            <span>PS 17 High-Risk Alerts</span>
            <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
          </div>
          <div className="text-2xl font-extrabold text-red-400 font-mono">176 <span className="text-xs font-sans text-slate-400 font-semibold">projects</span></div>
          <div className="text-[11px] text-red-300 mt-1 font-semibold">Predicted Delay &gt; 30 Days</div>
        </div>
      </div>

      {/* Main Grid: All-India Risk Map Visualizer + High Risk Projects List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: State-wise Heatmap & Distribution */}
        <div className="lg:col-span-7 bg-slate-950 p-5 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-center pb-3 border-b border-slate-800 mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Map className="w-4 h-4 text-blue-400" /> State-Wise Acquisition Progress & Risk Matrix
            </h3>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded font-mono">All-India Layer</span>
          </div>

          {/* Interactive State Bar Matrix */}
          <div className="space-y-3 text-xs">
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center font-bold mb-1">
                <span className="text-white">Gujarat State (182 Projects)</span>
                <span className="text-emerald-400 font-mono">82.7% Acquired • 14 High Risk</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
                <div className="bg-emerald-500 h-full w-[82.7%]"></div>
                <div className="bg-red-500 h-full w-[17.3%]"></div>
              </div>
            </div>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center font-bold mb-1">
                <span className="text-white">Maharashtra State (310 Projects)</span>
                <span className="text-emerald-400 font-mono">74.2% Acquired • 28 High Risk</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
                <div className="bg-emerald-500 h-full w-[74.2%]"></div>
                <div className="bg-amber-500 h-full w-[25.8%]"></div>
              </div>
            </div>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center font-bold mb-1">
                <span className="text-white">Rajasthan State (214 Projects)</span>
                <span className="text-emerald-400 font-mono">68.5% Acquired • 19 High Risk</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
                <div className="bg-emerald-500 h-full w-[68.5%]"></div>
                <div className="bg-amber-500 h-full w-[31.5%]"></div>
              </div>
            </div>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center font-bold mb-1">
                <span className="text-white">Karnataka State (195 Projects)</span>
                <span className="text-emerald-400 font-mono">71.0% Acquired • 12 High Risk</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
                <div className="bg-emerald-500 h-full w-[71.0%]"></div>
                <div className="bg-emerald-600 h-full w-[29.0%]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: High Risk Escalation Drill-down */}
        <div className="lg:col-span-5 bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" /> High-Risk National Queue
              </h3>
              <span className="bg-red-950 text-red-300 text-[10px] font-bold px-2 py-0.5 rounded">Action Needed</span>
            </div>

            <div className="space-y-2.5">
              {highRiskProjects.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onDrillDownProject && onDrillDownProject(p)}
                  className="bg-slate-900 p-3 rounded-xl border border-slate-800 hover:border-blue-500 transition-all cursor-pointer flex justify-between items-center group"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs group-hover:text-blue-400 transition-colors">{p.id}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-medium">{p.state}</span>
                    </div>
                    <div className="text-[11px] text-slate-300 font-medium truncate max-w-[220px]">{p.name}</div>
                    <div className="text-[10px] text-amber-400 mt-0.5">Pending: {p.pending}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-black text-red-400 font-mono">{p.risk}% RISK</div>
                    <div className="text-[10px] text-slate-400">{p.delay}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-center">
            <span className="text-[11px] text-blue-400 font-bold hover:underline cursor-pointer">
              View All 176 High-Risk National Projects →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
