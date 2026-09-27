import React, { useState, useEffect } from 'react';
import { 
  Gavel, AlertTriangle, ShieldCheck, Clock, Calendar, 
  ArrowRight, Search, Filter, CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';

export default function LegalPage({ onSelectProject }) {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLegalCases = async () => {
      setLoading(true);
      try {
        const data = await api.getLegalCases('NH-GJ-2026-001');
        setCases(data);
      } catch (err) {
        console.error('Error fetching legal cases:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLegalCases();
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
      {/* 1. HEADER BANNER */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-900 border border-rose-200 px-2 py-0.5 rounded">
              Litigation & Inquiry Cell
            </span>
            <span className="text-xs text-slate-500 font-medium">• Section 15 & High Court Stays</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-serif tracking-tight">
            Legal Disputes & Section 15 Objection Register
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            18 active legal litigations across Land Acquisition Tribunals and High Courts blocking corridor possession
          </p>
        </div>
      </div>

      {/* 2. SUMMARY STRIP */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-slate-500 font-bold uppercase text-[10px]">Active High Court Stays</div>
          <div className="text-2xl font-black text-rose-700 mt-1">4 Cases</div>
          <div className="text-[10px] text-rose-600 font-bold mt-0.5">Including Khasra 1042 Partition Writ</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-slate-500 font-bold uppercase text-[10px]">Tribunal Mediation Cases</div>
          <div className="text-2xl font-black text-amber-700 mt-1">11 Cases</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Assigned to Special Lok Adalat Bench</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-slate-500 font-bold uppercase text-[10px]">Average Litigation Delay</div>
          <div className="text-2xl font-black text-slate-900 mt-1">142 Days</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Empirical judicial lifecycle in Gujarat</div>
        </div>
      </div>

      {/* 3. CASES TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700">
          Active Dispute & Objection Case Files
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px]">
                <th className="py-2.5 px-3">Case ID</th>
                <th className="py-2.5 px-3">Parcel</th>
                <th className="py-2.5 px-3">Dispute Category</th>
                <th className="py-2.5 px-3">Claimant</th>
                <th className="py-2.5 px-3">Judicial Forum</th>
                <th className="py-2.5 px-3">Filed Date</th>
                <th className="py-2.5 px-3">Next Hearing</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {cases.map((c) => {
                const is1042 = c.parcel_id === 'P-1042' || c.id?.includes('1042');
                return (
                  <tr key={c.id} className={is1042 ? 'bg-rose-50/50 font-bold' : 'hover:bg-slate-50'}>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                      {c.id}
                      {is1042 && <span className="block text-[8px] text-rose-700 font-black">CRITICAL BLOCKER</span>}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-700">{c.parcel_id}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{c.case_type}</td>
                    <td className="py-2.5 px-3">{c.claimant_name}</td>
                    <td className="py-2.5 px-3 text-slate-600">{c.court_forum}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-500">{c.filed_date}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-rose-700">{c.next_hearing_date}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-rose-100 text-rose-900">
                        {c.risk_impact}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{c.current_status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
