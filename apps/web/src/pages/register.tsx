import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Input, Separator, useToast } from '@analytika/ui';
import { UserPlus, Eye, EyeOff, Shield } from 'lucide-react';
import { useAuthStore } from '../stores/auth-store';
import { ROUTES } from '../constants';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phone?: string;
  general?: string;
}

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();
  const { addToast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  function validate(): boolean {
    const errors: FormErrors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'El nombre es requerido';
    }
    if (!formData.lastName.trim()) {
      errors.lastName = 'Los apellidos son requeridos';
    }
    if (!formData.email.trim()) {
      errors.email = 'El correo electrónico es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Ingresa un correo válido';
    }
    if (!formData.password) {
      errors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    clearError();

    if (!validate()) return;

    try {
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || undefined,
      });
      addToast({ type: 'success', title: 'Registro exitoso', description: 'Bienvenida a Analytika Women' });
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch {
      // Error handled by store
    }
  }

  function updateField(field: keyof FormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
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
            <CardTitle className="text-2xl">Crear Cuenta</CardTitle>
            <CardDescription>
              Regístrate para acceder a todas las funcionalidades
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {formErrors.general && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  {formErrors.general}
                </div>
              )}
              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Nombres"
                  value={formData.firstName}
                  onChange={(e) => updateField('firstName', e.target.value)}
                  placeholder="María"
                  error={formErrors.firstName}
                />
                <Input
                  label="Apellidos"
                  value={formData.lastName}
                  onChange={(e) => updateField('lastName', e.target.value)}
                  placeholder="García"
                  error={formErrors.lastName}
                />
              </div>

              <Input
                label="Correo electrónico"
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="tu@correo.com"
                autoComplete="email"
                error={formErrors.email}
              />

              <div className="relative">
                <Input
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  autoComplete="new-password"
                  error={formErrors.password}
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

              <Input
                label="Teléfono (opcional)"
                type="tel"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="+51 999 999 999"
                error={formErrors.phone}
              />

              <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                <UserPlus className="mr-2 h-5 w-5" />
                Crear Cuenta
              </Button>
            </form>
          </CardContent>

          <Separator />

          <CardFooter className="justify-center p-6">
            <p className="text-sm text-gray-500">
              ¿Ya tienes cuenta?{' '}
              <Link to={ROUTES.LOGIN} className="font-medium text-violet-600 hover:text-violet-700 hover:underline">
                Inicia sesión
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
