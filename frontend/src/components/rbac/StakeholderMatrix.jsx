import React from 'react';
import { Users, Shield, Check, Eye, Edit, Lock, FileCheck } from 'lucide-react';

export default function StakeholderMatrix() {
  const stakeholders = [
    { title: 'Land Requiring Body', resp: 'Submits project land requirement & DPR', role: 'Project Applicant', create: 'Proposals, DPR', verify: 'Alignment Coordinates', approve: 'None', scope: 'Project Scope' },
    { title: 'Land Acquiring Authority', resp: 'Conducts land acquisition & hearings', role: 'Acquisition Officer', create: 'Gazette Notices, Awards', verify: 'Section 15 Objections', approve: 'Valuation & Awards', scope: 'District Scope' },
    { title: 'District Collector', resp: 'District administration & dispute resolution', role: 'District Admin', create: 'Legal Orders, Possession Certificates', verify: 'All District Parcels', approve: 'Final Possession & Transfer', scope: 'District-wide' },
    { title: 'State Government', resp: 'State approval, policy & inter-agency oversight', role: 'State Admin', create: 'State Sanctions, Guidelines', verify: 'District Progress', approve: 'Project Proposal Sanction', scope: 'State-wide' },
    { title: 'Central Ministry', resp: 'National infrastructure policy & funding', role: 'Central Admin', create: 'National Policies, Fund Allocation', verify: 'All India Projects', approve: 'National Clearance', scope: 'All India' },
    { title: 'Revenue Department', resp: 'Land records, khata & survey verification', role: 'Data Provider', create: 'Khasra Registers, Khata Ledgers', verify: 'Land Title Ownership', approve: 'Ownership Transfer', scope: 'Tehsil Scope' },
    { title: 'R&R Authority', resp: 'Rehabilitation & Resettlement of affected families', role: 'R&R Officer', create: 'R&R Entitlements, Family Surveys', verify: 'Affected/Displaced Families', approve: 'R&R Disbursement', scope: 'District Scope' },
    { title: 'Finance Department', resp: 'Compensation budget release & DBT auditing', role: 'Finance Officer', create: 'Payment Vouchers, Escrow Disbursals', verify: 'Bank Account Details', approve: 'DBT Compensation Release', scope: 'Financial Ledger' },
    { title: 'Project Agency (NHAI/Railways)', resp: 'Executes infrastructure construction', role: 'Project Manager', create: 'Milestone Progress Reports', verify: 'Possession Handover', approve: 'Site Handover Acceptance', scope: 'Project Corridor' },
    { title: 'Policy Maker / Executive', resp: 'National decision support & AI risk monitoring', role: 'Executive Viewer', create: 'Strategic Directives', verify: 'AI Delay Scorecards', approve: 'Escalation Override', scope: 'National Executive' }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 my-6 text-slate-800">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center pb-4 mb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-blue-100 text-blue-900 font-extrabold text-[10px] px-2.5 py-1 rounded uppercase tracking-wider">
              Research Phase 2 Stakeholders
            </span>
            <h2 className="text-xl font-bold font-serif text-[#0b2545]">
              Multi-Tenant Stakeholder & RBAC Governance Matrix
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            System permissions mapping determining data creation, verification, approval, and consumption across 10 key government stakeholders.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-300">
          <Shield className="w-4 h-4 text-emerald-600" />
          <span>Strict Role-Based Access Control (RBAC)</span>
        </div>
      </div>

      {/* Stakeholder Matrix Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#0b2545] text-white uppercase text-[10px] tracking-wider font-bold">
              <th className="p-3.5 rounded-tl-xl">Stakeholder Entity</th>
              <th className="p-3.5">Primary Responsibility</th>
              <th className="p-3.5">System Role</th>
              <th className="p-3.5">Data Creation Rights</th>
              <th className="p-3.5">Verification Scope</th>
              <th className="p-3.5">Approval Authority</th>
              <th className="p-3.5 rounded-tr-xl">Jurisdiction Scope</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-700">
            {stakeholders.map((sh, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="p-3.5 font-extrabold text-blue-900">{sh.title}</td>
                <td className="p-3.5 font-medium">{sh.resp}</td>
                <td className="p-3.5">
                  <span className="bg-blue-50 text-blue-900 font-bold px-2 py-0.5 rounded border border-blue-200 text-[10px]">
                    {sh.role}
                  </span>
                </td>
                <td className="p-3.5 font-semibold text-slate-800">{sh.create}</td>
                <td className="p-3.5 font-medium text-slate-700">{sh.verify}</td>
                <td className="p-3.5">
                  <span className={`font-extrabold text-[10px] px-2 py-0.5 rounded ${sh.approve === 'None' ? 'bg-slate-100 text-slate-500' : 'bg-emerald-100 text-emerald-800'}`}>
                    {sh.approve}
                  </span>
                </td>
                <td className="p-3.5 font-bold text-amber-800">{sh.scope}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
