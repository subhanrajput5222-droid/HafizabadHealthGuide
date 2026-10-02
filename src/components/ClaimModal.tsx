import React, { useState } from 'react';
import { StorageService } from '../services/storageService';
import { Language } from '../types';
import { ShieldCheck, X, CheckCircle2, AlertCircle } from 'lucide-react';

interface ClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultFacilityName?: string;
  defaultFacilityType?: 'hospital' | 'pharmacy' | 'laboratory' | 'blood_bank' | 'doctor';
  defaultFacilityId?: string;
  lang: Language;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({
  isOpen,
  onClose,
  defaultFacilityName = '',
  defaultFacilityType = 'hospital',
  defaultFacilityId = '',
  lang,
}) => {
  const [facilityName, setFacilityName] = useState(defaultFacilityName);
  const [facilityType, setFacilityType] = useState(defaultFacilityType);
  const [claimantName, setClaimantName] = useState('');
  const [claimantRole, setClaimantRole] = useState('');
  const [officialPhone, setOfficialPhone] = useState('');
  const [officialEmail, setOfficialEmail] = useState('');
  const [verificationProof, setVerificationProof] = useState('');
  const [requestedChanges, setRequestedChanges] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facilityName.trim() || !claimantName.trim() || !officialPhone.trim() || !verificationProof.trim()) {
      setError('Please fill in all required fields including your contact phone and registration/licence proof.');
      return;
    }

    StorageService.submitClaim({
      facilityId: defaultFacilityId || 'custom-' + Date.now(),
      facilityName,
      facilityType,
      claimantName,
      claimantRole: claimantRole || 'Authorized Representative',
      officialPhone,
      officialEmail,
      verificationProof,
      requestedChanges,
    });

    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-100 text-[#034694] rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Claim Healthcare Facility Listing</h3>
              <p className="text-xs text-slate-500">Official representative verification portal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Claim Application Received</h4>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              Thank you. Your claim for <span className="font-bold text-slate-800">{facilityName}</span> has been logged. Our administration will independently verify the registration documents and phone before approving representative edit rights.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="bg-[#034694] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-800 transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Facility Name *
              </label>
              <input
                type="text"
                required
                value={facilityName}
                onChange={(e) => setFacilityName(e.target.value)}
                placeholder="e.g. DHQ Hospital, Servaid Pharmacy, etc."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-[#034694]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Facility Type *
                </label>
                <select
                  value={facilityType}
                  onChange={(e) => setFacilityType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-[#034694] bg-white"
                >
                  <option value="hospital">Hospital</option>
                  <option value="pharmacy">Pharmacy / Medical Store</option>
                  <option value="laboratory">Diagnostic Laboratory</option>
                  <option value="blood_bank">Blood Bank</option>
                  <option value="doctor">Doctor Clinic</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={claimantName}
                  onChange={(e) => setClaimantName(e.target.value)}
                  placeholder="e.g. Dr. Muhammad / Farhan"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-[#034694]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Designation / Role *
                </label>
                <input
                  type="text"
                  required
                  value={claimantRole}
                  onChange={(e) => setClaimantRole(e.target.value)}
                  placeholder="e.g. Medical Superintendent, Owner, Incharge"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-[#034694]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Official Phone / Mobile *
                </label>
                <input
                  type="tel"
                  required
                  value={officialPhone}
                  onChange={(e) => setOfficialPhone(e.target.value)}
                  placeholder="e.g. 0547-XXXXXX / 0300-XXXXXXX"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-[#034694]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Official Email (Optional)
              </label>
              <input
                type="email"
                value={officialEmail}
                onChange={(e) => setOfficialEmail(e.target.value)}
                placeholder="contact@hospital.pk"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-[#034694]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Proof of Authorization / Registration *
              </label>
              <input
                type="text"
                required
                value={verificationProof}
                onChange={(e) => setVerificationProof(e.target.value)}
                placeholder="e.g. Punjab Healthcare Commission (PHC) Reg # or Drug Sale License #"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-[#034694]"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Required to ensure no unauthorized person can alter public healthcare data.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Requested Information Updates (Optional)
              </label>
              <textarea
                rows={3}
                value={requestedChanges}
                onChange={(e) => setRequestedChanges(e.target.value)}
                placeholder="Describe any updated phone numbers, new departments, doctors, or revised opening hours..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-[#034694]"
              />
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#034694] hover:bg-blue-800 text-white rounded-xl text-sm font-bold shadow-xs transition-colors"
              >
                Submit Claim for Verification
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
