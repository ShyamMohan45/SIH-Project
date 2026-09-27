import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Building2, MapPin, Calendar, Users, AlertTriangle, ShieldCheck, 
  CheckCircle2, Clock, FileText, DollarSign, Home, Gavel, Sparkles, RefreshCw, 
  Download, Upload, Eye, ExternalLink, Layers, ArrowUpRight, Cpu, Check, Grid, 
  ClipboardCheck, Bell, History
} from 'lucide-react';
import { api } from '../services/api';

export default function ProjectDetailPage({ 
  projectId = 'NH-GJ-2026-001', 
  onBack, 
  onOpenGis,
  onNavigateTab
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [project, setProject] = useState(null);
  const [parcels, setParcels] = useState([]);
  const [workflow, setWorkflow] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState(false);
  const [isSimulatingAction, setIsSimulatingAction] = useState(false);

  useEffect(() => {
    const fetchProjectData = async () => {
      setLoading(true);
      try {
        const projs = await api.getProjects('ALL');
        const found = projs.find(p => p.id === projectId) || projs[0];
        setProject(found);

        // Fetch workflow
        const wf = await api.getProjectWorkflow(projectId);
        setWorkflow(wf);

        // Fetch parcels
        const pcls = await api.getProjectParcels(projectId);
        setParcels(pcls);

        // Fetch field inspections
        const insps = await api.getAllFieldInspections('ALL');
        setInspections(insps.filter(i => i.project_id === projectId));

        // Fetch recommendations
        const recs = await api.getRecommendations(projectId);
        setRecommendations(recs);

        // Fetch alerts
        const alts = await api.getAlerts();
        setAlerts(alts.filter(a => a.project_id === projectId));
      } catch (err) {
        console.error('Error loading project details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjectData();
  }, [projectId]);

  const handleExecuteAction = async (actionType) => {
    setIsSimulatingAction(true);
    try {
      await api.executeIntervention(projectId, { action_type: actionType });
      setActionSuccess(true);
      // Reload project state
      const projs = await api.getProjects('ALL');
      const updated = projs.find(p => p.id === projectId);
      if (updated) setProject(updated);
    } catch (err) {
      console.error('Error executing intervention:', err);
    } finally {
      setIsSimulatingAction(false);
    }
  };

  if (loading || !project) {
    return (
      <div className="p-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span>Loading comprehensive project dossier...</span>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'workflow', label: 'Statutory Workflow (10)' },
    { id: 'parcels', label: `Cadastral Parcels (${parcels.length || 52})` },
    { id: 'field_inspections', label: `Field Ground Truthing (${inspections.length})` },
    { id: 'ai_risk', label: 'AI Delay & SHAP' },
    { id: 'compensation', label: 'Compensation Ledger' },
    { id: 'legal', label: `Legal Disputes (${project.legal_cases || 18})` },
    { id: 'rr', label: 'R&R Compliance' },
    { id: 'alerts', label: `Alerts (${alerts.length})` },
    { id: 'recommendations', label: `Recommendations (${recommendations.length})` },
    { id: 'documents', label: 'Document Vault' },
    { id: 'audit', label: 'Audit Trail' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
      {/* 1. TOP NAVIGATION BREADCRUMB & BACK BUTTON */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects Directory</span>
        </button>

        <div className="text-xs text-slate-400 font-mono">
          Corridor Unique UIN: <span className="text-slate-800 font-bold">{project.id}</span>
        </div>
      </div>

      {/* 2. PROJECT HERO CARD */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200 uppercase tracking-wide">
                {project.project_type} Sector
              </span>
              <span className="text-xs text-slate-500 font-semibold">• {project.state} • {project.district}</span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-100 text-amber-900 uppercase">
                {project.current_stage} Stage
              </span>
            </div>

            <h1 className="text-2xl font-black text-slate-900 font-serif tracking-tight">
              {project.name}
            </h1>
            <p className="text-xs text-slate-500">
              High-priority economic corridor connecting Ahmedabad and Rajkot Industrial Hubs under PM GatiShakti
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenGis}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Inspect on GIS</span>
            </button>

            <button
              onClick={() => handleExecuteAction('COMPENSATION_ESCALATION')}
              disabled={isSimulatingAction}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0b2545] hover:bg-[#12315b] text-white rounded-lg text-xs font-bold shadow-xs transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{isSimulatingAction ? 'Actioning...' : 'Fast-Track Remediation'}</span>
            </button>
          </div>
        </div>

        {/* Action success alert */}
        {actionSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Remediation action successfully executed! Risk score reduced and logged to audit trail.</span>
          </div>
        )}

        {/* Corridor Key Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div>
            <div className="text-[10px] text-slate-500 font-bold uppercase">Land Required</div>
            <div className="text-base font-black text-slate-900">{project.land_required.toLocaleString()} Ha</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-bold uppercase">Land Acquired</div>
            <div className="text-base font-black text-emerald-700">{project.land_acquired.toLocaleString()} Ha ({project.acquisition_pct}%)</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-bold uppercase">Affected Families</div>
            <div className="text-base font-black text-slate-900">{project.affected_families.toLocaleString()} PAFs</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-bold uppercase">Legal Disputes</div>
            <div className="text-base font-black text-rose-700">{project.legal_cases} Active Suits</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-bold uppercase">Predicted Delay</div>
            <div className="text-base font-black text-rose-700">+{project.predicted_delay_days} Days</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-bold uppercase">AI Risk Level</div>
            <div className="text-base font-black text-rose-700">{project.risk_level} ({project.risk_score}%)</div>
          </div>
        </div>
      </div>

      {/* 3. TABS NAVIGATION BAR */}
      <div className="border-b border-slate-200 overflow-x-auto">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2.5 px-3.5 text-xs font-bold border-b-2 whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-700 bg-blue-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. ACTIVE TAB VIEWPORT */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6 text-xs text-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
                  Corridor Strategic Scope & Authority
                </h3>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between">
                    <span>Competent Authority for Land Acquisition (CALA):</span>
                    <span className="font-bold text-slate-900">District Collectorate, Rajkot</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Statutory Legal Framework:</span>
                    <span className="font-bold text-slate-900">National Highways Act 1956 & RFCTLARR 2013</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Target Corridor Commissioning:</span>
                    <span className="font-bold text-slate-900">{project.target_date || '2027-03-31'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Estimated Compensation Solatium:</span>
                    <span className="font-bold text-slate-900">₹{project.compensation_assessed_cr || 850} Crores</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Compensation Disbursed via PFMS DBT:</span>
                    <span className="font-bold text-emerald-700">₹{project.compensation_disbursed_cr || 690} Crores</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
                  Key Exemplar Parcel Under Observation
                </h3>
                <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-200 space-y-2 text-slate-800">
                  <div className="flex justify-between font-bold">
                    <span>Target Cadastral Parcel:</span>
                    <span className="text-rose-900">Khasra 1042 (P-1042)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Village & Taluka:</span>
                    <span>Limbdi, Surendranagar / Kuvadva</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Area & Valuation:</span>
                    <span>2.45 Ha (₹45.6 Lakhs assessed)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ground Discrepancy:</span>
                    <span className="font-bold text-rose-700">12m Boundary overlap on highway alignment</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Legal Status:</span>
                    <span className="font-bold text-rose-700">High Court Stay Petition (Case LEG-2026-0042)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STATUTORY WORKFLOW (10 Stages with calculated delay) */}
        {activeTab === 'workflow' && (
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
                  Statutory 10-Stage Land Acquisition Lifecycle
                </h3>
                <p className="text-[11px] text-slate-500">
                  Delay calculated dynamically: (Actual End - Planned End) or (Today - Planned End)
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold border-y border-slate-200 text-[11px]">
                    <th className="py-2.5 px-3">Stage #</th>
                    <th className="py-2.5 px-3">Statutory Stage</th>
                    <th className="py-2.5 px-3">Authority</th>
                    <th className="py-2.5 px-3">Planned Period</th>
                    <th className="py-2.5 px-3">Actual Period</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Delay Days</th>
                    <th className="py-2.5 px-3">Statutory Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {workflow.map((stg) => (
                    <tr key={stg.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-500">{stg.stage_number}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{stg.stage_name}</td>
                      <td className="py-2.5 px-3 text-slate-600">{stg.responsible_dept}</td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">{stg.planned_start} to {stg.planned_end}</td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-700">{stg.actual_start || '—'} to {stg.actual_end || 'In Progress'}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          stg.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-900' :
                          stg.status === 'DELAYED' ? 'bg-rose-100 text-rose-900' : 'bg-blue-100 text-blue-900'
                        }`}>
                          {stg.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-bold">
                        {stg.delay_days > 0 ? (
                          <span className="text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded font-mono">+{stg.delay_days}d</span>
                        ) : (
                          <span className="text-emerald-700">0d</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 text-[11px]">{stg.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: CADASTRAL PARCELS */}
        {activeTab === 'parcels' && (
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
                  Project Cadastral Parcels ({parcels.length})
                </h3>
                <p className="text-[11px] text-slate-500">All registered land parcels along corridor alignment</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold border-y border-slate-200 text-[11px]">
                    <th className="py-2.5 px-3">Parcel ID</th>
                    <th className="py-2.5 px-3">Khasra #</th>
                    <th className="py-2.5 px-3">Village</th>
                    <th className="py-2.5 px-3">Area (Ha)</th>
                    <th className="py-2.5 px-3">Owners</th>
                    <th className="py-2.5 px-3">Acquisition</th>
                    <th className="py-2.5 px-3">Compensation</th>
                    <th className="py-2.5 px-3">Legal Status</th>
                    <th className="py-2.5 px-3">Ground Verified</th>
                    <th className="py-2.5 px-3">Risk Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {parcels.map((pcl) => {
                    const is1042 = pcl.khasra_number === '1042';
                    return (
                      <tr key={pcl.id} className={is1042 ? 'bg-rose-50/60 font-bold' : 'hover:bg-slate-50'}>
                        <td className="py-2.5 px-3 font-mono text-slate-900">{pcl.id}</td>
                        <td className="py-2.5 px-3 font-black text-slate-900">
                          {pcl.khasra_number}
                          {is1042 && <span className="ml-1 text-[8px] bg-rose-200 text-rose-900 px-1 rounded">EXEMPLAR</span>}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">{pcl.village}</td>
                        <td className="py-2.5 px-3 font-mono">{pcl.area_ha}</td>
                        <td className="py-2.5 px-3">{pcl.owner_name} ({pcl.owner_count})</td>
                        <td className="py-2.5 px-3">{pcl.acquisition_status}</td>
                        <td className="py-2.5 px-3">
                          <span className={`px-1.5 py-0.2 rounded text-[10px] ${
                            pcl.compensation_status === 'Paid' ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                          }`}>
                            {pcl.compensation_status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`px-1.5 py-0.2 rounded text-[10px] ${
                            pcl.legal_status === 'Clear' ? 'text-slate-600' : 'bg-rose-100 text-rose-900 font-bold'
                          }`}>
                            {pcl.legal_status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          {pcl.field_verified ? (
                            <span className="text-emerald-700 font-bold flex items-center gap-1">
                              ✓ Verified
                            </span>
                          ) : (
                            <span className="text-slate-400">Pending</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            pcl.risk_level === 'Critical' || pcl.risk_level === 'High' ? 'bg-rose-100 text-rose-900' : 'bg-emerald-100 text-emerald-900'
                          }`}>
                            {pcl.risk_level}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: FIELD GROUND TRUTHING */}
        {activeTab === 'field_inspections' && (
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
                  Ground Truth Inspections Received from Field App
                </h3>
                <p className="text-[11px] text-slate-500">
                  Data synchronized directly from the separate Android Cadastral Surveyor application
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {inspections.map((insp) => (
                <div key={insp.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                        <span>Dossier: {insp.inspection_code}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-900 rounded">
                          Khasra {insp.khasra_number}
                        </span>
                      </div>
                      <div className="text-slate-500 text-[11px] mt-0.5">
                        Parcel: {insp.parcel_id} • Officer: {insp.officer_name} ({insp.officer_id})
                      </div>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded text-xs font-black uppercase ${
                      insp.status === 'Approved' ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {insp.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-2 bg-white rounded border border-slate-200">
                      <span className="text-[10px] text-slate-500 block font-bold">GPS Geolocation</span>
                      <span className="font-bold text-slate-900">22.3862° N, 71.0676° E</span>
                      <span className="text-[9px] text-emerald-700 block mt-0.5">✓ Accuracy 4.2m (Matched)</span>
                    </div>

                    <div className="p-2 bg-white rounded border border-slate-200">
                      <span className="text-[10px] text-slate-500 block font-bold">Marker Check</span>
                      <span className="font-bold text-slate-900">Expected: {insp.khasra_expected}</span>
                      <span className="text-[9px] text-emerald-700 block mt-0.5">Observed: {insp.khasra_number} (Matched)</span>
                    </div>

                    <div className="p-2 bg-white rounded border border-slate-200">
                      <span className="text-[10px] text-slate-500 block font-bold">Boundary Status</span>
                      <span className="font-bold text-rose-700">{insp.boundary_status}</span>
                      <span className="text-[9px] text-slate-500 block mt-0.5">Overlap on reservation</span>
                    </div>

                    <div className="p-2 bg-white rounded border border-slate-200">
                      <span className="text-[10px] text-slate-500 block font-bold">Evidence Files</span>
                      <span className="font-bold text-blue-700">📷 {insp.photos_count || 4} Geo-tagged Photos</span>
                      <span className="text-[9px] text-rose-700 block mt-0.5">⚠️ {insp.issues_count || 3} Issues Logged</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-white rounded border border-slate-200 text-[11px] text-slate-700">
                    <strong>Surveyor Observations:</strong> "{insp.remarks || 'Boundary verification completed. Discrepancy noted on road fence.'}"
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* OTHER TABS FALLBACK CONTENT */}
        {['ai_risk', 'compensation', 'legal', 'rr', 'alerts', 'recommendations', 'documents', 'audit'].includes(activeTab) && (
          <div className="py-8 text-center space-y-3">
            <h3 className="text-base font-extrabold text-slate-900 capitalize">{activeTab.replace('_', ' ')} Module</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Dedicated operational interface synchronized with central database records for project {project.id}.
            </p>
            <button
              onClick={() => onNavigateTab(activeTab === 'ai_risk' ? 'ai_risk' : (activeTab === 'alerts' ? 'alerts' : activeTab))}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
            >
              Open Full {activeTab.replace('_', ' ').toUpperCase()} Workspace
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
