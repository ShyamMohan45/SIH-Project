import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Building2, Landmark, ShieldCheck, FileText, MapPin, 
  Layers, LogOut, User, Activity, Globe, ChevronRight 
} from 'lucide-react';

export default function CentralAdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'National Control Room', path: '/admin/central/dashboard' },
    { label: 'States & UTs Performance', path: '/admin/central/states' },
    { label: 'National Projects', path: '/admin/central/projects' },
    { label: 'Central Officer Profile', path: '/admin/central/profile' },
    { label: 'National Audit Logs', path: '/admin/central/audit' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('nlams_token');
    localStorage.removeItem('nlams_user');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Top National Alert Stripe */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500" />

      {/* Control Room Header */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-slate-800 flex items-center justify-center border border-amber-400/40">
              <Landmark className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base font-black tracking-tight text-white">N-LAMS CENTRAL CONTROL ROOM</h1>
                <span className="px-2 py-0.5 text-[9px] font-black uppercase rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  National Authority
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Department of Land Resources &bull; All-India Jurisdiction</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/portal"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition"
            >
              Staff Portal & GIS Studio &rarr;
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-500/30 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Central Admin Tabs */}
        <div className="bg-slate-900/90 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 flex overflow-x-auto space-x-2 py-1 scrollbar-none">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-indigo-600 text-white font-bold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6">
        <Outlet />
      </main>

      <footer className="bg-slate-950 border-t border-slate-800 py-3 px-4 text-center text-slate-400 text-xs">
        Central Administration Control Room &bull; RFCTLARR 2013 Statutory Monitoring Matrix &bull; MoRD Government of India
      </footer>
    </div>
  );
}
