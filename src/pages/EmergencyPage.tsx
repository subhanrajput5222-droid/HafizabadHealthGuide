import React from 'react';
import { Hospital, BloodBank, Language } from '../types';
import { EMERGENCY_CONTACTS } from '../data/initialData';
import { getT } from '../translations';
import {
  ShieldAlert,
  PhoneCall,
  Activity,
  AlertTriangle,
  Building2,
  Droplet,
  MapPin,
  ExternalLink,
  Ambulance,
  HeartPulse,
} from 'lucide-react';

interface EmergencyPageProps {
  lang: Language;
  hospitals: Hospital[];
  bloodBanks: BloodBank[];
  onSelectHospital: (hospital: Hospital) => void;
  onNavigateTab: (tab: string) => void;
}

export const EmergencyPage: React.FC<EmergencyPageProps> = ({
  lang,
  hospitals,
  bloodBanks,
  onSelectHospital,
  onNavigateTab,
}) => {
  const t = getT(lang);

  // Filter 24/7 and emergency hospitals
  const emergencyHospitals = hospitals.filter(
    (h) => h.emergency24_7 || h.services.emergency
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* High Alert Emergency Header */}
      <div className="bg-red-600 text-white rounded-3xl p-6 sm:p-10 shadow-xl mb-10 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold mb-4 backdrop-blur-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
            <span>24/7 District Emergency Response</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-3">
            Hafizabad Emergency Healthcare Guide
          </h1>
          <p className="text-red-100 text-sm sm:text-base leading-relaxed mb-6">
            In severe road traffic accidents, acute chest pain, trauma, unconsciousness or labor emergencies, call Punjab Emergency Service <strong>Rescue 1122</strong> immediately.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="tel:1122"
              className="px-6 py-3.5 bg-white text-red-600 rounded-2xl font-black text-sm sm:text-base hover:bg-red-50 transition-all flex items-center gap-2 shadow-lg"
            >
              <PhoneCall className="w-5 h-5" />
              <span>Call Rescue 1122</span>
            </a>

            <button
              onClick={() => onNavigateTab('map')}
              className="px-6 py-3.5 bg-red-800/80 hover:bg-red-800 text-white rounded-2xl font-bold text-sm sm:text-base border border-red-400/40 transition-all flex items-center gap-2"
            >
              <MapPin className="w-5 h-5" />
              <span>Find Nearest Emergency on Map</span>
            </button>
          </div>
        </div>

        {/* Ambient watermark icon */}
        <ShieldAlert className="absolute -right-8 -bottom-10 w-72 h-72 text-red-700/40 pointer-events-none" />
      </div>

      {/* Mandatory Disclaimer */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 mb-10 flex items-start gap-3.5 shadow-xs">
        <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-amber-900 leading-relaxed">
          <strong>Mandatory Notice:</strong> {t.disclaimerText}
        </div>
      </div>

      {/* Critical Hotlines Grid */}
      <div className="mb-12">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-4 flex items-center gap-2">
          <PhoneCall className="w-5 h-5 text-red-600" />
          <span>Essential Emergency Telephone Numbers</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {EMERGENCY_CONTACTS.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-red-400 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                    {item.type}
                  </span>
                  <span className="text-xs font-bold text-slate-400">24/7 Active</span>
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-1">{item.name}</h3>
                <p className="text-xs font-urdu text-slate-500 mb-2">{item.nameUrdu}</p>
                <p className="text-xs text-slate-600 mb-3">{item.notes}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 truncate max-w-[150px]">
                  📍 {item.address}
                </span>
                <a
                  href={`tel:${item.number.replace(/-/g, '')}`}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call {item.number}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 24/7 Emergency Hospitals */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#034694]" />
            <span>24/7 Emergency Hospital Units</span>
          </h2>
          <span className="text-xs font-bold text-slate-500">
            {emergencyHospitals.length} Facilities Equipped
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {emergencyHospitals.map((hosp) => (
            <div
              key={hosp.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-[#034694] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <span className="text-blue-700 font-bold">{hosp.type}</span>
                    <span>·</span>
                    <span className="text-slate-500">{hosp.area}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                    <Activity className="w-3 h-3" /> 24/7 Emergency
                  </span>
                </div>

                <h3
                  onClick={() => onSelectHospital(hosp)}
                  className="font-bold text-lg text-slate-900 hover:text-[#034694] cursor-pointer mb-1"
                >
                  {hosp.name}
                </h3>
                <p className="text-xs text-slate-600 mb-3">{hosp.emergencyAvailability}</p>
                <div className="text-xs text-slate-500 mb-3">📍 {hosp.address}</div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectHospital(hosp)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  View Services
                </button>
                <a
                  href={`tel:${hosp.emergencyPhone || hosp.phone}`}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Emergency: {hosp.emergencyPhone || hosp.phone}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Blood Contacts */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-4 flex items-center gap-2">
          <Droplet className="w-5 h-5 text-rose-600" />
          <span>Emergency Blood Bank Hotlines</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {bloodBanks.map((bank) => (
            <div
              key={bank.id}
              className="p-5 rounded-2xl bg-white border border-rose-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider block mb-1">
                  {bank.facilityType}
                </span>
                <h3 className="font-bold text-base text-slate-900 mb-1">{bank.facilityName}</h3>
                <p className="text-xs text-slate-600 mb-3">📍 {bank.address}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onNavigateTab('blood')}
                  className="text-xs text-rose-700 font-bold hover:underline"
                >
                  View Inventory
                </button>
                <a
                  href={`tel:${bank.emergencyPhone || bank.phone}`}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>Call</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
