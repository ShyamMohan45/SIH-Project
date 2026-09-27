import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Building2, MapPin, Search, ChevronRight } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000/api';

export default function StateProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const userStr = localStorage.getItem('nlams_user');
  const user = userStr ? JSON.parse(userStr) : null;
  const stateName = user?.state || 'Gujarat';

  const token = localStorage.getItem('nlams_token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await axios.get(`${API_BASE}/admin/state/projects?state_name=${encodeURIComponent(stateName)}`, { headers });
        setProjects(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, [stateName]);

  if (loading) return <div className="p-8 text-center text-xs text-slate-400">Loading {stateName} projects...</div>;

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-2xl font-black text-white">{stateName} State Infrastructure Projects</h2>
        <p className="text-xs text-slate-400">Strictly filtered to projects within {stateName} state boundary</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {projects.map((p) => (
          <div key={p.id} className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-slate-400">{p.project_code}</span>
              <span className="px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 font-semibold text-[10px]">
                {p.status}
              </span>
            </div>

            <h3 className="font-bold text-sm text-white">{p.name}</h3>

            <div className="text-xs text-slate-400 flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>{p.district}, {p.state}</span>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Acquired: {p.land_acquired_ha} ha</span>
                <span className="text-emerald-400 font-bold">{p.progress_pct}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-1.5 rounded-full" 
                  style={{ width: `${Math.min(p.progress_pct, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                <span>Required: {p.land_required_ha} ha</span>
                <span>Stage: <strong>{p.current_stage}</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
