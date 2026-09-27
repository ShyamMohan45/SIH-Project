import React, { useState } from 'react';
import { 
  Play, CheckCircle2, AlertTriangle, ShieldCheck, FileText, Map, Cpu, 
  ArrowRight, RotateCcw, Upload, Users, Scale, DollarSign, Activity, Lock, Layers, Building
} from 'lucide-react';

export default function ClosedLoopGovernanceDemo({ onNavigateToTab }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [demoState, setDemoState] = useState({
    userRole: 'State Government',
    jurisdiction: 'Gujarat State',
    projectStatus: 'UNDER_ACQUISITION',
    riskScore: 82,
    predictedDelayDays: 74,
    objectionCount: 18,
    compensationDisbursedPct: 62.4,
    possessionPct: 62.4,
    interventionExecuted: false,
    documentsUploaded: [
      { name: 'NH_GJ_2026_DPR.pdf', version: 'v1', status: 'VERIFIED', uploadedBy: 'State Officer' },
      { name: 'Land_Requirement_Report.pdf', version: 'v1', status: 'VERIFIED', uploadedBy: 'State Officer' },
      { name: 'Gazette_3A_3D_Draft.pdf', version: 'v2', status: 'PENDING_APPROVAL', uploadedBy: 'Acquisition Officer' }
    ]
  });

  const demoSteps = [
    { id: 1, name: '1. Role Scoping & Login', desc: 'Central Admin vs State Officer RBAC Scoping' },
    { id: 2, name: '2. Project Requisition', desc: 'State submits NH-GJ-2026-001 Requisition' },
    { id: 3, name: '3. Document Audit Vault', desc: 'Upload DPR, Land Report & SHA-256 Hash' },
    { id: 4, name: '4. Two-Way Scrutiny', desc: 'Central Approval & Request Clarification' },
    { id: 5, name: '5. GIS Parcel Identification', desc: 'Cadastral GIS mapping & P-1042 Red Flag' },
    { id: 6, name: '6. Field Officer Mobile Survey', desc: 'GPS & Photo Verification at Plot P-1042' },
    { id: 7, name: '7. Gazette Notification', desc: 'Auto-pulling 142 verified parcels into 3A/3D' },
    { id: 8, name: '8. Legal & Backlog Detection', desc: 'Section 15 disputes & Compensation lag' },
    { id: 9, name: '9. PS17 AI Risk & XAI Engine', desc: 'XGBoost 82% Risk & SHAP Feature Attribution' },
    { id: 10, name: '10. Closed-Loop Intervention', desc: 'Execute Mitigation → Risk Drops to 8% 🟢' }
  ];

  const handleExecuteIntervention = () => {
    setDemoState(prev => ({
      ...prev,
      riskScore: 8,
      predictedDelayDays: 0,
      objectionCount: 2,
      compensationDisbursedPct: 100,
      possessionPct: 100,
      projectStatus: 'COMPLETED',
      interventionExecuted: true
    }));
  };

  const handleResetDemo = () => {
    setDemoState({
      userRole: 'State Government',
      jurisdiction: 'Gujarat State',
      projectStatus: 'UNDER_ACQUISITION',
      riskScore: 82,
      predictedDelayDays: 74,
      objectionCount: 18,
      compensationDisbursedPct: 62.4,
      possessionPct: 62.4,
      interventionExecuted: false,
      documentsUploaded: [
        { name: 'NH_GJ_2026_DPR.pdf', version: 'v1', status: 'VERIFIED', uploadedBy: 'State Officer' },
        { name: 'Land_Requirement_Report.pdf', version: 'v1', status: 'VERIFIED', uploadedBy: 'State Officer' },
        { name: 'Gazette_3A_3D_Draft.pdf', version: 'v2', status: 'PENDING_APPROVAL', uploadedBy: 'Acquisition Officer' }
      ]
    });
    setCurrentStep(1);
  };

  return (
    <div className="bg-[#0b1a30] text-slate-100 rounded-2xl p-6 shadow-2xl border border-slate-800 my-6">
      {/* Demo Header */}
      <div className="flex flex-wrap justify-between items-center pb-5 mb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow">
              SIH Live Interactive Demo Mode
            </span>
            <h2 className="text-xl font-bold font-serif text-white flex items-center gap-2">
              <Play className="w-5 h-5 text-amber-400 fill-amber-400" />
              N-LAMS Closed-Loop Governance Simulation
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Walkthrough project <strong className="text-blue-300">NH-GJ-2026-001 (Ahmedabad–Rajkot Green Highway)</strong> through the end-to-end 10-step lifecycle.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDemo}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold flex items-center gap-1 border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Demo
          </button>
        </div>
      </div>

      {/* 10-Step Horizontal Stepper Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-1.5 mb-6">
        {demoSteps.map((step) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          return (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className={`p-2 rounded-xl text-left border transition-all flex flex-col justify-between h-16 ${
                isActive
                  ? 'bg-blue-600 border-blue-400 text-white shadow-lg ring-2 ring-blue-400/50 scale-[1.03]'
                  : isCompleted
                  ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300 hover:bg-emerald-900/50'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between text-[9px] font-black">
                <span>STEP {step.id}</span>
                {isCompleted && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
              </div>
              <div className="text-[10px] font-bold leading-tight truncate">{step.name.split('. ')[1]}</div>
            </button>
          );
        })}
      </div>

      {/* Step Content Container */}
      <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800">
        
        {/* STEP 1: ROLE SCOPING */}
        {currentStep === 1 && (
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <span className="text-amber-400 font-extrabold uppercase tracking-widest text-[10px]">
                Step 1 of 10 — Role-Based Access Control (RBAC) Scoping
              </span>
              <span className="bg-blue-950 text-blue-300 px-2.5 py-0.5 rounded font-mono font-bold">
                Role: {demoState.userRole} ({demoState.jurisdiction})
              </span>
            </div>

            <p className="text-slate-300 leading-relaxed">
              N-LAMS enforces multi-tenant Role-Based Access Control (RBAC). The same application automatically adapts UI dashboards, parcel permissions, and approval actions depending on the authenticated official.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <button
                onClick={() => setDemoState(prev => ({ ...prev, userRole: 'Central Government', jurisdiction: 'All India' }))}
                className={`p-4 rounded-xl border text-left transition-all ${
                  demoState.userRole === 'Central Government'
                    ? 'bg-blue-950 border-blue-500 text-white ring-2 ring-blue-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <ShieldCheck className="w-6 h-6 text-blue-400 mb-2" />
                <div className="font-bold text-sm text-white">Central Admin</div>
                <div className="text-[10px] opacity-75 mt-1">Scope: All India (2,840 Projects). National Dashboard & Policy Approvals.</div>
              </button>

              <button
                onClick={() => setDemoState(prev => ({ ...prev, userRole: 'State Government', jurisdiction: 'Gujarat State' }))}
                className={`p-4 rounded-xl border text-left transition-all ${
                  demoState.userRole === 'State Government'
                    ? 'bg-blue-950 border-blue-500 text-white ring-2 ring-blue-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Building className="w-6 h-6 text-emerald-400 mb-2" />
                <div className="font-bold text-sm text-white">State Officer (Gujarat)</div>
                <div className="text-[10px] opacity-75 mt-1">Scope: Gujarat (182 Projects). Project Creation & State Clearances.</div>
              </button>

              <button
                onClick={() => setDemoState(prev => ({ ...prev, userRole: 'Field Officer', jurisdiction: 'Rajkot District' }))}
                className={`p-4 rounded-xl border text-left transition-all ${
                  demoState.userRole === 'Field Officer'
                    ? 'bg-blue-950 border-blue-500 text-white ring-2 ring-blue-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Users className="w-6 h-6 text-amber-400 mb-2" />
                <div className="font-bold text-sm text-white">Field Survey Officer</div>
                <div className="text-[10px] opacity-75 mt-1">Scope: Rajkot District (Parcel P-1042). Mobile GPS Survey & Asset Audit.</div>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PROJECT REQUISITION */}
        {currentStep === 2 && (
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <span className="text-amber-400 font-extrabold uppercase tracking-widest text-[10px]">
                Step 2 of 10 — Project Requisition Submission
              </span>
              <span className="bg-emerald-950 text-emerald-300 px-2.5 py-0.5 rounded font-mono font-bold">
                Project ID: NH-GJ-2026-001
              </span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] block font-bold">Project Name</span>
                <span className="font-bold text-white">Ahmedabad–Rajkot Green Highway Expansion</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block font-bold">State / District</span>
                <span className="font-bold text-blue-300">Gujarat / Rajkot & Surendranagar</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block font-bold">Land Required</span>
                <span className="font-bold text-emerald-400">1,250.0 Hectares</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block font-bold">Affected Families</span>
                <span className="font-bold text-amber-400">2,400 Families</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: DOCUMENT VAULT */}
        {currentStep === 3 && (
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <span className="text-amber-400 font-extrabold uppercase tracking-widest text-[10px]">
                Step 3 of 10 — Document Vault & SHA-256 Audit Trail
              </span>
              <span className="bg-blue-950 text-blue-300 px-2.5 py-0.5 rounded font-mono font-bold">
                3 Mandatory Documents Uploaded
              </span>
            </div>

            <div className="space-y-2">
              {demoState.documentsUploaded.map((doc, idx) => (
                <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-400" />
                    <div>
                      <div className="font-bold text-white text-xs">{doc.name}</div>
                      <div className="text-[10px] text-slate-400">Version: {doc.version} | Uploaded by: {doc.uploadedBy}</div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded ${
                    doc.status === 'VERIFIED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: TWO-WAY SCRUTINY */}
        {currentStep === 4 && (
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <span className="text-amber-400 font-extrabold uppercase tracking-widest text-[10px]">
                Step 4 of 10 — Central Administrative Scrutiny & Approval
              </span>
              <span className="bg-emerald-950 text-emerald-300 px-2.5 py-0.5 rounded font-mono font-bold">
                Status: APPROVED BY MINISTRY
              </span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-white text-sm">Central Reviewer Decisions for Requisition #NH-GJ-2026-001</h4>
                <p className="text-slate-400 text-xs mt-1">DPR verified, alignment map validated against PM GatiShakti corridor layers.</p>
              </div>

              <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-bold">
                  ✓ APPROVED
                </button>
                <button className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg font-bold hover:bg-slate-700">
                  Request Clarification
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: GIS PARCEL IDENTIFICATION */}
        {currentStep === 5 && (
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <span className="text-amber-400 font-extrabold uppercase tracking-widest text-[10px]">
                Step 5 of 10 — GIS Cadastral Parcel Identification & High Risk Flag
              </span>
              <button
                onClick={() => onNavigateToTab('gis')}
                className="bg-blue-600 text-white px-3 py-1 rounded font-bold hover:bg-blue-500"
              >
                Open Full Interactive GIS Studio →
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-red-400 font-extrabold text-xs block">CRITICAL FLAG: PARCEL P-1042</span>
                <span className="text-slate-300 text-xs">Kuvadva Village, Rajkot | Area: 2.4 ha | Legal Case: LEG-2026-0042 (High Court)</span>
              </div>
              <span className="bg-red-950 text-red-300 border border-red-800 font-bold px-3 py-1 rounded">
                AI Risk: HIGH — 84%
              </span>
            </div>
          </div>
        )}

        {/* STEP 6: FIELD OFFICER MOBILE SURVEY */}
        {currentStep === 6 && (
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <span className="text-amber-400 font-extrabold uppercase tracking-widest text-[10px]">
                Step 6 of 10 — Field Officer Mobile GPS Verification
              </span>
              <span className="bg-emerald-950 text-emerald-300 px-2.5 py-0.5 rounded font-mono font-bold">
                GPS Captured: 23.0225° N, 72.5714° E
              </span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-white block">Field Survey Completed for Parcel P-1042</span>
                <span className="text-slate-400">Photos uploaded: 2 geo-tagged site images • Owner verified: Suresh & Bhavesh Patel</span>
              </div>
              <span className="bg-emerald-600 text-white font-bold px-3 py-1 rounded">VERIFIED ON GROUND</span>
            </div>
          </div>
        )}

        {/* STEP 7: GAZETTE NOTIFICATION */}
        {currentStep === 7 && (
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <span className="text-amber-400 font-extrabold uppercase tracking-widest text-[10px]">
                Step 7 of 10 — Gazette 3A / 3D Notification Auto-Generation
              </span>
              <span className="bg-blue-950 text-blue-300 px-2.5 py-0.5 rounded font-mono font-bold">
                142 Verified Parcels (326.4 ha)
              </span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-300 leading-relaxed">
              System automatically pulls verified parcel geometries and title deeds from DILRMP to generate Gazette Notification Form 3A/3D without manual re-typing.
            </div>
          </div>
        )}

        {/* STEP 8: LEGAL OBJECTIONS */}
        {currentStep === 8 && (
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <span className="text-amber-400 font-extrabold uppercase tracking-widest text-[10px]">
                Step 8 of 10 — Section 15 Legal Objections & Backlog Detection
              </span>
              <span className="bg-amber-950 text-amber-300 px-2.5 py-0.5 rounded font-mono font-bold">
                {demoState.objectionCount} Objections Pending
              </span>
            </div>

            <div className="bg-amber-950/40 border border-amber-800 p-4 rounded-xl text-amber-200">
              <strong>Bottleneck Detected:</strong> 18 landowners filed Section 15 compensation multiplier objections in Rajkot Collectorate. Legal delay probability spikes.
            </div>
          </div>
        )}

        {/* STEP 9: PS17 AI RISK & XAI ENGINE */}
        {currentStep === 9 && (
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <span className="text-amber-400 font-extrabold uppercase tracking-widest text-[10px]">
                Step 9 of 10 — PS17 AI Predictive Intelligence & Explainable AI (SHAP)
              </span>
              <span className="bg-red-950 text-red-300 px-2.5 py-0.5 rounded font-mono font-bold">
                Risk Score: {demoState.riskScore}% HIGH RISK ({demoState.predictedDelayDays} Days Delay)
              </span>
            </div>

            {/* XAI SHAP Breakdown */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-slate-400 text-[10px] font-bold block uppercase tracking-wider">
                XGBoost SHAP Feature Attribution Breakdown
              </span>
              <div className="space-y-1.5">
                <div>
                  <div className="flex justify-between text-[11px] mb-0.5">
                    <span className="text-slate-300">Pending Legal Objections (18 Cases)</span>
                    <span className="text-red-400 font-bold">+42% Contribution</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 w-[42%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-0.5">
                    <span className="text-slate-300">Compensation Payment Backlog (&gt;30 Days)</span>
                    <span className="text-amber-400 font-bold">+28% Contribution</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 w-[28%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-0.5">
                    <span className="text-slate-300">Administrative Approval Latency</span>
                    <span className="text-blue-400 font-bold">+18% Contribution</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[18%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 10: CLOSED-LOOP INTERVENTION */}
        {currentStep === 10 && (
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <span className="text-amber-400 font-extrabold uppercase tracking-widest text-[10px]">
                Step 10 of 10 — Closed-Loop Governance & AI Risk Reduction
              </span>
              <span className={`px-2.5 py-0.5 rounded font-mono font-bold ${
                demoState.riskScore === 8 ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-red-950 text-red-300 border border-red-800'
              }`}>
                Project Status: {demoState.projectStatus} (Risk: {demoState.riskScore}%)
              </span>
            </div>

            {!demoState.interventionExecuted ? (
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 text-center space-y-4">
                <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
                <div>
                  <h4 className="text-base font-bold text-white">Execute Recommended Decision-Support Interventions</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-lg mx-auto">
                    1. Deploy Dedicated District Legal Officer to resolve Section 15 objections.<br/>
                    2. Release PFMS compensation funds directly to 2,400 beneficiary accounts.<br/>
                    3. Issue final possession certificate.
                  </p>
                </div>

                <button
                  onClick={handleExecuteIntervention}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-black rounded-xl shadow-lg transition-all text-sm uppercase tracking-wider"
                >
                  ⚡ EXECUTE GOVERNANCE INTERVENTION NOW
                </button>
              </div>
            ) : (
              <div className="bg-emerald-950/60 border border-emerald-800 p-6 rounded-xl space-y-4 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <div>
                  <h4 className="text-lg font-bold text-white">CLOSED-LOOP GOVERNANCE SUCCESSFUL!</h4>
                  <p className="text-xs text-emerald-200 mt-1">
                    Intervention executed • Legal disputes resolved • Compensation 100% disbursed • Possession completed.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="bg-slate-900 p-3 rounded-lg border border-emerald-800">
                    <span className="text-slate-400 text-[10px] block">AI Delay Risk</span>
                    <span className="font-extrabold text-emerald-400 text-sm">8% LOW RISK 🟢</span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg border border-emerald-800">
                    <span className="text-slate-400 text-[10px] block">Compensation Paid</span>
                    <span className="font-extrabold text-emerald-400 text-sm">100% (₹ 690 Cr)</span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg border border-emerald-800">
                    <span className="text-slate-400 text-[10px] block">Land Possession</span>
                    <span className="font-extrabold text-emerald-400 text-sm">1,250 / 1,250 ha</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Stepper Footer Controls */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center text-xs">
          <button
            disabled={currentStep === 1}
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold disabled:opacity-40 hover:bg-slate-700 transition-colors"
          >
            ← Previous Step
          </button>

          <span className="text-slate-400 text-[11px] font-semibold">
            Step {currentStep} of 10: {demoSteps[currentStep - 1].name}
          </span>

          <button
            disabled={currentStep === 10}
            onClick={() => setCurrentStep(prev => Math.min(10, prev + 1))}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold disabled:opacity-40 hover:bg-blue-500 transition-colors shadow flex items-center gap-1.5"
          >
            <span>Next Step</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
