import React from 'react';
import { X, Play, ShieldCheck, Film } from 'lucide-react';

export default function VideoModal({ isOpen, onClose, videoId = 'ELO-9TsPu3k' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden border border-slate-700 animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="bg-[#0b2545] text-white p-4 flex justify-between items-center border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-serif">
                National Land Acquisition & Management System — Product Demonstration
              </h3>
              <p className="text-[11px] text-amber-300">
                Official Walkthrough: Digital Workflows, Cadastral GIS & AI Decision Support
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Video Player Container */}
        <div className="relative pt-[56.25%] w-full bg-black">
          <iframe
            className="absolute top-0 left-0 w-full h-full border-none"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title="LAMS Product Demo Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap justify-between items-center text-xs text-slate-400 gap-2">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Ministry of Rural Development • DoLR Compliant Video Tutorial</span>
          </div>
          <button
            onClick={onClose}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-1.5 rounded-lg transition-colors"
          >
            Close Video Player
          </button>
        </div>
      </div>
    </div>
  );
}
