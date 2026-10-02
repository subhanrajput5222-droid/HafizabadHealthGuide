import React, { useState, useEffect, useRef } from 'react';
import {
  Hospital,
  Doctor,
  Pharmacy,
  Laboratory,
  BloodBank,
  Language,
} from '../types';
import {
  Search,
  X,
  Building2,
  User,
  Pill,
  Droplet,
  FlaskConical,
  PhoneCall,
  MapPin,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  hospitals: Hospital[];
  doctors: Doctor[];
  pharmacies: Pharmacy[];
  laboratories: Laboratory[];
  bloodBanks: BloodBank[];
  onSelectHospital: (hospital: Hospital) => void;
  onNavigateTab: (tab: string, filter?: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  lang,
  hospitals,
  doctors,
  pharmacies,
  laboratories,
  bloodBanks,
  onSelectHospital,
  onNavigateTab,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  // Smart Query Parsing
  const isLookingForBlood = q.includes('blood') || /^(a|b|ab|o)[+-]$/i.test(q) || /(a|b|ab|o)[+-]\s*blood/i.test(q);
  const isLookingForGov = q.includes('gov') || q.includes('government') || q.includes('sarkari');
  const isLookingFor24 = q.includes('24') || q.includes('emergency') || q.includes('night');
  const isLookingForEye = q.includes('eye') || q.includes('ankh') || q.includes('ophthalmology');
  const isLookingForChild = q.includes('child') || q.includes('pediatric') || q.includes('bacha');

  // Filter Hospitals
  const matchedHospitals = hospitals.filter(h => {
    if (!q) return false;
    const matchName = h.name.toLowerCase().includes(q) || h.nameUrdu.includes(q);
    const matchArea = h.area.toLowerCase().includes(q);
    const matchDept = h.departments.some(d => d.toLowerCase().includes(q));
    const matchService =
      (q.includes('x-ray') || q.includes('xray')) && h.services.xRay ||
      (q.includes('ct') || q.includes('ct scan')) && h.services.ctScan ||
      (q.includes('ultrasound')) && h.services.ultrasound ||
      (q.includes('dialysis')) && h.services.dialysis ||
      (q.includes('emergency') && h.emergency24_7) ||
      (isLookingForGov && h.type === 'Government') ||
      (isLookingForEye && (h.name.toLowerCase().includes('eye') || h.departments.some(d => d.toLowerCase().includes('eye'))));
    return matchName || matchArea || matchDept || matchService;
  });

  // Filter Doctors
  const matchedDoctors = doctors.filter(d => {
    if (!q) return false;
    const matchName = d.name.toLowerCase().includes(q) || d.nameUrdu.includes(q);
    const matchSpec = d.specialty.toLowerCase().includes(q) || d.specialtyUrdu.includes(q);
    const matchArea = d.area.toLowerCase().includes(q);
    const matchSpecialQuery =
      (isLookingForChild && d.specialty.toLowerCase().includes('pediatric')) ||
      (isLookingForEye && d.specialty.toLowerCase().includes('ophthalmology')) ||
      (q.includes('heart') && d.specialty.toLowerCase().includes('cardiology')) ||
      (q.includes('gynae') && d.specialty.toLowerCase().includes('gynecology'));
    return matchName || matchSpec || matchArea || matchSpecialQuery;
  });

  // Filter Pharmacies
  const matchedPharmacies = pharmacies.filter(p => {
    if (!q) return false;
    const matchName = p.name.toLowerCase().includes(q) || p.nameUrdu.includes(q);
    const matchArea = p.area.toLowerCase().includes(q);
    const match24 = isLookingFor24 && p.is24_7;
    return matchName || matchArea || match24 || (q.includes('pharmacy') || q.includes('medical store'));
  });

  // Filter Labs
  const matchedLabs = laboratories.filter(l => {
    if (!q) return false;
    const matchName = l.name.toLowerCase().includes(q) || l.nameUrdu.includes(q);
    const matchArea = l.area.toLowerCase().includes(q);
    const matchTest =
      (q.includes('blood test') || q.includes('cbc')) && l.services.bloodTests ||
      (q.includes('x-ray') || q.includes('xray')) && l.services.xRay ||
      (q.includes('ultrasound')) && l.services.ultrasound ||
      (q.includes('ct') || q.includes('ct scan')) && l.services.ctScan;
    return matchName || matchArea || matchTest || (q.includes('lab') || q.includes('test'));
  });

  // Match Blood Banks
  const matchedBlood = isLookingForBlood ? bloodBanks : bloodBanks.filter(b => b.facilityName.toLowerCase().includes(q) || b.area.toLowerCase().includes(q));

  const totalResults = matchedHospitals.length + matchedDoctors.length + matchedPharmacies.length + matchedLabs.length + (isLookingForBlood ? matchedBlood.length : 0);

  const sampleQuickSearches = [
    { label: 'DHQ Hospital Hafizabad', query: 'DHQ Hospital' },
    { label: 'B+ blood', query: 'B+ blood' },
    { label: 'Children doctor', query: 'Children doctor' },
    { label: '24 hour pharmacy', query: '24 hour pharmacy' },
    { label: 'Eye hospital', query: 'Eye hospital' },
    { label: 'X-Ray / CT Scan', query: 'CT Scan' },
    { label: 'Pindi Bhattian', query: 'Pindi Bhattian' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] mt-8 sm:mt-12">
        {/* Search Bar Input */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50/70">
          <Search className="w-5 h-5 text-[#034694] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search hospitals, doctors, pharmacies, blood groups or medical services..."
            className="w-full bg-transparent border-none text-base sm:text-lg focus:outline-hidden text-slate-800 placeholder-slate-400"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md"
          >
            Esc
          </button>
        </div>

        {/* Suggestion Chips when search is empty */}
        {!query && (
          <div className="p-6 overflow-y-auto">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Popular Searches in Hafizabad
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {sampleQuickSearches.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setQuery(item.query)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-[#034694] hover:border-blue-200 border border-transparent transition-all"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-4">
              <div className="text-xs text-slate-500 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>All search results reference verified district public health databases.</span>
              </div>
            </div>
          </div>
        )}

        {/* Search Results Display */}
        {query && (
          <div className="p-4 overflow-y-auto space-y-6">
            <div className="text-xs text-slate-500 font-medium">
              Found <span className="font-bold text-slate-800">{totalResults}</span> matches for "{query}"
            </div>

            {/* Blood Banks Matching */}
            {(isLookingForBlood || matchedBlood.length > 0) && (
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-rose-700 uppercase tracking-wider mb-2">
                  <span className="flex items-center gap-1.5">
                    <Droplet className="w-3.5 h-3.5" />
                    Blood Banks & Blood Availability
                  </span>
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateTab('blood');
                    }}
                    className="text-xs text-[#034694] hover:underline flex items-center gap-0.5"
                  >
                    View Blood Finder <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-2">
                  {matchedBlood.slice(0, 3).map((b) => (
                    <div
                      key={b.id}
                      onClick={() => {
                        onClose();
                        onNavigateTab('blood');
                      }}
                      className="p-3 rounded-xl border border-rose-100 bg-rose-50/40 hover:bg-rose-50 cursor-pointer transition-colors flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-sm text-slate-800">{b.facilityName}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {b.area} · Verified Transfusion Facility
                        </div>
                      </div>
                      <a
                        href={`tel:${b.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                      >
                        <PhoneCall className="w-3 h-3" />
                        Call
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hospitals Results */}
            {matchedHospitals.length > 0 && (
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  <span className="flex items-center gap-1.5 text-[#034694]">
                    <Building2 className="w-3.5 h-3.5" />
                    Hospitals ({matchedHospitals.length})
                  </span>
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateTab('hospitals');
                    }}
                    className="text-xs text-[#034694] hover:underline"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-2">
                  {matchedHospitals.slice(0, 4).map((h) => (
                    <div
                      key={h.id}
                      onClick={() => {
                        onClose();
                        onSelectHospital(h);
                      }}
                      className="p-3 rounded-xl border border-slate-200 hover:border-[#034694] hover:bg-blue-50/30 cursor-pointer transition-colors flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-sm text-slate-800">{h.name}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                          <span className="font-medium text-blue-700">{h.type}</span>
                          <span>·</span>
                          <span>{h.area}</span>
                          {h.emergency24_7 && (
                            <>
                              <span>·</span>
                              <span className="text-red-600 font-semibold">24/7 Emergency</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-xs font-semibold text-[#034694] flex items-center gap-1">
                        Details <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Doctors Results */}
            {matchedDoctors.length > 0 && (
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  <span className="flex items-center gap-1.5 text-emerald-700">
                    <User className="w-3.5 h-3.5" />
                    Doctors & Specialists ({matchedDoctors.length})
                  </span>
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateTab('doctors');
                    }}
                    className="text-xs text-[#034694] hover:underline"
                  >
                    View All Doctors
                  </button>
                </div>
                <div className="space-y-2">
                  {matchedDoctors.slice(0, 4).map((d) => (
                    <div
                      key={d.id}
                      onClick={() => {
                        onClose();
                        onNavigateTab('doctors');
                      }}
                      className="p-3 rounded-xl border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/30 cursor-pointer transition-colors flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-sm text-slate-800">{d.name}</div>
                        <div className="text-xs text-emerald-700 font-semibold">{d.specialty}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{d.hospitalOrClinic}</div>
                      </div>
                      <a
                        href={`tel:${d.appointmentPhone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                      >
                        <PhoneCall className="w-3 h-3" />
                        Book
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pharmacies Results */}
            {matchedPharmacies.length > 0 && (
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  <span className="flex items-center gap-1.5 text-indigo-700">
                    <Pill className="w-3.5 h-3.5" />
                    Pharmacies & Medical Stores ({matchedPharmacies.length})
                  </span>
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateTab('pharmacies');
                    }}
                    className="text-xs text-[#034694] hover:underline"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-2">
                  {matchedPharmacies.slice(0, 3).map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        onClose();
                        onNavigateTab('pharmacies');
                      }}
                      className="p-3 rounded-xl border border-slate-200 hover:border-indigo-600 hover:bg-indigo-50/30 cursor-pointer transition-colors flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-sm text-slate-800">{p.name}</div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {p.address} {p.is24_7 && '· 24/7 Open'}
                        </div>
                      </div>
                      <a
                        href={`tel:${p.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                      >
                        <PhoneCall className="w-3 h-3" />
                        Call
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Labs Results */}
            {matchedLabs.length > 0 && (
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  <span className="flex items-center gap-1.5 text-cyan-700">
                    <FlaskConical className="w-3.5 h-3.5" />
                    Laboratories & Diagnostic Centers ({matchedLabs.length})
                  </span>
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateTab('labs');
                    }}
                    className="text-xs text-[#034694] hover:underline"
                  >
                    View All Labs
                  </button>
                </div>
                <div className="space-y-2">
                  {matchedLabs.slice(0, 3).map((l) => (
                    <div
                      key={l.id}
                      onClick={() => {
                        onClose();
                        onNavigateTab('labs');
                      }}
                      className="p-3 rounded-xl border border-slate-200 hover:border-cyan-600 hover:bg-cyan-50/30 cursor-pointer transition-colors flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-sm text-slate-800">{l.name}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{l.address}</div>
                      </div>
                      <a
                        href={`tel:${l.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 bg-cyan-700 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                      >
                        <PhoneCall className="w-3 h-3" />
                        Call
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {totalResults === 0 && (
              <div className="text-center py-8">
                <p className="text-slate-600 text-sm mb-2">
                  No exact matches found for "{query}".
                </p>
                <p className="text-xs text-slate-400">
                  Try searching for DHQ Hospital, Pindi Bhattian, B+ blood, ultrasound, or pediatrician.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
