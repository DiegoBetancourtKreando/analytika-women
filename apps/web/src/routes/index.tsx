import { Routes, Route } from 'react-router-dom';
import { PublicLayout } from '../layouts/public-layout';
import { DashboardLayout } from '../layouts/dashboard-layout';
import { HomePage } from '../pages/home';
import { AboutPage } from '../pages/about';
import { TeamPage } from '../pages/team';
import { ProjectsPage } from '../pages/projects';
import { ProjectDetailPage } from '../pages/projects/detail';
import { CoursesPage } from '../pages/courses';
import { ConsultantsPage } from '../pages/consultants';
import { OrganizationsPage } from '../pages/organizations';
import { ViolenceReportPage } from '../pages/violence-report';
import { OpportunitiesPage } from '../pages/opportunities';
import { EventsPage } from '../pages/events';
import { CertificatesPage } from '../pages/certificates';
import { LoginPage } from '../pages/login';
import { RegisterPage } from '../pages/register';
import { DashboardPage } from '../pages/dashboard';
import { AdminFormsPage } from '../pages/admin/forms';
import { NotFoundPage } from '../pages/not-found';

export function AppRouter() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/admin/formularios" element={<AdminFormsPage />} />
        <Route path="/proyectos" element={<ProjectsPage />} />
        <Route path="/proyectos/:id" element={<ProjectDetailPage />} />
        <Route path="/formacion" element={<CoursesPage />} />
        <Route path="/consultores" element={<ConsultantsPage />} />
        <Route path="/organizaciones" element={<OrganizationsPage />} />
        <Route path="/denuncia" element={<ViolenceReportPage />} />
        <Route path="/oportunidades" element={<OpportunitiesPage />} />
        <Route path="/eventos" element={<EventsPage />} />
        <Route path="/certificados" element={<CertificatesPage />} />
        <Route path="/certificados/verify/:code" element={<CertificatesPage />} />
      </Route>

      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/equipo" element={<TeamPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
