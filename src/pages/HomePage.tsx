import React, { useState } from 'react';
import {
  Hospital,
  Doctor,
  Pharmacy,
  Laboratory,
  BloodBank,
  Language,
  DistrictArea,
} from '../types';
import { getT } from '../translations';
import {
  Search,
  Building2,
  User,
  Pill,
  Droplet,
  FlaskConical,
  PhoneCall,
  MapPin,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Clock,
  ExternalLink,
  Flame,
  Activity,
  AlertTriangle,
  Eye,
  Stethoscope,
} from 'lucide-react';
import { Logo } from '../components/Logo';

interface HomePageProps {
  lang: Language;
  hospitals: Hospital[];
  doctors: Doctor[];
  pharmacies: Pharmacy[];
  laboratories: Laboratory[];
  bloodBanks: BloodBank[];
  onNavigateTab: (tab: string, filter?: string) => void;
  onSelectHospital: (hospital: Hospital) => void;
  onOpenSearch: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  lang,
  hospitals,
  doctors,
  pharmacies,
  laboratories,
  bloodBanks,
  onNavigateTab,
  onSelectHospital,
  onOpenSearch,
}) => {
  const t = getT(lang);
  const [selectedArea, setSelectedArea] = useState<DistrictArea | 'All'>('All');

  // Quick categories
  const categories = [
    {
      id: 'hospitals',
      title: t.catHospitals,
      subtitle: `${hospitals.length} Facilities`,
      icon: Building2,
      color: 'bg-blue-50 text-[#034694] border-blue-200 hover:border-[#034694]',
      badge: 'DHQ & Private',
    },
    {
      id: 'doctors',
      title: t.catDoctors,
      subtitle: `${doctors.length} Verified Specialists`,
      icon: User,
      color: 'bg-emerald-50 text-[#059669] border-emerald-200 hover:border-[#059669]',
      badge: 'PMC / DHA Roster',
    },
    {
      id: 'find-doctor',
      title: 'Find Doctor / Service',
      subtitle: 'Health Concern Matcher',
      icon: Stethoscope,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:border-indigo-700',
      badge: 'Concern Finder',
    },
    {
      id: 'eyecare',
      title: 'Eye & Eyesight Care',
      subtitle: 'Phaco, Vision & Glasses',
      icon: Eye,
      color: 'bg-teal-50 text-teal-800 border-teal-200 hover:border-teal-700',
      badge: 'Special Section',
    },
    {
      id: 'blood',
      title: t.catBlood,
      subtitle: 'Real-time Stock Alert',
      icon: Droplet,
      color: 'bg-rose-50 text-rose-600 border-rose-200 hover:border-rose-600',
      badge: 'Live Availability',
    },
    {
      id: 'emergency-helplines',
      title: 'Emergency Helplines',
      subtitle: '1122, Police 15, Fire 16',
      icon: ShieldAlert,
      color: 'bg-red-50 text-red-600 border-red-200 hover:border-red-600',
      badge: '24/7 Hotlines',
    },
    {
      id: 'pharmacies',
      title: t.catPharmacies,
      subtitle: `${pharmacies.length} Stores Listed`,
      icon: Pill,
      color: 'bg-amber-50 text-amber-700 border-amber-200 hover:border-amber-700',
      badge: '24/7 & Delivery',
    },
    {
      id: 'labs',
      title: t.catLabs,
      subtitle: 'X-Ray, Ultrasound & CT',
      icon: FlaskConical,
      color: 'bg-cyan-50 text-cyan-700 border-cyan-200 hover:border-cyan-700',
      badge: 'Chughtai & IDC',
    },
    {
      id: 'map',
      title: t.catNearby,
      subtitle: 'Interactive Pins',
      icon: MapPin,
      color: 'bg-slate-100 text-slate-800 border-slate-200 hover:border-slate-400',
      badge: 'GPS Directions',
    },
  ];

  const areas: DistrictArea[] = [
    'Hafizabad City',
    'Pindi Bhattian',
    'Jalalpur Bhattian',
    'Sukheke Mandi',
  ];

  // Featured facilities (DHQ, Trauma Center, THQ Pindi Bhattian, Saqib Basheer, Kamran Surgical)
  const featured = hospitals.slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-radial from-blue-900 via-[#034694] to-slate-900 text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 shadow-inner">
        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Official Emblem Logo */}
          <div className="flex justify-center mb-5">
            <Logo variant="icon" size={88} className="drop-shadow-2xl hover:scale-105 transition-transform" />
          </div>

          {/* Factual Trust Badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6 backdrop-blur-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Official Hafizabad District Public Healthcare Directory</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4">
            “Hafizabad Ki Sehat, Ek Jagah”
          </h1>
          <p className="text-slate-200 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            {t.subtitle}
          </p>

          {/* Large Search Box */}
          <div
            onClick={onOpenSearch}
            className="w-full max-w-2xl mx-auto bg-white rounded-2xl p-2.5 shadow-2xl flex items-center gap-3 cursor-pointer border-2 border-transparent hover:border-emerald-400 transition-all text-slate-700"
          >
            <div className="p-2.5 bg-blue-50 text-[#034694] rounded-xl shrink-0">
              <Search className="w-5 h-5" />
            </div>
            <span className="text-xs sm:text-sm text-slate-400 truncate text-left flex-1">
              Search hospitals, doctors, pharmacies, blood groups or medical services...
            </span>
            <button className="bg-[#034694] text-white px-4 sm:px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm hover:bg-blue-800 transition-colors shrink-0">
              {t.searchButton}
            </button>
          </div>

          {/* District Highlights */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-8 text-xs text-blue-200 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% Factual & Verified Listings
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Hafizabad City · Pindi Bhattian · Jalalpur Bhattian
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 24/7 Emergency & Blood Status
            </span>
          </div>
        </div>
      </section>

      {/* Quick Category Buttons Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-9 gap-2.5 sm:gap-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => onNavigateTab(cat.id)}
                className={`p-3 rounded-2xl bg-white border shadow-md hover:shadow-lg transition-all text-left flex flex-col justify-between group cursor-pointer ${cat.color}`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div className="p-2 rounded-xl bg-current/10">
                    <Icon className="w-5 h-5 text-current" />
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white border border-slate-200 shadow-2xs">
                    {cat.badge}
                  </span>
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm group-hover:text-[#034694] transition-colors">
                    {cat.title}
                  </div>
                  <div className="text-[11px] text-slate-500">{cat.subtitle}</div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Live Blood Emergency Alert Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-rose-600 text-white rounded-xl shrink-0 animate-pulse">
              <Droplet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-800">
                  Real-Time Blood Availability Notice
                </span>
                <span className="text-[10px] bg-rose-200 text-rose-900 px-2 py-0.5 rounded-full font-bold">
                  District Hafizabad
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 mt-1 max-w-3xl leading-relaxed">
                {t.bloodWarning} Blood banks at DHQ Hospital and Red Crescent Society update stock through authorized staff.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('blood')}
            className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-colors flex items-center gap-2 shrink-0 shadow-xs"
          >
            <span>Check Blood Availability</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Health Concern Matcher & Eye Care Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1: Find Doctor & Health Service */}
          <div className="bg-gradient-to-br from-indigo-900 to-blue-900 text-white rounded-2xl p-6 shadow-md flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 bg-white/20 border border-white/30 text-indigo-100 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Service Navigation Tool</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black mb-2">
                What Doctor or Service Do You Need?
              </h3>
              <p className="text-indigo-100 text-xs sm:text-sm leading-relaxed mb-4">
                Not sure which specialist to consult? Search by common health concern (children, skin, heart, stomach, surgery, tests) and find verified doctors in Hafizabad.
              </p>
              <div className="bg-indigo-950/60 border border-indigo-400/30 rounded-xl p-3 text-[11px] text-indigo-200 mb-4">
                * Service-finding tool only — does not provide medical diagnosis.
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('find-doctor')}
              className="relative z-10 self-start inline-flex items-center gap-2 bg-white text-indigo-900 hover:bg-indigo-50 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-colors"
            >
              <span>Explore Doctor & Service Finder</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Dedicated Eye Care Section */}
          <div className="bg-gradient-to-br from-emerald-900 to-teal-900 text-white rounded-2xl p-6 shadow-md flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 bg-white/20 border border-white/30 text-emerald-100 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                <Eye className="w-3.5 h-3.5" />
                <span>Dedicated Category</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black mb-2">
                Eye & Eyesight Care in Hafizabad
              </h3>
              <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed mb-4">
                Verified ophthalmology clinics, eye surgeons (phaco cataract, glaucoma), computerized vision testing, and glasses assessment in Hafizabad District.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-4 text-[10px] text-emerald-200">
                <span className="bg-emerald-800/80 px-2 py-0.5 rounded-md">Cataract Phaco</span>
                <span className="bg-emerald-800/80 px-2 py-0.5 rounded-md">Vision & Glasses</span>
                <span className="bg-emerald-800/80 px-2 py-0.5 rounded-md">Glaucoma</span>
                <span className="bg-emerald-800/80 px-2 py-0.5 rounded-md">Pediatric Squint</span>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('eyecare')}
              className="relative z-10 self-start inline-flex items-center gap-2 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-colors"
            >
              <span>View Eye Care Facilities & Doctors</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Area Selector Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Browse Healthcare by Area
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Select your tehsil or township to find nearest medical centers
            </p>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedArea('All')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors shrink-0 ${
                selectedArea === 'All'
                  ? 'bg-[#034694] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All District ({hospitals.length})
            </button>
            {areas.map((area) => (
              <button
                key={area}
                onClick={() => setSelectedArea(area)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors shrink-0 ${
                  selectedArea === area
                    ? 'bg-[#034694] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {area}
              </button>
            ))}
          </div>
        </div>

        {/* Area Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {areas.map((area) => {
            const count = hospitals.filter((h) => h.area === area).length;
            const docCount = doctors.filter((d) => d.area === area).length;
            const pharmCount = pharmacies.filter((p) => p.area === area).length;

            return (
              <div
                key={area}
                onClick={() => {
                  onNavigateTab('hospitals', area);
                }}
                className="bg-white border border-slate-200 hover:border-[#034694] rounded-2xl p-4 shadow-xs hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-xl bg-blue-50 text-[#034694] group-hover:bg-[#034694] group-hover:text-white transition-colors">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1 group-hover:text-[#034694]">
                    Explore <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1">{area}</h3>
                <div className="space-y-1 text-xs text-slate-500">
                  <div className="flex items-center justify-between">
                    <span>Hospitals & Clinics</span>
                    <span className="font-semibold text-slate-700">{count}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Specialist Doctors</span>
                    <span className="font-semibold text-slate-700">{docCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Pharmacies</span>
                    <span className="font-semibold text-slate-700">{pharmCount}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Section: Healthcare Facilities in Hafizabad */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Healthcare Facilities in Hafizabad
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Verified
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Government District Headquarters and major verified private surgical hospitals
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('hospitals')}
            className="text-xs sm:text-sm font-bold text-[#034694] hover:underline flex items-center gap-1"
          >
            View All {hospitals.length} Hospitals <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Hospital Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {featured.map((hospital) => (
            <div
              key={hospital.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between"
            >
              <div>
                {/* Header Metadata */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold mb-1">
                      <span
                        className={
                          hospital.type === 'Government'
                            ? 'text-emerald-700 font-bold'
                            : 'text-blue-700 font-bold'
                        }
                      >
                        {hospital.type} Hospital
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
                    <h3
                      onClick={() => onSelectHospital(hospital)}
                      className="font-bold text-lg text-slate-900 hover:text-[#034694] cursor-pointer"
                    >
                      {hospital.name}
                    </h3>
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

                <p className="text-xs text-slate-600 mb-3 line-clamp-2">
                  {hospital.description}
                </p>

                {/* Key Verified Facilities Checklist */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-700 mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <span className={hospital.services.emergency ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                      {hospital.services.emergency ? '✓' : '✗'}
                    </span>
                    <span>Emergency</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={hospital.services.laboratory ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                      {hospital.services.laboratory ? '✓' : '✗'}
                    </span>
                    <span>Laboratory</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={hospital.services.xRay ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                      {hospital.services.xRay ? '✓' : '✗'}
                    </span>
                    <span>X-Ray</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={hospital.services.ultrasound ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                      {hospital.services.ultrasound ? '✓' : '✗'}
                    </span>
                    <span>Ultrasound</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={hospital.services.ctScan ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                      {hospital.services.ctScan ? '✓' : '✗'}
                    </span>
                    <span>CT Scan</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={hospital.services.bloodBank ? 'text-rose-600 font-bold' : 'text-slate-400'}>
                      {hospital.services.bloodBank ? '✓' : '✗'}
                    </span>
                    <span>Blood Storage</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 mb-3 flex items-center justify-between">
                  <span className="truncate max-w-[280px]">
                    📍 {hospital.address}
                  </span>
                  <span>Updated: {hospital.lastUpdated}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectHospital(hospital)}
                  className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-[#034694] font-bold text-xs rounded-xl transition-colors"
                >
                  {t.viewDetails}
                </button>
                <div className="flex items-center gap-2">
                  <a
                    href={`https://maps.google.com/?q=${hospital.coordinates.lat},${hospital.coordinates.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 border border-slate-200 hover:border-slate-300 rounded-xl text-slate-700 text-xs font-semibold flex items-center gap-1"
                    title="Directions"
                  >
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span className="hidden sm:inline">Directions</span>
                  </a>
                  <a
                    href={`tel:${hospital.phone}`}
                    className="px-3.5 py-2 bg-[#034694] hover:bg-blue-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>{t.callNow}</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Strict Data Integrity Commitment */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16">
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-emerald-400/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold mb-4">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Verified Public Information Standard
            </div>
            <h2 className="text-2xl sm:text-3xl font-black mb-3">
              Why Hafizabad Health Guide is 100% Reliable
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Unlike generic directories that publish fictional contact numbers or arbitrary commercial rankings, our team enforces strict public verification. Every phone number, hospital department, doctor degree, and blood status is verified directly against official Punjab Health records and on-ground hospital administrative registers.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <div className="font-bold text-emerald-400 mb-1">✓ No Fake Numbers</div>
                <div className="text-slate-400">All telephone and emergency hotlines are authentic and tested.</div>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <div className="font-bold text-emerald-400 mb-1">✓ No Sponsored Rankings</div>
                <div className="text-slate-400">We do not label any hospital as "Best" without objective, documented facts.</div>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <div className="font-bold text-emerald-400 mb-1">✓ Public Accountability</div>
                <div className="text-slate-400">Anyone can report inaccurate information for immediate admin audit.</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
