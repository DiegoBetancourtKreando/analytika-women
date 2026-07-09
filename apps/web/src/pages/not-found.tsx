import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@analytika/ui';
import { Home, ArrowLeft, Shield } from 'lucide-react';
import { ROUTES } from '../constants';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-50 to-white px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ rotate: -10, scale: 0.8 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-violet-100 mb-8"
        >
          <Shield className="h-12 w-12 text-violet-600" />
        </motion.div>

        <h1 className="text-7xl font-bold text-violet-600">404</h1>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">Página no encontrada</h2>
        <p className="mt-4 text-gray-500 leading-relaxed">
          La página que estás buscando no existe o ha sido movida. 
          Verifica la URL o vuelve al inicio para continuar navegando.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link to={ROUTES.HOME}>
            <Button size="lg">
              <Home className="mr-2 h-5 w-5" />
              Volver al inicio
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Retroceder
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
