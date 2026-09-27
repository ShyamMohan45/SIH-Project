import React, { useState } from 'react';
import {
  BarChart3, TrendingUp, AlertTriangle, CheckCircle2, Clock,
  Layers, MapPin, Building2, Download, ArrowUpRight, Cpu
} from 'lucide-react';

export default function AnalyticsPage({ onSelectProject }) {
  const [timeRange, setTimeRange] = useState('12M');

  // Stage bottlenecks
  const stageBottlenecks = [
    { stage: 'Section 15 Inquiries & Objections', avgDelay: 84, target: 60, status: 'HIGH_RISK', pct: 85 },
    { stage: 'Section 23 Land Award Calculations', avgDelay: 76, target: 90, status: 'MEDIUM_RISK', pct: 70 },
    { stage: 'Forest & Inter-Agency Clearances', avgDelay: 68, target: 45, status: 'HIGH_RISK', pct: 78 },
    { stage: 'Joint Cadastral Survey & Demarcation', avgDelay: 32, target: 60, status: 'LOW_RISK', pct: 35 },
    { stage: 'Direct PFMS Compensation Disbursement', avgDelay: 28, target: 30, status: 'LOW_RISK', pct: 30 },
    { stage: 'Physical Possession Handover', avgDelay: 22, target: 30, status: 'LOW_RISK', pct: 25 },
  ];

  // State-wise acquisition efficiency
  const statePerformance = [
    { state: 'Gujarat', projects: 28, landAcquiredHa: 8450, avgDaysPerStage: 42, score: 91, grade: 'A+' },
    { state: 'Maharashtra', projects: 34, landAcquiredHa: 12100, avgDaysPerStage: 58, score: 82, grade: 'A' },
    { state: 'Rajasthan', projects: 22, landAcquiredHa: 14200, avgDaysPerStage: 49, score: 88, grade: 'A' },
    { state: 'Karnataka', projects: 19, landAcquiredHa: 5600, avgDaysPerStage: 64, score: 76, grade: 'B+' },
    { state: 'Uttar Pradesh', projects: 41, landAcquiredHa: 18900, avgDaysPerStage: 72, score: 69, grade: 'B' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase">
                National Workflow Analytics & Velocity Engine
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white font-serif mt-1">
              Statutory Lifecycle Bottleneck Analytics (PS 16 & PS 17)
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Cross-project empirical delay metrics across 600 infrastructure corridors under PM GatiShakti.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            {['3M', '6M', '12M', 'ALL'].map(t => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  timeRange === t ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase">National Velocity</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">4.2 Ha / Day</div>
            <span className="text-[10px] text-emerald-400/80">↑ 18% vs FY 2024-25</span>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Top Bottleneck</span>
            <div className="text-xl font-black text-amber-400 mt-1">Section 15 Objections</div>
            <span className="text-[10px] text-slate-500">Avg 84 Days (Target 60d)</span>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase">AI Early Alert Efficacy</span>
            <div className="text-2xl font-black text-blue-400 mt-1">92.4%</div>
            <span className="text-[10px] text-blue-400/80">Delays Mitigated in Pre-Award</span>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Average Project Lead Time</span>
            <div className="text-2xl font-black text-white mt-1">16.4 Months</div>
            <span className="text-[10px] text-slate-500">Statutory Ceiling: 24 Months</span>
          </div>
        </div>
      </div>

      {/* Grid: Bottlenecks & State Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stage Delay Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white font-serif mb-2 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            Empirical Delay by Statutory Stage
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            Elapsed time vs statutory mandates under RFCTLARR Act (Red indicates statutory overruns).
          </p>

          <div className="space-y-4">
            {stageBottlenecks.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-200">{item.stage}</span>
                  <span className="font-mono text-slate-300">
                    <strong className={item.avgDelay > item.target ? 'text-amber-400' : 'text-emerald-400'}>
                      {item.avgDelay}d
                    </strong>{' '}
                    / {item.target}d limit
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800/80 flex">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      item.status === 'HIGH_RISK'
                        ? 'bg-gradient-to-r from-amber-500 to-red-500'
                        : item.status === 'MEDIUM_RISK'
                        ? 'bg-gradient-to-r from-blue-500 to-amber-500'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                    }`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* State Efficiency Rankings */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white font-serif mb-2 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            State Acquisition Efficiency Index
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            Composite index calculated from DILRMP digital cadastral readiness & CALA throughput.
          </p>

          <div className="space-y-3">
            {statePerformance.map((st, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-xs text-slate-300">
                    #{idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{st.state}</h4>
                    <span className="text-xs text-slate-400">
                      {st.projects} Projects • {st.landAcquiredHa.toLocaleString()} Ha Acquired
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right">
                  <div>
                    <div className="text-xs font-mono font-bold text-emerald-400">
                      {st.score} / 100
                    </div>
                    <div className="text-[10px] text-slate-500">{st.avgDaysPerStage}d avg/stage</div>
                  </div>
                  <span className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 font-black text-xs flex items-center justify-center">
                    {st.grade}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
