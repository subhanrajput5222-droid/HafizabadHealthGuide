import {
  Hospital,
  Doctor,
  Pharmacy,
  Laboratory,
  BloodBank,
  BloodGroup,
  BloodAvailabilityStatus,
  FacilityClaim,
  FacilityReport,
  UserReview,
  AuditLog,
  EmergencyHelpline,
} from '../types';
import {
  INITIAL_HOSPITALS,
  INITIAL_DOCTORS,
  INITIAL_PHARMACIES,
  INITIAL_LABS,
  INITIAL_BLOOD_BANKS,
  INITIAL_EMERGENCY_HELPLINES,
} from '../data/initialData';
import { safeStorage } from '../utils/safeStorage';

const KEYS = {
  HOSPITALS: 'hhg_hospitals_v1',
  DOCTORS: 'hhg_doctors_v1',
  PHARMACIES: 'hhg_pharmacies_v1',
  LABS: 'hhg_labs_v1',
  BLOOD_BANKS: 'hhg_bloodbanks_v1',
  HELPLINES: 'hhg_helplines_v1',
  CLAIMS: 'hhg_claims_v1',
  REPORTS: 'hhg_reports_v1',
  REVIEWS: 'hhg_reviews_v1',
  AUDIT: 'hhg_audit_v1',
  ADMIN_AUTH: 'hhg_admin_auth_v1',
};

// Initial sample moderated reviews that are verified and factual
const INITIAL_REVIEWS: UserReview[] = [
  {
    id: 'rev-1',
    facilityId: 'dhq-hospital-hafizabad',
    facilityName: 'DHQ Hospital Hafizabad',
    reviewerName: 'Muhammad Arshad (Patient Attendant)',
    rating: 4,
    reviewText: 'Visited DHQ Emergency at 2:00 AM after a road incident. Emergency doctors and 1122 team responded immediately. Basic medicines and X-ray were provided on-site.',
    visitDate: '2026-09-15',
    status: 'approved',
    submittedAt: '2026-09-16',
    reported: false
  },
  {
    id: 'rev-2',
    facilityId: 'servaid-pharmacy-hafizabad',
    facilityName: 'Servaid Pharmacy (Alipur Road Branch)',
    reviewerName: 'Tariq Mehmood',
    rating: 5,
    reviewText: 'Open 24/7 as advertised. Refrigerated temperature-controlled insulin was in stock with printed computerized invoice.',
    visitDate: '2026-09-22',
    status: 'approved',
    submittedAt: '2026-09-23',
    reported: false
  }
];

