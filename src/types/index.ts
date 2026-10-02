export type Language = 'en' | 'ur';

export type DistrictArea = 
  | 'Hafizabad City'
  | 'Pindi Bhattian'
  | 'Jalalpur Bhattian'
  | 'Sukheke Mandi'
  | 'Other Areas';

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type BloodAvailabilityStatus = 'Available' | 'Not Available' | 'Unknown';

export interface BloodStatusInfo {
  status: BloodAvailabilityStatus;
  lastUpdated: string;
  updatedBy: string;
  unitsAvailableNotes?: string;
}

export interface EmergencyHelpline {
  id: string;
  name: string;
  nameUrdu: string;
  number: string;
  telUri: string;
  icon: string;
  purpose: string[];
  purposeUrdu?: string[];
  description: string;
  isVerified: boolean;
  officialSource: string;
  lastVerifiedDate: string;
  isActive: boolean;
  priority: number;
}

export interface Hospital {
  id: string;
  slug: string;
  name: string;
  nameUrdu: string;
  type: 'Government' | 'Private';
  area: DistrictArea;
  address: string;
  addressUrdu: string;
  phone: string;
  emergencyPhone?: string;
  openingHours: string;
  emergency24_7: boolean;
  emergencyAvailability: string;
  isVerified: boolean;
  lastUpdated: string;
  verificationSource: string;
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  services: {
    emergency: boolean;
    laboratory: boolean;
    xRay: boolean;
    ultrasound: boolean;
    ctScan: boolean;
    mri: boolean;
    bloodBank: boolean;
    ambulance: boolean;
    icu: boolean;
    nicu: boolean;
    dialysis: boolean;
    pharmacy: boolean;
    operationTheater: boolean;
  };
  departments: string[];
  doctorIds?: string[];
}

export interface Doctor {
  id: string;
  slug: string;
  name: string;
  nameUrdu: string;
  specialty: string;
  specialtyUrdu: string;
  hospitalOrClinic: string;
  hospitalId?: string; // Links to Hospital entity
  area: DistrictArea;
  address: string;
  addressUrdu?: string;
  qualification: string; // Factual qualifications (e.g. MBBS, FCPS, MCPS, PMDC/PMC Verified)
  availableDays: string;
  timings: string;
  appointmentPhone: string;
  appointmentMethod?: string;
  services: string[]; // Specific verified services (e.g. 'Eye Examination', 'Cataract Phaco', 'Vision Testing')
  areasOfSpecialization: string[];
  isVerified: boolean;
  lastUpdated: string;
  verificationSource: string;
  pmcRegistration?: string;
  notes?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface HealthConcernMapping {
  id: string;
  concernName: string;
  concernUrdu: string;
  keywords: string[];
  specialtyName: string;
  specialtyUrdu: string;
  recommendedType: string;
  explanation: string;
  facilityCategory: 'doctors' | 'hospitals' | 'labs' | 'pharmacies' | 'blood';
  icon: string;
}

export interface Pharmacy {
  id: string;
  name: string;
  nameUrdu: string;
  area: DistrictArea;
  address: string;
  phone: string;
  openingHours: string;
  is24_7: boolean;
  homeDelivery: boolean;
  isVerified: boolean;
  lastUpdated: string;
  verificationSource: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Laboratory {
  id: string;
  name: string;
  nameUrdu: string;
  area: DistrictArea;
  address: string;
  phone: string;
  openingHours: string;
  services: {
    bloodTests: boolean;
    xRay: boolean;
    ultrasound: boolean;
    ctScan: boolean;
    mri: boolean;
    ecg: boolean;
    pathology: boolean;
    covidDengueTests: boolean;
  };
  homeSampling: boolean;
  isVerified: boolean;
  lastUpdated: string;
  verificationSource: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface BloodBank {
  id: string;
  facilityName: string;
  facilityType: 'Government DHQ/THQ' | 'Private Hospital' | 'Transfusion Center / NGO';
  area: DistrictArea;
  phone: string;
  emergencyPhone: string;
  address: string;
  isVerified: boolean;
  lastUpdated: string;
  verificationSource: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  inventory: Record<BloodGroup, BloodStatusInfo>;
  notes?: string;
}

export interface FacilityClaim {
  id: string;
  facilityId: string;
  facilityName: string;
  facilityType: 'hospital' | 'pharmacy' | 'laboratory' | 'blood_bank' | 'doctor';
  claimantName: string;
  claimantRole: string; // e.g. Administrator, Medical Superintendent, Head Pharmacist
  officialPhone: string;
  officialEmail: string;
  verificationProof: string; // Licence/Registration or institutional document reference
  requestedChanges: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  adminNotes?: string;
}

export interface FacilityReport {
  id: string;
  facilityId: string;
  facilityName: string;
  facilityType: 'hospital' | 'pharmacy' | 'laboratory' | 'doctor' | 'blood_bank';
  reportType: 'wrong_phone' | 'wrong_address' | 'closed_facility' | 'wrong_services' | 'incorrect_timings' | 'other';
  details: string;
  reportedBy?: string;
  contactPhone?: string;
  status: 'pending' | 'resolved' | 'dismissed';
  submittedAt: string;
  resolvedAt?: string;
  adminNotes?: string;
}

export interface UserReview {
  id: string;
  facilityId: string;
  facilityName: string;
  reviewerName: string;
  rating: number; // 1-5
  reviewText: string;
  visitDate: string;
  status: 'pending' | 'approved' | 'rejected'; // Admin moderated
  submittedAt: string;
  reported: boolean;
}

export interface AuditLog {
  id: string;
  entityType: string;
  entityId: string;
  entityName: string;
  action: 'create' | 'update' | 'delete' | 'verify' | 'blood_update' | 'claim_approved' | 'report_resolved';
  updatedBy: string;
  timestamp: string;
  previousData?: string;
  newData?: string;
}
