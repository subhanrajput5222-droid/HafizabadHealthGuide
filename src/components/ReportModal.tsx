import React, { useState } from 'react';
import { StorageService } from '../services/storageService';
import { Language } from '../types';
import { AlertTriangle, X, CheckCircle2 } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  facilityName: string;
  facilityId: string;
  facilityType?: 'hospital' | 'pharmacy' | 'laboratory' | 'doctor' | 'blood_bank';
  lang: Language;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  facilityName,
  facilityId,
  facilityType = 'hospital',
  lang,
}) => {
  const [reportType, setReportType] = useState<
    'wrong_phone' | 'wrong_address' | 'closed_facility' | 'wrong_services' | 'incorrect_timings' | 'other'
  >('wrong_phone');
  const [details, setDetails] = useState('');
  const [reportedBy, setReportedBy] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) return;

    StorageService.submitReport({
      facilityId,
      facilityName,
      facilityType,
      reportType,
      details,
      reportedBy,
      contactPhone,
    });

    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-amber-50/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Report Incorrect Information</h3>
              <p className="text-xs text-slate-600 truncate max-w-xs">{facilityName}</p>
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
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-1">Feedback Submitted</h4>
            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              Thank you for keeping Hafizabad Health Guide accurate. Our administrator will review this report and update the listing accordingly.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="bg-[#034694] text-white px-5 py-2 rounded-xl text-xs font-bold"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Issue Category *
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-[#034694]"
              >
                <option value="wrong_phone">Incorrect Phone Number</option>
                <option value="wrong_address">Incorrect Location / Address</option>
                <option value="closed_facility">Facility Permanently or Temporarily Closed</option>
                <option value="wrong_services">Inaccurate Listed Services (e.g. no CT Scan/Lab)</option>
                <option value="incorrect_timings">Outdated Timings or Not 24/7</option>
                <option value="other">Other Inaccuracy</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Correct Information & Details *
              </label>
              <textarea
                required
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Please state what needs correction (e.g., 'The emergency number is actually 0547-...' or 'They do not do MRI tests on-site')."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-[#034694]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  value={reportedBy}
                  onChange={(e) => setReportedBy(e.target.value)}
                  placeholder="Citizen name"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Contact Phone (Optional)
                </label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="For clarification"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-hidden"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors"
              >
                Submit Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
