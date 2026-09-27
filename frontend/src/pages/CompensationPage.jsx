import React, { useState, useEffect } from 'react';
import { 
  DollarSign, Search, Filter, Download, CheckCircle2, 
  AlertTriangle, Clock, ShieldCheck, ArrowRight
} from 'lucide-react';
import { api } from '../services/api';

export default function CompensationPage({ onSelectProject }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCompensation = async () => {
      setLoading(true);
      try {
        const data = await api.getCompensation('NH-GJ-2026-001');
        setRecords(data);
      } catch (err) {
        console.error('Error fetching compensation records:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompensation();
  }, []);

  const filtered = records.filter(r => {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (search && !r.beneficiary_name?.toLowerCase().includes(search.toLowerCase()) && !r.parcel_id?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
      {/* 1. HEADER BANNER */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-900 border border-emerald-200 px-2 py-0.5 rounded">
              PFMS Direct Benefit Transfer
            </span>
            <span className="text-xs text-slate-500 font-medium">• Statutory Award & Solatium Ledger</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-serif tracking-tight">
            Compensation Award & Disbursement Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated award calculation (100% Solatium), PFMS direct disbursement, and escrow tracking
          </p>
        </div>
      </div>

      {/* 2. SUMMARY STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-slate-500 font-bold uppercase text-[10px]">Total Assessed Award</div>
          <div className="text-xl font-black text-slate-900 mt-1">₹850.00 Cr</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Includes 100% Solatium & 12% Interest</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-slate-500 font-bold uppercase text-[10px]">Disbursed via PFMS DBT</div>
          <div className="text-xl font-black text-emerald-700 mt-1">₹690.00 Cr (81.2%)</div>
          <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">Direct to Verified Bank Accounts</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-slate-500 font-bold uppercase text-[10px]">Escrow Deposit (Disputed)</div>
          <div className="text-xl font-black text-amber-700 mt-1">₹142.50 Cr</div>
          <div className="text-[10px] text-amber-800 font-semibold mt-0.5">Pending Tribunal & High Court Orders</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-slate-500 font-bold uppercase text-[10px]">Beneficiary Landowners</div>
          <div className="text-xl font-black text-slate-900 mt-1">2,400 Families</div>
          <div className="text-[10px] text-slate-500 mt-0.5">1,890 Disbursed • 510 Pending</div>
        </div>
      </div>

      {/* 3. TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap justify-between items-center gap-3 text-xs">
          <input
            type="text"
            placeholder="Search by Landowner Name, Parcel ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none w-64"
          />

          <div className="flex gap-1.5">
            {['ALL', 'Paid', 'Pending', 'Disputed'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                  statusFilter === st ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px]">
                <th className="py-2.5 px-3">Record ID</th>
                <th className="py-2.5 px-3">Parcel ID</th>
                <th className="py-2.5 px-3">Beneficiary Landowner</th>
                <th className="py-2.5 px-3">Masked Bank Account</th>
                <th className="py-2.5 px-3">Assessed (INR)</th>
                <th className="py-2.5 px-3">Disbursed (INR)</th>
                <th className="py-2.5 px-3">PFMS Reference</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{r.id}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-700">{r.parcel_id}</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">{r.beneficiary_name}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-500">{r.bank_account_masked}</td>
                  <td className="py-2.5 px-3 font-mono font-bold">₹{(r.assessed_inr || 0).toLocaleString()}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">₹{(r.disbursed_inr || 0).toLocaleString()}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-400">{r.pfms_ref || 'PENDING-SANCTION'}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      r.status === 'Paid' ? 'bg-emerald-100 text-emerald-900' :
                      r.status === 'Disputed' ? 'bg-rose-100 text-rose-900' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {r.status}
                    </span>
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
