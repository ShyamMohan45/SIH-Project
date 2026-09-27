import React, { useState } from 'react';
import { 
  GitBranch, Clock, FileText, CheckCircle2, AlertTriangle, Building, 
  Scale, ArrowRight, Database, Smartphone, ShieldCheck, Cpu, Layers, UserCheck, Search, Filter
} from 'lucide-react';

export default function StatutoryLifecycle() {
  const [activeTab, setActiveTab] = useState('pipeline'); // 'pipeline', 'matrix', 'mobile', 'legal'
  const [activeStage, setActiveStage] = useState(1);
  const [activeLegalStage, setActiveLegalStage] = useState(9);

  // 13 Operational Stages as requested in Research 1
  const operationalStages = [
    {
      id: 1,
      name: 'Project Proposal',
      action: 'Project agency submits initial land requisition request',
      data: 'project_type, land_required_ha, district_count, estimated_cost, target_completion',
      delay: 'Incomplete requisition, missing alignment map, baseline budget miscalculation',
      aiFeature: 'land_area',
      badge: 'Level 1 Input'
    },
    {
      id: 2,
      name: 'Land Identification',
      action: 'GIS corridor demarcation & survey parcel mapping',
      data: 'parcel_ids, survey_numbers, area_ha, village_code, spatial_polygons',
      delay: 'Overlapping corridor boundaries, unmapped village pockets',
      aiFeature: 'parcel_count',
      badge: 'GIS Layer'
    },
    {
      id: 3,
      name: 'Land Record Verification',
      action: 'Cross-verification with state land records & DILRMP APIs',
      data: 'owner_name, khata_no, encumbrance_status, land_category, mutation_history',
      delay: 'Disputed title deeds, missing Record of Rights (RoR), legacy manual records',
      aiFeature: 'dispute_ratio',
      badge: 'DILRMP API'
    },
    {
      id: 4,
      name: 'Survey & Assessment',
      action: 'Field officer mobile verification of assets & affected families',
      data: 'geo_tagged_photos, structure_count, trees_val, affected_family_id, gps_coords',
      delay: 'Field officer non-responsiveness, contested asset valuation, boundary disputes',
      aiFeature: 'field_delay_days',
      badge: 'Mobile App'
    },
    {
      id: 5,
      name: 'Proposal Scrutiny',
      action: 'Automated document validation & multi-department scrutiny',
      data: 'doc_completeness_score, scrutiny_timestamps, officer_comments',
      delay: 'Missing statutory clearances (Forest/CRZ), inter-departmental latency',
      aiFeature: 'document_gap',
      badge: 'Workflow AI'
    },
    {
      id: 6,
      name: 'Administrative Approval',
      action: 'Competent Authority / State Land Cell administrative sanction',
      data: 'approver_id, approval_date, sanction_order_no, budget_lock_status',
      delay: 'Approval file stuck in committee, delayed sanction order emission',
      aiFeature: 'approval_delay_days',
      badge: 'SLA Monitor'
    },
    {
      id: 7,
      name: 'Statutory Notification',
      action: 'Gazette publication (Preliminary RFCTLARR Section 11 notice)',
      data: 'gazette_no, publication_date, newspaper_ad_ref, gazette_pdf_hash',
      delay: 'Delayed gazette printing, local newspaper publication backlog',
      aiFeature: 'notification_delay',
      badge: 'Legal Gazette'
    },
    {
      id: 8,
      name: 'Objections & Hearing',
      action: 'Section 15 statutory hearings & public claim resolution',
      data: 'objection_id, claim_type, hearing_date, decision_status, court_stay_flag',
      delay: 'High volume of title/boundary objections, PIL filed in High Court',
      aiFeature: 'objection_count',
      badge: 'Bottleneck 🔥'
    },
    {
      id: 9,
      name: 'Valuation & Compensation',
      action: 'District Valuation Committee calculates solatium & market value',
      data: 'assessed_value, solatium_amount, asset_comp, total_payable_inr, beneficiary_cnt',
      delay: 'Disagreement over market rate multiplier, delayed budget disbursement',
      aiFeature: 'compensation_pending',
      badge: 'PFMS Bridge'
    },
    {
      id: 10,
      name: 'Award Declaration',
      action: 'Collector issues statutory land acquisition award (Section 23/37)',
      data: 'award_id, award_date, award_amount_cr, signed_collector_order',
      delay: 'Litigation over award amount, delay in Collector signature',
      aiFeature: 'award_delay_days',
      badge: 'Statutory Award'
    },
    {
      id: 11,
      name: 'Compensation Disbursement',
      action: 'Direct Benefit Transfer (DBT) via PFMS to bank accounts',
      data: 'bank_txn_id, dbt_status, amount_disbursed, pending_beneficiary_cnt',
      delay: 'KYC failure, unlinked Aadhar/bank details, joint-family title disputes',
      aiFeature: 'payment_delay_days',
      badge: 'DBT Engine'
    },
    {
      id: 12,
      name: 'Physical Possession',
      action: 'Land handover to Requiring Body & possession certificate issuance',
      data: 'possession_ha, possession_pct, handover_date, possession_cert_no',
      delay: 'Physical encroachment, local protests preventing site takeover',
      aiFeature: 'acquisition_progress',
      badge: 'Milestone'
    },
    {
      id: 13,
      name: 'Rehabilitation & Resettlement',
      action: 'Execution of R&R entitlements, housing, and livelihood support',
      data: 'rr_family_count, housing_allotted, livelihood_allowance_paid, rr_completion_pct',
      delay: 'Delayed construction of R&R colony, entitlement distribution disputes',
      aiFeature: 'rr_progress',
      badge: 'R&R Compliance'
    }
  ];

  // 18 Legal Statutory Stages under RFCTLARR Act 2013
  const legalStages = [
    { id: 1, name: 'Project Requisition', dept: 'Requiring Authority', time: '15 Days', doc: 'DPR & Alignment Map' },
    { id: 2, name: 'Corridor Identification', dept: 'Project Agency', time: '10 Days', doc: 'Form A Requisition' },
    { id: 3, name: 'Preliminary Cadastral Survey', dept: 'Revenue Dept', time: '20 Days', doc: 'Survey Boundaries' },
    { id: 4, name: 'Khasra Identification', dept: 'District Collector', time: '15 Days', doc: 'Survey Register' },
    { id: 5, name: 'RoR Ownership Audit', dept: 'Tehsildar Office', time: '15 Days', doc: 'Khata/Record of Rights' },
    { id: 6, name: 'Proposal Submission', dept: 'Acquiring Body', time: '5 Days', doc: 'Form B Application' },
    { id: 7, name: 'Administrative Scrutiny', dept: 'State Land Cell', time: '15 Days', doc: 'Scrutiny Report' },
    { id: 8, name: 'State Sanction Order', dept: 'State Cabinet', time: '30 Days', doc: 'Administrative Sanction' },
    { id: 9, name: 'Gazette Sec 11 Notification', dept: 'Gazette Authority', time: '30 Days', doc: 'Gazette Form 3A/3D' },
    { id: 10, name: 'Sec 15 Objections & Hearing', dept: 'District Legal Cell', time: '60 Days', doc: 'Hearing Orders' },
    { id: 11, name: 'Land Valuation Matrix', dept: 'Valuation Committee', time: '20 Days', doc: 'Valuation Rate Chart' },
    { id: 12, name: 'Compensation Draft Assessment', dept: 'Acquisition Collector', time: '15 Days', doc: 'Form C Assessment' },
    { id: 13, name: 'Section 23 Award Declaration', dept: 'District Magistrate', time: '30 Days', doc: 'Statutory Award Order' },
    { id: 14, name: 'PFMS Compensation Payment', dept: 'Finance / PFMS', time: '30 Days', doc: 'DBT Voucher' },
    { id: 15, name: 'Physical Possession Takeover', dept: 'Revenue Collector', time: '15 Days', doc: 'Possession Deed' },
    { id: 16, name: 'R&R Package Execution', dept: 'R&R Administrator', time: '60 Days', doc: 'R&R Entitlement Book' },
    { id: 17, name: 'Land Handover Deed', dept: 'District Collector', time: '10 Days', doc: 'Handover Deed' },
    { id: 18, name: 'Final Project Closure', dept: 'Ministry / N-LAMS', time: '15 Days', doc: 'Closure Certificate' }
  ];

  return (
    <div className="bg-[#0f172a] text-slate-100 rounded-2xl p-6 shadow-xl border border-slate-800 my-6">
      {/* Header with Research 1 Pill */}
      <div className="flex flex-wrap justify-between items-center pb-5 mb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 font-black text-[10px] px-2.5 py-1 rounded uppercase tracking-wider">
              Research Phase 1 — Lifecycle & AI Pipeline
            </span>
            <h2 className="text-xl font-bold font-serif text-white flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-blue-400" />
              Land Acquisition Lifecycle & PS 17 Data Pipeline
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Foundation of N-LAMS: Capturing operational acquisition data (PS 16) to feed PS 17 predictive intelligence.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 gap-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'pipeline' ? 'bg-blue-600 text-white font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>13-Stage Operational Pipeline</span>
          </button>

          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'matrix' ? 'bg-blue-600 text-white font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span>PS16 → PS17 AI Feature Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('mobile')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'mobile' ? 'bg-blue-600 text-white font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>Field Survey Mobile App</span>
          </button>

          <button
            onClick={() => setActiveTab('legal')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'legal' ? 'bg-blue-600 text-white font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>18-Stage RFCTLARR Compliance</span>
          </button>
        </div>
      </div>

      {/* TAB 1: 13-STAGE OPERATIONAL PIPELINE */}
      {activeTab === 'pipeline' && (
        <div>
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 mb-6 flex flex-wrap justify-between items-center text-xs">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></span>
              <span className="font-semibold text-slate-300">
                Conceptual Lifecycle: Project Requisition → DILRMP Verification → Compensation → R&R → Handover
              </span>
            </div>
            <div className="bg-blue-950 text-blue-300 border border-blue-800 px-3 py-1 rounded-full font-extrabold text-[11px]">
              DILRMP & PARIVESH Integration Active
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 6 Cols: Stage List */}
            <div className="lg:col-span-6 space-y-2 max-h-[550px] overflow-y-auto pr-2 scrollbar-thin">
              {operationalStages.map((st) => {
                const isSelected = activeStage === st.id;
                return (
                  <div
                    key={st.id}
                    onClick={() => setActiveStage(st.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-950/80 border-blue-500 shadow-md ring-1 ring-blue-400/50'
                        : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                          isSelected ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {st.id}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-white flex items-center gap-2">
                          {st.name}
                          <span className="text-[9px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-normal">
                            {st.badge}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[280px]">
                          {st.action}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-blue-400 translate-x-1' : 'text-slate-600'}`} />
                  </div>
                );
              })}
            </div>

            {/* Right 6 Cols: Active Stage Details Card */}
            {(() => {
              const current = operationalStages.find((s) => s.id === activeStage) || operationalStages[0];
              return (
                <div className="lg:col-span-6 bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-800 mb-4">
                      <span className="text-xs font-black text-blue-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Layers className="w-4 h-4" /> Operational Stage Inspector
                      </span>
                      <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded">
                        Stage {current.id} of 13
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white font-serif mb-2">{current.name}</h3>
                    <p className="text-xs text-slate-300 mb-4 bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <strong className="text-blue-400 block mb-1">Operational Activity:</strong>
                      {current.action}
                    </p>

                    <div className="space-y-3 text-xs">
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <span className="text-slate-400 text-[10px] block font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                          <Database className="w-3 h-3 text-emerald-400" /> Data Generated (PS 16 Digital Record)
                        </span>
                        <code className="text-emerald-300 font-mono text-[11px] block break-all">
                          {current.data}
                        </code>
                      </div>

                      <div className="bg-amber-950/40 border border-amber-800/50 p-3 rounded-xl">
                        <span className="text-amber-400 text-[10px] block font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Potential Delay Bottleneck
                        </span>
                        <p className="text-amber-200 text-xs">{current.delay}</p>
                      </div>

                      <div className="bg-blue-950/60 border border-blue-800/60 p-3 rounded-xl">
                        <span className="text-blue-400 text-[10px] block font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                          <Cpu className="w-3.5 h-3.5 text-blue-400" /> Derived PS 17 Predictive AI Feature
                        </span>
                        <div className="flex items-center justify-between">
                          <code className="text-blue-200 font-mono font-bold text-xs bg-blue-900/50 px-2 py-1 rounded border border-blue-700">
                            feature_name: "{current.aiFeature}"
                          </code>
                          <span className="text-[10px] text-blue-300 font-bold">Feeds XGBoost Model</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center text-xs">
                    <button
                      disabled={activeStage === 1}
                      onClick={() => setActiveStage((prev) => Math.max(1, prev - 1))}
                      className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg font-bold disabled:opacity-40 hover:bg-slate-700"
                    >
                      ← Previous Stage
                    </button>
                    <button
                      disabled={activeStage === 13}
                      onClick={() => setActiveStage((prev) => Math.min(13, prev + 1))}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-lg font-bold disabled:opacity-40 hover:bg-blue-500"
                    >
                      Next Stage →
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* TAB 2: PS16 -> PS17 AI FEATURE MATRIX TABLE */}
      {activeTab === 'matrix' && (
        <div className="space-y-4">
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
            <strong className="text-amber-400 font-bold block mb-1 text-sm">
              The SIH Core Pitch Story: Connecting Operational PS 16 to Predictive PS 17
            </strong>
            <p>
              "PS 16 continuously captures operational data across the 13-stage land acquisition lifecycle. 
              We transform this structured historical and real-time transaction data into continuous predictive features for PS 17's Machine Learning Risk Engine."
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-200 uppercase tracking-wider text-[10px] font-bold border-b border-slate-800">
                <tr>
                  <th className="p-3">Stage #</th>
                  <th className="p-3">Stage Name</th>
                  <th className="p-3">What Happens (Operational Action)</th>
                  <th className="p-3">Data Generated (PS 16)</th>
                  <th className="p-3">Delay Risk Possibility</th>
                  <th className="p-3 text-amber-400">Potential AI Feature (PS 17)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-950/60 font-medium">
                {operationalStages.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-900/80 transition-colors">
                    <td className="p-3 font-bold text-slate-400">#{st.id}</td>
                    <td className="p-3 font-bold text-white whitespace-nowrap">{st.name}</td>
                    <td className="p-3 text-slate-300 min-w-[180px]">{st.action}</td>
                    <td className="p-3 font-mono text-emerald-400 text-[11px] min-w-[160px]">{st.data}</td>
                    <td className="p-3 text-amber-300/90 text-[11px] min-w-[160px]">{st.delay}</td>
                    <td className="p-3 font-mono font-bold text-blue-300 bg-blue-950/40 border-l border-slate-800">
                      {st.aiFeature}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: MOBILE FIELD OFFICER INTERFACE PREVIEW */}
      {activeTab === 'mobile' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Explanation */}
          <div className="lg:col-span-6 space-y-4 text-xs text-slate-300">
            <h3 className="text-lg font-bold text-white font-serif">
              Mobile Field Officer App (Stage 4 & Stage 13 Verification)
            </h3>
            <p>
              Provides field survey officers with a mobile-responsive interface for real-time data collection, 
              geo-tagged photo capture, GPS boundary verification, and R&R entitlement audits directly at the plot level.
            </p>

            <div className="space-y-2">
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-bold">Offline & GPS Geo-fencing</strong>
                  <span>Captures accurate latitude/longitude and stores parcel evidence offline until connectivity is restored.</span>
                </div>
              </div>

              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-start gap-3">
                <Database className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-bold">DILRMP Integration</strong>
                  <span>Auto-populates survey numbers, Khata details, and registered owner names from state land record APIs.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Mobile Screen Mockup */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-[300px] bg-slate-950 rounded-[36px] border-4 border-slate-700 p-4 shadow-2xl space-y-3">
              {/* Phone Header Notch */}
              <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-2"></div>
              
              <div className="bg-blue-900/60 p-2.5 rounded-xl border border-blue-700 flex justify-between items-center text-xs">
                <div>
                  <div className="text-[10px] text-blue-300 font-bold">FIELD OFFICER APP</div>
                  <div className="font-bold text-white text-xs">Parcel # P-1042 / Sur-1042/B</div>
                </div>
                <span className="bg-emerald-500 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded">GPS ACTIVE</span>
              </div>

              <div className="space-y-2 text-[11px] text-slate-300">
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Village:</span>
                    <span className="font-bold text-white">Kuvadva, Rajkot</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Area Verified:</span>
                    <span className="font-bold text-emerald-400">2.4 Hectares</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Registered Owner:</span>
                    <span className="font-bold text-white">Suresh & Bhavesh Patel</span>
                  </div>
                </div>

                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 space-y-1.5">
                  <div className="text-[10px] text-amber-400 font-bold uppercase">Field Check Checklist</div>
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Boundaries Geo-tagged (23.0225, 72.5714)
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Residential Structure Photo Uploaded
                  </div>
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <AlertTriangle className="w-3.5 h-3.5" /> Legal Dispute Flagged (High Court)
                  </div>
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-xl font-bold text-xs transition-colors shadow">
                  Submit Field Survey Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: 18-STAGE STATUTORY RFCTLARR COMPLIANCE */}
      {activeTab === 'legal' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Mandatory Legal Steps under RFCTLARR Act 2013</span>
            <span className="font-bold text-amber-400">Statutory Max Timeframe: 12 Months</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {legalStages.map((st) => {
              const isSelected = activeLegalStage === st.id;
              return (
                <button
                  key={st.id}
                  onClick={() => setActiveLegalStage(st.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between h-20 ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-400 shadow-lg ring-2 ring-blue-300'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex justify-between items-center w-full text-[9px]">
                    <span className="font-black px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                      Step {st.id}
                    </span>
                    <span className="opacity-80 font-bold">{st.time}</span>
                  </div>
                  <div className="font-bold text-[11px] leading-tight truncate">{st.name}</div>
                  <div className="text-[9px] opacity-75 truncate">{st.doc}</div>
                </button>
              );
            })}
          </div>

          {/* Legal Inspector Box */}
          {(() => {
            const leg = legalStages.find((l) => l.id === activeLegalStage) || legalStages[8];
            return (
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-blue-400 font-extrabold uppercase tracking-widest block">
                    Legal Compliance Details (Step #{leg.id})
                  </span>
                  <div className="text-base font-bold text-white">{leg.name}</div>
                  <div className="text-slate-400">Responsible Body: {leg.dept} | Statutory Limit: {leg.time}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Mandatory Document</span>
                  <span className="font-mono font-bold text-amber-300">{leg.doc}</span>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
