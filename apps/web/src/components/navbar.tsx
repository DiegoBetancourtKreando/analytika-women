import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@analytika/ui';
import { MODULES } from '../constants';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const publicModules = MODULES.filter((m) => m.isPublic);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
            <span className="text-sm font-bold text-white">AW</span>
          </div>
          <span className="text-lg font-semibold text-gray-900">Analytika Women</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {publicModules.map((module) => {
            const isActive = location.pathname === module.path;
            return (
              <Link
                key={module.id}
                to={module.path}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-violet-50 text-violet-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {module.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/login">
            <Button variant="ghost" size="sm">Iniciar Sesión</Button>
          </Link>
          <Link to="/registro">
            <Button size="sm">Registrarse</Button>
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <div className="space-y-1 px-4 py-4">
            {publicModules.map((module) => (
              <Link
                key={module.id}
                to={module.path}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                {module.label}
              </Link>
            ))}
            <div className="border-t border-gray-200 pt-4">
              <Link to="/login" className="block w-full mb-2">
                <Button variant="outline" className="w-full">Iniciar Sesión</Button>
              </Link>
              <Link to="/registro" className="block w-full">
                <Button className="w-full">Registrarse</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
