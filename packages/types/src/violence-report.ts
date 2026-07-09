export type ViolenceLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type ViolenceType = 'PHYSICAL' | 'PSYCHOLOGICAL' | 'SEXUAL' | 'ECONOMIC' | 'PATRIMONIAL' | 'DIGITAL';

export type ReportStatus = 'RECEIVED' | 'IN_REVIEW' | 'DERIVED' | 'CLOSED';

export type ViolenceReport = {
  id: string;
  reportCode: string;
  reporterName?: string;
  reporterEmail?: string;
  reporterPhone?: string;
  isAnonymous: boolean;
  violenceType: ViolenceType[];
  description: string;
  level: ViolenceLevel;
  status: ReportStatus;
  wantsReferral: boolean;
  referralSpecialty?: string;
  evidence: string[];
  aiClassification?: string;
  aiRiskScore?: number;
  assignedProfessionalId?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateViolenceReportInput = {
  reporterName?: string;
  reporterEmail?: string;
  reporterPhone?: string;
  isAnonymous: boolean;
  violenceType: ViolenceType[];
  description: string;
  wantsReferral: boolean;
  referralSpecialty?: string;
  evidence?: string[];
};

export type UpdateViolenceReportInput = {
  status?: ReportStatus;
  level?: ViolenceLevel;
  assignedProfessionalId?: string;
  notes?: string;
};
