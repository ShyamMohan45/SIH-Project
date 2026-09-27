import React, { useState } from 'react';
import { Layers, Cpu, LayoutDashboard, GitBranch, Database, Shield, Server, ArrowDown, Activity, CheckCircle2 } from 'lucide-react';

export default function SystemArchitecture() {
  const [selectedLayer, setSelectedLayer] = useState(1);

  const layers = [
    {
      id: 1,
      title: 'Layer 1 — National Dashboard',
      sub: 'Central / State / District Interfaces',
      icon: LayoutDashboard,
      color: 'border-blue-500 bg-blue-900/30 text-blue-300',
      activeColor: 'bg-blue-600 text-white ring-2 ring-blue-400',
      description: 'Multi-tenant RBAC interfaces tailored for Central Ministries (All India overview), State Governments (State monitoring), and District Collectors (Field execution).',
      components: ['Central Policy Dashboard', 'State Governor Summary', 'District Collector Portal', 'Field Mobile Verification App']
    },
    {
      id: 2,
      title: 'Layer 2 — Decision Support Layer',
      sub: 'KPIs | Analytics | Reports | Risk | Recommendations',
      icon: Activity,
      color: 'border-emerald-500 bg-emerald-900/30 text-emerald-300',
      activeColor: 'bg-emerald-600 text-white ring-2 ring-emerald-400',
      description: 'Executive decision-support dashboard synthesizing project status, financial disbursement tracking, timeline adherence, and policy formulation reports.',
      components: ['National KPI Aggregator', 'Disbursement Heatmap', 'Milestone SLA Monitor', 'Executive MIS Reports']
    },
    {
      id: 3,
      title: 'Layer 3 — AI / ML Engine (PS17)',
      sub: 'Delay Prediction | Risk Scoring | Explainable AI (XAI)',
      icon: Cpu,
      color: 'border-amber-500 bg-amber-900/30 text-amber-300',
      activeColor: 'bg-amber-500 text-slate-950 ring-2 ring-amber-300 font-extrabold',
      description: 'Machine Learning engine using XGBoost & Random Forest to calculate delay probability scores, generate SHAP feature explanations, and suggest mitigation steps.',
      components: ['Project Delay Predictor', 'Risk Scoring Pipeline', 'SHAP Explainable AI (XAI)', 'Automated Escalation Bot']
    },
    {
      id: 4,
      title: 'Layer 4 — Land Acquisition Core (PS16)',
      sub: 'Proposal → Scrutiny → Notification → Award → Possession',
      icon: GitBranch,
      color: 'border-purple-500 bg-purple-900/30 text-purple-300',
      activeColor: 'bg-purple-600 text-white ring-2 ring-purple-400',
      description: 'End-to-end statutory workflow engine enforcing mandatory legal steps under the RFCTLARR Act 2013 and state-specific Land Acquisition rules.',
      components: ['18-Stage Legal Workflow', 'Section 3A/3D Notification Engine', 'Section 23 Award Declarator', 'Section 15 Objection Handler']
    },
    {
      id: 5,
      title: 'Layer 5 — Specialist Engines',
      sub: 'GIS Engine | Document Engine | Workflow Engine',
      icon: Layers,
      color: 'border-cyan-500 bg-cyan-900/30 text-cyan-300',
      activeColor: 'bg-cyan-600 text-white ring-2 ring-cyan-400',
      description: 'Decoupled domain engines handling spatial cadastral mapping, versioned PDF document generation with checksum integrity, and automated task routing.',
      components: ['PostGIS Cadastral Polygon Engine', 'PDF Gazette Notification Generator', 'Task Routing & SLA Escalator', 'Encroachment Satellite Diff Engine']
    },
    {
      id: 6,
      title: 'Layer 6 — Data Platform',
      sub: 'PostgreSQL / PostGIS / Historical Repository',
      icon: Database,
      color: 'border-indigo-500 bg-indigo-900/30 text-indigo-300',
      activeColor: 'bg-indigo-600 text-white ring-2 ring-indigo-400',
      description: 'High-performance spatial database maintaining historical project timelines, land parcel geometries, survey numbers, khata ledgers, and audit trails.',
      components: ['PostgreSQL Database', 'PostGIS Geometry Extension', 'Audit Log Vault', 'Historical Time-Series Store']
    },
    {
      id: 7,
      title: 'Layer 7 — Integration Layer (APIs)',
      sub: 'Land Records | Cadastral GIS Data | Financial Compensation',
      icon: Server,
      color: 'border-rose-500 bg-rose-900/30 text-rose-300',
      activeColor: 'bg-rose-600 text-white ring-2 ring-rose-400',
      description: 'RESTful API gateway connecting to State Land Record Portals (Bhoomi, AnyRoR, Mahabhulekh), MoRTH BhoomiRashi API, and Public Financial Management (PFMS).',
      components: ['State Land Record API Gateway', 'Cadastral Vector Tile Server', 'PFMS Direct Payout Bridge', 'BhoomiRashi Sync Connector']
    }
  ];

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-2xl border border-slate-800 my-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center pb-4 mb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-blue-500/20 text-blue-300 font-extrabold text-[10px] px-2.5 py-1 rounded uppercase tracking-wider border border-blue-400/30">
              Target Technical Architecture
            </span>
            <h2 className="text-xl font-bold font-serif text-white">
              7-Layer Integrated Technical Architecture
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            System design blueprint connecting National Dashboards, Decision Support, AI Engines, Core Workflows, and Government API Gateways.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/30">
          <Shield className="w-4 h-4" />
          <span>7-Tier Enterprise Stack</span>
        </div>
      </div>

      {/* Architecture Visualizer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Stack Diagram */}
        <div className="lg:col-span-7 space-y-2 relative">
          {layers.map((layer, idx) => {
            const Icon = layer.icon;
            const isSelected = selectedLayer === layer.id;
            return (
              <div key={layer.id} className="relative">
                <div
                  onClick={() => setSelectedLayer(layer.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between shadow-md ${
                    isSelected ? layer.activeColor : `${layer.color} hover:brightness-125`
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-black/30">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-extrabold text-sm leading-tight">{layer.title}</div>
                      <div className="text-[11px] opacity-85 font-medium">{layer.sub}</div>
                    </div>
                  </div>
                  <span className="text-xs font-black opacity-75">{isSelected ? 'ACTIVE' : `L${layer.id}`}</span>
                </div>

                {idx < layers.length - 1 && (
                  <div className="flex justify-center my-0.5 opacity-40">
                    <ArrowDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right 5 Cols: Layer Detail Inspector */}
        <div className="lg:col-span-5 bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between shadow-inner">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <span className="text-xs font-extrabold text-amber-400 uppercase tracking-widest">
                Layer Inspector
              </span>
              <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                Layer {selectedLayer} of 7
              </span>
            </div>

            <h3 className="text-lg font-bold text-white font-serif mb-1">
              {layers[selectedLayer - 1].title}
            </h3>
            <div className="text-xs text-amber-300 font-semibold mb-3">
              {layers[selectedLayer - 1].sub}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {layers[selectedLayer - 1].description}
            </p>

            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Core Module Subsystems:
              </div>
              <div className="space-y-1.5">
                {layers[selectedLayer - 1].components.map((comp, idx) => (
                  <div key={idx} className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-xs font-medium text-slate-200 flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{comp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Inter-layer Latency: &lt;15ms</span>
            <span className="text-emerald-400 font-bold">100% Interoperable</span>
          </div>
        </div>
      </div>
    </div>
  );
}
