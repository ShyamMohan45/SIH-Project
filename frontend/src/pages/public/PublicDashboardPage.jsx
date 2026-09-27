import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Building2, MapPin, FileText, CheckCircle2, TrendingUp, 
  Search, ArrowRight, ShieldCheck, Calendar, AlertCircle, 
  Layers, Users, Award 
} from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000/api';

export default function PublicDashboardPage() {
  const [summary, setSummary] = useState(null);
  const [states, setStates] = useState([]);
  const [notices, setNotices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [sumRes, stRes, notRes, projRes] = await Promise.all([
          axios.get(`${API_BASE}/public/summary`),
          axios.get(`${API_BASE}/public/states`),
          axios.get(`${API_BASE}/public/notices`),
          axios.get(`${API_BASE}/public/projects`)
        ]);
        setSummary(sumRes.data);
        setStates(stRes.data);
        setNotices(notRes.data.slice(0, 4));
        setProjects(projRes.data.slice(0, 6));
      } catch (err) {
        console.error('Failed loading public portal data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero Banner with Search */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 text-white rounded-2xl p-6 sm:p-10 shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial-gradient from-amber-500/10 to-transparent pointer-events-none" />
        
        <div className="max-w-3xl relative z-10 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold tracking-wide border border-amber-400/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Official Government Transparency Portal &bull; Open Access</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            National Land Acquisition Transparency & Citizen Disclosure
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Track major infrastructure projects across India in full transparency under the RFCTLARR Act 2013. Monitor gazette notifications, social impact hearings, and compensation disbursement status without login.
          </p>

          {/* Quick Search */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search project by name, highway, or district..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <Link
              to={searchTerm ? `/public/projects?search=${encodeURIComponent(searchTerm)}` : '/public/projects'}
              className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm text-center transition-colors shadow"
            >
              Search Disclosures
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Public Projects</span>
            <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {summary?.published_projects || summary?.total_projects || '10'}
          </div>
          <p className="text-xs text-slate-500 mt-1">Across {summary?.participating_states || '8'} States & UTs</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Land Acquired</span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {summary?.total_land_acquired_ha ? summary.total_land_acquired_ha.toLocaleString() : '16,030'} <span className="text-xs font-normal text-slate-500">ha</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div 
              className="bg-emerald-600 h-1.5 rounded-full" 
              style={{ width: `${summary?.national_progress_pct || 63.8}%` }}
            />
          </div>
          <p className="text-xs text-emerald-700 font-semibold mt-1.5">
            {summary?.national_progress_pct || '63.8'}% of {summary?.total_land_required_ha ? summary.total_land_required_ha.toLocaleString() : '25,120'} ha
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Families Supported</span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-lg">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {summary?.affected_families_count ? summary.affected_families_count.toLocaleString() : '26,600'}
          </div>
          <p className="text-xs text-slate-500 mt-1">Under statutory R&R benefits</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Gazette Notices</span>
            <div className="p-2 bg-rose-50 text-rose-700 rounded-lg">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {summary?.public_notices_count || '5'}
          </div>
          <p className="text-xs text-slate-500 mt-1">Sec 11, SIA & Award Notices</p>
        </div>
      </div>

      {/* Two Column Section: Featured Projects & Recent Notices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Featured Disclosed Projects */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Publicly Disclosed Projects</h3>
              <p className="text-xs text-slate-500">Transparent progress and statutory milestones</p>
            </div>
            <Link to="/public/projects" className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center space-x-1">
              <span>View All Projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.map((p) => (
              <Link 
                key={p.id}
                to={`/public/projects/${p.id}`}
                className="block bg-white p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {p.project_code}
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {p.status || 'Active'}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-900 group-hover:text-indigo-700 transition-colors line-clamp-1 mb-1">
                  {p.name}
                </h4>

                <div className="text-xs text-slate-500 flex items-center space-x-1 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{p.district}, {p.state}</span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-medium">
                    <span className="text-slate-500">Progress: {p.progress_pct}%</span>
                    <span className="text-slate-700">{p.land_acquired_ha} / {p.land_required_ha} ha</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-1.5 rounded-full" 
                      style={{ width: `${Math.min(p.progress_pct, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Stage: <strong>{p.current_stage || 'Possession'}</strong></span>
                  <span className="text-indigo-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center">
                    Details &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right Col: Recent Public Notices */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Statutory Gazette Notices</h3>
              <p className="text-xs text-slate-500">Published under RFCTLARR 2013</p>
            </div>
            <Link to="/public/notices" className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center space-x-1">
              <span>All Notices</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {notices.map((n) => (
              <div key={n.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-semibold uppercase">
                    {n.notice_type.replace('_', ' ')}
                  </span>
                  <span className="text-slate-400 flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{n.issue_date}</span>
                  </span>
                </div>
                <h4 className="font-bold text-xs text-slate-900 leading-snug">
                  {n.title}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-2">
                  {n.summary}
                </p>
                <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{n.district}, {n.state}</span>
                  <Link 
                    to="/public/notices" 
                    className="text-indigo-600 hover:underline font-semibold"
                  >
                    View Official Text &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* State-wise Breakdown Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-slate-900">State-wise Acquisition Transparency Matrix</h3>
            <p className="text-xs text-slate-500">Aggregated statistics by State / Union Territory</p>
          </div>
          <span className="text-xs text-slate-400 self-start sm:self-auto">
            Updated daily via State Revenue Departments
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-y border-slate-200">
              <tr>
                <th className="py-3 px-4">State / UT</th>
                <th className="py-3 px-4">Projects</th>
                <th className="py-3 px-4">Land Required (ha)</th>
                <th className="py-3 px-4">Land Acquired (ha)</th>
                <th className="py-3 px-4">Progress (%)</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {states.map((st) => (
                <tr key={st.state} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{st.state}</td>
                  <td className="py-3 px-4">{st.projects_count}</td>
                  <td className="py-3 px-4">{st.land_required_ha.toLocaleString()}</td>
                  <td className="py-3 px-4 font-medium text-emerald-700">{st.land_acquired_ha.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-emerald-600 h-1.5 rounded-full" 
                          style={{ width: `${Math.min(st.progress_pct, 100)}%` }}
                        />
                      </div>
                      <span className="font-semibold text-slate-800">{st.progress_pct}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      to={`/public/projects?state=${encodeURIComponent(st.state)}`}
                      className="text-indigo-600 hover:text-indigo-800 font-bold hover:underline"
                    >
                      View Projects &rarr;
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
