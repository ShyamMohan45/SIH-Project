import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Building2, Landmark, ShieldCheck, MapPin, 
  LogOut, User, Activity, AlertTriangle, ChevronRight 
} from 'lucide-react';

export default function StateAdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const userStr = localStorage.getItem('nlams_user');
  const user = userStr ? JSON.parse(userStr) : null;
  const stateName = user?.state || 'Gujarat';

  const navItems = [
    { label: 'State Operations Room', path: '/admin/state/dashboard' },
    { label: 'State Districts', path: '/admin/state/districts' },
    { label: 'State Projects', path: '/admin/state/projects' },
    { label: 'State Officer Profile', path: '/admin/state/profile' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('nlams_token');
    localStorage.removeItem('nlams_user');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Top State Alert Stripe */}
      <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500" />

      {/* State Operations Room Header */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-700 to-slate-800 flex items-center justify-center border border-emerald-400/40">
              <Landmark className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base font-black tracking-tight text-white uppercase">
                  N-LAMS {stateName} Operations Room
                </h1>
                <span className="px-2 py-0.5 text-[9px] font-black uppercase rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  State SLAO Authority
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Department of Revenue &bull; Government of {stateName}</p>
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

        {/* State Admin Tabs */}
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
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
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

      {/* State Isolation Warning & Verification Banner */}
      <div className="bg-emerald-950/40 border-b border-emerald-800/60 px-4 sm:px-8 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-emerald-300">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Cryptographic State Isolation Enforced:</strong> Your session is strictly authorized for <strong>{stateName}</strong> records. Cross-state data access is blocked by backend security filters.
            </span>
          </div>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-200 font-mono text-[10px]">
            Jurisdiction: {stateName} State
          </span>
        </div>
      </div>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6">
        <Outlet />
      </main>

      <footer className="bg-slate-950 border-t border-slate-800 py-3 px-4 text-center text-slate-400 text-xs">
        State Land Acquisition Administration &bull; Office of Special Land Acquisition Officer (SLAO) &bull; Government of {stateName}
      </footer>
    </div>
  );
}
