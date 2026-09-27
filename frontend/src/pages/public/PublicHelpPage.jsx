import React from 'react';
import { HelpCircle, PhoneCall, ShieldCheck, BookOpen, AlertCircle, ExternalLink } from 'lucide-react';

export default function PublicHelpPage() {
  const faqs = [
    {
      q: 'How is land acquisition compensation calculated under the 2013 Act?',
      a: 'Under the Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013 (RFCTLARR), compensation is calculated using the higher of the registered sale deed values or circle rates, multiplied by 1.0x (urban) to 2.0x (rural), plus 100% Solatium (statutory bonus).'
    },
    {
      q: 'What are my rights if my land is notified under Section 11?',
      a: 'Once a preliminary notification under Section 11 is published, affected landholders have 60 days to submit written objections regarding the public purpose, suitability of land, or Social Impact Assessment to the District Collector or Special Land Acquisition Officer (SLAO).'
    },
    {
      q: 'How are compensation payments disbursed to landowners?',
      a: 'Payments are disbursed directly into the verified bank account of the landholder through Direct Benefit Transfer (DBT / RTGS / PFMS). Cash payments are prohibited by law to ensure total transparency.'
    },
    {
      q: 'What is the Rehabilitation and Resettlement (R&R) Entitlement?',
      a: 'Displaced families are entitled to alternate housing in planned resettlement colonies, subsistence allowances for 12 months, transportation costs, and skill training or employment assistance under Schedule II of RFCTLARR.'
    },
    {
      q: 'How can I lodge a grievance or complaint?',
      a: 'Citizens can lodge grievances through the Central Public Grievance Redress and Monitoring System (CPGRAMS) or directly with the State Land Acquisition Officer (SLAO) / District Collectorate.'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-black text-slate-900">Citizen Awareness, Entitlements & Grievance Redressal</h2>
        <p className="text-xs text-slate-500">
          Comprehensive guide to statutory rights, valuation procedures, and official helpline channels
        </p>
      </div>

      {/* FAQ Accordion Section */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <span>Frequently Asked Questions (RFCTLARR Act, 2013)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((f, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <h4 className="font-bold text-xs text-slate-900 flex items-start space-x-2">
                <span className="text-indigo-600 font-extrabold">Q{idx+1}.</span>
                <span>{f.q}</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed pl-5">
                {f.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Grievance Channels */}
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-4 shadow-md">
        <h3 className="text-lg font-bold">Official Grievance & Assistance Channels</h3>
        <p className="text-xs text-slate-300">
          For queries regarding land boundaries, compensation awards, or R&R site allocations:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
            <span className="text-amber-400 font-bold text-xs uppercase">National Helpdesk</span>
            <p className="text-sm font-black">1800-11-2026</p>
            <p className="text-[10px] text-slate-400">Toll-Free &bull; 09:30 AM to 06:00 PM IST</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
            <span className="text-amber-400 font-bold text-xs uppercase">CPGRAMS Portal</span>
            <p className="text-sm font-black">pgportal.gov.in</p>
            <p className="text-[10px] text-slate-400">Central Public Grievance Portal</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
            <span className="text-amber-400 font-bold text-xs uppercase">Department of Land Resources</span>
            <p className="text-sm font-black">dolr.gov.in</p>
            <p className="text-[10px] text-slate-400">Krishi Bhawan, New Delhi</p>
          </div>
        </div>
      </div>
    </div>
  );
}
