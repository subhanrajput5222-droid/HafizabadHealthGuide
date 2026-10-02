import React, { useState, useMemo } from 'react';
import {
  Doctor,
  Hospital,
  Laboratory,
  Language,
  HealthConcernMapping,
} from '../types';
import { HEALTH_CONCERNS_DATA } from '../data/initialData';
import { getT } from '../translations';
import {
  Search,
  User,
  Building2,
  PhoneCall,
  MapPin,
  Clock,
  Calendar,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Eye,
  Baby,
  Sparkles,
  Heart,
  Activity,
  Shield,
  Users,
  Headphones,
  Smile,
  FlaskConical,
  Camera,
  ExternalLink,
  ChevronRight,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface FindDoctorPageProps {
  lang: Language;
  doctors: Doctor[];
  hospitals: Hospital[];
  laboratories: Laboratory[];
  onSelectHospital: (hospital: Hospital) => void;
  onOpenReport?: (name: string, id: string) => void;
  initialConcernId?: string;
  initialMode?: 'concerns' | 'eyecare' | 'all-doctors';
}

export const FindDoctorPage: React.FC<FindDoctorPageProps> = ({
  lang,
  doctors,
  hospitals,
  laboratories,
  onSelectHospital,
  onOpenReport,
  initialConcernId,
  initialMode = 'concerns',
}) => {
  const t = getT(lang);
  const [activeTab, setActiveTab] = useState<'concerns' | 'eyecare' | 'all-doctors'>(initialMode);
  const [searchTerm, setSearchTerm] = useState('');
  const [allDocSearch, setAllDocSearch] = useState('');
  const [allDocSpecialty, setAllDocSpecialty] = useState('All');
  const [allDocArea, setAllDocArea] = useState('All');
  const [selectedConcern, setSelectedConcern] = useState<HealthConcernMapping | null>(() => {
    if (initialConcernId) {
      return HEALTH_CONCERNS_DATA.find((c) => c.id === initialConcernId) || null;
    }
    return null;
  });

  // Eye Care sub-filter
  const [eyeServiceFilter, setEyeServiceFilter] = useState<string>('all');

  // Filter concerns based on search input
  const filteredConcerns = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return HEALTH_CONCERNS_DATA;
    return HEALTH_CONCERNS_DATA.filter((c) => {
      const matchName = c.concernName.toLowerCase().includes(q);
      const matchUrdu = c.concernUrdu.toLowerCase().includes(q);
      const matchSpecialty = c.specialtyName.toLowerCase().includes(q);
      const matchKeywords = c.keywords.some((k) => k.toLowerCase().includes(q));
      return matchName || matchUrdu || matchSpecialty || matchKeywords;
    });
  }, [searchTerm]);

  // Matching doctors for selected concern
  const matchingDoctors = useMemo(() => {
    if (!selectedConcern) return [];
    const termLower = (
      (selectedConcern.specialtyName || '') +
      ' ' +
      (selectedConcern.keywords || []).join(' ')
    ).toLowerCase();

    return doctors.filter((doc) => {
      const spec = doc.specialty || '';
      const areas = Array.isArray(doc.areasOfSpecialization) ? doc.areasOfSpecialization.join(' ') : '';
      const serv = Array.isArray(doc.services) ? doc.services.join(' ') : '';
      const docText = `${spec} ${areas} ${serv}`.toLowerCase();

      if (selectedConcern.id === 'concern-eye') {
        return docText.includes('eye') || docText.includes('ophthalm') || docText.includes('optometr');
      }
      if (selectedConcern.id === 'concern-children') {
        return docText.includes('pediatric') || docText.includes('child');
      }
      if (selectedConcern.id === 'concern-skin') {
        return docText.includes('dermatolog') || docText.includes('skin');
      }
      if (selectedConcern.id === 'concern-heart') {
        return docText.includes('cardio') || docText.includes('heart');
      }
      if (selectedConcern.id === 'concern-bones') {
        return docText.includes('orthoped') || docText.includes('bone') || docText.includes('joint');
      }
      if (selectedConcern.id === 'concern-stomach') {
        return docText.includes('gastro') || docText.includes('stomach') || docText.includes('liver') || docText.includes('internal medicine');
      }
      if (selectedConcern.id === 'concern-women') {
        return docText.includes('gynecolog') || docText.includes('obstetric') || docText.includes('maternity');
      }
      if (selectedConcern.id === 'concern-ent') {
        return docText.includes('ent') || docText.includes('ear') || docText.includes('throat');
      }
      if (selectedConcern.id === 'concern-teeth') {
        return docText.includes('dent') || docText.includes('tooth');
      }
      if (selectedConcern.id === 'concern-surgery') {
        return docText.includes('surgeon') || docText.includes('surgery');
      }
      if (selectedConcern.id === 'concern-urology') {
        return docText.includes('urolo') || docText.includes('kidney') || docText.includes('stone');
      }
      if (selectedConcern.id === 'concern-general') {
        return docText.includes('physician') || docText.includes('medicine');
      }

      return (selectedConcern.keywords || []).some((k) => docText.includes(k.toLowerCase()));
    });
  }, [selectedConcern, doctors]);

  // Eye Care Specific Facilities & Doctors
  const eyeCareDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const spec = doc.specialty || '';
      const serv = Array.isArray(doc.services) ? doc.services.join(' ') : '';
      const docText = `${spec} ${serv}`.toLowerCase();
      const isEye = docText.includes('eye') || docText.includes('ophthalm') || docText.includes('optomet');
      if (!isEye) return false;

      if (eyeServiceFilter === 'all') return true;
      if (eyeServiceFilter === 'cataract') return docText.includes('cataract') || docText.includes('phaco');
      if (eyeServiceFilter === 'glaucoma') return docText.includes('glaucoma');
      if (eyeServiceFilter === 'vision-test') return docText.includes('vision') || docText.includes('optometr') || docText.includes('glasses');
      if (eyeServiceFilter === 'pediatric') return docText.includes('pediatric') || docText.includes('squint');
      return true;
    });
  }, [doctors, eyeServiceFilter]);

  const eyeCareHospitals = useMemo(() => {
    return hospitals.filter((h) => {
      const matchDep = (h.departments || []).some((d) => d.toLowerCase().includes('eye') || d.toLowerCase().includes('ophthalm'));
      const matchName = (h.name || '').toLowerCase().includes('eye') || ((h.description || '').toLowerCase().includes('eye'));
      return matchDep || matchName;
    });
  }, [hospitals]);

  // All Doctors Filter
  const filteredAllDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      if (allDocSearch.trim()) {
        const q = allDocSearch.toLowerCase();
        const matchName = doc.name.toLowerCase().includes(q) || (doc.nameUrdu && doc.nameUrdu.includes(q));
        const matchSpec = doc.specialty.toLowerCase().includes(q) || (doc.specialtyUrdu && doc.specialtyUrdu.includes(q));
        const matchHosp = doc.hospitalOrClinic.toLowerCase().includes(q);
        if (!matchName && !matchSpec && !matchHosp) return false;
      }
      if (allDocSpecialty !== 'All') {
        if (!doc.specialty.toLowerCase().includes(allDocSpecialty.toLowerCase())) return false;
      }
      if (allDocArea !== 'All') {
        if (doc.area !== allDocArea) return false;
      }
      return true;
    });
  }, [doctors, allDocSearch, allDocSpecialty, allDocArea]);

  // Icon helper
  const renderConcernIcon = (iconName: string, className = 'w-5 h-5') => {
    switch (iconName) {
      case 'eye':
        return <Eye className={className} />;
      case 'baby':
        return <Baby className={className} />;
      case 'sparkles':
        return <Sparkles className={className} />;
      case 'heart':
        return <Heart className={className} />;
      case 'activity':
        return <Activity className={className} />;
      case 'shield':
        return <Shield className={className} />;
      case 'users':
        return <Users className={className} />;
      case 'headphones':
        return <Headphones className={className} />;
      case 'smile':
        return <Smile className={className} />;
      case 'flask':
        return <FlaskConical className={className} />;
      case 'camera':
        return <Camera className={className} />;
      default:
        return <User className={className} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-[#034694] via-[#0284c7] to-[#059669] text-white py-12 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase mb-3 backdrop-blur-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>Healthcare Navigation Directory • Hafizabad District</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-3">
            Find a Doctor & Healthcare Service in Hafizabad
          </h1>
          <p className="text-base sm:text-xl text-blue-100 max-w-3xl mx-auto font-medium">
            Find doctors, specialists, clinics and healthcare services near you in Hafizabad.
          </p>

          {/* Tab Selector */}
          <div className="mt-8 flex flex-wrap justify-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                setActiveTab('concerns');
                setSelectedConcern(null);
              }}
              className={`px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer ${
                activeTab === 'concerns'
                  ? 'bg-white text-[#034694] shadow-md ring-2 ring-white/50'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Health Concern & Specialty Finder
            </button>
            <button
              onClick={() => setActiveTab('eyecare')}
              className={`px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'eyecare'
                  ? 'bg-emerald-500 text-white shadow-md ring-2 ring-emerald-300'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <Eye className="w-4 h-4" />
              Eye & Eyesight Care Section
            </button>
            <button
              onClick={() => setActiveTab('all-doctors')}
              className={`px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'all-doctors'
                  ? 'bg-white text-[#034694] shadow-md ring-2 ring-white/50'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <User className="w-4 h-4" />
              All Verified Doctors ({doctors.length})
            </button>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* MANDATORY MEDICAL DISCLAIMER: NOT A DIAGNOSIS TOOL */}
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 shadow-sm mb-8 flex items-start gap-3.5">
          <div className="p-2.5 bg-amber-500 text-white rounded-xl shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="text-xs sm:text-sm text-amber-950 leading-relaxed">
            <span className="font-black text-amber-900 block text-sm mb-1 uppercase tracking-wide">
              Important Medical Disclaimer: Service-Finding Tool, Not A Medical Diagnosis
            </span>
            <p>
              This feature is designed solely to help residents of Hafizabad District identify which verified medical specialty or healthcare service corresponds to common symptoms or healthcare needs.
              <strong className="text-amber-900"> This feature must NOT diagnose diseases or tell you what disease you have.</strong> Always consult a qualified, licensed medical doctor for clinical evaluation, accurate medical diagnosis, and treatment.
            </p>
          </div>
        </div>

        {activeTab === 'concerns' && (
          <div>
            {/* Search Input Bar */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-md border border-slate-200 mb-8">
              <label className="block text-sm font-bold text-slate-900 mb-2">
                What type of doctor or healthcare service are you looking for?
              </label>
              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="e.g. Eye problem, weak eyesight, children doctor, skin rash, heart specialist, bone pain, ultrasound, blood test..."
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#034694] focus:bg-white text-sm sm:text-base font-medium transition-all"
                />
              </div>

              {/* Quick Suggestion Pills */}
              <div className="mt-4">
                <span className="text-xs font-bold text-slate-500 block mb-2">
                  Common Healthcare Queries in Hafizabad:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: 'Eye problem & Weak Eyesight', id: 'concern-eye' },
                    { label: 'Children Doctor', id: 'concern-children' },
                    { label: 'Skin Problem / Acne', id: 'concern-skin' },
                    { label: 'Heart Specialist', id: 'concern-heart' },
                    { label: 'Bone / Joint Pain', id: 'concern-bones' },
                    { label: 'Stomach / Gas / Liver', id: 'concern-stomach' },
                    { label: "Women's Health & Pregnancy", id: 'concern-women' },
                    { label: 'Ear, Nose & Throat (ENT)', id: 'concern-ent' },
                    { label: 'Dentist / Toothache', id: 'concern-teeth' },
                    { label: 'General Physician / Fever', id: 'concern-general' },
                    { label: 'Blood Test / Labs', id: 'concern-labs' },
                    { label: 'Ultrasound / X-Ray', id: 'concern-radiology' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        const match = HEALTH_CONCERNS_DATA.find((c) => c.id === item.id);
                        if (match) {
                          setSelectedConcern(match);
                          setSearchTerm('');
                        }
                      }}
                      className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                        selectedConcern?.id === item.id
                          ? 'bg-[#034694] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-[#034694]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Selected Concern Display Box */}
            {selectedConcern && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-[#034694]/30 rounded-2xl p-5 sm:p-6 mb-8 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="p-3 bg-[#034694] text-white rounded-xl shadow-xs shrink-0 mt-0.5">
                      {renderConcernIcon(selectedConcern.icon, 'w-6 h-6')}
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-[#034694]">
                        Recommended Medical Specialty & Facility Type
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                        {selectedConcern.specialtyName}
                      </h2>
                      {lang === 'ur' && (
                        <p className="text-base font-bold text-slate-700 font-urdu mt-0.5">
                          {selectedConcern.specialtyUrdu}
                        </p>
                      )}
                      <p className="text-sm text-slate-700 mt-2 font-medium leading-relaxed">
                        {selectedConcern.explanation}
                      </p>
                      <div className="mt-3 inline-flex items-center gap-2 bg-white/80 border border-blue-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-900">
                        <Info className="w-4 h-4 text-[#034694] shrink-0" />
                        <span>Recommended practitioner: <strong>{selectedConcern.recommendedType}</strong></span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedConcern(null)}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800 bg-white/80 px-2.5 py-1 rounded-md border border-slate-200 shrink-0"
                  >
                    Clear selection
                  </button>
                </div>

                {/* Direct Action for Special Sections */}
                {selectedConcern.id === 'concern-eye' && (
                  <div className="mt-4 pt-4 border-t border-blue-200 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs font-bold text-slate-700">
                      Looking for comprehensive eye surgery, vision testing or glasses assessment?
                    </span>
                    <button
                      onClick={() => setActiveTab('eyecare')}
                      className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Open Dedicated Eye & Eyesight Care Section
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* List of Concerns when none selected or searching */}
            {!selectedConcern && (
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 mb-4 flex items-center justify-between">
                  <span>Browse by Health Concern / Required Specialty ({filteredConcerns.length})</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredConcerns.map((concern) => (
                    <div
                      key={concern.id}
                      onClick={() => {
                        setSelectedConcern(concern);
                        window.scrollTo({ top: 400, behavior: 'smooth' });
                      }}
                      className="bg-white rounded-xl border border-slate-200 hover:border-[#034694] hover:shadow-md p-4 sm:p-5 transition-all cursor-pointer group flex items-start justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 bg-blue-50 text-[#034694] group-hover:bg-[#034694] group-hover:text-white rounded-xl transition-colors shrink-0">
                          {renderConcernIcon(concern.icon, 'w-5 h-5')}
                        </div>
                        <div>
                          <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#034694] transition-colors">
                            {concern.concernName}
                          </h3>
                          {lang === 'ur' && (
                            <p className="text-xs font-semibold text-slate-500 font-urdu mt-0.5">
                              {concern.concernUrdu}
                            </p>
                          )}
                          <div className="mt-2 text-xs font-bold text-emerald-700 flex items-center gap-1">
                            <span>Specialty:</span>
                            <span className="text-slate-800">{concern.specialtyName}</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#034694] group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Results: Verified Doctors or Facilities for the selected concern */}
            {selectedConcern && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-black text-slate-900">
                    Verified Practitioners & Services in Hafizabad ({matchingDoctors.length})
                  </h3>
                  <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-md">
                    Strict verified listings only
                  </span>
                </div>

                {matchingDoctors.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {matchingDoctors.map((doc) => (
                      <div
                        key={doc.id}
                        className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow p-5 flex flex-col justify-between"
                      >
                        <div>
                          {/* Header */}
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-black text-base sm:text-lg text-slate-900">
                                  {doc.name}
                                </span>
                                {doc.isVerified && (
                                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                    Verified
                                  </span>
                                )}
                              </div>
                              <div className="text-xs font-bold text-[#034694] mt-0.5">
                                {doc.specialty}
                              </div>
                            </div>
                            <span className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md shrink-0">
                              {doc.area}
                            </span>
                          </div>

                          {/* Qualifications */}
                          <div className="text-xs text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md mb-3 font-medium">
                            {doc.qualification} {doc.pmcRegistration ? `• ${doc.pmcRegistration}` : ''}
                          </div>

                          {/* Clinic/Hospital */}
                          <div className="space-y-1.5 text-xs text-slate-700 mb-3">
                            <div className="flex items-center gap-1.5">
                              <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="font-bold text-slate-900">{doc.hospitalOrClinic}</span>
                            </div>
                            <div className="flex items-start gap-1.5 text-slate-500">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                              <span>{doc.address}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{doc.availableDays} ({doc.timings})</span>
                            </div>
                          </div>

                          {/* Available Services */}
                          {doc.services && doc.services.length > 0 && (
                            <div className="mb-4">
                              <span className="text-[11px] font-bold text-slate-500 block mb-1">
                                Available Services:
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {doc.services.slice(0, 3).map((srv, idx) => (
                                  <span
                                    key={idx}
                                    className="bg-blue-50 text-[#034694] text-[10px] font-semibold px-2 py-0.5 rounded-md"
                                  >
                                    {srv}
                                  </span>
                                ))}
                                {doc.services.length > 3 && (
                                  <span className="text-[10px] text-slate-400 px-1 py-0.5">
                                    +{doc.services.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Footer Buttons */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                          <a
                            href={`tel:${doc.appointmentPhone}`}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#034694] hover:bg-[#002d66] text-white py-2 px-3 rounded-xl font-bold text-xs shadow-xs transition-colors"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                            <span>Call {doc.appointmentPhone}</span>
                          </a>

                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                              `${doc.hospitalOrClinic} ${doc.address} Hafizabad`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors text-xs font-semibold"
                            title="Get Directions on Google Maps"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          {onOpenReport && (
                            <button
                              onClick={() => onOpenReport(doc.name, doc.id)}
                              className="text-[10px] text-slate-400 hover:text-red-600 px-1.5 py-1"
                              title="Report inaccurate information"
                            >
                              Report
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-600">
                    <p className="text-sm font-semibold mb-2">
                      No standalone specialist clinic listing found for this specific query.
                    </p>
                    <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
                      Please check the Outpatient Department (OPD) at <strong>DHQ Hospital Hafizabad</strong> (Gujranwala Road) or <strong>THQ Hospital Pindi Bhattian</strong>, which offer government specialist consultants.
                    </p>
                    <button
                      onClick={() => setSelectedConcern(null)}
                      className="inline-flex items-center gap-1.5 bg-[#034694] text-white px-4 py-2 rounded-xl text-xs font-bold"
                    >
                      Browse All Categories
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* DEDICATED EYE / EYESIGHT SECTION */}
        {activeTab === 'eyecare' && (
          <div className="space-y-8">
            {/* Eye Care Introduction */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-200">
              <div className="flex items-start gap-4">
                <div className="p-3.5 bg-emerald-600 text-white rounded-2xl shadow-xs shrink-0">
                  <Eye className="w-8 h-8" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Dedicated Category
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                    Eye & Eyesight Care in Hafizabad
                  </h2>
                  <p className="text-sm sm:text-base text-slate-600 mt-1 font-medium">
                    Verified facilities, ophthalmic surgeons, vision testing, and glasses assessment in Hafizabad District.
                  </p>
                  <p className="text-xs text-slate-500 mt-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <strong>Fact-check note:</strong> Listings below are verified against Punjab Healthcare Commission (PHC) registers and local clinic records. Hafizabad Health Guide does not designate any practitioner as "the best", providing objective factual information regarding available treatments, consultation timings, and qualifications.
                  </p>
                </div>
              </div>

              {/* Sub-Filters for Eye Services */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                {[
                  { id: 'all', label: 'All Eye Care Services' },
                  { id: 'cataract', label: 'Cataract Phaco Surgery' },
                  { id: 'vision-test', label: 'Computerized Vision Test & Glasses' },
                  { id: 'glaucoma', label: 'Glaucoma Management' },
                  { id: 'pediatric', label: 'Children Eye Care & Squint' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setEyeServiceFilter(f.id)}
                    className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                      eyeServiceFilter === f.id
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Verified Eye Specialists & Optometrists */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <span>Verified Eye Specialists & Optometrists</span>
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    {eyeCareDoctors.length} Verified
                  </span>
                </h3>
                <span className="text-xs text-slate-500 font-medium">Updated 2026</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {eyeCareDoctors.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-white rounded-2xl border-2 border-emerald-100 hover:border-emerald-500 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between"
                  >
                    <div>
                      {/* Name & Badge */}
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <h4 className="font-black text-lg text-slate-900">
                            {doc.name}
                          </h4>
                          {lang === 'ur' && (
                            <span className="text-xs font-bold text-slate-600 font-urdu block">
                              {doc.nameUrdu}
                            </span>
                          )}
                          <div className="text-xs font-bold text-emerald-700 mt-0.5">
                            {doc.specialty}
                          </div>
                        </div>

                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          Verified
                        </span>
                      </div>

                      {/* Qualification */}
                      <div className="text-xs text-slate-600 bg-emerald-50/50 border border-emerald-100 px-3 py-1.5 rounded-xl mb-3 font-semibold">
                        {doc.qualification} {doc.pmcRegistration ? `• ${doc.pmcRegistration}` : ''}
                      </div>

                      {/* Location & Timings */}
                      <div className="space-y-2 text-xs text-slate-700 mb-4">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-emerald-700 shrink-0" />
                          <span className="font-bold text-slate-900">{doc.hospitalOrClinic}</span>
                        </div>
                        <div className="flex items-start gap-2 text-slate-600">
                          <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                          <span>{doc.address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Calendar className="w-4 h-4 text-emerald-700 shrink-0" />
                          <span>{doc.availableDays}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
                          <span>{doc.timings}</span>
                        </div>
                      </div>

                      {/* Available Eye Services */}
                      <div className="mb-4">
                        <span className="text-xs font-bold text-slate-700 block mb-1.5">
                          Verified Eye Procedures & Services:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {(doc.services || []).map((srv, idx) => (
                            <span
                              key={idx}
                              className="bg-slate-100 text-slate-800 text-[11px] font-medium px-2.5 py-1 rounded-lg border border-slate-200"
                            >
                              ✓ {srv}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Verification details */}
                      <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200 mb-3 space-y-0.5">
                        <div>
                          <strong>Verification Source:</strong> {doc.verificationSource}
                        </div>
                        <div>
                          <strong>Last Verified:</strong> {doc.lastUpdated}
                        </div>
                        {doc.notes && (
                          <div className="text-slate-600 italic mt-1">
                            “{doc.notes}”
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <a
                        href={`tel:${doc.appointmentPhone}`}
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-4 rounded-xl font-bold text-xs shadow-xs transition-colors"
                      >
                        <PhoneCall className="w-4 h-4" />
                        <span>Call {doc.appointmentPhone}</span>
                      </a>

                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          `${doc.hospitalOrClinic} ${doc.address} Hafizabad`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2.5 rounded-xl transition-colors text-xs font-bold"
                        title="Directions on Google Maps"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Directions</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Eye Hospitals & Specialized Ophthalmology Units in Hafizabad */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <h3 className="text-lg font-black text-slate-900 mb-2">
                Hospitals with Specialized Eye Departments in Hafizabad
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Facilities equipped with ophthalmic operating theaters, A/B ultrasound scans, and outpatient eye clinics:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {eyeCareHospitals.map((hosp) => (
                  <div
                    key={hosp.id}
                    className="border border-slate-200 rounded-xl p-4 hover:border-emerald-500 hover:bg-emerald-50/20 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-base text-slate-900">
                          {hosp.name}
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {hosp.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {hosp.address}
                      </p>
                      <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                        {hosp.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => onSelectHospital(hosp)}
                        className="text-xs font-bold text-[#034694] hover:underline"
                      >
                        View Full Hospital Profile →
                      </button>
                      <a
                        href={`tel:${hosp.phone}`}
                        className="inline-flex items-center gap-1 text-xs font-bold bg-slate-100 text-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-200"
                      >
                        <PhoneCall className="w-3 h-3 text-[#034694]" />
                        Call
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ALL VERIFIED DOCTORS ROSTER */}
        {activeTab === 'all-doctors' && (
          <div className="space-y-6">
            {/* Search & Filter Controls */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={allDocSearch}
                    onChange={(e) => setAllDocSearch(e.target.value)}
                    placeholder="Search doctor by name, qualification, or hospital chamber..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#034694] focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              {/* Specialty Chips */}
              <div>
                <span className="text-xs font-bold text-slate-500 block mb-2">Filter by Specialty:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'All',
                    'Pediatrics',
                    'Gynecology',
                    'General Physician',
                    'Cardiology',
                    'Orthopedics',
                    'Ophthalmology',
                    'Dentistry',
                    'General Surgery',
                    'Urology',
                    'Dermatology',
                    'ENT',
                  ].map((spec) => (
                    <button
                      key={spec}
                      onClick={() => setAllDocSpecialty(spec)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                        allDocSpecialty === spec
                          ? 'bg-[#034694] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-[#034694]'
                      }`}
                    >
                      {spec}
                    </button>
                  ))}
                </div>
              </div>

              {/* District Area Chips */}
              <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
                <span className="text-xs font-bold text-slate-500 shrink-0">Area:</span>
                {['All', 'Hafizabad City', 'Pindi Bhattian', 'Jalalpur Bhattian'].map((area) => (
                  <button
                    key={area}
                    onClick={() => setAllDocArea(area)}
                    className={`text-xs px-3 py-1 rounded-md font-semibold transition-colors shrink-0 cursor-pointer ${
                      allDocArea === area
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>

            {/* Doctors Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-black text-slate-900">
                  Verified Consultants in Hafizabad ({filteredAllDoctors.length})
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  PMC Verified Qualifications
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAllDoctors.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow p-5 flex flex-col justify-between"
                  >
                    <div>
                      {/* Name & Specialty */}
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-black text-base sm:text-lg text-slate-900">
                              {doc.name}
                            </h4>
                            {doc.isVerified && (
                              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                Verified
                              </span>
                            )}
                          </div>
                          {lang === 'ur' && doc.nameUrdu && (
                            <span className="text-xs font-semibold text-slate-500 font-urdu block">
                              {doc.nameUrdu}
                            </span>
                          )}
                          <div className="text-xs font-bold text-[#034694] mt-0.5">
                            {doc.specialty}
                          </div>
                        </div>
                        <span className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md shrink-0">
                          {doc.area}
                        </span>
                      </div>

                      {/* Qualification */}
                      <div className="text-xs text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg mb-3 font-medium border border-slate-100">
                        {doc.qualification} {doc.pmcRegistration ? `• ${doc.pmcRegistration}` : ''}
                      </div>

                      {/* Location & Timings */}
                      <div className="space-y-1.5 text-xs text-slate-700 mb-3">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-bold text-slate-900">{doc.hospitalOrClinic}</span>
                        </div>
                        <div className="flex items-start gap-1.5 text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span>{doc.address}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{doc.availableDays} ({doc.timings})</span>
                        </div>
                      </div>

                      {/* Available Services */}
                      {doc.services && doc.services.length > 0 && (
                        <div className="mb-4">
                          <span className="text-[11px] font-bold text-slate-500 block mb-1">
                            Key Procedures & Clinical Services:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {doc.services.map((srv, idx) => (
                              <span
                                key={idx}
                                className="bg-blue-50 text-[#034694] text-[10px] font-semibold px-2 py-0.5 rounded-md"
                              >
                                {srv}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <a
                        href={`tel:${doc.appointmentPhone}`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#034694] hover:bg-[#002d66] text-white py-2 px-3 rounded-xl font-bold text-xs shadow-xs transition-colors"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Call {doc.appointmentPhone}</span>
                      </a>

                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          `${doc.hospitalOrClinic} ${doc.address} Hafizabad`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors text-xs font-semibold"
                        title="Get Directions on Google Maps"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      {onOpenReport && (
                        <button
                          onClick={() => onOpenReport(doc.name, doc.id)}
                          className="text-[10px] text-slate-400 hover:text-red-600 px-1.5 py-1"
                          title="Report inaccurate info"
                        >
                          Report
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
