import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Building2, MapPin, TrendingUp, AlertTriangle, ShieldCheck, 
  Users, CheckCircle2, ArrowRight 
} from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000/api';

export default function StateDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const userStr = localStorage.getItem('nlams_user');
  const user = userStr ? JSON.parse(userStr) : null;
  const stateName = user?.state || 'Gujarat';

  useEffect(() => {
    async function loadData() {
      try {
        const token = localStorage.getItem('nlams_token');
        const res = await axios.get(`${API_BASE}/admin/state/dashboard?state_name=${encodeURIComponent(stateName)}`, {
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
  }, [stateName]);

  if (loading) return <div className="p-8 text-center text-xs text-slate-400">Loading {stateName} Operations Room...</div>;
  if (!data) return <div className="p-8 text-center text-xs text-rose-400">Failed to load State Operations data. Verify authorization.</div>;

  return (
    <div className="space-y-6">
      {/* State Operations Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 p-4 sm:p-6 rounded-2xl border border-emerald-800/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <h2 className="text-xl font-black text-white">{data.state} State Acquisition Operations</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time field monitoring across {data.total_districts} revenue districts in {data.state}
          </p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 rounded-lg bg-emerald-900/60 border border-emerald-700 text-emerald-300 text-xs font-bold">
            {data.total_projects} Projects Monitored
          </span>
        </div>
      </div>

      {/* State KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700">
          <span className="text-[11px] uppercase font-bold text-slate-400">Acquisition Progress</span>
          <p className="text-3xl font-black text-emerald-400 mt-1">{data.progress_pct}%</p>
          <p className="text-xs text-slate-400 mt-1">{data.land_acquired_ha.toLocaleString()} of {data.land_required_ha.toLocaleString()} ha</p>
        </div>

        <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700">
          <span className="text-[11px] uppercase font-bold text-slate-400">Affected Families</span>
          <p className="text-3xl font-black text-amber-400 mt-1">{data.affected_families.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-1">Pending R&R: {data.pending_rr} cases</p>
        </div>

        <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700">
          <span className="text-[11px] uppercase font-bold text-slate-400">Pending Compensation</span>
          <p className="text-3xl font-black text-indigo-300 mt-1">{data.pending_compensation}</p>
          <p className="text-xs text-slate-400 mt-1">Parcels pending award DBT</p>
        </div>

        <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700">
          <span className="text-[11px] uppercase font-bold text-slate-400">High Risk Alerts</span>
          <p className="text-3xl font-black text-rose-400 mt-1">{data.critical_projects + data.high_risk_projects}</p>
          <p className="text-xs text-slate-400 mt-1">{data.critical_projects} Critical &bull; {data.high_risk_projects} High</p>
        </div>
      </div>

      {/* Districts Breakdown */}
      <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">District-wise Progress in {data.state}</h3>
            <p className="text-xs text-slate-400">Revenue sub-division performance under SLAO oversight</p>
          </div>
          <Link
            to="/admin/state/districts"
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
          >
            <span>All Districts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(data.districts_summary || []).map((d) => (
            <div key={d.district} className="p-4 rounded-xl bg-slate-900 border border-slate-700 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-sm text-white">{d.district}</h4>
                <span className="px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 text-xs font-mono">
                  {d.projects_count} Project{d.projects_count > 1 ? 's' : ''}
                </span>
              </div>
              <div className="text-xs text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>Land Acquired:</span>
                  <span className="text-emerald-400 font-bold">{d.land_acquired_ha} / {d.land_required_ha} ha</span>
                </div>
              </div>
              <Link
                to={`/admin/state/districts?district=${encodeURIComponent(d.district)}`}
                className="block text-right text-xs text-emerald-400 hover:underline font-bold"
              >
                Inspect District &rarr;
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
