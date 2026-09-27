import React, { useState, useEffect } from 'react';
import { 
  Home, Users, CheckCircle2, Clock, ShieldCheck, HeartHandshake, 
  MapPin, AlertTriangle, ArrowRight
} from 'lucide-react';
import { api } from '../services/api';

export default function RRPage({ onSelectProject }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRR = async () => {
      setLoading(true);
      try {
        const data = await api.getRR('NH-GJ-2026-001');
        setRecords(data);
      } catch (err) {
        console.error('Error loading R&R records:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRR();
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
      {/* 1. HEADER BANNER */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded">
              RFCTLARR Second Schedule
            </span>
            <span className="text-xs text-slate-500 font-medium">• Rehabilitation & Resettlement Cell</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-serif tracking-tight">
            Rehabilitation & Resettlement (R&R) Compliance Portal
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Statutory tracking of 2,400 affected families, 780 displaced families, housing delivery, and subsistence grants
          </p>
        </div>
      </div>

      {/* 2. STATS STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-slate-500 font-bold uppercase text-[10px]">Project Affected Families</div>
          <div className="text-2xl font-black text-slate-900 mt-1">2,400 PAFs</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Enumerated under Section 16 Census</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-slate-500 font-bold uppercase text-[10px]">Physical Resettlement</div>
          <div className="text-2xl font-black text-blue-700 mt-1">780 Families</div>
          <div className="text-[10px] text-blue-600 font-semibold mt-0.5">Requiring alternative residential sites</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-slate-500 font-bold uppercase text-[10px]">Housing Units Handed Over</div>
          <div className="text-2xl font-black text-emerald-700 mt-1">540 / 780</div>
          <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">69.2% Completed at Model Colonies</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-slate-500 font-bold uppercase text-[10px]">Livelihood Subsistence Grant</div>
          <div className="text-2xl font-black text-amber-700 mt-1">₹3,000 / mo</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Statutory 12-month grant under Sec 31</div>
        </div>
      </div>

      {/* 3. TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700">
          Family Entitlement & Delivery Register
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px]">
                <th className="py-2.5 px-3">Record ID</th>
                <th className="py-2.5 px-3">Head of Family</th>
                <th className="py-2.5 px-3">Family ID</th>
                <th className="py-2.5 px-3">Displaced</th>
                <th className="py-2.5 px-3">Housing Allotment</th>
                <th className="py-2.5 px-3">Livelihood Grant</th>
                <th className="py-2.5 px-3">Statutory Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{r.id}</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">{r.head_of_family}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-500">{r.family_id}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      r.is_displaced ? 'bg-amber-100 text-amber-900' : 'text-slate-500'
                    }`}>
                      {r.is_displaced ? 'Yes (Displaced)' : 'No'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      r.housing_allotment === 'Allotted' ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {r.housing_allotment}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">{r.livelihood_grant_status}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-800 rounded font-bold text-[10px]">
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
