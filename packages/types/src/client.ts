export type ClientType = 'INDIVIDUAL' | 'COMPANY' | 'INSTITUTION' | 'GOVERNMENT' | 'NGO';

export type Client = {
  id: string;
  type: ClientType;
  name: string;
  email: string;
  phone?: string;
  organizationName?: string;
  ruc?: string;
  address?: string;
  contactPerson?: string;
  isActive: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateClientInput = {
  type: ClientType;
  name: string;
  email: string;
  phone?: string;
  organizationName?: string;
  ruc?: string;
  address?: string;
  contactPerson?: string;
  notes?: string;
};

export type UpdateClientInput = Partial<CreateClientInput>;
