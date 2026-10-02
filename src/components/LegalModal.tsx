import React from 'react';
import { X, ShieldAlert, FileText, Lock } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'privacy' | 'terms' | 'disclaimer';
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, type }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            {type === 'disclaimer' ? (
              <ShieldAlert className="w-5 h-5 text-amber-600" />
            ) : type === 'privacy' ? (
              <Lock className="w-5 h-5 text-[#034694]" />
            ) : (
              <FileText className="w-5 h-5 text-emerald-600" />
            )}
            <h3 className="font-bold text-slate-900 text-base">
              {type === 'disclaimer'
                ? 'Medical & Emergency Disclaimer'
                : type === 'privacy'
                ? 'Privacy Policy'
                : 'Terms & Conditions'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          {type === 'disclaimer' && (
            <>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 font-medium">
                <strong>CRITICAL NOTICE:</strong> “This website provides healthcare facility information only. It does not provide medical diagnosis or replace professional medical advice. In an emergency, contact emergency services (Rescue 1122) or visit the nearest emergency department.”
              </div>
              <h4 className="font-bold text-slate-800 text-sm">1. Non-Diagnostic Purpose</h4>
              <p>
                Hafizabad Health Guide (HHG) is an independent public information directory. We do not provide clinical diagnosis, triage, treatment prescriptions, or doctor-patient confidentiality. Always consult a qualified medical professional for health concerns.
              </p>
              <h4 className="font-bold text-slate-800 text-sm">2. Blood Availability Dynamic Status</h4>
              <p>
                Blood reserves fluctuate minute by minute based on acute surgeries and obstetric emergencies. Listings on this platform show the latest timestamp verified by facility personnel. Always call the blood bank or transfusion center before traveling.
              </p>
              <h4 className="font-bold text-slate-800 text-sm">3. Emergency Protocol</h4>
              <p>
                In life-threatening situations such as vehicular trauma, severe chest pain, unresponsiveness, or heavy bleeding, dial Punjab Emergency Service <strong>1122</strong> immediately.
              </p>
            </>
          )}

          {type === 'privacy' && (
            <>
              <h4 className="font-bold text-slate-800 text-sm">1. No Sensitive Health Data Collected</h4>
              <p>
                Hafizabad Health Guide does not store patient medical charts, prescription histories, diagnostic scans, or private health conditions. The platform is designed purely as an institutional directory for public awareness.
              </p>
              <h4 className="font-bold text-slate-800 text-sm">2. Citizen Submissions</h4>
              <p>
                When submitting reviews, incorrect data reports, or facility claims, contact information provided is solely used for verification purposes and will never be sold or rented to third-party marketing entities.
              </p>
              <h4 className="font-bold text-slate-800 text-sm">3. Location Services</h4>
              <p>
                Device location requests for "Nearby Facilities" or distance calculations are processed entirely within your client browser and are never tracked or saved onto remote profiling servers.
              </p>
            </>
          )}

          {type === 'terms' && (
            <>
              <h4 className="font-bold text-slate-800 text-sm">1. Verification Standard</h4>
              <p>
                Every listing on Hafizabad Health Guide is checked against official district health authorities, Punjab Healthcare Commission registries, and direct on-ground facility records. Information that is not verified is explicitly indicated as such.
              </p>
              <h4 className="font-bold text-slate-800 text-sm">2. Prohibition of Fake Information</h4>
              <p>
                Users, agents, and administrators are strictly forbidden from creating fake hospital names, fabricated phone numbers, fictional reviews, or unauthorized claims.
              </p>
              <h4 className="font-bold text-slate-800 text-sm">3. Facility Claims & Moderation</h4>
              <p>
                All facility claims submitted by clinics, medical stores, or diagnostic labs undergo human administrative verification before representative update credentials are granted.
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex justify-end bg-slate-50">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#034694] text-white rounded-xl text-xs font-bold hover:bg-blue-800 transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
