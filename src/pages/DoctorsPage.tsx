import React, { useState, useMemo } from 'react';
import { Doctor, Language } from '../types';
import { getT } from '../translations';
import {
  Search,
  User,
  PhoneCall,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  AlertCircle,
  GraduationCap,
  Filter,
} from 'lucide-react';

interface DoctorsPageProps {
  lang: Language;
  doctors: Doctor[];
  onOpenReport: (name: string, id: string) => void;
}

export const DoctorsPage: React.FC<DoctorsPageProps> = ({
  lang,
  doctors,
  onOpenReport,
}) => {
  const t = getT(lang);
  const [search, setSearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [selectedArea, setSelectedArea] = useState<string>('All');

  const specialties = [
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
  ];

  const areas = ['Hafizabad City', 'Pindi Bhattian', 'Jalalpur Bhattian'];

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = doc.name.toLowerCase().includes(q) || doc.nameUrdu.includes(q);
        const matchSpec = doc.specialty.toLowerCase().includes(q) || doc.specialtyUrdu.includes(q);
        const matchHosp = doc.hospitalOrClinic.toLowerCase().includes(q);
        if (!matchName && !matchSpec && !matchHosp) return false;
      }

      if (selectedSpecialty !== 'All') {
        const specMatch = doc.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase());
        if (!specMatch) return false;
      }

      if (selectedArea !== 'All' && doc.area !== selectedArea) {
        return false;
      }

      return true;
    });
  }, [doctors, search, selectedSpecialty, selectedArea]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 mb-1">
          <User className="w-4 h-4 text-emerald-600" />
          <span>Pakistan Medical Commission (PMC) & District Roster</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Specialist Doctors & Medical Consultants in Hafizabad
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-3xl">
          Factual roster of verified consultants and surgeons practicing at DHQ Hospital Hafizabad, THQ Pindi Bhattian, and registered private specialist clinics.
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
              placeholder="Search doctor by name, specialty, or hospital chamber..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#034694] focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 focus:outline-hidden"
            >
              <option value="All">All Areas ({doctors.length})</option>
              {areas.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Specialty Filter Buttons */}
        <div className="pt-2 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Filter by Specialty
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedSpecialty('All')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedSpecialty === 'All'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Specialties
            </button>
            {specialties.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSpecialty(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedSpecialty === s
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Doctors List Count */}
      <div className="flex items-center justify-between mb-4 text-xs text-slate-500">
        <div>
          Showing <span className="font-bold text-slate-900">{filteredDoctors.length}</span> verified consultants
        </div>
        <div className="text-[11px] text-slate-400">
          *Doctors are listed objectively without subjective ranking.
        </div>
      </div>

      {/* Doctors Cards Grid */}
      {filteredDoctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">
                      {doc.name}
                    </h2>
                    <p className="text-xs font-urdu text-slate-500">{doc.nameUrdu}</p>
                    <div className="text-xs font-bold text-emerald-700 mt-1">
                      {doc.specialty}
                    </div>
                  </div>

                  {doc.isVerified ? (
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

                {/* Qualification */}
                <div className="flex items-start gap-1.5 text-xs text-slate-700 mb-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <GraduationCap className="w-4 h-4 text-[#034694] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-800">{doc.qualification}</div>
                    {doc.pmcRegistration && (
                      <div className="text-[10px] text-slate-500">{doc.pmcRegistration}</div>
                    )}
                  </div>
                </div>

                {/* Hospital / Clinic */}
                <div className="text-xs text-slate-600 mb-2 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium">{doc.hospitalOrClinic}</span>
                    <span className="text-slate-400 block text-[11px]">{doc.area}</span>
                  </div>
                </div>

                {/* Timings */}
                <div className="text-xs text-slate-600 mb-2 flex items-start gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{doc.availableDays}</span>
                </div>
                <div className="text-xs text-slate-600 mb-4 flex items-start gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{doc.timings}</span>
                </div>

                {doc.notes && (
                  <div className="text-[11px] text-slate-500 italic mb-4">
                    Focus: {doc.notes}
                  </div>
                )}
              </div>

              {/* Action */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onOpenReport(doc.name, doc.id)}
                  className="text-[11px] text-slate-400 hover:text-slate-600"
                >
                  Report error
                </button>
                <a
                  href={`tel:${doc.appointmentPhone}`}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Book: {doc.appointmentPhone}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h3 className="font-bold text-slate-800 text-base mb-1">
            No Doctors Found for Selected Specialty
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Try choosing "All Specialties" or removing search terms.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedSpecialty('All');
              setSelectedArea('All');
            }}
            className="px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
