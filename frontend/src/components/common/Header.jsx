import React from 'react';
import { ShieldCheck, Phone, Globe, Eye } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 text-slate-800 shadow-sm sticky top-0 z-50">
      {/* Top Tricolor Accent Line */}
      <div className="goi-tricolor-bar"></div>

      {/* Top Accessibility & GoI Utility Bar */}
      <div className="bg-[#0b2545] text-white text-xs py-1 px-4 flex flex-wrap justify-between items-center">
        <div className="flex items-center space-x-4">
          <span className="font-semibold tracking-wide flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            GOVERNMENT OF INDIA | NATIONAL PORTAL
          </span>
          <span className="hidden md:inline text-slate-300">|</span>
          <span className="hidden md:inline text-slate-200">Ministry of Rural Development • Department of Land Resources (DoLR)</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 hover:text-amber-300 cursor-pointer">
            <Phone className="w-3.5 h-3.5 text-amber-400" />
            <span>Toll Free: 1800-11-2013</span>
          </div>
          <span>|</span>
          <div className="flex items-center space-x-1 cursor-pointer hover:text-amber-300">
            <Globe className="w-3.5 h-3.5" />
            <select className="bg-transparent border-none text-xs text-white focus:outline-none cursor-pointer">
              <option className="text-black" value="en">English</option>
              <option className="text-black" value="hi">हिंदी (Hindi)</option>
              <option className="text-black" value="gu">ગુજરાતી (Gujarati)</option>
            </select>
          </div>
          <span>|</span>
          <div className="flex items-center space-x-1 cursor-pointer hover:text-amber-300">
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Accessibility</span>
          </div>
        </div>
      </div>

      {/* Main PARIVESH / N-LAMS National Emblem Brand Header */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center space-x-4">
          {/* Emblem & Logos */}
          <div className="flex items-center space-x-3 border-r border-slate-200 pr-4">
            <div className="w-12 h-14 bg-amber-50 rounded border border-amber-200 flex flex-col items-center justify-center p-1 shadow-inner">
              <ShieldCheck className="w-8 h-8 text-[#0b2545]" />
              <span className="text-[8px] font-bold text-amber-800 uppercase tracking-tighter">Satyameva Jayate</span>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#0b2545] font-serif">
                N-LAMS
              </h1>
              <p className="text-xs text-slate-600 font-medium">
                National Land Acquisition & Management System
              </p>
              <p className="text-[10px] text-amber-700 font-semibold">
                Single-Window Digital Governance & Decision Support Platform
              </p>
            </div>
          </div>

          <div className="hidden lg:block text-xs text-slate-500 max-w-xs leading-relaxed">
            Real-time Monitoring under <span className="font-semibold text-slate-700">RFCTLARR Act 2013</span> across all States & UTs.
          </div>
        </div>

        {/* SIH PS 26016 Badge & Quick Status */}
        <div className="flex items-center space-x-3">
          <div className="bg-amber-50 border border-amber-300 px-3 py-1.5 rounded-lg text-right hidden sm:block">
            <div className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">Problem Statement ID</div>
            <div className="text-xs font-extrabold text-[#0b2545]">PS-26016 (Smart Automation)</div>
          </div>

          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs px-3 py-1.5 rounded-lg flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
            <div>
              <span className="font-bold block">Live Portal</span>
              <span className="text-[10px] text-emerald-700">36 States/UTs Connected</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
