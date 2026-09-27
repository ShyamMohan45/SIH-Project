import React, { useState } from 'react';
import {
  GitBranch, CheckCircle2, Clock, AlertTriangle, ChevronRight, ShieldAlert,
  FileText, Calendar, Building2, User, ArrowRight, Info, AlertOctagon,
  Eye, Download, ZoomIn, X, ShieldCheck, MapPin
} from 'lucide-react';

export default function StatutoryLifecyclePage({ onSelectProject }) {
  const [selectedProjectId, setSelectedProjectId] = useState('NH-GJ-2026-001');
  const [activeStageId, setActiveStageId] = useState('s19');
  const [previewImage, setPreviewImage] = useState(null);

  const projects = [
    { id: 'NH-GJ-2026-001', name: 'Ahmedabad–Rajkot Green Highway Expansion (NH-GJ-2026-001)', state: 'Gujarat', currentStage: 'Section 19 (Declaration Published)' },
    { id: 'MH-RAIL-2026-014', name: 'Mumbai–Pune Dedicated Freight Logistics Corridor (MH-RAIL-2026-014)', state: 'Maharashtra', currentStage: 'Section 15 (Objections Hearing)' },
    { id: 'DL-EXP-2026-003', name: 'Delhi–Dehradun Economic Expressway Pkg-3 (DL-EXP-2026-003)', state: 'Delhi/UK', currentStage: 'Section 23 (Award Enquiry)' },
  ];

  const stages = [
    {
      id: 's4',
      stepNumber: 1,
      section: 'Section 4',
      title: 'Social Impact Assessment (SIA)',
      statutoryLimit: '6 Months',
      legalCeiling: 'Mandatory before Section 11',
      description: 'Consultation with local Panchayat / Municipal body, public hearings, and assessment of whether land serves public purpose and minimal displacement.',
      status: 'COMPLETED',
      completedDate: '2025-03-20',
      daysTaken: 154,
      lapseRisk: 'NONE',
      authority: 'Director, State SIA Cell',
      keyOutput: 'Final SIA Study & Social Impact Management Plan (SIMP)',
      image: {
        url: '/assets/images/statutory/cadastral_survey_dgps.jpg',
        title: 'SIA Cadastral Alignment & Drone Orthomosaic',
        caption: 'High-resolution drone orthomosaic verifying multi-village alignment corridor and minimal habitational displacement.',
        badge: 'SIA SPATIAL EVIDENCE',
        sha256: 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0'
      }
    },
    {
      id: 's6',
      stepNumber: 2,
      section: 'Section 6',
      title: 'Expert Group Appraisal of SIA',
      statutoryLimit: '2 Months',
      legalCeiling: 'Statutory recommendation within 60 days',
      description: 'Evaluation by 7-member independent multi-disciplinary committee including non-official social scientists and rehabilitation experts.',
      status: 'COMPLETED',
      completedDate: '2025-05-12',
      daysTaken: 53,
      lapseRisk: 'NONE',
      authority: 'Independent Expert Group',
      keyOutput: 'Form VII Recommendation Report submitted to State Govt',
      image: {
        url: '/assets/images/statutory/cadastral_survey_dgps.jpg',
        title: 'Multi-Disciplinary Expert Group Boundary Verification',
        caption: 'Expert committee evaluation confirming public interest for 45-meter Right-of-Way along NH-GJ-2026-001.',
        badge: 'EXPERT APPRAISAL',
        sha256: 'e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f60718293a4b5c'
      }
    },
    {
      id: 's7',
      stepNumber: 3,
      section: 'Section 7',
      title: 'Government Examination of SIA',
      statutoryLimit: 'Immediate',
      legalCeiling: 'Pre-condition to proceed',
      description: 'Competent state/central department verifies that minimum required area is proposed and no viable alternative unutilized government land exists.',
      status: 'COMPLETED',
      completedDate: '2025-05-28',
      daysTaken: 16,
      lapseRisk: 'NONE',
      authority: 'Revenue & Disaster Management Dept',
      keyOutput: 'Administrative Approval & Sanction Memo',
      image: {
        url: '/assets/images/statutory/cadastral_survey_dgps.jpg',
        title: 'State Revenue Department Administrative Examination',
        caption: 'Cadastral land availability audit verifying optimal highway geometric alignment.',
        badge: 'GOVT SANCTION',
        sha256: 'f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f60718293a4b5c6d'
      }
    },
    {
      id: 's8',
      stepNumber: 4,
      section: 'Section 8',
      title: 'Government Decision on Acquisition',
      statutoryLimit: '30 Days',
      legalCeiling: 'Record reasons if overriding Expert Group',
      description: 'Formal executive determination that potential benefits outweigh social costs and proceeding with notification is warranted.',
      status: 'COMPLETED',
      completedDate: '2025-06-05',
      daysTaken: 8,
      lapseRisk: 'NONE',
      authority: 'Principal Secretary (Revenue)',
      keyOutput: 'Cabinet / Ministerial Approval Order',
      image: {
        url: '/assets/images/statutory/cadastral_survey_dgps.jpg',
        title: 'Executive Decision Memo & RoW Corridor Demarcation',
        caption: 'Formal government determination approving acquisition of 142.0 Ha across 52 parcels.',
        badge: 'CABINET ORDER',
        sha256: 'a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f60718293a4b5c6d7e'
      }
    },
    {
      id: 's11',
      stepNumber: 5,
      section: 'Section 11',
      title: 'Preliminary Notification Publication',
      statutoryLimit: '12 Months post SIA',
      legalCeiling: 'Lapse of SIA if not published within 12 months',
      description: 'Publication in Official Gazette, two regional newspapers, Gram Panchayat, and online portal. Freezes land transactions and transactions made thereafter are void.',
      status: 'COMPLETED',
      completedDate: '2025-06-15',
      daysTaken: 10,
      lapseRisk: 'NONE',
      authority: 'District Collector & CALA',
      keyOutput: 'Gazette Extraordinary No. GJ-SRN-11-2025',
      image: {
        url: '/assets/images/statutory/gazette_section_19.jpg',
        title: 'Section 11(1) Official Gazette Extraordinary Publication',
        caption: 'Published in Gujarat Rajpatra and regional dailies freezing transactions across 52 parcels in Limbdi taluka.',
        badge: 'GAZETTE NOTIFICATION',
        sha256: 'b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f60718293a4b5c6d7e8f'
      }
    },
    {
      id: 's15',
      stepNumber: 6,
      section: 'Section 15',
      title: 'Hearing of Objections by Collector',
      statutoryLimit: '60 Days',
      legalCeiling: 'Strict 60-day window for affected persons to file',
      description: 'Hearing individual title, boundary, and public interest objections filed by landowners. Collector submits report and recommendations to appropriate government.',
      status: 'COMPLETED',
      completedDate: '2025-09-18',
      daysTaken: 95,
      lapseRisk: 'RESOLVED_DELAY',
      authority: 'Competent Authority for Land Acquisition (CALA)',
      keyOutput: 'Section 15(2) Enquiry Report & Recommendation Record',
      image: {
        url: '/assets/images/statutory/section_15_hearing.jpg',
        title: 'Official Record of Section 15 Objection Hearing (CALA Surendranagar)',
        caption: 'Proceeding minutes hearing Khasra 1042 title dispute and directing fast-track Lok Adalat mediation.',
        badge: 'HEARING MINUTES',
        sha256: 'c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f60718293a4b5c6d7e8f90'
      }
    },
    {
      id: 's19',
      stepNumber: 7,
      section: 'Section 19',
      title: 'Final Declaration of Acquisition',
      statutoryLimit: '12 Months post Sec 11',
      legalCeiling: 'CRITICAL: Entire acquisition lapses if expired!',
      description: 'Formal statutory declaration that land is required for a public purpose. Must be published within 12 months of Section 11, otherwise acquisition proceedings lapse in toto.',
      status: 'IN_PROGRESS',
      completedDate: 'Pending (Nov 2025 gazetted)',
      daysTaken: 148,
      lapseRisk: 'HIGH_ATTENTION',
      authority: 'State Govt & Appropriate Authority',
      keyOutput: 'Section 19 Declaration & Summary of Rehabilitation Scheme',
      image: {
        url: '/assets/images/statutory/gazette_section_19.jpg',
        title: 'Sealed Gujarat Government Gazette Extraordinary — Section 19(1)',
        caption: 'Notification No. REV-LA/GJ-SRN-2025/19-108 declaring 118.40 Ha across 42 cadastral plots including Khasra 1042.',
        badge: 'GAZETTE NOTIFICATION',
        sha256: '9f83a81b2c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f'
      }
    },
    {
      id: 's21',
      stepNumber: 8,
      section: 'Section 21',
      title: 'Public Notice for Claims & Measurement',
      statutoryLimit: '30 to 60 Days',
      legalCeiling: 'Mandatory personal service to all recorded occupants',
      description: 'Notice to persons interested to appear personally or by agent before the Collector to state the nature of their respective interests and amount of compensation claimed.',
      status: 'PENDING',
      completedDate: 'Target: Apr 2026',
      daysTaken: 0,
      lapseRisk: 'NONE',
      authority: 'Sub-Divisional Magistrate / CALA',
      keyOutput: 'Form IX Individual Claim Notices',
      image: {
        url: '/assets/images/statutory/cadastral_survey_dgps.jpg',
        title: 'Field Claim Notices & Cadastral Demarcation Pillars',
        caption: 'Individual notices served to PAFs with on-ground GPS boundary pillars for claim hearings.',
        badge: 'CLAIM NOTICES',
        sha256: 'd6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f60718293a4b5c6d7e8f9012'
      }
    },
    {
      id: 's23',
      stepNumber: 9,
      section: 'Section 23',
      title: 'Enquiry & Award Determination',
      statutoryLimit: '12 Months post Sec 19',
      legalCeiling: 'Acquisition lapses if award not made within 12 months',
      description: 'Collector determines true area, market value under Section 26, multiplier factor under First Schedule, 100% solatium under Section 30, and 12% additional compensation.',
      status: 'PENDING',
      completedDate: 'Target: Jul 2026',
      daysTaken: 0,
      lapseRisk: 'WATCH',
      authority: 'District Collector',
      keyOutput: 'Section 23 Official Award Statement',
      image: {
        url: '/assets/images/statutory/section_23_award.jpg',
        title: 'Form XI - Statutory Land Acquisition Award & PFMS Disbursal Schedule',
        caption: 'Full statutory valuation with 100% solatium verification (₹4,25,06,000 for Khasra 1042 cluster).',
        badge: 'AWARD STATEMENT',
        sha256: 'e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f60718293a4b5c6d7e8f901234'
      }
    },
    {
      id: 's38',
      stepNumber: 10,
      section: 'Section 38',
      title: 'Taking Possession post Full Payment',
      statutoryLimit: 'Prompt post DBT',
      legalCeiling: 'Possession illegal until 100% monetary compensation disbursed',
      description: 'Collector takes possession only after full compensation has been paid or deposited in escrow bank accounts and infrastructural amenities under Second Schedule are provided.',
      status: 'PENDING',
      completedDate: 'Target: Sep 2026',
      daysTaken: 0,
      lapseRisk: 'NONE',
      authority: 'District Administration & NHAI / MoRTH',
      keyOutput: 'Possession Certificate & Mutation in Revenue Records',
      image: {
        url: '/assets/images/statutory/cadastral_survey_dgps.jpg',
        title: 'Physical Right-of-Way Site Handover Certificate',
        caption: 'Physical possession certificate and revenue 7/12 mutation transfer to National Highways Authority.',
        badge: 'POSSESSION ORDER',
        sha256: 'f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f60718293a4b5c6d7e8f90123456'
      }
    }
  ];

  const activeStage = stages.find(s => s.id === activeStageId) || stages[6];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase">
                RFCTLARR Act 2013 Statutory Engine
              </span>
              <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1">
                <AlertOctagon className="w-3 h-3 text-amber-600" />
                Section 19 Statutory Lapse Prevention Monitor
              </span>
            </div>
            <h1 className="text-2xl font-black text-[#0b2545] font-serif">
              Statutory Land Acquisition Lifecycle
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              End-to-end 10-stage mandatory statutory pipeline tracking legal ceilings, expiry countdowns, and procedural validity.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-700">Select Project:</label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 10-Stage Horizontal Tracker / Progress Bar */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
            Milestone Sequence (Click any stage to inspect statutory evidence & official documents)
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-1.5">
            {stages.map((st) => {
              const isSelected = activeStageId === st.id;
              return (
                <button
                  key={st.id}
                  onClick={() => setActiveStageId(st.id)}
                  className={`p-2 rounded-lg text-left transition-all border ${
                    isSelected
                      ? 'bg-[#0b2545] text-white border-[#0b2545] shadow-xs'
                      : st.status === 'COMPLETED'
                      ? 'bg-emerald-50/70 border-emerald-200 text-slate-800 hover:bg-emerald-100/60'
                      : st.status === 'IN_PROGRESS'
                      ? 'bg-amber-50 border-amber-300 text-slate-900 ring-1 ring-amber-400'
                      : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[9px] font-mono font-bold ${isSelected ? 'text-blue-200' : 'text-slate-500'}`}>
                      #{st.stepNumber}
                    </span>
                    {st.status === 'COMPLETED' ? (
                      <CheckCircle2 className={`w-3 h-3 ${isSelected ? 'text-emerald-300' : 'text-emerald-600'}`} />
                    ) : st.status === 'IN_PROGRESS' ? (
                      <Clock className={`w-3 h-3 ${isSelected ? 'text-amber-300' : 'text-amber-600 animate-spin'}`} />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-300" />
                    )}
                  </div>
                  <div className="font-bold text-[11px] leading-tight truncate">{st.section}</div>
                  <div className={`text-[9px] mt-0.5 truncate ${isSelected ? 'text-slate-200' : 'text-slate-500'}`}>
                    {st.title}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Deep Stage Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Detailed Stage Dossier & Official Evidence Visual */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-900 font-bold text-xs px-2.5 py-0.5 rounded">
                    Stage {activeStage.stepNumber} of 10
                  </span>
                  <span className="font-bold text-slate-900 text-base">{activeStage.section}: {activeStage.title}</span>
                </div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {activeStage.description}
                </p>
              </div>

              <span className={`shrink-0 text-xs font-black px-2.5 py-1 rounded-full uppercase ${
                activeStage.status === 'COMPLETED'
                  ? 'bg-emerald-100 text-emerald-800'
                  : activeStage.status === 'IN_PROGRESS'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {activeStage.status.replace('_', ' ')}
              </span>
            </div>

            {/* Statutory Legal Constraints Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Statutory Time Limit</div>
                <div className="text-sm font-black text-[#0b2545] mt-0.5">{activeStage.statutoryLimit}</div>
                <div className="text-[10px] text-slate-500 mt-1">{activeStage.legalCeiling}</div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Responsible Statutory Authority</div>
                <div className="text-sm font-black text-slate-800 mt-0.5">{activeStage.authority}</div>
                <div className="text-[10px] text-slate-500 mt-1">Designated under RFCTLARR Act Rules</div>
              </div>
            </div>

            {/* Key Legal Deliverable */}
            <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-lg">
              <div className="text-[10px] font-bold text-blue-900 uppercase">Statutory Instrument / Legal Output</div>
              <div className="text-xs font-black text-blue-950 mt-1 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-700 shrink-0" />
                {activeStage.keyOutput}
              </div>
            </div>

            {/* NEW: OFFICIAL STATUTORY DOCUMENT & CAD EVIDENCE PREVIEW */}
            {activeStage.image && (
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
                      {activeStage.image.badge}
                    </span>
                    <span className="text-xs font-bold text-slate-800">{activeStage.image.title}</span>
                  </div>
                  <button
                    onClick={() => setPreviewImage(activeStage.image)}
                    className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>View High-Res Document</span>
                  </button>
                </div>

                <div 
                  onClick={() => setPreviewImage(activeStage.image)}
                  className="relative group rounded-xl overflow-hidden border border-slate-300 shadow-sm cursor-pointer max-h-72 bg-slate-950"
                >
                  <img
                    src={activeStage.image.url}
                    alt={activeStage.image.title}
                    className="w-full h-64 object-cover object-top group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                    <div className="text-white space-y-1">
                      <div className="text-xs font-bold flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{activeStage.image.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 line-clamp-1">
                        {activeStage.image.caption}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Lapse Risk Alert if Section 19 or In Progress */}
            {activeStage.lapseRisk === 'HIGH_ATTENTION' && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-rose-900">RFCTLARR Statutory Lapse Penalty Warning</div>
                  <p className="text-[11px] text-rose-700 mt-0.5 leading-relaxed">
                    Under Section 19(7) of the 2013 Act, if no declaration is published within twelve months from the date of publication of the Section 11 preliminary notification, the entire proceedings for acquisition lapse automatically. N-LAMS early warning monitors this milestone with automated escalation.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Timeline & Cadastral Progress + Visual Document Card */}
        <div className="space-y-4">
          {/* Visual Snapshot Card */}
          {activeStage.image && (
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-slate-500">Statutory Artifact Preview</span>
                <span className="text-[9px] font-mono font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                  VERIFIED
                </span>
              </div>

              <div 
                onClick={() => setPreviewImage(activeStage.image)}
                className="rounded-lg overflow-hidden border border-slate-200 shadow-2xs relative group cursor-pointer"
              >
                <img
                  src={activeStage.image.url}
                  alt={activeStage.image.title}
                  className="w-full h-36 object-cover object-top group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs gap-1.5">
                  <ZoomIn className="w-4 h-4" />
                  <span>Inspect Scan</span>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <div className="font-bold text-slate-900 text-[11px] leading-tight">{activeStage.image.title}</div>
                <div className="text-[10px] font-mono text-slate-500 break-all">
                  SHA-256: {activeStage.image.sha256.substring(0, 16)}...
                </div>
              </div>
            </div>
          )}

          {/* Cadastral Progress at this Stage */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              Cadastral Progress at this Stage
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600">Parcels Cleared:</span>
                  <span className="font-bold text-slate-900">42 / 52 Parcels (80.7%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '80.7%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600">Area Gazetted:</span>
                  <span className="font-bold text-slate-900">118.4 Ha / 142.0 Ha</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '83.3%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600">Pending Under Section 15 Hearing:</span>
                  <span className="font-bold text-amber-700">10 Parcels (19.3%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '19.3%' }} />
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <button
                onClick={() => onSelectProject && onSelectProject(selectedProjectId)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <span>View Full Project Dossier</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FULLSCREEN IMAGE MODAL PREVIEW */}
      {previewImage && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-300 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="bg-blue-100 text-blue-900 font-bold text-xs px-2 py-0.5 rounded">
                  {previewImage.badge}
                </span>
                <h3 className="font-bold text-slate-900 text-sm">{previewImage.title}</h3>
              </div>
              <button
                onClick={() => setPreviewImage(null)}
                className="p-1 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image Body */}
            <div className="overflow-y-auto p-4 flex-1 bg-slate-900 flex flex-col items-center justify-center">
              <img
                src={previewImage.url}
                alt={previewImage.title}
                className="max-w-full max-h-[60vh] object-contain rounded-lg border border-slate-700 shadow-lg"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <p className="text-slate-700 font-medium">{previewImage.caption}</p>
                <div className="text-[10px] font-mono text-slate-400 break-all">
                  Cryptographic SHA-256 Digest: {previewImage.sha256}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert('Downloading official high-resolution statutory record PDF...')}
                  className="px-3.5 py-1.5 bg-[#0b2545] hover:bg-[#12315b] text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Record</span>
                </button>
                <button
                  onClick={() => setPreviewImage(null)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg border border-slate-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
