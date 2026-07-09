export const appConfig = {
  name: 'Analytika Women',
  tagline: 'Plataforma Inteligente de Gestión, Formación, Consultoría y Responsabilidad Social',
  description: 'Plataforma inteligente para la gestión institucional, proyectos, formación y responsabilidad social.',
  url: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api',
  version: '1.0.0',
} as const;

export const analytics = {
  enabled: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true',
  measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
} as const;

export const contact = {
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'contacto@analytikawomen.com',
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? '+51 999 999 999',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '+51999999999',
  address: process.env.NEXT_PUBLIC_ADDRESS ?? 'Quito, Ecuador',
} as const;

export const socialMedia = {
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? '#',
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? '#',
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL ?? '#',
  twitter: process.env.NEXT_PUBLIC_TWITTER_URL ?? '#',
} as const;

export const theme = {
  colors: {
    primary: '#7C3AED',
    primaryDark: '#6D28D9',
    primaryLight: '#A78BFA',
    secondary: '#1E1B4B',
    accent: '#F59E0B',
    background: '#FFFFFF',
    surface: '#F8FAFC',
    text: '#0F172A',
    textSecondary: '#64748B',
    border: '#E2E8F0',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
  },
  fonts: {
    sans: '"Inter", system-ui, -apple-system, sans-serif',
    mono: '"JetBrains Mono", monospace',
  },
} as const;

export const pagination = {
  defaultPage: 1,
  defaultLimit: 10,
  maxLimit: 100,
} as const;

export const fileUpload = {
  maxFileSize: 10 * 1024 * 1024,
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
  allowedDocumentTypes: ['application/pdf'],
} as const;
