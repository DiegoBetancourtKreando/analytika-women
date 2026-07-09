import { motion } from 'framer-motion';
import { Shield, Phone, Mail, Clock, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@analytika/ui';
import { DynamicForm } from '../components/dynamic-form';

export function ViolenceReportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-900 via-violet-800 to-indigo-900 px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE4YzEuNjU3IDAgMy0xLjM0MyAzLTNzLTEuMzQzLTMtMy0zLTMgMS4zNDMtMyAzIDEuMzQzIDMgMyAzem0wIDI0YzEuNjU3IDAgMy0xLjM0MyAzLTNzLTEuMzQzLTMtMy0zLTMgMS4zNDMtMyAzIDEuMzQzIDMgMyAzeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="mt-6 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Denuncia por Violencia de Género
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-violet-200">
              Este formulario es confidencial y seguro. Te acompañamos en este proceso con respeto y empatía.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Emergency Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-xl border border-red-200 bg-red-50 p-4"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
              <Clock className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="font-semibold text-red-900">¿Estás en peligro ahora mismo?</p>
              <p className="mt-1 text-sm text-red-700">
                Si necesitas ayuda inmediata, llama al <strong>100</strong> (Línea de Emergencia para Mujeres) 
                o escribe al <strong>WhatsApp 955 410 010</strong>. Tu seguridad es lo más importante.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Formulario de Denuncia</CardTitle>
                <CardDescription>
                  Todas las preguntas son confidenciales. Puedes denunciar de forma anónima.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DynamicForm formCode="violence_report" />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Líneas de Ayuda</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 rounded-lg bg-violet-50 p-3">
                  <Phone className="mt-0.5 h-5 w-5 text-violet-600" />
                  <div>
                    <p className="font-medium text-violet-900">Línea 100</p>
                    <p className="text-sm text-violet-700">Atención 24/7 gratuita</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg bg-violet-50 p-3">
                  <Phone className="mt-0.5 h-5 w-5 text-violet-600" />
                  <div>
                    <p className="font-medium text-violet-900">WhatsApp</p>
                    <p className="text-sm text-violet-700">955 410 010</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg bg-violet-50 p-3">
                  <Mail className="mt-0.5 h-5 w-5 text-violet-600" />
                  <div>
                    <p className="font-medium text-violet-900">Chat Online</p>
                    <p className="text-sm text-violet-700">Disponible en horario diurno</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tus Derechos</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />
                    Derecho a una vida libre de violencia
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />
                    Derecho a ser protegida y asistida
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />
                    Derecho a la confidencialidad
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />
                    Derecho a atención especializada
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
