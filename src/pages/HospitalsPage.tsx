import React, { useState, useMemo } from 'react';
import { Hospital, Language, DistrictArea } from '../types';
import { getT } from '../translations';
import {
  Search,
  Building2,
  PhoneCall,
  MapPin,
  ShieldCheck,
  Activity,
  Filter,
  SlidersHorizontal,
  ArrowRight,
  GitCompare,
  Check,
  AlertCircle,
} from 'lucide-react';

interface HospitalsPageProps {
  lang: Language;
  hospitals: Hospital[];
  onSelectHospital: (hospital: Hospital) => void;
  compareList: Hospital[];
  onToggleCompare: (hospital: Hospital) => void;
  initialAreaFilter?: string;
}

export const HospitalsPage: React.FC<HospitalsPageProps> = ({
  lang,
  hospitals,
  onSelectHospital,
  compareList,
  onToggleCompare,
  initialAreaFilter,
}) => {
  const t = getT(lang);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Government' | 'Private'>('All');
  const [areaFilter, setAreaFilter] = useState<string>(initialAreaFilter || 'All');
  const [only24_7, setOnly24_7] = useState(false);
  const [onlyEmergency, setOnlyEmergency] = useState(false);
  const [selectedServices, setSelectedServices] = useState<{ [key: string]: boolean }>({});
  const [selectedDepts, setSelectedDepts] = useState<{ [key: string]: boolean }>({});
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Available service filter buttons
  const serviceOptions = [
    { id: 'laboratory', label: 'Laboratory' },
    { id: 'xRay', label: 'X-Ray' },
    { id: 'ultrasound', label: 'Ultrasound' },
    { id: 'ctScan', label: 'CT Scan' },
    { id: 'mri', label: 'MRI' },
    { id: 'bloodBank', label: 'Blood Bank' },
    { id: 'ambulance', label: 'Ambulance' },
    { id: 'icu', label: 'ICU / CCU' },
    { id: 'dialysis', label: 'Dialysis' },
  ];

  // Available specialty departments filter
  const departmentOptions = [
    'Pediatrics',
    'Gynecology',
    'Surgery',
    'Orthopedics',
    'Cardiology',
    'ENT',
    'Eye',
    'Dental',
  ];

  const areas = ['Hafizabad City', 'Pindi Bhattian', 'Jalalpur Bhattian', 'Sukheke Mandi'];

  const toggleService = (srv: string) => {
    setSelectedServices(prev => ({ ...prev, [srv]: !prev[srv] }));
  };

  const toggleDept = (dept: string) => {
    setSelectedDepts(prev => ({ ...prev, [dept]: !prev[dept] }));
  };

  const filteredHospitals = useMemo(() => {
    return hospitals.filter((h) => {
      // Search
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = h.name.toLowerCase().includes(q) || h.nameUrdu.includes(q);
        const matchAddr = h.address.toLowerCase().includes(q);
        const matchDept = h.departments.some(d => d.toLowerCase().includes(q));
        if (!matchName && !matchAddr && !matchDept) return false;
      }

      // Type
      if (typeFilter !== 'All' && h.type !== typeFilter) return false;

      // Area
      if (areaFilter !== 'All' && h.area !== areaFilter) return false;

      // 24/7
      if (only24_7 && !h.emergency24_7) return false;

      // Emergency
      if (onlyEmergency && !h.services.emergency) return false;

      // Services
      for (const [key, val] of Object.entries(selectedServices)) {
        if (val) {
          const sKey = key as keyof typeof h.services;
          if (!h.services[sKey]) return false;
        }
      }

      // Departments
      for (const [dept, val] of Object.entries(selectedDepts)) {
        if (val) {
          const hasDept = h.departments.some(d =>
            d.toLowerCase().includes(dept.toLowerCase())
          );
          if (!hasDept) return false;
        }
      }

      return true;
    });
  }, [hospitals, search, typeFilter, areaFilter, only24_7, onlyEmergency, selectedServices, selectedDepts]);

  const resetFilters = () => {
    setSearch('');
    setTypeFilter('All');
    setAreaFilter('All');
    setOnly24_7(false);
    setOnlyEmergency(false);
    setSelectedServices({});
    setSelectedDepts({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 mb-1">
          <span>District Healthcare Portal</span>
          <span>·</span>
          <span>Punjab Health Authority</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Hospitals & Medical Centers in Hafizabad
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-3xl">
          Directory of verified government and private hospitals across Hafizabad City, Pindi Bhattian, and Jalalpur Bhattian. Factual emergency capabilities and diagnostic imaging availability.
        </p>
      </div>

      {/* Main Search & Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by hospital name, doctor department, or address..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#034694] focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-[#034694]"
            >
              <option value="All">All Areas ({hospitals.length})</option>
              {areas.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className="sm:hidden px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Quick Segmented Filter for Hospital Type */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setTypeFilter('All')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                typeFilter === 'All'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setTypeFilter('Government')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                typeFilter === 'Government'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Government (DHQ/THQ)
            </button>
            <button
              onClick={() => setTypeFilter('Private')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                typeFilter === 'Private'
                  ? 'bg-[#034694] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Private Hospitals
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100">
              <input
                type="checkbox"
                checked={only24_7}
                onChange={(e) => setOnly24_7(e.target.checked)}
                className="rounded-sm text-[#034694] focus:ring-[#034694]"
              />
              <span className="font-semibold text-slate-700">24/7 Hours</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100">
              <input
                type="checkbox"
                checked={onlyEmergency}
                onChange={(e) => setOnlyEmergency(e.target.checked)}
                className="rounded-sm text-red-600 focus:ring-red-600"
              />
              <span className="font-semibold text-red-700">Emergency Dept</span>
            </label>

            <button
              onClick={resetFilters}
              className="text-xs text-slate-500 hover:text-slate-800 underline ml-2"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Detailed Service & Department Checkboxes (Visible desktop or toggled mobile) */}
        <div className={`pt-3 border-t border-slate-100 ${showFiltersMobile ? 'block' : 'hidden sm:block'}`}>
          <div className="mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Diagnostic Services Available On-Site
            </span>
            <div className="flex flex-wrap gap-1.5">
              {serviceOptions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => toggleService(s.id)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                    selectedServices[s.id]
                      ? 'bg-[#034694] text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {selectedServices[s.id] ? `✓ ${s.label}` : s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Clinical Specializations & Departments
            </span>
            <div className="flex flex-wrap gap-1.5">
              {departmentOptions.map((d) => (
                <button
                  key={d}
                  onClick={() => toggleDept(d)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                    selectedDepts[d]
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {selectedDepts[d] ? `✓ ${d}` : d}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-4 text-xs font-medium text-slate-500">
        <div>
          Showing <span className="font-bold text-slate-900">{filteredHospitals.length}</span> hospitals matching criteria
        </div>
        {compareList.length > 0 && (
          <div className="text-[#034694] font-bold">
            {compareList.length} hospital(s) selected for comparison
          </div>
        )}
      </div>

      {/* Hospital Cards Grid */}
      {filteredHospitals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredHospitals.map((hospital) => {
            const isCompared = compareList.some((c) => c.id === hospital.id);

            return (
              <div
                key={hospital.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between"
              >
                <div>
                  {/* Top Meta Line */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-medium mb-1">
                        <span
                          className={`font-bold ${
                            hospital.type === 'Government'
                              ? 'text-emerald-700'
                              : 'text-blue-700'
                          }`}
                        >
                          {hospital.type}
                        </span>
                        <span>·</span>
                        <span className="text-slate-500">{hospital.area}</span>
                        {hospital.emergency24_7 && (
                          <>
                            <span>·</span>
                            <span className="text-red-600 font-bold flex items-center gap-1">
                              <Activity className="w-3 h-3" /> 24/7 Emergency
                            </span>
                          </>
                        )}
                      </div>
                      <h2
                        onClick={() => onSelectHospital(hospital)}
                        className="text-lg font-bold text-slate-900 hover:text-[#034694] cursor-pointer"
                      >
                        {hospital.name}
                      </h2>
                    </div>

                    {hospital.isVerified ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md shrink-0">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                        Information not verified
                      </span>
                    )}
                  </div>

                  {/* Factual Address & Timings */}
                  <p className="text-xs text-slate-600 mb-3 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{hospital.address}</span>
                  </p>

                  {/* Factual Services Grid */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs mb-3">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-slate-700">
                      <div>
                        Emergency: <span className="font-bold text-emerald-600">{hospital.services.emergency ? '✓ Yes' : '✗ No'}</span>
                      </div>
                      <div>
                        Laboratory: <span className="font-bold text-emerald-600">{hospital.services.laboratory ? '✓ Yes' : '✗ No'}</span>
                      </div>
                      <div>
                        X-Ray: <span className="font-bold text-emerald-600">{hospital.services.xRay ? '✓ Yes' : '✗ No'}</span>
                      </div>
                      <div>
                        Ultrasound: <span className="font-bold text-emerald-600">{hospital.services.ultrasound ? '✓ Yes' : '✗ No'}</span>
                      </div>
                      <div>
                        CT Scan: <span className={hospital.services.ctScan ? 'font-bold text-emerald-600' : 'text-slate-400 font-semibold'}>{hospital.services.ctScan ? '✓ Yes' : '✗ No'}</span>
                      </div>
                      <div>
                        Blood Bank: <span className={hospital.services.bloodBank ? 'font-bold text-rose-600' : 'text-slate-400 font-semibold'}>{hospital.services.bloodBank ? '✓ Yes' : '✗ No'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Department Tags (Clean, unboxed typography per design constitution) */}
                  <div className="text-[11px] text-slate-500 mb-4">
                    <span className="font-semibold text-slate-700">Departments: </span>
                    {(hospital.departments || []).slice(0, 4).join(', ')}
                    {(hospital.departments || []).length > 4 && ` +${hospital.departments.length - 4} more`}
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center justify-between mb-3 border-t border-slate-100 pt-2">
                    <span className="truncate max-w-[240px]">Source: {hospital.verificationSource}</span>
                    <span>Updated: {hospital.lastUpdated}</span>
                  </div>
                </div>

                {/* Bottom Action Controls */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onSelectHospital(hospital)}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#034694] font-bold text-xs rounded-xl transition-colors"
                    >
                      {t.viewDetails}
                    </button>
                    <button
                      onClick={() => onToggleCompare(hospital)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors ${
                        isCompared
                          ? 'bg-slate-900 text-white'
                          : 'border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                      title="Compare with another hospital"
                    >
                      <GitCompare className="w-3.5 h-3.5" />
                      <span>{isCompared ? 'Compared' : 'Compare'}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`https://maps.google.com/?q=${hospital.coordinates.lat},${hospital.coordinates.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 border border-slate-200 hover:border-slate-300 rounded-xl text-slate-700 text-xs font-semibold"
                      title="Directions"
                    >
                      <MapPin className="w-4 h-4 text-slate-600" />
                    </a>
                    <a
                      href={`tel:${hospital.phone}`}
                      className="px-3.5 py-1.5 bg-[#034694] hover:bg-blue-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>{t.callNow}</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h3 className="font-bold text-slate-800 text-base mb-1">
            No Hospitals Match Selected Filters
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Try adjusting your search criteria or resetting filters.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-[#034694] text-white text-xs font-bold rounded-xl"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};
