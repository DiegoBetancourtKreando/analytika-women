import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  GraduationCap,
  Briefcase,
  Building2,
  Shield,
  Sparkles,
  Calendar,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  FileText,
} from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../stores/auth-store';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: FolderKanban, label: 'Proyectos', path: '/proyectos' },
  { icon: Shield, label: 'Denuncias', path: '/denuncia' },
  { icon: Briefcase, label: 'Consultores', path: '/consultores' },
  { icon: Building2, label: 'Organizaciones', path: '/organizaciones' },
  { icon: GraduationCap, label: 'Formación', path: '/formacion' },
  { icon: Sparkles, label: 'Oportunidades', path: '/oportunidades' },
  { icon: Calendar, label: 'Eventos', path: '/eventos' },
];

const adminMenuItems = [
  { icon: FileText, label: 'Formularios', path: '/admin/formularios' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const logout = useAuthStore((s) => s.logout);

  return (
    <aside
      className={`flex flex-col border-r border-gray-200 bg-white transition-all duration-200 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-violet-600">
              <span className="text-xs font-bold text-white">AW</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">Analytika</span>
          </Link>
        )}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-violet-50 text-violet-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-200 p-3 space-y-1">
        <p className={`px-3 text-xs font-medium text-gray-400 uppercase tracking-wider ${collapsed ? 'hidden' : ''}`}>
          Admin
        </p>
        {adminMenuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-violet-50 text-violet-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && item.label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-red-600 transition-colors"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && 'Cerrar Sesión'}
        </button>
      </div>
    </aside>
  );
}
