export type CourseModality = 'VIRTUAL' | 'IN_PERSON' | 'HYBRID';

export type CourseStatus = 'DRAFT' | 'PUBLISHED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type Course = {
  id: string;
  title: string;
  description: string;
  modality: CourseModality;
  status: CourseStatus;
  duration: number;
  durationUnit: 'HOURS' | 'DAYS' | 'WEEKS';
  price?: number;
  capacity: number;
  enrolledCount: number;
  startDate: string;
  endDate?: string;
  syllabus: string[];
  instructorId?: string;
  hasCertification: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateCourseInput = {
  title: string;
  description: string;
  modality: CourseModality;
  duration: number;
  durationUnit: 'HOURS' | 'DAYS' | 'WEEKS';
  price?: number;
  capacity: number;
  startDate: string;
  endDate?: string;
  syllabus: string[];
  instructorId?: string;
  hasCertification: boolean;
};

export type UpdateCourseInput = Partial<CreateCourseInput> & {
  status?: CourseStatus;
};
