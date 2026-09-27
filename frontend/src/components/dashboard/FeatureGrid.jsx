import React from 'react';
import { Layers, MapPin, Users, Calculator, ShieldAlert, Scale, DollarSign, Cpu } from 'lucide-react';

export default function FeatureGrid({ onSelectFeature }) {
  const features = [
    {
      id: 'gis_boundary',
      title: 'Plot / Parcel Boundary GIS Visualization',
      subtitle: 'High-Definition Digital Cadastral Mapping',
      icon: MapPin,
      color: 'from-blue-600 to-indigo-700',
      badge: 'GIS Cadastral',
      description: 'Overlay vector plot boundaries onto Google Satellite and OpenStreetMap layers. View spatial extent, area in hectares, and survey numbers instantly.'
    },
    {
      id: 'acquisition_workflow',
      title: 'Land Acquisition Process Monitoring',
      subtitle: 'RFCTLARR Statutory Compliance Engine',
      icon: Layers,
      color: 'from-emerald-600 to-teal-700',
      badge: '11-Stage Workflow',
      description: 'Track proposal submission, digital scrutiny, Gazette 3A/3D notifications, Section 23 awards, and final physical possession status.'
    },
    {
      id: 'family_tree',
      title: 'Plot Owner & Family Tree Mapping',
      subtitle: 'Ancestral Inheritance & Stakeholder Hierarchy',
      icon: Users,
      color: 'from-amber-600 to-orange-700',
      badge: 'LAMSAPP Core',
      description: 'Visualize multi-generational family trees, legal heir shares, joint ownership splits, and beneficiary compensation entitlements.'
    },
    {
      id: 'valuation',
      title: 'Real-Time Plot & Asset Valuation',
      subtitle: 'Solatium, Multiplier & Asset Assessment',
      icon: Calculator,
      color: 'from-purple-600 to-indigo-800',
      badge: 'Automated MIS',
      description: 'Calculate total compensation based on circle rate, rural/urban multiplier factor (1.0 - 2.0x), solatium (100%), structures, and crops.'
    },
    {
      id: 'encroachment',
      title: 'Satellite Encroachment Detection',
      subtitle: 'Aerial & Remote Sensing Anomaly Alerts',
      icon: ShieldAlert,
      color: 'from-red-600 to-rose-700',
      badge: 'AI Satellite',
      description: 'Detect unauthorized construction or agricultural encroachment on acquired/notified land parcels using periodic satellite image diffing.'
    },
    {
      id: 'litigation',
      title: 'Litigation & Legal Case Tracking',
      subtitle: 'Section 15 Objections & High Court Appeals',
      icon: Scale,
      color: 'from-cyan-600 to-blue-800',
      badge: 'Legal Desk',
      description: 'Centralized registry of court stay orders, ownership disputes, hearing dates, and legal counsel assignments with automated reminders.'
    }
  ];

  return (
    <div className="my-8">
      <div className="text-center max-w-3xl mx-auto mb-8">
        <span className="bg-amber-100 text-amber-900 font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
          LAMSAPP Enterprise Benchmarking
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#0b2545] mt-2 font-serif">
          Product Insights & Core System Capabilities
        </h2>
        <p className="text-sm text-slate-600 mt-2">
          Comprehensive suite digitizing every facet of the national land acquisition lifecycle from survey to possession.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feat) => {
          const Icon = feat.icon;
          return (
            <div
              key={feat.id}
              onClick={() => onSelectFeature && onSelectFeature(feat.id)}
              className="bg-white rounded-xl shadow-md border border-slate-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                    {feat.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#0b2545] group-hover:text-blue-700 transition-colors">
                  {feat.title}
                </h3>
                <h4 className="text-xs font-semibold text-amber-700 mt-0.5 mb-2">
                  {feat.subtitle}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {feat.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-700 group-hover:text-blue-900">
                <span>Explore Module</span>
                <span className="text-base group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
