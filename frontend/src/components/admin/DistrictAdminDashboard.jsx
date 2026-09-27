import React, { useState } from 'react';
import { 
  ShieldCheck, Scale, FileText, CheckCircle2, AlertTriangle, 
  DollarSign, MapPin, Users, Award, Landmark, ArrowRight
} from 'lucide-react';

export default function DistrictAdminDashboard({ onSelectProject }) {
  const [activeSubTab, setActiveSubTab] = useState('objections'); // 'objections', 'awards', 'compensation', 'possession'

  const objectionsList = [
    { id: 'LEG-2026-0042', parcel: 'P-1042', surveyNo: 'RJ-1042/B', owner: 'Suresh & Bhavesh Patel', issue: 'Compensation Rate Multiplier Disagreement', status: 'HIGH_COURT_STAY', assignedTo: 'District Legal Officer' },
    { id: 'LEG-2026-0045', parcel: 'P-1045', surveyNo: 'RJ-1045/A', owner: 'Ramesh Patel (Heir Claim)', issue: 'Joint Family Title Dispute (Khata Split)', status: 'COLLECTOR_HEARING', assignedTo: 'Tehsildar Legal Cell' },
    { id: 'LEG-2026-0051', parcel: 'P-1051', surveyNo: 'RJ-1051/C', owner: 'Kuvadva Gram Panchayat', issue: 'Public Common Land Re-classification', status: 'SOLVED', assignedTo: 'District Collector' }
  ];

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-950 to-slate-900 p-6 rounded-2xl border border-blue-800 shadow-xl flex flex-wrap justify-between items-center">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-blue-500 text-white font-black text-[10px] px-2.5 py-0.5 rounded uppercase tracking-wider">
              Level 3 — District Administration Portal
            </span>
            <span className="text-xs text-blue-200 font-semibold">• Jurisdiction: Rajkot District Collectorate</span>
          </div>
          <h2 className="text-2xl font-black text-white font-serif tracking-tight">
            Office of the District Magistrate & Land Collector, Rajkot
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Statutory RFCTLARR Section 15 Hearings, Section 23 Award Declarations & PFMS DBT Compensation
          </p>
        </div>

        <div className="bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-700 text-right">
          <div className="text-[10px] text-slate-400 font-bold uppercase">District Legal Objections</div>
          <div className="text-xl font-black text-amber-400 font-mono">18 Cases (11 Pending)</div>
        </div>
      </div>

      {/* 4 District KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 shadow">
          <div className="text-slate-400 text-xs font-bold mb-1">District Parcels</div>
          <div className="text-2xl font-extrabold text-white font-mono">1,024 <span className="text-xs text-slate-400 font-sans">parcels</span></div>
          <div className="text-[11px] text-emerald-400 mt-1 font-semibold">910 Awards Declared</div>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 shadow">
          <div className="text-slate-400 text-xs font-bold mb-1">Assessed Compensation</div>
          <div className="text-2xl font-extrabold text-white font-mono">₹ 850 <span className="text-xs text-slate-400 font-sans">Cr</span></div>
          <div className="text-[11px] text-emerald-400 mt-1 font-semibold">₹ 690 Cr Disbursed (81.1%)</div>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 shadow">
          <div className="text-slate-400 text-xs font-bold mb-1">District R&R Families</div>
          <div className="text-2xl font-extrabold text-white font-mono">2,400 <span className="text-xs text-slate-400 font-sans">families</span></div>
          <div className="text-[11px] text-amber-400 mt-1 font-semibold">1,890 Packages Disbursed</div>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 shadow">
          <div className="text-slate-400 text-xs font-bold mb-1">Possession Handover</div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">78.4%</div>
          <div className="text-[11px] text-slate-400 mt-1 font-semibold">980 / 1,250 ha Taken Over</div>
        </div>
      </div>

      {/* Interactive Sub-Module Tabs */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-xs font-bold">
          <button
            onClick={() => setActiveSubTab('objections')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeSubTab === 'objections' ? 'bg-blue-600 text-white font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Scale className="w-4 h-4 text-amber-400" />
            <span>Section 15 Objections Desk (18)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('awards')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeSubTab === 'awards' ? 'bg-blue-600 text-white font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Section 23 Award Orders</span>
          </button>

          <button
            onClick={() => setActiveSubTab('compensation')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeSubTab === 'compensation' ? 'bg-blue-600 text-white font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>PFMS DBT Compensation</span>
          </button>
        </div>

        {/* SUB-TAB 1: OBJECTIONS DESK */}
        {activeSubTab === 'objections' && (
          <div className="space-y-3">
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-200 uppercase tracking-wider text-[10px] font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-3">Case ID</th>
                    <th className="p-3">Parcel / Survey No</th>
                    <th className="p-3">Landowner / Claimant</th>
                    <th className="p-3">Objection Reason</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Assigned Legal Officer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-medium">
                  {objectionsList.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-900/80 transition-colors">
                      <td className="p-3 font-mono font-bold text-amber-400">{c.id}</td>
                      <td className="p-3 font-bold text-white">{c.parcel} ({c.surveyNo})</td>
                      <td className="p-3 text-slate-300">{c.owner}</td>
                      <td className="p-3 text-slate-400">{c.issue}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                          c.status === 'HIGH_COURT_STAY' ? 'bg-red-950 text-red-300 border border-red-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-300 font-semibold">{c.assignedTo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUB-TAB 2: AWARDS */}
        {activeSubTab === 'awards' && (
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
            <strong className="text-emerald-400 font-bold block mb-1 text-sm">Statutory Collector Award Issuance (Section 23/37)</strong>
            District Collectorate has published 910 statutory award orders out of 1,024 parcels in Rajkot Corridor. 92 award declarations pending valuation committee clearance.
          </div>
        )}

        {/* SUB-TAB 3: COMPENSATION */}
        {activeSubTab === 'compensation' && (
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
            <strong className="text-emerald-400 font-bold block mb-1 text-sm">PFMS DBT Disbursement Ledger</strong>
            ₹ 690 Cr successfully transferred to 15,320 verified beneficiary accounts directly via Aadhar-linked bank accounts. 3,132 beneficiary disbursements pending title verification.
          </div>
        )}
      </div>
    </div>
  );
}
