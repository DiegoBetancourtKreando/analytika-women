export type OrganizationType = 'ALLY' | 'CLIENT' | 'GOVERNMENT' | 'NGO' | 'ACADEMIC' | 'OTHER';

export type Organization = {
  id: string;
  name: string;
  description?: string;
  type: OrganizationType;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  logo?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateOrganizationInput = {
  name: string;
  description?: string;
  type: OrganizationType;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  logo?: string;
};

export type UpdateOrganizationInput = Partial<CreateOrganizationInput>;
