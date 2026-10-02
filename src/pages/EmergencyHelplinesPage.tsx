import React, { useState } from 'react';
import { EmergencyHelpline, Language } from '../types';
import { getT } from '../translations';
import {
  PhoneCall,
  Copy,
  Check,
  ShieldAlert,
  AlertTriangle,
  ShieldCheck,
  Flame,
  Building2,
  Ambulance,
  Phone,
  Shield,
  Clock,
  Radio,
  ExternalLink,
} from 'lucide-react';

interface EmergencyHelplinesPageProps {
  lang: Language;
  helplines: EmergencyHelpline[];
}

export const EmergencyHelplinesPage: React.FC<EmergencyHelplinesPageProps> = ({
  lang,
  helplines,
}) => {
  const t = getT(lang);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  const handleCopy = (id: string, num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'ambulance':
        return <Ambulance className="w-8 h-8 text-red-600 shrink-0" />;
      case 'police':
        return <Shield className="w-8 h-8 text-blue-600 shrink-0" />;
      case 'fire':
        return <Flame className="w-8 h-8 text-amber-600 shrink-0" />;
      case 'building':
        return <Building2 className="w-8 h-8 text-indigo-600 shrink-0" />;
      case 'phone':
        return <Phone className="w-8 h-8 text-teal-600 shrink-0" />;
      default:
        return <ShieldAlert className="w-8 h-8 text-red-600 shrink-0" />;
    }
  };

  const filtered = helplines
    .filter((h) => {
      if (filterType === 'medical') return h.icon === 'ambulance';
      if (filterType === 'police') return h.icon === 'police';
      if (filterType === 'fire') return h.icon === 'fire';
      if (filterType === 'district') return h.icon === 'building';
      return true;
    })
    .sort((a, b) => a.priority - b.priority);

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* High-Visibility Red/Orange Emergency Banner */}
      <section className="bg-gradient-to-r from-red-700 via-red-600 to-amber-600 text-white py-10 sm:py-14 px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
            <span>24/7 Hafizabad Immediate Response Helplines</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-3">
            EMERGENCY?
          </h1>
          <p className="text-lg sm:text-2xl font-bold text-amber-100 max-w-2xl mx-auto mb-3">
            Call the appropriate emergency service immediately.
          </p>
          <p className="text-xs sm:text-sm text-red-100 max-w-xl mx-auto">
            {lang === 'ur'
              ? 'کسی بھی ہنگامی صورتحال، حادثے یا خطرے کی صورت میں فوری طور پر نیچے دیے گئے متعلقہ نمبر پر کال کریں۔'
              : 'Important emergency contact numbers for Hafizabad District and Punjab. Tap "CALL NOW" to dial directly from your mobile device.'}
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Safety Notice & Disclaimer Cards */}
        <div className="space-y-3 mb-8">
          {/* Life-threatening safety notice */}
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 shadow-sm flex items-start gap-3.5">
            <div className="p-2 bg-amber-500 text-white rounded-xl shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="text-xs sm:text-sm text-amber-950 leading-relaxed">
              <span className="font-black text-amber-900 block mb-0.5 text-sm">
                CRITICAL LIFE SAFETY NOTICE:
              </span>
              “For life-threatening emergencies, contact the appropriate emergency service immediately. Hafizabad Health Guide is an information website and is not itself an emergency response service.”
            </div>
          </div>

          {/* Official Verification Notice */}
          <div className="bg-blue-50/90 border border-blue-200 rounded-xl p-3 sm:p-4 text-xs text-blue-900 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#034694] shrink-0" />
              <span>
                “Always verify important emergency information with official sources. Emergency numbers may change.”
              </span>
            </div>
            <span className="hidden sm:inline-block font-bold text-[11px] bg-white border border-blue-200 px-2 py-0.5 rounded-md text-[#034694] shrink-0">
              Verified by District Administration
            </span>
          </div>
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-6">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              filterType === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            All Emergency Helplines ({helplines.length})
          </button>
          <button
            onClick={() => setFilterType('medical')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              filterType === 'medical'
                ? 'bg-red-700 text-white shadow-xs'
                : 'bg-white text-red-700 border border-red-200 hover:bg-red-50'
            }`}
          >
            <Ambulance className="w-3.5 h-3.5" />
            <span>Ambulance & Rescue</span>
          </button>
          <button
            onClick={() => setFilterType('police')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              filterType === 'police'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Police & Law</span>
          </button>
          <button
            onClick={() => setFilterType('fire')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              filterType === 'fire'
                ? 'bg-amber-700 text-white shadow-xs'
                : 'bg-white text-amber-700 border border-amber-200 hover:bg-amber-50'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Fire Brigade</span>
          </button>
          <button
            onClick={() => setFilterType('district')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              filterType === 'district'
                ? 'bg-indigo-700 text-white shadow-xs'
                : 'bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>District Control</span>
          </button>
        </div>

        {/* Large Emergency Cards Grid */}
        <div className="space-y-5">
          {filtered.map((item) => {
            const isCopied = copiedId === item.id;
            const isHighPriority = item.number === '1122' || item.number === '15';

            return (
              <div
                key={item.id}
                className={`bg-white rounded-3xl border-2 transition-all p-5 sm:p-7 shadow-xs hover:shadow-md ${
                  isHighPriority
                    ? 'border-red-500/80 bg-linear-to-b from-white to-red-50/20'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  {/* Left Column: Icon, Name, Number, Purpose */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl shrink-0 mt-1">
                      {getIcon(item.icon)}
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          {item.icon.toUpperCase()} HELPLINE
                        </span>
                        {item.isActive ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                            Active 24/7
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                            Inactive / Temporarily Unavailable
                          </span>
                        )}
                        {item.isVerified && (
                          <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                            Verified Source
                          </span>
                        )}
                      </div>

                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        {item.name}
                      </h2>
                      {item.nameUrdu && (
                        <p className="text-sm font-urdu text-slate-600 mb-2 font-bold">
                          {item.nameUrdu}
                        </p>
                      )}

                      {/* Giant Number Display for High Contrast Legibility */}
                      <div className="my-2 flex items-baseline gap-3">
                        <span className="font-mono text-3xl sm:text-5xl font-black text-red-600 tracking-tight select-all">
                          {item.number}
                        </span>
                      </div>

                      {/* Purpose bullet points */}
                      <div className="mt-3">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Emergency Services Provided:
                        </span>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-slate-700">
                          {item.purpose.map((p, idx) => (
                            <li key={idx} className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Large Action Buttons (Call Now & Copy) */}
                  <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 sm:w-auto md:w-56 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <a
                      href={item.telUri}
                      className="w-full py-4 px-6 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-2xl font-black text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all focus:outline-hidden focus:ring-4 focus:ring-red-200"
                    >
                      <PhoneCall className="w-5 h-5 animate-bounce" />
                      <span>CALL NOW</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => handleCopy(item.id, item.number)}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border ${
                        isCopied
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span>Number Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-slate-500" />
                          <span>Copy Number ({item.number})</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Card Verification Footer */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                  <span className="truncate max-w-sm sm:max-w-md">
                    <strong>Official Source:</strong> {item.officialSource}
                  </span>
                  <span className="flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Last Verified: {item.lastVerifiedDate}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Safety Reminder */}
        <div className="mt-12 text-center text-xs text-slate-500 max-w-2xl mx-auto leading-relaxed">
          <p className="mb-2">
            Hafizabad Health Guide Emergency Directory is maintained strictly with government-verified contacts. Fictional or unconfirmed telephone hotlines are strictly barred.
          </p>
          <p className="font-semibold text-slate-600">
            For general healthcare inquiries or hospital departments, visit our main Directory.
          </p>
        </div>
      </div>
    </div>
  );
};
