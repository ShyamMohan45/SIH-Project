import React, { useState } from 'react';
import { Building2, Layers, DollarSign, Users, AlertTriangle, Search, Download, Filter, Eye } from 'lucide-react';

export default function NationalOverview({ onSelectProject }) {
  const kpis = [
    { label: 'Total Infrastructure Projects', value: '2,840', change: '+12 this month', icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Land Proposed / Acquired', value: '125,000 ha', change: '72.4% Acquired', icon: Layers, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Total Compensation Disbursed', value: '₹ 8,420 Cr', change: '84.2% Disbursed', icon: DollarSign, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Affected & Displaced Families', value: '142,600', change: '78.5% R&R Complete', icon: Users, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'High-Risk Projects (AI Flagged)', value: '176', change: 'Escalated to Center', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' }
  ];

  const projects = [
    { id: 'NH-GJ-2026-001', name: 'Ahmedabad–Rajkot Green Highway Expansion', state: 'Gujarat', landReq: '1,250 ha', landAcq: '780 ha (62.4%)', compPaid: '₹ 690 Cr', riskScore: 82, riskLevel: 'HIGH', stage: 'Hearing Objections' },
    { id: 'MH-RAIL-2026-014', name: 'Mumbai–Nagpur High-Speed Rail Corridor', state: 'Maharashtra', landReq: '3,400 ha', landAcq: '2,890 ha (85.0%)', compPaid: '₹ 2,140 Cr', riskScore: 79, riskLevel: 'HIGH', stage: 'Compensation Disbursement' },
    { id: 'RJ-SOLAR-2026-031', name: 'Bhadla Renewable Energy Park Phase IV', state: 'Rajasthan', landReq: '4,100 ha', landAcq: '3,890 ha (94.8%)', compPaid: '₹ 980 Cr', riskScore: 24, riskLevel: 'LOW', stage: 'Physical Possession' },
    { id: 'KA-IND-2026-009', name: 'Bengaluru–Chennai Industrial Corridor', state: 'Karnataka', landReq: '2,100 ha', landAcq: '1,470 ha (70.0%)', compPaid: '₹ 1,280 Cr', riskScore: 61, riskLevel: 'MEDIUM', stage: 'Award Declaration' },
    { id: 'UP-EXPR-2026-005', name: 'Ganga Expressway Phase II Expansion', state: 'Uttar Pradesh', landReq: '5,600 ha', landAcq: '5,040 ha (90.0%)', compPaid: '₹ 3,450 Cr', riskScore: 32, riskLevel: 'LOW', stage: 'Physical Possession' }
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('ALL');

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = selectedState === 'ALL' || p.state === selectedState;
    return matchesSearch && matchesState;
  });

  return (
    <div className="space-y-6">
      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase leading-tight">{kpi.label}</span>
                  <div className={`p-2 rounded-lg ${kpi.bg}`}>
                    <Icon className={`w-4 h-4 ${kpi.color}`} />
                  </div>
                </div>
                <div className="text-xl font-extrabold text-[#0b2545]">{kpi.value}</div>
              </div>
              <div className="text-[10px] font-semibold text-slate-500 mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span>{kpi.change}</span>
                <span className="text-blue-600 font-bold">Live Data</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Projects Directory & MIS Table */}
      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
        <div className="flex flex-wrap justify-between items-center mb-4 gap-4 pb-3 border-b border-slate-200">
          <div>
            <h3 className="text-lg font-bold text-[#0b2545] font-serif">
              National Infrastructure Land Acquisition Directory
            </h3>
            <p className="text-xs text-slate-500">
              Filter and scrutinize state-wise land acquisition progress under Ministry of Rural Development standards.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search project or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs w-48 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            {/* State Selector */}
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All States (36)</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
            </select>

            <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-1.5 px-3 rounded-lg transition-colors flex items-center space-x-1 shadow-sm">
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* MIS Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#0b2545] text-white uppercase text-[10px] tracking-wider font-bold">
                <th className="p-3 rounded-tl-lg">Project ID</th>
                <th className="p-3">Project Title</th>
                <th className="p-3">State</th>
                <th className="p-3">Land Required</th>
                <th className="p-3">Acquired Progress</th>
                <th className="p-3">Compensation Paid</th>
                <th className="p-3">AI Risk Score</th>
                <th className="p-3">Current Milestone</th>
                <th className="p-3 text-center rounded-tr-lg">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              {filteredProjects.map((proj) => (
                <tr key={proj.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-extrabold text-blue-900">{proj.id}</td>
                  <td className="p-3 font-bold text-slate-900">{proj.name}</td>
                  <td className="p-3 font-medium">{proj.state}</td>
                  <td className="p-3 font-semibold">{proj.landReq}</td>
                  <td className="p-3 font-bold text-emerald-700">{proj.landAcq}</td>
                  <td className="p-3 font-bold">{proj.compPaid}</td>
                  <td className="p-3">
                    <span
                      className={`font-extrabold px-2 py-0.5 rounded text-[10px] ${
                        proj.riskLevel === 'HIGH'
                          ? 'bg-red-100 text-red-800 border border-red-300'
                          : proj.riskLevel === 'MEDIUM'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}
                    >
                      {proj.riskScore}% {proj.riskLevel}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-slate-700">{proj.stage}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => onSelectProject && onSelectProject(proj)}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold px-2.5 py-1 rounded border border-blue-300 transition-colors inline-flex items-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-700" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
