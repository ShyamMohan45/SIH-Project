import React, { useState } from 'react';
import { Activity, AlertTriangle, Cpu, CheckCircle2, Clock, Scale, ShieldAlert, ArrowRight } from 'lucide-react';
import AIRiskPanel from '../ai_risk/AIRiskPanel';
import NationalOverview from './NationalOverview';

export default function ProblemLevelSwitcher() {
  const [activeLevel, setActiveLevel] = useState(1);

  const levels = [
    {
      id: 1,
      title: 'Level 1 — Digital Monitoring (PS 16)',
      sub: '"What is happening right now?"',
      badge: 'PS 16 CORE',
      icon: Activity,
      color: 'border-blue-500 bg-blue-50 text-blue-900',
      activeColor: 'bg-blue-600 text-white ring-2 ring-blue-400 font-extrabold',
      questions: [
        'How much land is proposed vs acquired?',
        'Which gazette notifications (3A/3D) are issued?',
        'Which Section 23 awards are declared?',
        'How much compensation is paid to landowners?',
        'How many families are affected and displaced?',
        'How much R&R is completed?',
        'Where is the project physically located on GIS map?'
      ]
    },
    {
      id: 2,
      title: 'Level 2 — Rule-Based Monitoring',
      sub: '"Where is the process getting stuck?"',
      badge: 'WORKFLOW SLA',
      icon: AlertTriangle,
      color: 'border-amber-500 bg-amber-50 text-amber-900',
      activeColor: 'bg-amber-500 text-slate-950 ring-2 ring-amber-300 font-extrabold',
      questions: [
        'Approval pending beyond statutory time limit',
        'Gazette notification pending publication',
        'Compensation disbursement backlog (>30 days)',
        'Active Section 15 legal court disputes',
        'Khata ownership heir conflicts',
        'R&R entitlement distribution pending',
        'Physical possession certificate delayed'
      ]
    },
    {
      id: 3,
      title: 'Level 3 — Intelligence & Prediction (PS 17)',
      sub: '"Which projects are likely to get delayed next?"',
      badge: 'PS 17 AI/XAI',
      icon: Cpu,
      color: 'border-red-500 bg-red-50 text-red-900',
      activeColor: 'bg-red-600 text-white ring-2 ring-red-400 font-extrabold',
      questions: [
        'Predictive delay risk scoring (e.g. 82% High Risk)',
        'XGBoost & Random Forest time-series forecasting',
        'Explainable AI (SHAP) feature contributions',
        'Legal disputes contribution (31%)',
        'Compensation pending contribution (24%)',
        'Approval delay contribution (21%)',
        'Automated decision-support mitigation suggestions'
      ]
    }
  ];

  return (
    <div className="space-y-6 my-6">
      {/* Level Selector Tabs */}
      <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 text-slate-800">
        <div className="flex flex-wrap justify-between items-center pb-4 mb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-[#0b2545] text-white font-extrabold text-[10px] px-2.5 py-1 rounded uppercase tracking-wider">
                SIH Problem Level Framework
              </span>
              <h2 className="text-xl font-bold font-serif text-[#0b2545]">
                3-Tier Problem Solving Subsystems
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Toggle between Level 1 Digital Monitoring, Level 2 Process Bottleneck Detection, and Level 3 Predictive Intelligence.
            </p>
          </div>
        </div>

        {/* 3 Level Tab Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {levels.map((lvl) => {
            const Icon = lvl.icon;
            const isSelected = activeLevel === lvl.id;
            return (
              <div
                key={lvl.id}
                onClick={() => setActiveLevel(lvl.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer shadow-sm flex flex-col justify-between ${
                  isSelected ? lvl.activeColor : `${lvl.color} hover:shadow-md`
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="p-2 rounded-lg bg-black/10">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-black/20">
                      {lvl.badge}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-sm">{lvl.title}</h3>
                  <div className="text-xs italic opacity-90 mt-0.5">{lvl.sub}</div>
                </div>

                <div className="mt-4 pt-2 border-t border-black/10 flex items-center justify-between text-[11px] font-bold">
                  <span>{isSelected ? 'Currently Inspecting' : 'Switch View'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Level View Contents */}
      {activeLevel === 1 && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-blue-950 text-xs">
            <span className="font-extrabold text-blue-900 block text-sm mb-1">Level 1 — PS16 Digital Monitoring Layer Active</span>
            Answers "What is happening?" by providing real-time visibility into proposed vs acquired land, published 3A/3D notifications, Section 23 awards declared, and compensation disbursed.
          </div>
          <NationalOverview />
        </div>
      )}

      {activeLevel === 2 && (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-300 p-4 rounded-xl text-amber-950 text-xs">
            <span className="font-extrabold text-amber-900 block text-sm mb-1">Level 2 — Rule-Based Process Bottleneck Detection Active</span>
            Answers "Where is the process getting stuck?" by automatically flagging Section 15 legal disputes, approval delays, compensation backlogs, and overdue milestone SLAs.
          </div>

          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 text-xs text-slate-800">
            <h3 className="text-base font-bold text-[#0b2545] font-serif mb-4">Detected Active Process Bottlenecks — Project NH-GJ-2026-001</h3>
            <div className="space-y-3">
              <div className="p-3.5 bg-red-50 border border-red-300 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <div>
                    <div className="font-bold text-red-900 text-xs">Section 15 Legal Objections Pending (Parcel P-1042)</div>
                    <div className="text-red-700 text-[11px]">35 litigation cases filed in Rajkot High Court • Overdue by +42 Days</div>
                  </div>
                </div>
                <span className="bg-red-600 text-white font-extrabold text-[10px] px-2.5 py-1 rounded">CRITICAL BOTTLENECK</span>
              </div>

              <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-amber-600" />
                  <div>
                    <div className="font-bold text-amber-900 text-xs">Compensation Disbursement Backlog (38% Cases Pending)</div>
                    <div className="text-amber-800 text-[11px]">₹ 160 Cr compensation release pending PFMS budget sanction • Overdue by +18 Days</div>
                  </div>
                </div>
                <span className="bg-amber-500 text-slate-950 font-extrabold text-[10px] px-2.5 py-1 rounded">MODERATE BOTTLENECK</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeLevel === 3 && (
        <div className="space-y-6">
          <div className="bg-red-50 border border-red-300 p-4 rounded-xl text-red-950 text-xs">
            <span className="font-extrabold text-red-900 block text-sm mb-1">Level 3 — PS17 AI Predictive Intelligence Subsystem Active</span>
            Answers "Which projects are likely to get delayed next?" using XGBoost ML forecasting, SHAP explainability feature contributions, and automated mitigation recommendations.
          </div>
          <AIRiskPanel />
        </div>
      )}
    </div>
  );
}
