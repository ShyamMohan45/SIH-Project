import React, { useState } from 'react';
import { Shield, MapPin, Cpu, Play, Film, Sparkles, MessageSquare, ArrowRight, Layers, CheckCircle2 } from 'lucide-react';
import FeatureGrid from '../components/dashboard/FeatureGrid';
import VideoModal from '../components/common/VideoModal';

export default function LandingPage({ onExploreModule }) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <div className="space-y-10 relative">
      {/* Video Modal Component */}
      <VideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} videoId="ELO-9TsPu3k" />

      {/* Hero Section with Aerial Cadastral Map Background */}
      <div className="relative bg-[#0b2545] text-white rounded-2xl overflow-hidden shadow-2xl border border-slate-800 min-h-[480px]">
        {/* High-Resolution Green Aerial Drone Cadastral Survey Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 scale-105 transition-transform duration-1000"
          style={{ backgroundImage: `url('/assets/images/aerial_hero_bg.jpg')` }}
        ></div>

        {/* Cadastral Grid Overlay Pattern for extra clarity */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay"
          style={{ backgroundImage: `url('/assets/images/cadastral_grid_overlay.png')` }}
        ></div>

        {/* Gradient Overlay for Premium Readability & Exact Color Matching */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b2545] via-[#0b2545]/80 to-[#0b2545]/40 z-10"></div>

        <div className="relative z-20 max-w-6xl mx-auto px-6 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            {/* Unified National Platform Badge */}
            <div className="inline-flex items-center space-x-2 bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold px-3.5 py-1.5 rounded-full mb-4 shadow-sm backdrop-blur-md">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Unified National Platform • Ministry of Rural Development</span>
            </div>

            {/* Sub-headline */}
            <div className="text-amber-400 text-xs font-extrabold uppercase tracking-widest mb-1">
              KEY FEATURES OF N-LAMS
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight font-serif text-white leading-tight">
              Elevating Land Management for <span className="text-amber-400 underline decoration-amber-500/50">Informed Decisions</span>
            </h1>

            {/* Main Paragraph Text */}
            <p className="text-sm md:text-base text-slate-200 mt-4 leading-relaxed font-medium">
              Discover N-LAMS – Your Digital Hub for Land Information and Efficiency. Digitizing the complete lifecycle from proposal submission to final physical possession under <span className="font-bold text-white">RFCTLARR Act 2013</span> with real-time GIS cadastral mapping and AI-driven decision support.
            </p>

            {/* Hero Buttons */}
            <div className="mt-8 flex flex-wrap gap-4 items-center">
              <button
                onClick={() => onExploreModule('gis')}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs md:text-sm py-3.5 px-6 rounded-xl transition-all shadow-lg flex items-center space-x-2.5 hover:scale-105 cursor-pointer"
              >
                <MapPin className="w-4.5 h-4.5 text-slate-950" />
                <span>Open GIS Cadastral Workspace</span>
              </button>

              <button
                onClick={() => setIsVideoOpen(true)}
                className="bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs md:text-sm py-3.5 px-6 rounded-xl transition-all shadow-lg flex items-center space-x-2.5 border border-red-400/50 hover:scale-105 cursor-pointer group"
              >
                <div className="w-6 h-6 rounded-full bg-white text-red-600 flex items-center justify-center shadow">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </div>
                <span>Watch Product Demo Video</span>
              </button>
            </div>
          </div>

          {/* Right Floating Active Project Monitoring Card */}
          <div className="bg-slate-900/80 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl text-xs space-y-4 relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="font-extrabold text-amber-300 text-sm">Active Project Monitoring</span>
              </div>
              <button
                onClick={() => setIsVideoOpen(true)}
                className="bg-amber-400/20 text-amber-300 hover:bg-amber-400/30 px-2.5 py-1 rounded text-[10px] font-bold border border-amber-400/40 flex items-center space-x-1 cursor-pointer"
              >
                <Film className="w-3 h-3" />
                <span>Play Video Guide</span>
              </button>
            </div>

            <div>
              <div className="text-base font-extrabold text-white">Ahmedabad–Rajkot Green Highway Expansion</div>
              <div className="text-slate-300 text-[11px] mt-0.5">Project ID: NH-GJ-2026-001 • Gujarat State</div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-700/80">
                <div className="text-slate-400 text-[10px]">Land Requirement</div>
                <div className="text-base font-extrabold text-amber-400">1,250 Hectares</div>
                <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">780 ha Acquired (62.4%)</div>
              </div>
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-700/80">
                <div className="text-slate-400 text-[10px]">AI Delay Risk</div>
                <div className="text-base font-extrabold text-red-400">82% High Risk</div>
                <div className="text-[10px] text-red-300 font-semibold mt-0.5">+74 Days Predicted</div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-300 border-t border-white/10">
              <span>Stakeholders Connected: 4 Districts</span>
              <span className="text-amber-300 font-bold">2,400 Affected Families</span>
            </div>
          </div>
        </div>
      </div>

      {/* Video Demonstration Section */}
      <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 my-6">
        <div className="flex flex-wrap justify-between items-center mb-6 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center space-x-2">
              <Film className="w-5 h-5 text-red-600" />
              <h2 className="text-xl font-bold text-[#0b2545] font-serif">
                System Video Walkthrough & Help Guide
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Watch how N-LAMS digitizes cadastral mapping, Section 15 legal review, compensation payouts, and AI risk alerts.
            </p>
          </div>

          <button
            onClick={() => setIsVideoOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs py-2 px-4 rounded-lg shadow transition-colors flex items-center space-x-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Launch Fullscreen Player</span>
          </button>
        </div>

        {/* Embedded YouTube iFrame */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2 relative pt-[56.25%] rounded-xl overflow-hidden shadow-lg border border-slate-300 bg-black">
            <iframe
              className="absolute top-0 left-0 w-full h-full border-none"
              src="https://www.youtube.com/embed/ELO-9TsPu3k?rel=0"
              title="LAMS Video Guide"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3 text-xs">
            <div className="font-extrabold text-[#0b2545] text-sm">Key Topics Covered in Video:</div>
            <ul className="space-y-2">
              <li className="flex items-start space-x-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Digitization of paper cadastral maps into interactive spatial vectors.</span>
              </li>
              <li className="flex items-start space-x-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>11-Stage statutory workflow tracking under RFCTLARR Act.</span>
              </li>
              <li className="flex items-start space-x-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Owner family tree heir mapping and compensation valuation.</span>
              </li>
              <li className="flex items-start space-x-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>AI anomaly detection & automated litigation alert triggers.</span>
              </li>
            </ul>

            <button
              onClick={() => onExploreModule('gis')}
              className="w-full mt-2 bg-[#0b2545] hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Try Live Interactive Map</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Feature Insights Showcase */}
      <FeatureGrid onSelectFeature={(featId) => onExploreModule(featId)} />

      {/* Floating Action Badges Matching Screenshots */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col space-y-3">
        <button
          onClick={() => onExploreModule('ai_risk')}
          className="bg-[#0b2545] text-white hover:bg-slate-900 font-extrabold text-xs py-2.5 px-4 rounded-full shadow-2xl border border-amber-400/50 flex items-center space-x-2 hover:scale-105 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
          <span>AI in N-LAMS</span>
        </button>

        <button
          onClick={() => setIsVideoOpen(true)}
          className="bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs py-2.5 px-4 rounded-full shadow-2xl border border-red-400 flex items-center space-x-2 hover:scale-105 transition-all cursor-pointer"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Watch Video Demo</span>
        </button>
      </div>
    </div>
  );
}
