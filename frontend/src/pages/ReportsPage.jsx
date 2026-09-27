import React, { useState } from 'react';
import {
  BarChart3, FileText, Download, Printer, Filter, Calendar, CheckCircle2,
  AlertTriangle, TrendingUp, DollarSign, Building2, MapPin, RefreshCw
} from 'lucide-react';

export default function ReportsPage() {
  const [activeReport, setActiveReport] = useState('COMPLIANCE');
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedSector, setSelectedSector] = useState('ALL');

  const reportTabs = [
    { id: 'COMPLIANCE', label: 'RFCTLARR Statutory Compliance Audit' },
    { id: 'FINANCE', label: 'PFMS DBT Compensation Disbursement' },
    { id: 'AI_DELAY', label: 'AI Delay Prognosis & Risk Summary' },
    { id: 'GROUND_TRUTH', label: 'Cadastral Ground Truthing Status' },
  ];

  const complianceData = [
    { section: 'Section 4 (SIA Preparation & Appraisal)', legalLimit: '6 Months', avgObserved: '5.2 Months', onTimePct: 92, status: 'HEALTHY' },
    { section: 'Section 11 (Preliminary Notification Publication)', legalLimit: '12 Months post SIA', avgObserved: '9.8 Months', onTimePct: 88, status: 'HEALTHY' },
    { section: 'Section 15 (Hearing of Objections by Collector)', legalLimit: '60 Days', avgObserved: '68 Days', onTimePct: 64, status: 'WARNING' },
    { section: 'Section 19 (Final Declaration of Acquisition)', legalLimit: '12 Months post Sec 11', avgObserved: '13.4 Months', onTimePct: 48, status: 'CRITICAL' },
    { section: 'Section 23 (Enquiry & Land Award by Collector)', legalLimit: '12 Months post Sec 19', avgObserved: '10.5 Months', onTimePct: 76, status: 'WATCH' },
    { section: 'Section 38 (Taking Possession post Full Payment)', legalLimit: 'Prompt post DBT', avgObserved: '3.1 Months', onTimePct: 82, status: 'HEALTHY' },
  ];

  const financialData = [
    { state: 'Gujarat', totalAwarded: '₹1,240.50 Cr', pfmsDisbursed: '₹982.10 Cr', pendingEscrow: '₹258.40 Cr', dbtSuccessRate: '99.4%', solatiumAudited: '100%' },
    { state: 'Maharashtra', totalAwarded: '₹2,180.00 Cr', pfmsDisbursed: '₹1,430.20 Cr', pendingEscrow: '₹749.80 Cr', dbtSuccessRate: '98.7%', solatiumAudited: '100%' },
    { state: 'Karnataka', totalAwarded: '₹940.20 Cr', pfmsDisbursed: '₹810.00 Cr', pendingEscrow: '₹130.20 Cr', dbtSuccessRate: '99.1%', solatiumAudited: '100%' },
    { state: 'Uttar Pradesh', totalAwarded: '₹3,450.80 Cr', pfmsDisbursed: '₹2,890.40 Cr', pendingEscrow: '₹560.40 Cr', dbtSuccessRate: '99.6%', solatiumAudited: '100%' },
    { state: 'Tamil Nadu', totalAwarded: '₹1,120.00 Cr', pfmsDisbursed: '₹890.30 Cr', pendingEscrow: '₹229.70 Cr', dbtSuccessRate: '98.9%', solatiumAudited: '100%' },
  ];

  const delayPrognosisData = [
    { project: 'Ahmedabad–Rajkot Green Highway Expansion', code: 'NH-GJ-2026-001', riskScore: '82%', expectedDelay: '+140 Days', rootFactor: 'Boundary Overlap (Khasra 1042) + Title Dispute', actionStatus: 'Action Required' },
    { project: 'Mumbai–Pune Dedicated Freight Logistics Corridor', code: 'MH-RAIL-2026-014', riskScore: '78%', expectedDelay: '+115 Days', rootFactor: 'Forest Clearance Lapsed (Sec 19 deadline in 28 days)', actionStatus: 'Escalated to MoEFCC' },
    { project: 'Delhi–Dehradun Economic Expressway Pkg-3', code: 'DL-EXP-2026-003', riskScore: '65%', expectedDelay: '+90 Days', rootFactor: 'Gram Sabha Resolution Discrepancy', actionStatus: 'Hearing Convened' },
    { project: 'Bengaluru–Chennai High-Speed Rail Corridor', code: 'KA-HSR-2026-008', riskScore: '45%', expectedDelay: '+40 Days', rootFactor: 'Urban Cadastral Mutation Backlog', actionStatus: 'Fast-Track Camp' },
    { project: 'Varanasi Multimodal Inland Terminal Ring Road', code: 'UP-LOG-2026-022', riskScore: '22%', expectedDelay: '+12 Days', rootFactor: 'Minor Valuation Objections Resolved', actionStatus: 'On Schedule' },
  ];

  const groundTruthData = [
    { state: 'Gujarat', totalParcels: 14200, fieldInspected: 12850, verifiedMatch: 11980, boundaryDiscrepancies: 870, photosLogged: 38550 },
    { state: 'Maharashtra', totalParcels: 28400, fieldInspected: 21300, verifiedMatch: 19400, boundaryDiscrepancies: 1900, photosLogged: 63900 },
    { state: 'Karnataka', totalParcels: 11200, fieldInspected: 10100, verifiedMatch: 9550, boundaryDiscrepancies: 550, photosLogged: 30300 },
    { state: 'Uttar Pradesh', totalParcels: 34500, fieldInspected: 31200, verifiedMatch: 29800, boundaryDiscrepancies: 1400, photosLogged: 93600 },
  ];

  const handleExportCsv = () => {
    let content = '';
    if (activeReport === 'COMPLIANCE') {
      content = 'Section,Statutory Legal Limit,Average Observed,On-Time Adherence %,Status\n' +
        complianceData.map(r => `"${r.section}","${r.legalLimit}","${r.avgObserved}",${r.onTimePct}%,"${r.status}"`).join('\n');
    } else if (activeReport === 'FINANCE') {
      content = 'State,Total Awarded,PFMS Disbursed,Pending Escrow,DBT Success Rate,Solatium Audited\n' +
        financialData.map(r => `"${r.state}","${r.totalAwarded}","${r.pfmsDisbursed}","${r.pendingEscrow}","${r.dbtSuccessRate}","${r.solatiumAudited}"`).join('\n');
    } else if (activeReport === 'AI_DELAY') {
      content = 'Project Name,Project Code,AI Risk Probability,Expected Delay,Primary Root Cause,Action Status\n' +
        delayPrognosisData.map(r => `"${r.project}","${r.code}","${r.riskScore}","${r.expectedDelay}","${r.rootFactor}","${r.actionStatus}"`).join('\n');
    } else {
      content = 'State,Total Cadastral Parcels,Field Inspected,Verified Exact Match,Discrepancies Flagged,Photos Logged\n' +
        groundTruthData.map(r => `"${r.state}",${r.totalParcels},${r.fieldInspected},${r.verifiedMatch},${r.boundaryDiscrepancies},${r.photosLogged}`).join('\n');
    }

    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NLAMS_Report_${activeReport}_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase">
                Statutory Intelligence & Audit Engine
              </span>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase">
                Official Parliamentary & Review Dossier
              </span>
            </div>
            <h1 className="text-2xl font-black text-[#0b2545] font-serif">
              National Land Acquisition Reports & Analytics
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Comprehensive compliance audits under RFCTLARR 2013, PFMS direct benefit transfer reconciliation, and AI predictive delay reports.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-lg border border-slate-200 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Dossier</span>
            </button>
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 bg-[#0b2545] hover:bg-[#1e3a8a] text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-1.5 mt-5 pt-4 border-t border-slate-100">
          {reportTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveReport(tab.id)}
              className={`text-xs font-bold px-3 py-2 rounded-lg transition-all ${
                activeReport === tab.id
                  ? 'bg-[#0b2545] text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* REPORT CONTENT: 1. STATUTORY COMPLIANCE */}
      {activeReport === 'COMPLIANCE' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <div className="text-[10px] font-bold text-slate-500 uppercase">National On-Time Adherence</div>
              <div className="text-2xl font-black text-[#0b2545] mt-1">77.4%</div>
              <p className="text-[11px] text-slate-500 mt-1">Across 10 mandatory RFCTLARR 2013 procedural milestones.</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Major Bottleneck Milestone</div>
              <div className="text-2xl font-black text-rose-600 mt-1">Section 19</div>
              <p className="text-[11px] text-slate-500 mt-1">Final declaration lapses after 12 months in 52% of monitored corridors.</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Litigation Avoidance Rate</div>
              <div className="text-2xl font-black text-emerald-600 mt-1">89.2%</div>
              <p className="text-[11px] text-slate-500 mt-1">Fast-track mediation preventing high court stay orders.</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Statutory Milestone Time-Limits & Compliance Adherence
              </h2>
              <span className="text-[10px] font-semibold text-slate-500">Benchmark: RFCTLARR Act 2013 Schedules</span>
            </div>
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Statutory Milestone</th>
                  <th className="py-3 px-4">Statutory Legal Ceiling</th>
                  <th className="py-3 px-4">National Average Duration</th>
                  <th className="py-3 px-4">Adherence Rate</th>
                  <th className="py-3 px-4 text-center">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {complianceData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-bold text-slate-900">{row.section}</td>
                    <td className="py-3 px-4 font-semibold text-slate-700">{row.legalLimit}</td>
                    <td className="py-3 px-4 font-mono text-slate-800">{row.avgObserved}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              row.onTimePct >= 80 ? 'bg-emerald-500' : row.onTimePct >= 65 ? 'bg-amber-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${row.onTimePct}%` }}
                          />
                        </div>
                        <span className="font-bold text-slate-800">{row.onTimePct}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        row.status === 'HEALTHY'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : row.status === 'WARNING'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : row.status === 'WATCH'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT CONTENT: 2. FINANCE & PFMS */}
      {activeReport === 'FINANCE' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <div className="text-[10px] font-bold text-slate-500 uppercase">National Compensation Awarded</div>
              <div className="text-xl font-black text-[#0b2545] mt-1">₹8,931.50 Cr</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Across 5 High-Density States</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <div className="text-[10px] font-bold text-slate-500 uppercase">PFMS Disbursed to Bank Accounts</div>
              <div className="text-xl font-black text-emerald-700 mt-1">₹7,002.70 Cr</div>
              <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">78.4% Direct Disbursed</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Held in Escrow (Disputed Titles)</div>
              <div className="text-xl font-black text-amber-700 mt-1">₹1,928.80 Cr</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Awaiting CALA / Court Adjudication</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Solatium Compliance</div>
              <div className="text-xl font-black text-blue-900 mt-1">100.0%</div>
              <div className="text-[10px] text-blue-700 font-semibold mt-0.5">Section 30 100% Solatium Audited</div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                State-Wise PFMS Direct Benefit Transfer Reconciliation
              </h2>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                PFMS Gateway Sync: Active
              </span>
            </div>
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">State / Revenue Jurisdiction</th>
                  <th className="py-3 px-4">Total Awarded (₹)</th>
                  <th className="py-3 px-4">PFMS Disbursed (₹)</th>
                  <th className="py-3 px-4">Pending in Escrow (₹)</th>
                  <th className="py-3 px-4">DBT Success Rate</th>
                  <th className="py-3 px-4 text-center">Solatium Audited</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {financialData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-bold text-slate-900">{row.state}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">{row.totalAwarded}</td>
                    <td className="py-3 px-4 font-bold text-emerald-700">{row.pfmsDisbursed}</td>
                    <td className="py-3 px-4 font-semibold text-amber-700">{row.pendingEscrow}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">{row.dbtSuccessRate}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                        {row.solatiumAudited}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT CONTENT: 3. AI DELAY PROGNOSIS */}
      {activeReport === 'AI_DELAY' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  PS 17 Predictive Delay Analytics & Corridor Health Summary
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Gradient Boosted Survival Model predictions with SHAP explainability.
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                Model: XGBoost Survival v2.4 (AUC: 0.89)
              </span>
            </div>
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Corridor Name & Code</th>
                  <th className="py-3 px-4">AI Risk Probability</th>
                  <th className="py-3 px-4">Expected Delay</th>
                  <th className="py-3 px-4">Primary Delay Factor (SHAP)</th>
                  <th className="py-3 px-4 text-center">Intervention Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {delayPrognosisData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{row.project}</div>
                      <div className="font-mono text-[10px] text-blue-700 font-semibold">{row.code}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-black text-xs px-2 py-0.5 rounded ${
                        parseInt(row.riskScore) >= 70
                          ? 'bg-rose-100 text-rose-800'
                          : parseInt(row.riskScore) >= 40
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {row.riskScore}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">{row.expectedDelay}</td>
                    <td className="py-3 px-4 font-medium text-slate-700">{row.rootFactor}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-[10px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                        {row.actionStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT CONTENT: 4. GROUND TRUTHING */}
      {activeReport === 'GROUND_TRUTH' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Cadastral Ground Truthing & Field App Synchronization
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Real-time sync from Field Officer mobile inspections with GPS and photographic logs.
                </p>
              </div>
              <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200">
                Mobile App Gateway: 100% Synced
              </span>
            </div>
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">State</th>
                  <th className="py-3 px-4">Total Parcels</th>
                  <th className="py-3 px-4">Field Inspected</th>
                  <th className="py-3 px-4">Exact Boundary Match</th>
                  <th className="py-3 px-4">Discrepancies Flagged</th>
                  <th className="py-3 px-4">Photos Logged</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {groundTruthData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-bold text-slate-900">{row.state}</td>
                    <td className="py-3 px-4 font-semibold text-slate-700">{row.totalParcels.toLocaleString()}</td>
                    <td className="py-3 px-4 font-bold text-blue-900">{row.fieldInspected.toLocaleString()}</td>
                    <td className="py-3 px-4 font-bold text-emerald-700">{row.verifiedMatch.toLocaleString()}</td>
                    <td className="py-3 px-4 font-bold text-rose-600">{row.boundaryDiscrepancies.toLocaleString()}</td>
                    <td className="py-3 px-4 font-mono text-purple-800 font-semibold">{row.photosLogged.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
