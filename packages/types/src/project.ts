export type ProjectArea = 'SOCIAL' | 'TECHNOLOGY' | 'ENVIRONMENTAL' | 'ECONOMIC' | 'POLITICAL';

export type ProjectStatus = 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED';

export type Project = {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  area: ProjectArea;
  status: ProjectStatus;
  startDate: string;
  endDate?: string;
  clientName?: string;
  organizationId?: string;
  evidence: ProjectEvidence[];
  indicators: ProjectIndicator[];
  createdAt: string;
  updatedAt: string;
};

export type ProjectEvidence = {
  id: string;
  title: string;
  fileUrl: string;
  type: string;
  uploadedAt: string;
};

export type ProjectIndicator = {
  id: string;
  name: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
};

export type CreateProjectInput = {
  title: string;
  description: string;
  objectives: string[];
  area: ProjectArea;
  startDate: string;
  endDate?: string;
  clientName?: string;
  organizationId?: string;
};

export type UpdateProjectInput = Partial<CreateProjectInput> & {
  status?: ProjectStatus;
};
