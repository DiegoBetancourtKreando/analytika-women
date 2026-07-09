export type ProfessionalSpecialty =
  | 'LAWYER'
  | 'PSYCHOLOGIST'
  | 'SOCIAL_WORKER'
  | 'DATA_SCIENCE'
  | 'TECHNOLOGY'
  | 'RESEARCH'
  | 'CONSULTING'
  | 'EDUCATION'
  | 'OTHER';

export type Professional = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  specialty: ProfessionalSpecialty;
  bio?: string;
  experience: number;
  certifications: Certification[];
  publications: Publication[];
  isActive: boolean;
  isTeamMember: boolean;
  photo?: string;
  userId?: string;
  createdAt: string;
  updatedAt: string;
};

export type Certification = {
  id: string;
  name: string;
  issuer: string;
  year: number;
  expirationYear?: number;
  fileUrl?: string;
};

export type Publication = {
  id: string;
  title: string;
  publisher: string;
  year: number;
  url?: string;
  doi?: string;
};

export type CreateProfessionalInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  specialty: ProfessionalSpecialty;
  bio?: string;
  experience: number;
  isTeamMember: boolean;
  photo?: string;
};

export type UpdateProfessionalInput = Partial<CreateProfessionalInput>;
