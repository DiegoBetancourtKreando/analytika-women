import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from '../components/sidebar';
import { DashboardHeader } from '../components/dashboard-header';
import { useAuthStore } from '../stores/auth-store';

export function DashboardLayout() {
  const isInitializing = useAuthStore((s) => s.isInitializing);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (isInitializing) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-600 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
