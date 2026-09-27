import React, { useState, useEffect } from 'react';
import { 
  FolderCheck, Layers, AlertTriangle, TrendingUp, Users, DollarSign, 
  Home, Gavel, Clock, CheckCircle2, ArrowRight, ShieldCheck, 
  MapPin, Activity, Sparkles, RefreshCw, Eye, ExternalLink, ChevronRight,
  Play, Film
} from 'lucide-react';
import { api } from '../services/api';

export default function DashboardPage({ 
  onSelectProject, 
  onNavigateTab, 
  selectedState = 'ALL',
  selectedDistrict = 'ALL' 
}) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const summary = await api.getDashboardSummary(selectedState, selectedDistrict);
      setData(summary);
    } catch (err) {
      console.error('Error fetching dashboard summary:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedState, selectedDistrict]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  if (loading || !data) {
    return (
      <div className="min-h-full p-8 flex flex-col items-center justify-center space-y-3 text-slate-500">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-xs font-semibold">Loading National Control Room Telemetry...</div>
      </div>
    );
  }

  const { kpis, risk_distribution, projects_needing_attention, live_alerts, recent_field_activity } = data;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
      {/* 1. TOP HEADER & TELEMETRY BANNER */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded">
              Operational Control Room
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Jurisdiction: <span className="font-bold text-slate-800">{selectedState === 'ALL' ? 'All India (National)' : selectedState}</span>
              {selectedDistrict !== 'ALL' && ` • District: ${selectedDistrict}`}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-serif tracking-tight">
            National Land Acquisition & Management Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time digital lifecycle monitoring (PS16) and predictive delay intelligence (PS17)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors border border-slate-300"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-blue-600' : ''}`} />
            <span>{refreshing ? 'Syncing...' : 'Sync Telemetry'}</span>
          </button>

          <button
            onClick={() => onNavigateTab('gis')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0b2545] hover:bg-[#12315b] text-white rounded-lg text-xs font-bold transition-all shadow-xs"
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Open GIS Studio</span>
          </button>
        </div>
      </div>

      {/* 2. HON'BLE PRIME MINISTER'S NATIONAL INFRASTRUCTURE VISION */}
      <div className="bg-gradient-to-r from-[#0b2545] via-[#12315b] to-[#1e3a8a] text-white p-4 sm:p-5 rounded-2xl border border-blue-900/60 shadow-sm flex flex-wrap sm:flex-nowrap items-center gap-5">
        <div className="shrink-0 flex flex-col items-center">
          <img
            src="/assets/images/pm_modi.png"
            alt="Shri Narendra Modi, Hon'ble Prime Minister of India"
            className="w-20 h-24 object-cover object-top rounded-xl border-2 border-amber-400 shadow-md bg-white"
          />
          <span className="text-[10px] font-black text-amber-300 mt-1.5 uppercase text-center leading-tight">
            Shri Narendra Modi
          </span>
          <span className="text-[9px] text-slate-300 text-center font-medium">Hon'ble Prime Minister of India</span>
        </div>

        <div className="space-y-1.5 flex-1 border-t sm:border-t-0 sm:border-l border-white/15 pt-3 sm:pt-0 sm:pl-5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded">
              National Infrastructure Mission
            </span>
            <span className="text-xs font-semibold text-slate-200">• PM GatiShakti & Digital Governance</span>
          </div>
          <blockquote className="text-xs sm:text-sm text-slate-100 font-medium italic leading-relaxed">
            "Infrastructure development with speed, scale, and digital transparency will power India's journey towards Viksit Bharat 2047. Digital monitoring and predictive decision support ensure zero project delays, fair compensation, and transparent governance for our farmers and citizens."
          </blockquote>
          <div className="text-[10px] text-amber-300 font-bold flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
            <span>● PM GatiShakti National Master Plan</span>
            <span>● Digital Land Cadastre</span>
            <span>● 100% DBT Compensation</span>
            <span>● Viksit Bharat 2047</span>
          </div>
        </div>
      </div>

      {/* 3. HERO LAND ACQUISITION & SATELLITE GIS VISUAL */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-300 shadow-md min-h-[340px] bg-slate-950 flex flex-col justify-between p-6">
        {/* Real Green Agricultural Crop Field & Rural Cadastral Satellite Imagery */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-75"
          style={{ backgroundImage: `url('/assets/images/agricultural_cadastral_satellite.jpg')` }}
        />
        
        {/* Subtle Dark Vignette & Gradient for Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40" />

        {/* Top Floating Badges */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/90 text-slate-950 text-[10px] font-black uppercase px-2.5 py-1 rounded shadow-sm flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
              Live Spatial Cadastre
            </span>
            <span className="bg-slate-900/80 backdrop-blur-md text-slate-200 border border-white/20 text-[10px] font-mono font-bold px-2 py-1 rounded">
              EPSG:4326 • Surendranagar Cluster
            </span>
            <span className="bg-amber-400/90 text-slate-950 text-[10px] font-black uppercase px-2 py-1 rounded">
              DEMO GIS DATA
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 text-xs text-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Drone Aerial Imagery: <strong>0.25m GSD</strong></span>
          </div>
        </div>

        {/* Center Content & Exemplar Hero Parcel Spotlight */}
        <div className="relative z-10 max-w-2xl my-4">
          <div className="inline-flex items-center gap-1.5 text-amber-400 text-xs font-black uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital Land Monitoring & AI Decision Support</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-serif tracking-tight leading-tight">
            Ahmedabad–Rajkot Green Highway Expansion
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 mt-1.5 leading-relaxed">
            Multi-modal transport corridor monitoring 52 agricultural parcels across Limbdi and Kuvadva talukas with geotagged field verification, Section 15 objection tracking, and automated predictive delay detection.
          </p>

          {/* Exemplar Parcel Khasra 1042 Spotlight Box */}
          <div className="mt-4 p-3.5 bg-slate-900/85 backdrop-blur-md rounded-xl border border-blue-400/40 max-w-xl text-xs flex flex-wrap items-center justify-between gap-3 shadow-xl">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-blue-300 text-sm">Khasra 1042</span>
                <span className="bg-rose-500/80 text-white font-black text-[9px] px-1.5 py-0.2 rounded uppercase">
                  82% High Delay Risk
                </span>
                <span className="text-slate-400 text-[11px]">• 2.45 Ha Cotton Plot</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Ground Truthing: <span className="text-rose-300 font-bold">12m Boundary Overlap</span> + High Court Writ Dispute reported by Field Inspection.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigateTab('gis')}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Inspect in GIS Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Metadata Strip */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/15 text-[11px] text-slate-300">
          <div className="flex items-center gap-4">
            <span>Cadastral Fields: <strong className="text-white font-mono">52 Plots</strong></span>
            <span>Survey Accuracy: <strong className="text-emerald-400 font-mono">4.2m GPS</strong></span>
            <span>Solatium Compliance: <strong className="text-amber-300 font-mono">100% Audited</strong></span>
          </div>
          <div className="text-slate-400 text-[10px]">
            * Real agricultural crop imagery visible with irregular boundary demarcation.
          </div>
        </div>
      </div>

      {/* 3. TOP KPI METRIC STRIP (10 Core Dimensions) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        {/* KPI 1: Active Projects */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-tight flex items-center justify-between">
            <span>Active Corridors</span>
            <FolderCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">{kpis.total_projects}</div>
          <div className="text-[10px] text-emerald-700 font-bold mt-0.5">● 100% In Gestation</div>
        </div>

        {/* KPI 2: Total Land Acquired vs Required */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-tight flex items-center justify-between">
            <span>Land Acquired / Req</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-black text-slate-900 mt-1">
            {kpis.land_acquired_ha.toLocaleString()} <span className="text-xs font-semibold text-slate-500">/ {kpis.land_required_ha.toLocaleString()} Ha</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: `${kpis.acquisition_pct}%` }}></div>
          </div>
          <div className="text-[10px] font-extrabold text-slate-600 mt-1 flex justify-between">
            <span>{kpis.acquisition_pct}% Acquired</span>
            <span>{(kpis.land_required_ha - kpis.land_acquired_ha).toLocaleString()} Ha Rem.</span>
          </div>
        </div>

        {/* KPI 3: Affected Families */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-tight flex items-center justify-between">
            <span>Affected Families</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">{kpis.affected_families.toLocaleString()}</div>
          <div className="text-[10px] text-slate-500 font-semibold mt-0.5">Displaced: {kpis.displaced_families.toLocaleString()} PAFs</div>
        </div>

        {/* KPI 4: Pending Compensation */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-tight flex items-center justify-between">
            <span>Pending Comp.</span>
            <DollarSign className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-700 mt-1">₹{kpis.pending_compensation_cr.toLocaleString()} <span className="text-xs text-slate-500">Cr</span></div>
          <div className="text-[10px] text-slate-500 font-semibold mt-0.5">Escrow & PFMS In Queue</div>
        </div>

        {/* KPI 5: High-Risk Projects */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-tight flex items-center justify-between">
            <span>High Risk Projects</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-700 mt-1">{kpis.high_risk_projects} <span className="text-xs font-semibold text-slate-500">/ {kpis.total_projects}</span></div>
          <div className="text-[10px] text-rose-600 font-bold mt-0.5">Requires Executive Action</div>
        </div>
      </div>

      {/* 3. SECTION 1 & 2: ACQUISITION PROGRESS & RISK OVERVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Section 1: Progress Breakdown (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
                Section 1 — National Acquisition Progress
              </h2>
              <p className="text-[11px] text-slate-500">Formula: (Land Acquired / Land Required) × 100</p>
            </div>
            <span className="text-xs font-black text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
              {kpis.acquisition_pct}% Complete
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>National Highways (MoRTH / NHAI)</span>
                <span>82.4% (8,420 / 10,200 Ha)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '82.4%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Dedicated Freight Corridors (Railways)</span>
                <span>68.5% (5,400 / 7,880 Ha)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '68.5%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Industrial Corridors & Green Energy Parks</span>
                <span>54.1% (3,810 / 7,040 Ha)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '54.1%' }}></div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs flex justify-between items-center text-slate-600">
            <span>Total Statutory Legal Dispute Hold: <span className="font-bold text-slate-900">{kpis.legal_cases} Cases</span></span>
            <span>Overdue Statutory SLA Activities: <span className="font-bold text-rose-700">{kpis.overdue_activities} Tasks</span></span>
          </div>
        </div>

        {/* Section 2: Project Risk Distribution (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
                Section 2 — PS17 Project Risk Overview
              </h2>
              <p className="text-[11px] text-slate-500">Machine learning delay risk categorization</p>
            </div>
            <button
              onClick={() => onNavigateTab('ai_risk')}
              className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
            >
              ML Details <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200">
              <div className="text-[11px] font-bold text-rose-800 uppercase">Critical Risk</div>
              <div className="text-2xl font-black text-rose-700 mt-0.5">{risk_distribution.CRITICAL}</div>
              <div className="text-[10px] text-rose-600 font-semibold mt-0.5">&gt;75% Delay Prob.</div>
            </div>

            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
              <div className="text-[11px] font-bold text-amber-800 uppercase">High Risk</div>
              <div className="text-2xl font-black text-amber-700 mt-0.5">{risk_distribution.HIGH}</div>
              <div className="text-[10px] text-amber-600 font-semibold mt-0.5">50% - 75% Prob.</div>
            </div>

            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
              <div className="text-[11px] font-bold text-blue-800 uppercase">Medium Risk</div>
              <div className="text-2xl font-black text-blue-700 mt-0.5">{risk_distribution.MEDIUM}</div>
              <div className="text-[10px] text-blue-600 font-semibold mt-0.5">25% - 50% Prob.</div>
            </div>

            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
              <div className="text-[11px] font-bold text-emerald-800 uppercase">Low / On Track</div>
              <div className="text-2xl font-black text-emerald-700 mt-0.5">{risk_distribution.LOW}</div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">&lt;25% Prob.</div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Random Forest Inference: <span className="font-bold text-slate-900">90.0% Accuracy</span></span>
            </span>
            <span className="font-mono text-[10px] text-slate-500">v2.4-prod</span>
          </div>
        </div>
      </div>

      {/* 4. SECTION 3: PROJECTS NEEDING ATTENTION */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
              Section 3 — Projects Needing Attention Right Now
            </h2>
            <p className="text-[11px] text-slate-500">
              Corridors experiencing statutory SLA overruns, legal disputes, or ground inspection anomalies
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('projects')}
            className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
          >
            View All Corridors <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-y border-slate-200 text-[11px]">
                <th className="py-2.5 px-3">Project Corridor</th>
                <th className="py-2.5 px-3">State / District</th>
                <th className="py-2.5 px-3">Stage</th>
                <th className="py-2.5 px-3">Acquired %</th>
                <th className="py-2.5 px-3">Predicted Delay</th>
                <th className="py-2.5 px-3">Risk Level</th>
                <th className="py-2.5 px-3">Primary Root Cause</th>
                <th className="py-2.5 px-3 text-right">Required Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {projects_needing_attention.map((proj) => (
                <tr key={proj.id} className="hover:bg-blue-50/50 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900">
                    <button
                      onClick={() => onSelectProject(proj.id)}
                      className="hover:text-blue-700 text-left font-bold"
                    >
                      {proj.name}
                      <span className="block text-[10px] font-mono text-slate-400 font-normal">{proj.id}</span>
                    </button>
                  </td>
                  <td className="py-3 px-3 text-slate-600">{proj.state} • {proj.district}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-semibold text-[10px]">
                      {proj.current_stage}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-blue-600 h-1.5" style={{ width: `${proj.progress}%` }}></div>
                      </div>
                      <span className="font-bold text-[11px]">{proj.progress}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded text-[11px]">
                      +{proj.delay_days} Days
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      proj.risk_level === 'CRITICAL' ? 'bg-rose-100 text-rose-900 border border-rose-300' : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}>
                      {proj.risk_level} ({proj.risk_score}%)
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 text-[11px]">{proj.primary_issue}</td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onSelectProject(proj.id)}
                      className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-bold shadow-2xs transition-colors"
                    >
                      {proj.next_action}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. SECTION 4 & 5: LIVE ALERTS & AI RISK OUTLOOK */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Section 4: Live Operational Alerts (6 cols) */}
        <div className="lg:col-span-6 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Section 4 — Live Operational Alerts</span>
              </h2>
              <p className="text-[11px] text-slate-500">Unresolved statutory, financial, and cadastral warnings</p>
            </div>
            <button
              onClick={() => onNavigateTab('alerts')}
              className="text-xs font-bold text-blue-700 hover:text-blue-900"
            >
              All Alerts ({live_alerts.length})
            </button>
          </div>

          <div className="space-y-2.5">
            {live_alerts.slice(0, 4).map((alert) => (
              <div 
                key={alert.id}
                className="p-3 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors bg-slate-50/60 flex items-start justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-black px-1.5 py-0.2 rounded uppercase ${
                      alert.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-900' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {alert.severity}
                    </span>
                    <span className="font-bold text-slate-900">{alert.title}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-1">{alert.message}</p>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Project: {alert.project_id} • Estimated Delay: +{alert.delay_days} days • {alert.created_at}
                  </div>
                </div>

                <button
                  onClick={() => onNavigateTab('recommendations')}
                  className="px-2.5 py-1 bg-white hover:bg-blue-50 text-blue-700 border border-slate-300 rounded text-[11px] font-bold shrink-0 transition-colors"
                >
                  Action
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: AI Risk Outlook & SHAP Factors (6 cols) */}
        <div className="lg:col-span-6 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Section 5 — AI Risk Outlook & Delay Attribution</span>
              </h2>
              <p className="text-[11px] text-slate-500">PS17 Explainability: Root causes driving corridor delays</p>
            </div>
            <button
              onClick={() => onNavigateTab('ai_risk')}
              className="text-xs font-bold text-blue-700 hover:text-blue-900"
            >
              Full Simulator
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-slate-700 font-bold mb-1">
                <span>1. Legal Disputes & Section 15 Inquiries</span>
                <span className="text-rose-700 font-extrabold">+42% Factor Contribution</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-rose-600 h-2 rounded-full" style={{ width: '42%' }}></div>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">18 High Court stays and co-sharer partition disputes on critical alignment.</p>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 font-bold mb-1">
                <span>2. Compensation Payment Backlog (&gt;30 Days)</span>
                <span className="text-amber-700 font-extrabold">+28% Factor Contribution</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '28%' }}></div>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">PFMS Direct Benefit Transfer batches pending escrow sanction.</p>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 font-bold mb-1">
                <span>3. Ground Cadastral Mismatch & Field Observations</span>
                <span className="text-blue-700 font-extrabold">+18% Factor Contribution</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '18%' }}></div>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">Field officer boundary overlaps detected on Khasra 1042.</p>
            </div>
          </div>

          <div className="bg-blue-50/70 p-3 rounded-lg border border-blue-200 text-xs text-blue-950 flex items-center justify-between">
            <span>Recommended Closed-Loop Intervention:</span>
            <button
              onClick={() => onNavigateTab('recommendations')}
              className="px-2.5 py-1 bg-blue-700 hover:bg-blue-800 text-white rounded font-bold text-[10px]"
            >
              Execute Mediation Bench
            </button>
          </div>
        </div>
      </div>

      {/* 6. SECTION 6: RECENT FIELD ACTIVITY (Ground Truth Feed) */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
                Section 6 — Ground Truth Feed (Field Officer Submissions)
              </h2>
              <span className="text-[9px] bg-emerald-100 text-emerald-900 font-black px-1.5 py-0.5 rounded uppercase">
                Direct from Field App
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Ground-truth cadastral inspection dossiers received from the separate N-LAMS Field Officer application
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('field_inspections')}
            className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
          >
            Open Inspection Cell <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {recent_field_activity.map((act) => (
            <div
              key={act.id}
              onClick={() => onNavigateTab('field_inspections')}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-white transition-all cursor-pointer shadow-2xs space-y-2 group"
            >
              <div className="flex justify-between items-start">
                <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1">
                  Khasra {act.khasra_number}
                  {act.khasra_number === '1042' && (
                    <span className="text-[8px] bg-rose-100 text-rose-800 font-black px-1 rounded">EXEMPLAR</span>
                  )}
                </span>
                <span className={`text-[9px] font-black px-1.5 py-0.2 rounded uppercase ${
                  act.status === 'Approved' ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                }`}>
                  {act.status}
                </span>
              </div>

              <div className="text-[11px] text-slate-500">
                Village: <span className="font-semibold text-slate-800">{act.village}</span> • Code: <span className="font-mono text-[10px] text-slate-400">{act.inspection_code}</span>
              </div>

              <div className="flex flex-wrap gap-1.5 text-[10px] font-bold">
                <span className={`px-1.5 py-0.5 rounded ${
                  act.gps_verified ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                }`}>
                  {act.gps_verified ? '✓ GPS Verified' : 'GPS Unverified'}
                </span>

                <span className={`px-1.5 py-0.5 rounded ${
                  act.boundary_status === 'Matched' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                  Boundary: {act.boundary_status}
                </span>

                {act.photos_count > 0 && (
                  <span className="bg-blue-50 text-blue-800 px-1.5 py-0.5 rounded">
                    📷 {act.photos_count} Evidence
                  </span>
                )}
              </div>

              <div className="pt-2 border-t border-slate-200/80 flex justify-between items-center text-[10px] text-slate-400">
                <span>By: {act.officer_name.split(' ')[0]}</span>
                <span>{act.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. SECTION 7: GEOGRAPHIC OVERVIEW */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
              Section 7 — Geographic & Spatial Cadastral Overview
            </h2>
            <p className="text-[11px] text-slate-500">52 georeferenced cadastral parcels along active alignment corridors</p>
          </div>
          <button
            onClick={() => onNavigateTab('gis')}
            className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
          >
            Launch Fullscreen GIS Studio <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center space-y-3">
          <div className="max-w-md mx-auto">
            <h3 className="text-base font-bold text-slate-900">Interactive OpenStreetMap & GeoJSON Engine</h3>
            <p className="text-xs text-slate-500 mt-1">
              Directly inspect project alignments, village cadastral boundaries, and live ground truthing markers.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              onClick={() => onNavigateTab('gis')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
            >
              Open Interactive GIS Map
            </button>
            <button
              onClick={() => onSelectProject('NH-GJ-2026-001')}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg text-xs font-bold transition-colors"
            >
              Inspect Ahmedabad–Rajkot Alignment
            </button>
          </div>
        </div>
      </div>

      {/* 8. OFFICIAL SYSTEM VIDEO WALKTHROUGH & DEMONSTRATION */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-wider bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded flex items-center gap-1">
                <Play className="w-2.5 h-2.5 fill-red-600" />
                Official Video Walkthrough
              </span>
              <span className="text-xs text-slate-500 font-medium">• Smart India Hackathon Demonstration Guide</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 font-serif">
              National Land Acquisition & Management System (N-LAMS) — Product Video
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Watch how N-LAMS digitizes the complete statutory lifecycle under RFCTLARR Act 2013, displays high-resolution cadastral parcels, and recalculates AI delay risks in real time.
            </p>
          </div>

          <a
            href="https://www.youtube.com/watch?v=ELO-9TsPu3k"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Open in YouTube</span>
            <ExternalLink className="w-3 h-3 text-red-200" />
          </a>
        </div>

        {/* Embedded Responsive YouTube Player */}
        <div className="relative pt-[45%] w-full bg-slate-950 rounded-xl overflow-hidden border border-slate-300 shadow-md">
          <iframe
            className="absolute top-0 left-0 w-full h-full border-none"
            src="https://www.youtube.com/embed/ELO-9TsPu3k?rel=0"
            title="N-LAMS Official Product Demonstration Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-1">
          <div className="flex items-center gap-4">
            <span>● <strong>Demonstration:</strong> End-to-End Digital Workflow & Decision Support</span>
            <span>● <strong>Platform:</strong> Smart India Hackathon PS16 & PS17</span>
          </div>
          <span className="text-emerald-700 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Official Verified Video Guide
          </span>
        </div>
      </div>
    </div>
  );
}
