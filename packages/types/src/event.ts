export type EventType = 'COURSE' | 'WORKSHOP' | 'CONFERENCE' | 'SEMINAR' | 'SOCIAL' | 'COMMUNITY' | 'OTHER';

export type EventModality = 'VIRTUAL' | 'IN_PERSON' | 'HYBRID';

export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type Event = {
  id: string;
  title: string;
  description: string;
  type: EventType;
  modality: EventModality;
  status: EventStatus;
  startDate: string;
  endDate: string;
  location?: string;
  virtualLink?: string;
  capacity: number;
  registeredCount: number;
  organizerId?: string;
  organizationId?: string;
  isPublic: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type CreateEventInput = {
  title: string;
  description: string;
  type: EventType;
  modality: EventModality;
  startDate: string;
  endDate: string;
  location?: string;
  virtualLink?: string;
  capacity: number;
  organizerId?: string;
  organizationId?: string;
  isPublic: boolean;
  tags: string[];
};

export type UpdateEventInput = Partial<CreateEventInput> & {
  status?: EventStatus;
};
