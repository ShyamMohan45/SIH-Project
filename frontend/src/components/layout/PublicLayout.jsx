import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  Building2, Landmark, ShieldCheck, FileText, MapPin, 
  Lock, Globe, Info, HelpCircle, BarChart3, ChevronRight 
} from 'lucide-react';

export default function PublicLayout() {
  const location = useLocation();

  const navItems = [
    { label: 'Transparency Overview', path: '/' },
    { label: 'Disclosed Projects', path: '/public/projects' },
    { label: 'Public Notices', path: '/public/notices' },
    { label: 'Public Disclosures', path: '/public/reports' },
    { label: 'Public Map', path: '/public/map' },
    { label: 'Operational GIS', path: '/operational-gis' },
    { label: 'Citizen Help & FAQ', path: '/public/help' }
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Top Tricolor Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-white to-emerald-600 shadow-sm" />

      {/* Top Official Banner */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 sm:px-8 flex justify-between items-center border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-medium tracking-wide">GOVERNMENT OF INDIA &bull; DIGITAL INDIA LAND RECORDS INITIATIVE</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-slate-400 hidden sm:inline">RTI Act & RFCTLARR Act 2013 Statutory Compliance</span>
          <Link 
            to="/portal" 
            className="text-amber-400 hover:text-amber-300 transition-colors font-medium flex items-center space-x-1"
          >
            <span>Staff Portal</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Main Institutional Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex flex-wrap justify-between items-center gap-4">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-3.5 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-900 to-slate-900 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform border border-amber-400/30">
              <Landmark className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-black tracking-tight text-slate-900">N-LAMS</h1>
                <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase">
                  Public Transparency
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-tight">
                National Land Acquisition Monitoring System &bull; Common Citizen Portal
              </p>
            </div>
          </Link>

          {/* Action Button: Dedicated Administrative Login */}
          <div className="flex items-center space-x-3">
            <Link
              to="/admin/login"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm hover:shadow transition-all border border-slate-700"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Administrative Login</span>
            </Link>
          </div>
        </div>

        {/* Public Navigation Bar */}
        <div className="bg-slate-100/90 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 flex overflow-x-auto space-x-1 py-1 scrollbar-none">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3.5 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                    active
                      ? 'bg-white text-indigo-900 font-bold shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Mandatory Statutory Transparency & Privacy Disclaimer */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200/80 px-4 sm:px-8 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              <strong>Citizen Notice:</strong> Information published here is proactively disclosed under Section 4 of the RTI Act and Section 11/23 of RFCTLARR 2013. Private landowner contact details, Aadhaar, and banking credentials remain legally protected and redacted.
            </span>
          </div>
          <span className="hidden md:inline-block px-2 py-0.5 rounded bg-amber-200/70 text-amber-950 font-semibold text-[10px]">
            Statutory Public Domain
          </span>
        </div>
      </div>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6">
        <Outlet />
      </main>

      {/* Institutional Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Landmark className="w-5 h-5 text-amber-400" />
              <span className="font-bold text-slate-100 text-sm">N-LAMS Public Transparency</span>
            </div>
            <p className="text-slate-400 leading-relaxed mb-3">
              Department of Land Resources (DoLR), Ministry of Rural Development, Government of India.
            </p>
            <p className="text-[11px] text-slate-400">
              New Delhi &bull; Integrated with Digital India Land Records (DILRMP).
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 mb-3 uppercase tracking-wider text-[11px]">Public Disclosures</h4>
            <ul className="space-y-2">
              <li><Link to="/public/projects" className="hover:text-amber-400 transition">Approved National Projects</Link></li>
              <li><Link to="/public/notices" className="hover:text-amber-400 transition">Section 11 Preliminary Gazettes</Link></li>
              <li><Link to="/public/notices" className="hover:text-amber-400 transition">Social Impact Assessment (SIA) Hearings</Link></li>
              <li><Link to="/public/reports" className="hover:text-amber-400 transition">Annual Compensation & R&R Disclosures</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 mb-3 uppercase tracking-wider text-[11px]">Statutory & Grievance</h4>
            <ul className="space-y-2">
              <li><Link to="/public/help" className="hover:text-amber-400 transition">How Compensation is Calculated</Link></li>
              <li><Link to="/public/help" className="hover:text-amber-400 transition">Landowner Entitlement Matrix</Link></li>
              <li><Link to="/public/help" className="hover:text-amber-400 transition">CPGRAMS / SLAO Grievance Cell</Link></li>
              <li><a href="https://dolr.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition">DoLR Official Portal</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 mb-3 uppercase tracking-wider text-[11px]">Authorized Access</h4>
            <p className="text-slate-400 mb-3">
              Dedicated portals with role-based cryptographic authentication for designated government officers.
            </p>
            <Link
              to="/admin/login"
              className="inline-block px-3.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 font-medium text-xs border border-slate-700 transition"
            >
              Administrative Access &rarr;
            </Link>
          </div>
        </div>

        <div className="border-t border-slate-800 py-4 px-4 sm:px-8 text-center text-slate-400 text-[11px]">
          Designed and developed for the Government of India. Hosted by National Informatics Centre (NIC).
        </div>
      </footer>
    </div>
  );
}
