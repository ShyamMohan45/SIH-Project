import React from 'react';
import { CheckCircle2, Clock, AlertCircle, FileText, MapPin, Award, DollarSign, Home, Key, CheckCheck } from 'lucide-react';

export default function SingleWindowTracker({ currentStage = 6 }) {
  const stages = [
    { step: 1, name: 'Proposal Submission', icon: FileText, desc: 'Central/State DPR & Land Proposal' },
    { step: 2, name: 'Digital Scrutiny', icon: Clock, desc: 'Verification by Competent Authority' },
    { step: 3, name: 'Ministry Approval', icon: CheckCircle2, desc: 'Administrative Approval Issued' },
    { step: 4, name: 'GIS Parcel Mapping', icon: MapPin, desc: 'Cadastral Survey & Geo-tagging' },
    { step: 5, name: 'Gazette 3A/3D Notification', icon: FileText, desc: 'Public Notice Issued' },
    { step: 6, name: 'Hearing Objections', icon: AlertCircle, desc: 'Section 15 Legal Review (Active)' },
    { step: 7, name: 'Award Declaration', icon: Award, desc: 'Section 23 Compensation Award' },
    { step: 8, name: 'Compensation Payment', icon: DollarSign, desc: 'DBT Payment Disbursement' },
    { step: 9, name: 'R&R Progress', icon: Home, desc: 'Resettlement Entitlements' },
    { step: 10, name: 'Physical Possession', icon: Key, desc: 'Land Handover & Certificate' },
    { step: 11, name: 'Project Closure', icon: CheckCheck, desc: 'Final Milestone & Audit' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 my-4">
      <div className="flex flex-wrap justify-between items-center mb-4 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-amber-100 text-amber-900 font-extrabold text-xs px-2.5 py-1 rounded">
              PARIVESH Single-Window Standard
            </span>
            <h3 className="text-lg font-bold text-[#0b2545]">
              Land Acquisition Lifecycle Tracker — <span className="text-blue-700">NH-GJ-2026-001</span>
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Ahmedabad–Rajkot Green Highway Expansion • 1,250 ha Required • 780 ha Acquired (62.4%)
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-600">Current Phase:</span>
          <span className="bg-amber-500 text-slate-950 font-bold text-xs px-3 py-1 rounded-full shadow-sm animate-pulse">
            Stage 6: Hearing Objections (Legal Scrutiny)
          </span>
        </div>
      </div>

      {/* Horizontal Stepper Progress Bar */}
      <div className="overflow-x-auto pb-4 pt-2">
        <div className="min-w-[1000px] flex items-center justify-between relative">
          {/* Background Connecting Line */}
          <div className="absolute top-5 left-6 right-6 h-1 bg-slate-200 -z-0"></div>
          <div
            className="absolute top-5 left-6 h-1 bg-emerald-500 transition-all duration-500 -z-0"
            style={{ width: `${((currentStage - 1) / (stages.length - 1)) * 100}%` }}
          ></div>

          {stages.map((st) => {
            const Icon = st.icon;
            const isCompleted = st.step < currentStage;
            const isCurrent = st.step === currentStage;

            return (
              <div key={st.step} className="flex flex-col items-center relative z-10 w-24">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-sm ${
                    isCompleted
                      ? 'bg-emerald-600 text-white border-2 border-emerald-600'
                      : isCurrent
                      ? 'bg-amber-500 text-slate-950 border-4 border-amber-200 scale-110 shadow-md font-extrabold'
                      : 'bg-slate-100 text-slate-400 border-2 border-slate-300'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>

                <div className="text-center mt-2">
                  <div
                    className={`text-[11px] font-bold leading-tight ${
                      isCurrent ? 'text-blue-900 font-extrabold' : isCompleted ? 'text-emerald-700' : 'text-slate-500'
                    }`}
                  >
                    {st.name}
                  </div>
                  <div className="text-[9px] text-slate-400 mt-0.5 max-w-[90px] leading-snug">
                    {st.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stage Status Legend */}
      <div className="flex flex-wrap items-center justify-between text-xs pt-3 border-t border-slate-100 text-slate-600">
        <div className="flex space-x-4">
          <span className="flex items-center space-x-1">
            <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block"></span>
            <span>Completed (5 Stages)</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
            <span>In Progress (Active)</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-3 h-3 rounded-full bg-slate-300 inline-block"></span>
            <span>Pending Future Stages</span>
          </span>
        </div>
        <div className="text-amber-800 font-medium">
          * Section 15 objections under legal scrutiny at District Magistrate Office, Rajkot.
        </div>
      </div>
    </div>
  );
}
