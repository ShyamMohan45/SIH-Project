import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Search, MapPin, Building2, ChevronRight, ShieldCheck, Filter } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000/api';

export default function PublicProjectsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const stateQuery = searchParams.get('state') || 'All';
  const searchQuery = searchParams.get('search') || '';

  const [projects, setProjects] = useState([]);
  const [selectedState, setSelectedState] = useState(stateQuery);
  const [searchText, setSearchText] = useState(searchQuery);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        let url = `${API_BASE}/public/projects?`;
        if (selectedState !== 'All') url += `state=${encodeURIComponent(selectedState)}&`;
        if (searchText) url += `search=${encodeURIComponent(searchText)}&`;
        const res = await axios.get(url);
        setProjects(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, [selectedState, searchText]);

  const stateOptions = ['All', 'Gujarat', 'Maharashtra', 'Rajasthan', 'Karnataka', 'Uttar Pradesh', 'Tamil Nadu', 'Madhya Pradesh', 'Odisha'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Statutory Public Projects Directory</h2>
          <p className="text-xs text-slate-500">
            Proactively disclosed infrastructure projects across India under RFCTLARR Act 2013
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Showing {projects.length} Verified National Projects</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap gap-4 items-center">
        <div className="flex items-center space-x-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by project name, corridor, or district..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 border-l border-slate-200 pl-4">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-500 font-medium">State:</span>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none"
          >
            {stateOptions.map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map(p => (
          <div key={p.id} className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow p-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700">
                  {p.project_type}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                  {p.status}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-slate-900 hover:text-indigo-600 transition">
                  <Link to={`/public/projects/${p.id}`}>{p.name}</Link>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Code: {p.project_code}</p>
              </div>

              <div className="flex items-center space-x-1.5 text-xs text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{p.district}, {p.state}</span>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-500">Acquired: {p.land_acquired_ha} ha</span>
                  <span className="text-slate-800 font-bold">{p.progress_pct}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-emerald-600 h-2 rounded-full" 
                    style={{ width: `${Math.min(p.progress_pct, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Required: {p.land_required_ha} ha</span>
                  <span>Stage: <strong>{p.current_stage}</strong></span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Target: {p.target_date || '2027'}</span>
              <Link
                to={`/public/projects/${p.id}`}
                className="inline-flex items-center space-x-1 text-xs font-bold text-indigo-700 hover:text-indigo-900"
              >
                <span>View Disclosure</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
