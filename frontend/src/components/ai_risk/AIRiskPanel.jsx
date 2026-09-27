import React from 'react';
import { AlertTriangle, TrendingUp, ShieldAlert, Cpu, CheckCircle2, ArrowUpRight, Zap } from 'lucide-react';

export default function AIRiskPanel() {
  const riskFactors = [
    { name: 'Legal Litigation & Title Disputes (Sec 15)', contribution: 38, color: 'bg-red-600', text: 'text-red-700' },
    { name: 'Compensation Disbursement Backlog', contribution: 29, color: 'bg-amber-500', text: 'text-amber-700' },
    { name: 'District Inter-Agency Scrutiny Delays', contribution: 20, color: 'bg-blue-600', text: 'text-blue-700' },
    { name: 'R&R Beneficiary Entitlement Verification', contribution: 13, color: 'bg-emerald-600', text: 'text-emerald-700' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 my-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center pb-4 mb-4 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-amber-600 text-white flex items-center justify-center shadow-md">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-red-100 text-red-900 font-extrabold text-[10px] px-2 py-0.5 rounded uppercase">
                PS17 Predictive Intelligence Subsystem
              </span>
              <h2 className="text-xl font-extrabold text-[#0b2545]">
                AI Delay Risk Scorecard & XAI Decision Support
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Continuous Machine Learning assessment predicting milestone bottlenecks before project delays occur.
            </p>
          </div>
        </div>

        <div className="bg-red-50 border border-red-300 text-red-900 px-4 py-2 rounded-xl flex items-center space-x-3 shadow-sm">
          <AlertTriangle className="w-6 h-6 text-red-600 animate-bounce" />
          <div>
            <div className="text-[10px] uppercase font-bold text-red-700">Project Delay Risk</div>
            <div className="text-xl font-extrabold text-red-700">82% (HIGH RISK)</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: XAI Feature Contribution Breakdown */}
        <div className="lg:col-span-2 bg-slate-50 p-5 rounded-xl border border-slate-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-[#0b2545] flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Explainable AI (XAI) — SHAP Feature Contribution</span>
            </h3>
            <span className="text-xs font-semibold text-slate-500">Predicted Delay: +74 Days</span>
          </div>

          <div className="space-y-4 my-4">
            {riskFactors.map((factor, idx) => (
              <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-bold text-slate-800">{factor.name}</span>
                  <span className={`font-extrabold ${factor.text}`}>{factor.contribution}% Impact</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${factor.color} transition-all duration-700`}
                    style={{ width: `${factor.contribution}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg text-xs text-amber-950 font-medium">
            <span className="font-bold text-amber-900">AI Model Insight:</span> High litigation concentration in Parcel P-1042 combined with a 38% compensation backlog increases overall project risk by +21% compared to Gujarat state averages.
          </div>
        </div>

        {/* Right Col: Automated Decision Support Recommendations */}
        <div className="bg-[#0b2545] text-white p-5 rounded-xl flex flex-col justify-between shadow-md">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm mb-3">
              <ShieldAlert className="w-5 h-5" />
              <span>AI Decision-Support Recommendations</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-700">
                <div className="font-bold text-amber-300 mb-1 flex items-center justify-between">
                  <span>1. Legal Fast-Tracking</span>
                  <span className="bg-red-600 text-white text-[9px] px-1.5 py-0.5 rounded font-extrabold">PRIORITY 1</span>
                </div>
                <p className="text-slate-300 leading-snug">
                  Deploy Additional Legal Counsel to Rajkot District Magistrate court to resolve Section 15 objections in Parcel P-1042.
                </p>
              </div>

              <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-700">
                <div className="font-bold text-amber-300 mb-1 flex items-center justify-between">
                  <span>2. Priority Compensation DBT</span>
                  <span className="bg-amber-600 text-slate-950 text-[9px] px-1.5 py-0.5 rounded font-extrabold">PRIORITY 2</span>
                </div>
                <p className="text-slate-300 leading-snug">
                  Release ₹ 160 Cr pending compensation budget to verified non-disputed heirs to clear 62% backlog.
                </p>
              </div>
            </div>
          </div>

          <button className="mt-4 w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-sm">
            <span>Escalate Alert to Central Ministry</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
