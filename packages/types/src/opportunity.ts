export type OpportunityType = 'SCHOLARSHIP' | 'JOB' | 'VOLUNTEER' | 'INTERNSHIP' | 'CALL' | 'TRAINING';

export type OpportunityModality = 'VIRTUAL' | 'IN_PERSON' | 'HYBRID';

export type OpportunityStatus = 'OPEN' | 'CLOSED' | 'IN_PROGRESS';

export type Opportunity = {
  id: string;
  title: string;
  description: string;
  type: OpportunityType;
  modality?: OpportunityModality;
  status: OpportunityStatus;
  applicationDeadline?: string;
  requirements: string[];
  benefits?: string[];
  contactEmail: string;
  organizationId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateOpportunityInput = {
  title: string;
  description: string;
  type: OpportunityType;
  modality?: OpportunityModality;
  applicationDeadline?: string;
  requirements: string[];
  benefits?: string[];
  contactEmail: string;
  organizationId?: string;
};

export type UpdateOpportunityInput = Partial<CreateOpportunityInput> & {
  status?: OpportunityStatus;
};
