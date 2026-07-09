export const API_BASE_URL = (typeof import.meta !== 'undefined' ? import.meta.env.VITE_API_URL : undefined) ?? '/api';

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  TEAM: '/equipo',
  PROJECTS: '/proyectos',
  COURSES: '/formacion',
  CONSULTANTS: '/consultores',
  ORGANIZATIONS: '/organizaciones',
  CLIENTS: '/clientes',
  VIOLENCE_REPORT: '/denuncia',
  OPPORTUNITIES: '/oportunidades',
  EVENTS: '/eventos',
  CERTIFICATES: '/certificados',
  DASHBOARD: '/dashboard',
  LOGIN: '/login',
  REGISTER: '/registro',
  FORGOT_PASSWORD: '/recuperar-contrasena',
  ADMIN: '/admin',
  SETTINGS: '/configuracion',
} as const;

export const MODULES = [
  { id: 'inicio', label: 'Inicio', path: ROUTES.HOME, icon: 'Home', isPublic: true },
  { id: 'equipo', label: 'Equipo', path: ROUTES.TEAM, icon: 'Users', isPublic: true },
  { id: 'proyectos', label: 'Proyectos', path: ROUTES.PROJECTS, icon: 'FolderKanban', isPublic: true },
  { id: 'formacion', label: 'Formación', path: ROUTES.COURSES, icon: 'GraduationCap', isPublic: false, featureFlag: 'courses_module' },
  { id: 'consultores', label: 'Consultores', path: ROUTES.CONSULTANTS, icon: 'Briefcase', isPublic: true },
  { id: 'organizaciones', label: 'Organizaciones', path: ROUTES.ORGANIZATIONS, icon: 'Building2', isPublic: true },
  { id: 'denuncia', label: 'Denuncia', path: ROUTES.VIOLENCE_REPORT, icon: 'Shield', isPublic: true },
  { id: 'oportunidades', label: 'Oportunidades', path: ROUTES.OPPORTUNITIES, icon: 'Sparkles', isPublic: true },
  { id: 'eventos', label: 'Eventos', path: ROUTES.EVENTS, icon: 'Calendar', isPublic: true },
  { id: 'dashboard', label: 'Dashboard', path: ROUTES.DASHBOARD, icon: 'LayoutDashboard', isPublic: false },
] as const;

export const VIOLENCE_LEVELS = [
  { value: 'LOW', label: 'Bajo', color: 'bg-green-100 text-green-800', severity: 1 },
  { value: 'MODERATE', label: 'Moderado', color: 'bg-yellow-100 text-yellow-800', severity: 2 },
  { value: 'HIGH', label: 'Alto', color: 'bg-orange-100 text-orange-800', severity: 3 },
  { value: 'CRITICAL', label: 'Crítico', color: 'bg-red-100 text-red-800', severity: 4 },
] as const;

export const PROJECT_AREAS = [
  { value: 'SOCIAL', label: 'Social' },
  { value: 'TECHNOLOGY', label: 'Tecnológico' },
  { value: 'ENVIRONMENTAL', label: 'Ambiental' },
  { value: 'ECONOMIC', label: 'Económico' },
  { value: 'POLITICAL', label: 'Político' },
] as const;

export const ORGANIZATION_TYPES = [
  { value: 'ALLY', label: 'Aliada' },
  { value: 'CLIENT', label: 'Cliente' },
  { value: 'GOVERNMENT', label: 'Gubernamental' },
  { value: 'NGO', label: 'ONG' },
  { value: 'ACADEMIC', label: 'Académica' },
  { value: 'OTHER', label: 'Otra' },
] as const;
