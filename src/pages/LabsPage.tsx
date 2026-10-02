import React, { useState, useMemo } from 'react';
import { Laboratory, Language } from '../types';
import { getT } from '../translations';
import {
  Search,
  FlaskConical,
  PhoneCall,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Home,
  AlertCircle,
} from 'lucide-react';

interface LabsPageProps {
  lang: Language;
  laboratories: Laboratory[];
  onOpenReport: (name: string, id: string) => void;
  onOpenClaim: (name: string, id: string) => void;
}

export const LabsPage: React.FC<LabsPageProps> = ({
  lang,
  laboratories,
  onOpenReport,
  onOpenClaim,
}) => {
  const t = getT(lang);
  const [search, setSearch] = useState('');
  const [selectedArea, setSelectedArea] = useState<string>('All');
  const [activeServiceFilter, setActiveServiceFilter] = useState<string>('All');

  const testOptions = [
    { id: 'bloodTests', label: 'Blood Tests (CBC / Chemistry)' },
    { id: 'xRay', label: 'Digital X-Ray' },
    { id: 'ultrasound', label: 'Ultrasound' },
    { id: 'ctScan', label: 'CT Scan' },
    { id: 'mri', label: 'MRI' },
    { id: 'ecg', label: 'ECG' },
    { id: 'pathology', label: 'Pathology & Biopsy' },
  ];

  const filteredLabs = useMemo(() => {
    return laboratories.filter((lab) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = lab.name.toLowerCase().includes(q) || lab.nameUrdu.includes(q);
        const matchAddr = lab.address.toLowerCase().includes(q);
        if (!matchName && !matchAddr) return false;
      }
      if (selectedArea !== 'All' && lab.area !== selectedArea) return false;
      if (activeServiceFilter !== 'All') {
        const sKey = activeServiceFilter as keyof typeof lab.services;
        if (!lab.services[sKey]) return false;
      }
      return true;
    });
  }, [laboratories, search, selectedArea, activeServiceFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 mb-1">
          <FlaskConical className="w-4 h-4 text-teal-600" />
          <span>Diagnostic Imaging & Clinical Pathology</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Diagnostic Laboratories & Imaging in Hafizabad
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-3xl">
          Find verified diagnostic centres including Chughtai Lab, Islamabad Diagnostic Centre (IDC), Shaukat Khanum Collection Centre, and DHQ Central Radiology.
        </p>
      </div>

      {/* Control & Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search diagnostic labs, blood tests, X-ray or ultrasound in Hafizabad..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#034694] focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 focus:outline-hidden"
            >
              <option value="All">All District Areas</option>
              <option value="Hafizabad City">Hafizabad City</option>
              <option value="Pindi Bhattian">Pindi Bhattian</option>
              <option value="Jalalpur Bhattian">Jalalpur Bhattian</option>
            </select>
          </div>
        </div>

        {/* Filter by Test Capability */}
        <div className="pt-2 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Filter by Diagnostic Facility
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setActiveServiceFilter('All')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeServiceFilter === 'All'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Tests
            </button>
            {testOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setActiveServiceFilter(opt.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeServiceFilter === opt.id
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      {filteredLabs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredLabs.map((lab) => (
            <div
              key={lab.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-teal-500 shadow-xs hover:shadow-md transition-all p-5 sm:p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 block mb-0.5">
                      {lab.area}
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">
                      {lab.name}
                    </h2>
                    <p className="text-xs font-urdu text-slate-500">{lab.nameUrdu}</p>
                  </div>

                  {lab.isVerified ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md shrink-0">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Verified
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md shrink-0">
                      Information not verified
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-600 mb-3 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{lab.address}</span>
                </div>

                {/* Available Diagnostic Modalities Matrix */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
                  <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Verified Tests Available:
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className={lab.services.bloodTests ? 'text-teal-600 font-bold' : 'text-slate-400'}>
                        {lab.services.bloodTests ? '✓' : '✗'}
                      </span>
                      <span>Blood Tests</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={lab.services.xRay ? 'text-teal-600 font-bold' : 'text-slate-400'}>
                        {lab.services.xRay ? '✓' : '✗'}
                      </span>
                      <span>X-Ray</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={lab.services.ultrasound ? 'text-teal-600 font-bold' : 'text-slate-400'}>
                        {lab.services.ultrasound ? '✓' : '✗'}
                      </span>
                      <span>Ultrasound</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={lab.services.ctScan ? 'text-teal-600 font-bold' : 'text-slate-400'}>
                        {lab.services.ctScan ? '✓' : '✗'}
                      </span>
                      <span>CT Scan</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={lab.services.ecg ? 'text-teal-600 font-bold' : 'text-slate-400'}>
                        {lab.services.ecg ? '✓' : '✗'}
                      </span>
                      <span>ECG</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={lab.services.pathology ? 'text-teal-600 font-bold' : 'text-slate-400'}>
                        {lab.services.pathology ? '✓' : '✗'}
                      </span>
                      <span>Pathology</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{lab.openingHours}</span>
                  </span>
                  {lab.homeSampling && (
                    <span className="text-teal-700 font-bold flex items-center gap-1">
                      <Home className="w-3 h-3" /> Home Sampling
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-slate-400 flex items-center justify-between mb-3 border-t border-slate-100 pt-2">
                  <span className="truncate max-w-[240px]">{lab.verificationSource}</span>
                  <span>Updated: {lab.lastUpdated}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <a
                  href={`https://maps.google.com/?q=${lab.coordinates.lat},${lab.coordinates.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 border border-slate-200 hover:border-slate-300 rounded-xl text-slate-700 text-xs font-semibold flex items-center gap-1"
                >
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Directions</span>
                </a>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onOpenClaim(lab.name, lab.id)}
                    className="text-[11px] text-slate-400 hover:text-slate-600 px-1.5 py-1"
                  >
                    Claim
                  </button>
                  <a
                    href={`tel:${lab.phone}`}
                    className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call Lab: {lab.phone}</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h3 className="font-bold text-slate-800 text-base mb-1">
            No Laboratories Found
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Try choosing a different diagnostic filter or reset search.
          </p>
        </div>
      )}
    </div>
  );
};
