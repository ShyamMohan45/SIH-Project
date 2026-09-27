import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Building2, Globe, TrendingUp, AlertTriangle, ShieldAlert, 
  CheckCircle2, Clock, Users, ArrowRight 
} from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000/api';

export default function CentralDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const token = localStorage.getItem('nlams_token');
        const res = await axios.get(`${API_BASE}/admin/central/dashboard`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div className="p-8 text-center text-xs text-slate-400">Connecting to Central Control Room...</div>;
  if (!data) return <div className="p-8 text-center text-xs text-rose-400">Failed to load National Control Room data. Please ensure Central Admin authentication.</div>;

  return (
    <div className="space-y-6">
      {/* Scope Indicator Banner */}
      <div className="bg-gradient-to-r from-indigo-950 to-slate-950 p-4 sm:p-6 rounded-2xl border border-indigo-800/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <h2 className="text-xl font-black text-white">All-India Land Acquisition Command Dashboard</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Full national visibility across all 28 States & 8 Union Territories
          </p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 rounded-lg bg-indigo-900/60 border border-indigo-700 text-indigo-300 text-xs font-bold">
            {data.total_states} States Active
          </span>
          <span className="px-3 py-1 rounded-lg bg-emerald-900/40 border border-emerald-700 text-emerald-300 text-xs font-bold">
            {data.total_active_projects} Major Projects
          </span>
        </div>
      </div>

      {/* High Level KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700">
          <span className="text-[11px] uppercase font-bold text-slate-400">National Progress</span>
          <p className="text-3xl font-black text-emerald-400 mt-1">{data.national_progress_pct}%</p>
          <p className="text-xs text-slate-400 mt-1">{data.total_land_acquired_ha.toLocaleString()} ha of {data.total_land_required_ha.toLocaleString()} ha</p>
        </div>

        <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700">
          <span className="text-[11px] uppercase font-bold text-slate-400">Affected Families</span>
          <p className="text-3xl font-black text-amber-400 mt-1">{data.affected_families.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-1">Pending R&R: {data.pending_rr_parcels} parcels</p>
        </div>

        <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700">
          <span className="text-[11px] uppercase font-bold text-slate-400">Pending Compensation</span>
          <p className="text-3xl font-black text-indigo-300 mt-1">{data.pending_compensation_parcels}</p>
          <p className="text-xs text-slate-400 mt-1">Parcels pending award DBT</p>
        </div>

        <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700">
          <span className="text-[11px] uppercase font-bold text-slate-400">Statutory Risk Alerts</span>
          <p className="text-3xl font-black text-rose-400 mt-1">{data.critical_projects + data.high_risk_projects}</p>
          <p className="text-xs text-slate-400 mt-1">{data.critical_projects} Critical &bull; {data.high_risk_projects} High Risk</p>
        </div>
      </div>

      {/* State-wise Breakdown from dashboard */}
      <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">All-India State Performance Matrix</h3>
            <p className="text-xs text-slate-400">Drill down into state-level operations and district records</p>
          </div>
          <Link
            to="/admin/central/states"
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
          >
            <span>Detailed State Matrix</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 uppercase font-semibold border-y border-slate-700">
              <tr>
                <th className="py-3 px-4">State / Territory</th>
                <th className="py-3 px-4">Active Projects</th>
                <th className="py-3 px-4">Land Required (ha)</th>
                <th className="py-3 px-4">Land Acquired (ha)</th>
                <th className="py-3 px-4">Progress (%)</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {(data.states_summary || []).map((st) => (
                <tr key={st.state} className="hover:bg-slate-750 transition">
                  <td className="py-3 px-4 font-bold text-white">{st.state}</td>
                  <td className="py-3 px-4">{st.projects_count}</td>
                  <td className="py-3 px-4">{st.land_required_ha}</td>
                  <td className="py-3 px-4 text-emerald-400 font-semibold">{st.land_acquired_ha}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-slate-700 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-emerald-500 h-1.5 rounded-full" 
                          style={{ width: `${Math.min(st.progress_pct, 100)}%` }}
                        />
                      </div>
                      <span className="font-bold">{st.progress_pct}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      to={`/admin/central/states?selected=${encodeURIComponent(st.state)}`}
                      className="text-indigo-400 hover:text-indigo-300 font-bold"
                    >
                      Inspect State &rarr;
                    </Link>
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
