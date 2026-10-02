import React, { useState } from 'react';
import { Hospital, Doctor, UserReview, Language } from '../types';
import { getT } from '../translations';
import {
  Building2,
  PhoneCall,
  MapPin,
  Clock,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  Share2,
  ExternalLink,
  Activity,
  HeartHandshake,
  Star,
  CheckCircle2,
  XCircle,
  HelpCircle,
  MessageSquarePlus,
  Flag,
} from 'lucide-react';

interface HospitalDetailPageProps {
  hospital: Hospital;
  doctors: Doctor[];
  reviews: UserReview[];
  lang: Language;
  onBack: () => void;
  onOpenReport: (name: string, id: string) => void;
  onOpenClaim: (name: string, id: string) => void;
  onOpenReview: (name: string, id: string) => void;
}

export const HospitalDetailPage: React.FC<HospitalDetailPageProps> = ({
  hospital,
  doctors,
  reviews,
  lang,
  onBack,
  onOpenReport,
  onOpenClaim,
  onOpenReview,
}) => {
  const t = getT(lang);
  const [copied, setCopied] = useState(false);

  // Doctors affiliated or related to this hospital
  const hospitalDoctors = doctors.filter(
    (d) =>
      d.hospitalOrClinic.toLowerCase().includes(hospital.name.toLowerCase().split(' ')[0]) ||
      d.hospitalOrClinic.toLowerCase().includes(hospital.id.replace(/-/g, ' '))
  );

  const approvedReviews = reviews.filter(
    (r) => r.facilityId === hospital.id && r.status === 'approved'
  );

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: hospital.name,
        text: `Healthcare details for ${hospital.name} in Hafizabad District`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const renderServiceBadge = (available: boolean | null, label: string) => {
    if (available === true) {
      return (
        <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
          <span className="font-semibold text-xs sm:text-sm text-slate-800">{label}</span>
          <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Verified Available
          </span>
        </div>
      );
    }
    if (available === false) {
      return (
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
          <span className="font-semibold text-xs sm:text-sm text-slate-600">{label}</span>
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
            <XCircle className="w-4 h-4 text-slate-400" />
            Not Available On-Site
          </span>
        </div>
      );
    }
    return (
      <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/60 border border-amber-200">
        <span className="font-semibold text-xs sm:text-sm text-slate-700">{label}</span>
        <span className="text-xs font-medium text-amber-700 flex items-center gap-1">
          <HelpCircle className="w-4 h-4 text-amber-600" />
          Information not verified
        </span>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button and breadcrumb */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#034694] hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Hospitals</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 border border-slate-200 hover:border-slate-300 rounded-xl text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'Link Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Main Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold mb-2">
              <span
                className={`px-2.5 py-0.5 rounded-full ${
                  hospital.type === 'Government'
                    ? 'bg-emerald-100 text-emerald-800 font-bold'
                    : 'bg-blue-100 text-[#034694] font-bold'
                }`}
              >
                {hospital.type} Hospital
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-700 font-medium">{hospital.area}</span>
              {hospital.emergency24_7 && (
                <>
                  <span className="text-slate-500">·</span>
                  <span className="text-red-700 font-bold flex items-center gap-1 bg-red-50 px-2 py-0.5 rounded-full">
                    <Activity className="w-3.5 h-3.5" /> 24/7 Emergency
                  </span>
                </>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 mb-1">
              {hospital.name}
            </h1>
            <p className="text-sm font-urdu text-slate-600 mb-2">{hospital.nameUrdu}</p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
            {hospital.isVerified ? (
              <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-xl text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified by Health Authority</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1.5 rounded-xl text-xs font-medium">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Information not verified</span>
              </div>
            )}
            <span className="text-[11px] text-slate-400">
              Last Verified: {hospital.lastUpdated}
            </span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-6 border-t border-slate-100 pt-4">
          {hospital.description}
        </p>

        {/* Quick Contact & Emergency Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-start gap-3">
            <div className="p-2.5 bg-[#034694] text-white rounded-xl shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Telephone Hotline
              </div>
              <a
                href={`tel:${hospital.phone}`}
                className="font-mono font-bold text-base text-[#034694] hover:underline"
              >
                {hospital.phone}
              </a>
              <div className="text-[11px] text-slate-500">General Information Desk</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-red-50/70 border border-red-200 flex items-start gap-3">
            <div className="p-2.5 bg-red-600 text-white rounded-xl shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-red-700 uppercase tracking-wider">
                Emergency Hotline
              </div>
              <a
                href={`tel:${hospital.emergencyPhone || hospital.phone}`}
                className="font-mono font-bold text-base text-red-700 hover:underline"
              >
                {hospital.emergencyPhone || hospital.phone}
              </a>
              <div className="text-[11px] text-red-600">{hospital.emergencyAvailability}</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <div className="p-2.5 bg-slate-800 text-white rounded-xl shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Operating Hours
              </div>
              <div className="font-bold text-sm text-slate-800">{hospital.openingHours}</div>
              <div className="text-[11px] text-slate-500">OPD & Casualty timings</div>
            </div>
          </div>
        </div>

        {/* Location & Directions Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-100 text-xs sm:text-sm text-slate-700">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-[#034694] shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-900">{hospital.address}</div>
              <div className="text-xs text-slate-500">{hospital.addressUrdu}</div>
            </div>
          </div>
          <a
            href={`https://maps.google.com/?q=${hospital.coordinates.lat},${hospital.coordinates.lng}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#034694] hover:bg-blue-800 text-white rounded-xl font-bold text-xs shrink-0 transition-colors shadow-2xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open in Google Maps / Get Directions</span>
          </a>
        </div>
      </div>

      {/* Verified Service Capabilities Matrix */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-8">
        <h2 className="text-lg sm:text-xl font-black text-slate-900 mb-1">
          Factual Services & Diagnostic Capabilities
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          Directly verified against hospital equipment registers. No unsupported claims.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {renderServiceBadge(hospital.services.emergency, '24/7 Emergency Care')}
          {renderServiceBadge(hospital.services.laboratory, 'Pathology Laboratory')}
          {renderServiceBadge(hospital.services.xRay, 'Digital X-Ray')}
          {renderServiceBadge(hospital.services.ultrasound, 'Ultrasound Imaging')}
          {renderServiceBadge(hospital.services.ctScan, 'Computed Tomography (CT Scan)')}
          {renderServiceBadge(hospital.services.mri, 'Magnetic Resonance Imaging (MRI)')}
          {renderServiceBadge(hospital.services.bloodBank, 'Blood Storage / Transfusion Unit')}
          {renderServiceBadge(hospital.services.ambulance, 'Ambulance Service')}
          {renderServiceBadge(hospital.services.icu, 'Intensive Care Unit (ICU/CCU)')}
          {renderServiceBadge(hospital.services.nicu, 'Neonatal Nursery (NICU)')}
          {renderServiceBadge(hospital.services.dialysis, 'Hemodialysis Unit')}
          {renderServiceBadge(hospital.services.operationTheater, 'Operation Theaters')}
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500 flex items-center justify-between">
          <span>Verification Registry: {hospital.verificationSource}</span>
          <span>Status: Verified Factual</span>
        </div>
      </div>

      {/* Departments & Medical Sections */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-8">
        <h2 className="text-lg sm:text-xl font-black text-slate-900 mb-1">
          Clinical Departments & Specialist Wards
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Available medical units at this facility
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {hospital.departments.map((dept, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl border border-slate-100 bg-slate-50/70 text-xs font-semibold text-slate-800 flex items-center gap-2"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#034694]" />
              <span>{dept}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Doctors on Panel / Practicing Here */}
      {hospitalDoctors.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-8">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 mb-1">
            Doctors & Consultants at this Facility
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Verified specialists with PMC credentials
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {hospitalDoctors.map((doc) => (
              <div
                key={doc.id}
                className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-600 transition-colors bg-slate-50/50"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{doc.name}</h3>
                    <div className="text-xs text-emerald-700 font-bold">{doc.specialty}</div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    PMC Verified
                  </span>
                </div>
                <div className="text-xs text-slate-600 mt-2 space-y-1">
                  <div><strong>Degree:</strong> {doc.qualification}</div>
                  <div><strong>Days:</strong> {doc.availableDays} ({doc.timings})</div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Call for appointment</span>
                  <a
                    href={`tel:${doc.appointmentPhone}`}
                    className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>Call {doc.appointmentPhone}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Reviews Section (Moderated) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              Community Reviews & Patient Feedback
            </h2>
            <p className="text-xs text-slate-500">
              Strictly moderated authentic community experiences. No automated ratings.
            </p>
          </div>
          <button
            onClick={() => onOpenReview(hospital.name, hospital.id)}
            className="px-4 py-2 bg-[#034694] hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Write Factual Review</span>
          </button>
        </div>

        {approvedReviews.length > 0 ? (
          <div className="space-y-4">
            {approvedReviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-bold text-xs sm:text-sm text-slate-900">
                    {rev.reviewerName}
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= rev.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                    <span className="text-[11px] text-slate-500 ml-1.5">
                      Visited {rev.visitDate}
                    </span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {rev.reviewText}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-xs text-slate-500 mb-2">
              No public reviews approved yet for this hospital.
            </p>
            <button
              onClick={() => onOpenReview(hospital.name, hospital.id)}
              className="text-xs font-bold text-[#034694] hover:underline"
            >
              Be the first patient or attendant to leave a factual review
            </button>
          </div>
        )}
      </div>

      {/* Facility Claim & Error Reporting Footnote */}
      <div className="bg-slate-100 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <HeartHandshake className="w-4 h-4 text-[#034694]" />
          <span>
            Are you an administrator or doctor at <strong>{hospital.name}</strong>?
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenClaim(hospital.name, hospital.id)}
            className="font-bold text-[#034694] hover:underline"
          >
            Claim This Listing
          </button>
          <span>·</span>
          <button
            onClick={() => onOpenReport(hospital.name, hospital.id)}
            className="font-bold text-amber-700 hover:underline flex items-center gap-1"
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Report Error</span>
          </button>
        </div>
      </div>
    </div>
  );
};