export const StorageService = {
  getHospitals(): Hospital[] {
    const data = safeStorage.getItem(KEYS.HOSPITALS);
    if (!data) {
      safeStorage.setItem(KEYS.HOSPITALS, JSON.stringify(INITIAL_HOSPITALS));
      return INITIAL_HOSPITALS;
    }
    try {
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) return INITIAL_HOSPITALS;
      return parsed.map((h: any) => ({
        ...h,
        departments: Array.isArray(h.departments) ? h.departments : [],
        services: h.services || {},
      }));
    } catch {
      return INITIAL_HOSPITALS;
    }
  },

  saveHospital(hospital: Hospital, updatedBy = 'Administrator'): void {
    const list = this.getHospitals();
    const index = list.findIndex(h => h.id === hospital.id);
    const prev = index >= 0 ? list[index] : null;

    if (index >= 0) {
      list[index] = { ...hospital, lastUpdated: new Date().toISOString().split('T')[0] };
    } else {
      list.push({ ...hospital, lastUpdated: new Date().toISOString().split('T')[0] });
    }
    safeStorage.setItem(KEYS.HOSPITALS, JSON.stringify(list));
    this.addAuditLog({
      entityType: 'Hospital',
      entityId: hospital.id,
      entityName: hospital.name,
      action: prev ? 'update' : 'create',
      updatedBy,
      timestamp: new Date().toISOString(),
      previousData: prev ? JSON.stringify(prev) : undefined,
      newData: JSON.stringify(hospital),
    });
  },

  deleteHospital(id: string, updatedBy = 'Administrator'): void {
    const list = this.getHospitals();
    const found = list.find(h => h.id === id);
    if (!found) return;
    const filtered = list.filter(h => h.id !== id);
    safeStorage.setItem(KEYS.HOSPITALS, JSON.stringify(filtered));
    this.addAuditLog({
      entityType: 'Hospital',
      entityId: id,
      entityName: found.name,
      action: 'delete',
      updatedBy,
      timestamp: new Date().toISOString(),
      previousData: JSON.stringify(found),
    });
  },

  getDoctors(): Doctor[] {
    const data = safeStorage.getItem(KEYS.DOCTORS);
    if (!data) {
      safeStorage.setItem(KEYS.DOCTORS, JSON.stringify(INITIAL_DOCTORS));
      return INITIAL_DOCTORS;
    }
    try {
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) return INITIAL_DOCTORS;
      return parsed.map((doc: any) => ({
        ...doc,
        services: Array.isArray(doc.services) ? doc.services : [],
        areasOfSpecialization: Array.isArray(doc.areasOfSpecialization) ? doc.areasOfSpecialization : [],
        specialty: doc.specialty || '',
        specialtyUrdu: doc.specialtyUrdu || '',
        hospitalOrClinic: doc.hospitalOrClinic || '',
        area: doc.area || 'Hafizabad City',
        qualification: doc.qualification || '',
        address: doc.address || '',
        name: doc.name || '',
      }));
    } catch {
      return INITIAL_DOCTORS;
    }
  },

  saveDoctor(doctor: Doctor, updatedBy = 'Administrator'): void {
    const list = this.getDoctors();
    const index = list.findIndex(d => d.id === doctor.id);
    const prev = index >= 0 ? list[index] : null;

    if (index >= 0) {
      list[index] = { ...doctor, lastUpdated: new Date().toISOString().split('T')[0] };
    } else {
      list.push({ ...doctor, lastUpdated: new Date().toISOString().split('T')[0] });
    }
    safeStorage.setItem(KEYS.DOCTORS, JSON.stringify(list));
    this.addAuditLog({
      entityType: 'Doctor',
      entityId: doctor.id,
      entityName: doctor.name,
      action: prev ? 'update' : 'create',
      updatedBy,
      timestamp: new Date().toISOString(),
    });
  },

  deleteDoctor(id: string, updatedBy = 'Administrator'): void {
    const list = this.getDoctors();
    const found = list.find(d => d.id === id);
    if (!found) return;
    const filtered = list.filter(d => d.id !== id);
    safeStorage.setItem(KEYS.DOCTORS, JSON.stringify(filtered));
    this.addAuditLog({
      entityType: 'Doctor',
      entityId: id,
      entityName: found.name,
      action: 'delete',
      updatedBy,
      timestamp: new Date().toISOString(),
    });
  },

  getPharmacies(): Pharmacy[] {
    const data = safeStorage.getItem(KEYS.PHARMACIES);
    if (!data) {
      safeStorage.setItem(KEYS.PHARMACIES, JSON.stringify(INITIAL_PHARMACIES));
      return INITIAL_PHARMACIES;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_PHARMACIES;
    }
  },

  savePharmacy(pharmacy: Pharmacy, updatedBy = 'Administrator'): void {
    const list = this.getPharmacies();
    const index = list.findIndex(p => p.id === pharmacy.id);
    if (index >= 0) {
      list[index] = { ...pharmacy, lastUpdated: new Date().toISOString().split('T')[0] };
    } else {
      list.push({ ...pharmacy, lastUpdated: new Date().toISOString().split('T')[0] });
    }
    safeStorage.setItem(KEYS.PHARMACIES, JSON.stringify(list));
    this.addAuditLog({
      entityType: 'Pharmacy',
      entityId: pharmacy.id,
      entityName: pharmacy.name,
      action: index >= 0 ? 'update' : 'create',
      updatedBy,
      timestamp: new Date().toISOString(),
    });
  },

  deletePharmacy(id: string, updatedBy = 'Administrator'): void {
    const list = this.getPharmacies();
    const found = list.find(p => p.id === id);
    if (!found) return;
    const filtered = list.filter(p => p.id !== id);
    safeStorage.setItem(KEYS.PHARMACIES, JSON.stringify(filtered));
    this.addAuditLog({
      entityType: 'Pharmacy',
      entityId: id,
      entityName: found.name,
      action: 'delete',
      updatedBy,
      timestamp: new Date().toISOString(),
    });
  },

  getLaboratories(): Laboratory[] {
    const data = safeStorage.getItem(KEYS.LABS);
    if (!data) {
      safeStorage.setItem(KEYS.LABS, JSON.stringify(INITIAL_LABS));
      return INITIAL_LABS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_LABS;
    }
  },

  saveLaboratory(lab: Laboratory, updatedBy = 'Administrator'): void {
    const list = this.getLaboratories();
    const index = list.findIndex(l => l.id === lab.id);
    if (index >= 0) {
      list[index] = { ...lab, lastUpdated: new Date().toISOString().split('T')[0] };
    } else {
      list.push({ ...lab, lastUpdated: new Date().toISOString().split('T')[0] });
    }
    safeStorage.setItem(KEYS.LABS, JSON.stringify(list));
    this.addAuditLog({
      entityType: 'Laboratory',
      entityId: lab.id,
      entityName: lab.name,
      action: index >= 0 ? 'update' : 'create',
      updatedBy,
      timestamp: new Date().toISOString(),
    });
  },

  deleteLaboratory(id: string, updatedBy = 'Administrator'): void {
    const list = this.getLaboratories();
    const found = list.find(l => l.id === id);
    if (!found) return;
    const filtered = list.filter(l => l.id !== id);
    safeStorage.setItem(KEYS.LABS, JSON.stringify(filtered));
    this.addAuditLog({
      entityType: 'Laboratory',
      entityId: id,
      entityName: found.name,
      action: 'delete',
      updatedBy,
      timestamp: new Date().toISOString(),
    });
  },

  getBloodBanks(): BloodBank[] {
    const data = safeStorage.getItem(KEYS.BLOOD_BANKS);
    if (!data) {
      safeStorage.setItem(KEYS.BLOOD_BANKS, JSON.stringify(INITIAL_BLOOD_BANKS));
      return INITIAL_BLOOD_BANKS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_BLOOD_BANKS;
    }
  },

  saveBloodBank(bank: BloodBank, updatedBy = 'Administrator'): void {
    const list = this.getBloodBanks();
    const index = list.findIndex(b => b.id === bank.id);
    if (index >= 0) {
      list[index] = { ...bank, lastUpdated: new Date().toLocaleString() };
    } else {
      list.push({ ...bank, lastUpdated: new Date().toLocaleString() });
    }
    safeStorage.setItem(KEYS.BLOOD_BANKS, JSON.stringify(list));
    this.addAuditLog({
      entityType: 'BloodBank',
      entityId: bank.id,
      entityName: bank.facilityName,
      action: index >= 0 ? 'update' : 'create',
      updatedBy,
      timestamp: new Date().toISOString(),
    });
  },

  updateBloodGroupStatus(
    bankId: string,
    group: BloodGroup,
    status: BloodAvailabilityStatus,
    updatedByRole: string
  ): void {
    const list = this.getBloodBanks();
    const bank = list.find(b => b.id === bankId);
    if (!bank) return;

    const timestamp = new Date().toISOString().split('T')[0] + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    bank.inventory[group] = {
      status,
      lastUpdated: timestamp,
      updatedBy: updatedByRole,
    };
    bank.lastUpdated = timestamp;
    safeStorage.setItem(KEYS.BLOOD_BANKS, JSON.stringify(list));

    this.addAuditLog({
      entityType: 'BloodAvailability',
      entityId: bankId,
      entityName: `${bank.facilityName} (${group})`,
      action: 'blood_update',
      updatedBy: updatedByRole,
      timestamp: new Date().toISOString(),
      newData: `Set ${group} to ${status}`,
    });
  },

  // Facility Claims
  getClaims(): FacilityClaim[] {
    const data = safeStorage.getItem(KEYS.CLAIMS);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  submitClaim(claim: Omit<FacilityClaim, 'id' | 'status' | 'submittedAt'>): FacilityClaim {
    const list = this.getClaims();
    const newClaim: FacilityClaim = {
      ...claim,
      id: 'claim-' + Date.now(),
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };
    list.unshift(newClaim);
    safeStorage.setItem(KEYS.CLAIMS, JSON.stringify(list));
    return newClaim;
  },

  updateClaimStatus(id: string, status: 'approved' | 'rejected', adminNotes?: string, reviewedBy = 'Admin'): void {
    const list = this.getClaims();
    const claim = list.find(c => c.id === id);
    if (!claim) return;
    claim.status = status;
    claim.reviewedAt = new Date().toISOString();
    claim.reviewedBy = reviewedBy;
    if (adminNotes) claim.adminNotes = adminNotes;
    safeStorage.setItem(KEYS.CLAIMS, JSON.stringify(list));

    this.addAuditLog({
      entityType: 'FacilityClaim',
      entityId: id,
      entityName: claim.facilityName,
      action: status === 'approved' ? 'claim_approved' : 'update',
      updatedBy: reviewedBy,
      timestamp: new Date().toISOString(),
      newData: `Claim status changed to ${status}`,
    });
  },

  // User Reports for incorrect information
  getReports(): FacilityReport[] {
    const data = safeStorage.getItem(KEYS.REPORTS);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  submitReport(report: Omit<FacilityReport, 'id' | 'status' | 'submittedAt'>): FacilityReport {
    const list = this.getReports();
    const newReport: FacilityReport = {
      ...report,
      id: 'rep-' + Date.now(),
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };
    list.unshift(newReport);
    safeStorage.setItem(KEYS.REPORTS, JSON.stringify(list));
    return newReport;
  },

  updateReportStatus(id: string, status: 'resolved' | 'dismissed', adminNotes?: string): void {
    const list = this.getReports();
    const report = list.find(r => r.id === id);
    if (!report) return;
    report.status = status;
    report.resolvedAt = new Date().toISOString();
    if (adminNotes) report.adminNotes = adminNotes;
    safeStorage.setItem(KEYS.REPORTS, JSON.stringify(list));

    this.addAuditLog({
      entityType: 'FacilityReport',
      entityId: id,
      entityName: report.facilityName,
      action: 'report_resolved',
      updatedBy: 'Admin',
      timestamp: new Date().toISOString(),
      newData: `Report marked ${status}`,
    });
  },

  // User Reviews with moderation
  getReviews(facilityId?: string): UserReview[] {
    const data = safeStorage.getItem(KEYS.REVIEWS);
    let list: UserReview[] = [];
    if (!data) {
      list = INITIAL_REVIEWS;
      safeStorage.setItem(KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
    } else {
      try {
        list = JSON.parse(data);
      } catch {
        list = INITIAL_REVIEWS;
      }
    }
    if (facilityId) {
      return list.filter(r => r.facilityId === facilityId);
    }
    return list;
  },

  submitReview(review: Omit<UserReview, 'id' | 'status' | 'submittedAt' | 'reported'>): UserReview {
    const list = this.getReviews();
    const newReview: UserReview = {
      ...review,
      id: 'rev-' + Date.now(),
      status: 'pending', // Requires admin review
      submittedAt: new Date().toISOString().split('T')[0],
      reported: false,
    };
    list.unshift(newReview);
    safeStorage.setItem(KEYS.REVIEWS, JSON.stringify(list));
    return newReview;
  },

  updateReviewStatus(id: string, status: 'approved' | 'rejected'): void {
    const list = this.getReviews();
    const review = list.find(r => r.id === id);
    if (!review) return;
    review.status = status;
    safeStorage.setItem(KEYS.REVIEWS, JSON.stringify(list));
  },

  flagReview(id: string): void {
    const list = this.getReviews();
    const review = list.find(r => r.id === id);
    if (!review) return;
    review.reported = true;
    safeStorage.setItem(KEYS.REVIEWS, JSON.stringify(list));
  },

  // Audit Logs
  getAuditLogs(): AuditLog[] {
    const data = safeStorage.getItem(KEYS.AUDIT);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  addAuditLog(log: Omit<AuditLog, 'id'>): void {
    const list = this.getAuditLogs();
    const newLog: AuditLog = {
      ...log,
      id: 'audit-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    };
    list.unshift(newLog);
    // Keep max 200 logs
    if (list.length > 200) list.pop();
    safeStorage.setItem(KEYS.AUDIT, JSON.stringify(list));
  },

  // Emergency Helplines
  getEmergencyHelplines(): EmergencyHelpline[] {
    const data = safeStorage.getItem(KEYS.HELPLINES);
    if (!data) {
      safeStorage.setItem(KEYS.HELPLINES, JSON.stringify(INITIAL_EMERGENCY_HELPLINES));
      return INITIAL_EMERGENCY_HELPLINES;
    }
    try {
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) return INITIAL_EMERGENCY_HELPLINES;
      return parsed.map((h: any) => ({
        ...h,
        purpose: Array.isArray(h.purpose) ? h.purpose : [],
      }));
    } catch {
      return INITIAL_EMERGENCY_HELPLINES;
    }
  },

  saveEmergencyHelpline(helpline: EmergencyHelpline, updatedBy = 'Administrator'): void {
    const list = this.getEmergencyHelplines();
    const index = list.findIndex(h => h.id === helpline.id);
    const today = new Date().toISOString().split('T')[0];
    const prev = index >= 0 ? list[index] : null;

    if (index >= 0) {
      list[index] = { ...helpline, lastVerifiedDate: today };
    } else {
      list.push({ ...helpline, lastVerifiedDate: today });
    }
    safeStorage.setItem(KEYS.HELPLINES, JSON.stringify(list));
    this.addAuditLog({
      entityType: 'EmergencyHelpline',
      entityId: helpline.id,
      entityName: `${helpline.name} (${helpline.number})`,
      action: prev ? 'update' : 'create',
      updatedBy,
      timestamp: new Date().toISOString(),
      newData: JSON.stringify(helpline),
      previousData: prev ? JSON.stringify(prev) : undefined,
    });
  },

  toggleHelplineActive(id: string, updatedBy = 'Administrator'): void {
    const list = this.getEmergencyHelplines();
    const helpline = list.find(h => h.id === id);
    if (!helpline) return;
    const oldStatus = helpline.isActive;
    helpline.isActive = !helpline.isActive;
    helpline.lastVerifiedDate = new Date().toISOString().split('T')[0];
    safeStorage.setItem(KEYS.HELPLINES, JSON.stringify(list));

    this.addAuditLog({
      entityType: 'EmergencyHelpline',
      entityId: id,
      entityName: `${helpline.name} (${helpline.number})`,
      action: 'update',
      updatedBy,
      timestamp: new Date().toISOString(),
      newData: `Status set to ${helpline.isActive ? 'Active' : 'Inactive'}`,
      previousData: `Previous status: ${oldStatus ? 'Active' : 'Inactive'}`,
    });
  },

  // Reset to verified initial seeds
  resetToSeeds(): void {
    safeStorage.setItem(KEYS.HOSPITALS, JSON.stringify(INITIAL_HOSPITALS));
    safeStorage.setItem(KEYS.DOCTORS, JSON.stringify(INITIAL_DOCTORS));
    safeStorage.setItem(KEYS.PHARMACIES, JSON.stringify(INITIAL_PHARMACIES));
    safeStorage.setItem(KEYS.LABS, JSON.stringify(INITIAL_LABS));
    safeStorage.setItem(KEYS.BLOOD_BANKS, JSON.stringify(INITIAL_BLOOD_BANKS));
    safeStorage.setItem(KEYS.HELPLINES, JSON.stringify(INITIAL_EMERGENCY_HELPLINES));
    safeStorage.setItem(KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
  }
};
