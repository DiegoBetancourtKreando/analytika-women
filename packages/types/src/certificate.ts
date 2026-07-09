export type Certificate = {
  id: string;
  code: string;
  title: string;
  recipientName: string;
  recipientEmail: string;
  courseId?: string;
  eventId?: string;
  issueDate: string;
  expiryDate?: string;
  qrCode: string;
  isValid: boolean;
  metadata: Record<string, string>;
  createdAt: string;
  updatedAt: string;
};

export type CreateCertificateInput = {
  title: string;
  recipientName: string;
  recipientEmail: string;
  courseId?: string;
  eventId?: string;
  issueDate: string;
  expiryDate?: string;
  metadata?: Record<string, string>;
};

export type VerifyCertificateInput = {
  code: string;
};
