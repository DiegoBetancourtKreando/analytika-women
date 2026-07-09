import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Input, Separator } from '@analytika/ui';
import { LogIn, Eye, EyeOff, Shield } from 'lucide-react';
import { useAuthStore } from '../stores/auth-store';
import { ROUTES } from '../constants';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    clearError();

    if (!email.trim()) {
      setFormError('El correo electrónico es requerido.');
      return;
    }
    if (!password) {
      setFormError('La contraseña es requerida.');
      return;
    }

    try {
      await login(email, password);
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch {
      // Error is handled by the store
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-violet-100 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-violet-100 mb-4">
              <Shield className="h-7 w-7 text-violet-600" />
            </div>
            <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
            <CardDescription>
              Accede a tu cuenta de Analytika Women
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {(formError || error) && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  {formError ?? error}
                </div>
              )}

              <Input
                label="Correo electrónico"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                autoComplete="email"
                error={formError && !email.trim() ? 'Requerido' : undefined}
              />

              <div className="relative">
                <Input
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  error={formError && !password ? 'Requerido' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <div className="flex items-center justify-end">
                <Link
                  to={ROUTES.FORGOT_PASSWORD}
                  className="text-sm text-violet-600 hover:text-violet-700 hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                <LogIn className="mr-2 h-5 w-5" />
                Iniciar Sesión
              </Button>
            </form>
          </CardContent>

          <Separator />

          <CardFooter className="justify-center p-6">
            <p className="text-sm text-gray-500">
              ¿No tienes cuenta?{' '}
              <Link to={ROUTES.REGISTER} className="font-medium text-violet-600 hover:text-violet-700 hover:underline">
                Regístrate aquí
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
