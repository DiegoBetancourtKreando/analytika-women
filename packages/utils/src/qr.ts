export function generateQRData(code: string, baseUrl: string): string {
  return `${baseUrl}/verify/${code}`;
}

export function generateCertificateCode(
  recipientName: string,
  courseName: string,
  date: Date,
): string {
  const namePart = recipientName.slice(0, 3).toUpperCase();
  const coursePart = courseName.slice(0, 3).toUpperCase();
  const datePart = date.getTime().toString(36).toUpperCase().slice(-4);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CERT-${namePart}-${coursePart}-${datePart}-${random}`;
}
