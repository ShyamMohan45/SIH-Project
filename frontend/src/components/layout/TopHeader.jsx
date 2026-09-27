import React, { useState } from 'react';
import { 
  Shield, Search, Bell, Activity, ChevronDown, CheckCircle2, 
  Building2, MapPin, User, LogOut, ExternalLink, AlertTriangle, Play
} from 'lucide-react';

export default function TopHeader({ 
  userSession, 
  onRoleSwitch, 
  selectedState, 
  setSelectedState, 
  selectedDistrict, 
  setSelectedDistrict, 
  onOpenSearch, 
  onNavigateTab,
  onOpenVideo,
  activeAlertsCount = 6
}) {
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

  const roles = [
    { id: 'CENTRAL_ADMIN', title: 'Central Administrator', dept: 'Ministry of Rural Development (DoLR)', state: 'All India', district: 'All Districts' },
    { id: 'STATE_OFFICER', title: 'State Acquisition Nodal', dept: 'Revenue & Land Reforms Dept.', state: 'Gujarat', district: 'All Districts' },
    { id: 'DISTRICT_OFFICER', title: 'District Collector & CALA', dept: 'Competent Authority (Rajkot/Surendranagar)', state: 'Gujarat', district: 'Rajkot / Surendranagar' },
    { id: 'VIEWER', title: 'Public & Parliamentary Viewer', dept: 'National Infrastructure Oversight Cell', state: 'All India', district: 'All Districts' }
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Tricolor Accent Line */}
      <div className="h-1 bg-gradient-to-r from-amber-500 via-white to-emerald-600"></div>

      <div className="px-5 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Official Emblem & Portal Title */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-11 bg-amber-50/80 rounded border border-amber-300 flex flex-col items-center justify-center p-0.5 shadow-xs">
            <Shield className="w-5 h-5 text-[#0b2545]" />
            <span className="text-[6px] font-black text-amber-800 uppercase tracking-tighter mt-0.5">Satyameva Jayate</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-[#0b2545] tracking-tight font-serif">N-LAMS</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 uppercase tracking-wider">
                PS16 • PS17 Control Room
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 uppercase tracking-tight">
                DEMO / SYNTHETIC DATA
              </span>
            </div>
            <p className="text-[11px] font-bold text-slate-700 leading-none mt-0.5">
              National Land Acquisition & Management System
            </p>
            <p className="text-[10px] text-slate-500 font-medium">
              Department of Land Resources • Ministry of Rural Development, Government of India
            </p>
          </div>
        </div>

        {/* Center: Global Search Bar + State/District Filters */}
        <div className="flex-1 max-w-2xl flex items-center gap-3">
          {/* Global Search Button */}
          <button
            onClick={onOpenSearch}
            className="flex-1 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-500 flex items-center justify-between transition-colors shadow-2xs group"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
              <span className="truncate">Search Project ID, Parcel Khasra 1042, Village, Inspection ID...</span>
            </div>
            <kbd className="hidden sm:inline-block bg-white border border-slate-300 text-[10px] font-mono font-bold text-slate-600 px-1.5 py-0.5 rounded shadow-2xs">
              Ctrl+K
            </kbd>
          </button>

          {/* State Jurisdiction Filter */}
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-700">
            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-transparent font-bold text-slate-800 text-xs focus:outline-none cursor-pointer"
            >
              <option value="ALL">All States (National)</option>
              <option value="Gujarat">Gujarat State</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Haryana">Haryana</option>
            </select>
          </div>

          {/* District Filter */}
          <div className="hidden xl:flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-transparent font-bold text-slate-800 text-xs focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Districts</option>
              <option value="Rajkot">Rajkot</option>
              <option value="Surendranagar">Surendranagar</option>
              <option value="Ahmedabad">Ahmedabad</option>
              <option value="Thane">Thane</option>
            </select>
          </div>
        </div>

        {/* Right Controls: Telemetry, Alerts, Role Switcher */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* System Telemetry Pill */}
          <div className="hidden md:flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 px-2.5 py-1 rounded-md text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Gateway 99.8%</span>
          </div>

          {/* Early Warning Alerts Bell */}
          <button
            onClick={() => onNavigateTab('alerts')}
            className="relative p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title="View Active AI Delay Alerts"
          >
            <Bell className="w-4 h-4" />
            {activeAlertsCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-rose-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {activeAlertsCount}
              </span>
            )}
          </button>

          {/* Watch Product Demo Video Button */}
          <button
            onClick={onOpenVideo}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer"
            title="Watch Official N-LAMS System Walkthrough Video (YouTube)"
          >
            <Play className="w-3.5 h-3.5 fill-red-600 text-red-600" />
            <span className="hidden sm:inline">Demo Video</span>
          </button>

          {/* Hon'ble Prime Minister of India Dignitary Badge */}
          <div className="hidden lg:flex items-center gap-2.5 pl-3 border-l border-slate-200">
            <img
              src="/assets/images/pm_modi.png"
              alt="Shri Narendra Modi, Hon'ble Prime Minister of India"
              className="w-9 h-11 object-cover object-top rounded border border-slate-300 shadow-2xs bg-white shrink-0"
            />
            <div className="text-left leading-tight">
              <div className="text-[11px] font-black text-[#0b2545]">Shri Narendra Modi</div>
              <div className="text-[9px] font-bold text-slate-600">Hon'ble Prime Minister</div>
              <div className="text-[8px] font-semibold text-amber-700">PM GatiShakti Vision</div>
            </div>
          </div>

          {/* Citizen Public Portal Link */}
          <a
            href="/"
            className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-300 transition flex items-center gap-1"
          >
            <span>Public Portal</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          {/* Role Switcher Menu */}
          <div className="relative">
            <button
              onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
              className="flex items-center gap-2 bg-[#0b2545] hover:bg-[#12315b] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs"
            >
              <User className="w-3.5 h-3.5 text-amber-400" />
              <div className="text-left leading-tight hidden sm:block">
                <div className="text-[11px] font-black">{userSession.roleTitle}</div>
                <div className="text-[9px] text-blue-200 font-normal">{userSession.role}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
            </button>

            {isRoleMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 text-xs font-sans">
                <div className="px-3.5 py-2 border-b border-slate-100 bg-slate-50">
                  <div className="font-bold text-slate-900">Switch Stakeholder Role (RBAC)</div>
                  <div className="text-[10px] text-slate-500">Demo full multi-tier administrative governance</div>
                </div>

                <div className="p-1 space-y-0.5">
                  {roles.map((r) => {
                    const isSelected = userSession.role === r.id;
                    return (
                      <button
                        key={r.id}
                        onClick={() => {
                          onRoleSwitch({
                            role: r.id,
                            roleTitle: r.title,
                            department: r.dept,
                            state: r.state,
                            district: r.district
                          });
                          setIsRoleMenuOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-lg transition-colors flex items-start justify-between ${
                          isSelected ? 'bg-blue-50 text-blue-950 font-bold border border-blue-200' : 'hover:bg-slate-100 text-slate-800'
                        }`}
                      >
                        <div>
                          <div className="font-extrabold text-[11px] text-[#0b2545]">{r.title}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">{r.dept}</div>
                          <div className="text-[9px] text-slate-400 mt-0.5">Jurisdiction: {r.state} • {r.district}</div>
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
