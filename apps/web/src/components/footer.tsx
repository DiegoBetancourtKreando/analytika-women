import { Link } from 'react-router-dom';
import { Heart, Github, Twitter, Linkedin, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
                <span className="text-sm font-bold text-white">AW</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">Analytika Women</span>
            </div>
            <p className="mt-3 text-sm text-gray-500">
              Plataforma inteligente de gestión, formación, consultoría y responsabilidad social.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Enlaces</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/about" className="text-sm text-gray-500 hover:text-violet-600">Sobre Nosotras</Link></li>
              <li><Link to="/equipo" className="text-sm text-gray-500 hover:text-violet-600">Equipo</Link></li>
              <li><Link to="/proyectos" className="text-sm text-gray-500 hover:text-violet-600">Proyectos</Link></li>
              <li><Link to="/oportunidades" className="text-sm text-gray-500 hover:text-violet-600">Oportunidades</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Servicios</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/formacion" className="text-sm text-gray-500 hover:text-violet-600">Formación</Link></li>
              <li><Link to="/consultores" className="text-sm text-gray-500 hover:text-violet-600">Consultoría</Link></li>
              <li><Link to="/denuncia" className="text-sm text-gray-500 hover:text-violet-600">Denuncia</Link></li>
              <li><Link to="/eventos" className="text-sm text-gray-500 hover:text-violet-600">Eventos</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Contacto</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-500">
              <li>contacto@analytikawomen.com</li>
              <li>+51 999 999 999</li>
              <li>Quito, Ecuador</li>
            </ul>
            <div className="mt-4 flex gap-3">
              <a href="#" className="text-gray-400 hover:text-violet-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-violet-600 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-violet-600 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-200 pt-6">
          <p className="text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Analytika Women. Todos los derechos reservados.
            Hecho con <Heart className="inline h-4 w-4 text-red-500" /> para las mujeres en STEM.
          </p>
        </div>
      </div>
    </footer>
  );
}
