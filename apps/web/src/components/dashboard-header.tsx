import { Bell, Moon, Sun, Search } from 'lucide-react';
import { useTheme } from '../app/providers/theme-provider';
import { useAuthStore } from '../stores/auth-store';

export function DashboardHeader() {
  const { theme, setTheme } = useTheme();
  const user = useAuthStore((s) => s.user);

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar..."
          className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm placeholder:text-gray-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <button
          type="button"
          className="relative rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="flex items-center gap-3 border-l border-gray-200 pl-3 ml-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-sm font-medium text-violet-700">
            {user?.firstName?.charAt(0) ?? 'U'}
            {user?.lastName?.charAt(0) ?? ''}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-900">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
