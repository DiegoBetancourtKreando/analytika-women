import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ShieldOff, User, Phone, Mail, Clock, ChevronRight, FileText } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button } from '@analytika/ui';
import { DynamicForm } from '../components/dynamic-form';
import { apiGet } from '../services/api';

interface DynamicFormSummary {
  id: string;
  code: string;
  name: string;
  description?: string;
  _count?: { fields: number };
}

export function ViolenceReportPage() {
  const [step, setStep] = useState<'anonymous' | 'category' | 'form'>('anonymous');
  const [isAnonymous, setIsAnonymous] = useState<boolean | null>(null);
  const [categories, setCategories] = useState<DynamicFormSummary[]>([]);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (step === 'category') {
      setLoading(true);
      apiGet<any[]>('/forms')
        .then((data) => setCategories(Array.isArray(data) ? data : []))
        .catch(() => setCategories([]))
        .finally(() => setLoading(false));
    }
  }, [step]);

  function handleAnonymous(value: boolean) {
    setIsAnonymous(value);
    setStep('category');
  }

  function handleSelectCategory(code: string) {
    setSelectedCode(code);
    setStep('form');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-900 via-violet-800 to-indigo-900 px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="mt-6 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">Denuncia por Violencia de Género</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-violet-200">Este formulario es confidencial y seguro.</p>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100"><Clock className="h-5 w-5 text-red-600" /></div>
            <div>
              <p className="font-semibold text-red-900">¿Estás en peligro ahora mismo?</p>
              <p className="mt-1 text-sm text-red-700">
                Si necesitas ayuda inmediata, llama al <strong>100</strong> (Línea de Emergencia para Mujeres) o escribe al <strong>WhatsApp 955 410 010</strong>.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {step === 'anonymous' && '¿Cómo deseas proceder?'}
                  {step === 'category' && 'Selecciona el tipo de denuncia'}
                  {step === 'form' && 'Formulario de Denuncia'}
                </CardTitle>
                <CardDescription>
                  {step === 'anonymous' && 'Puedes permanecer en el anonimato si lo prefieres.'}
                  {step === 'category' && 'Elige la categoría que corresponda a tu situación.'}
                  {step === 'form' && 'Responde todas las preguntas.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  {step === 'anonymous' && (
                    <motion.div key="anon" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
                      <button onClick={() => handleAnonymous(true)} className="w-full rounded-xl border-2 border-violet-200 bg-white p-6 text-left transition-all hover:border-violet-500 hover:bg-violet-50">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-100 text-violet-600"><ShieldOff className="h-6 w-6" /></div>
                          <div>
                            <p className="font-semibold text-gray-900">Anónima</p>
                            <p className="text-sm text-gray-500">No registramos tus datos personales</p>
                          </div>
                        </div>
                      </button>
                      <button onClick={() => handleAnonymous(false)} className="w-full rounded-xl border-2 border-violet-200 bg-white p-6 text-left transition-all hover:border-violet-500 hover:bg-violet-50">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-100 text-violet-600"><User className="h-6 w-6" /></div>
                          <div>
                            <p className="font-semibold text-gray-900">Identificada</p>
                            <p className="text-sm text-gray-500">Proporciono mis datos para recibir seguimiento</p>
                          </div>
                        </div>
                      </button>
                    </motion.div>
                  )}

                  {step === 'category' && (
                    <motion.div key="cat" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-3">
                      {loading ? (
                        <div className="flex justify-center py-8"><div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-600 border-t-transparent" /></div>
                      ) : categories.length === 0 ? (
                        <div className="py-8 text-center text-gray-400">No hay categorías disponibles</div>
                      ) : (
                        categories.map((cat) => (
                          <button key={cat.id} onClick={() => handleSelectCategory(cat.code)} className="w-full rounded-xl border-2 border-gray-200 bg-white p-4 text-left transition-all hover:border-violet-500 hover:bg-violet-50">
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 shrink-0 text-violet-600" />
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{cat.name}</p>
                                {cat.description && <p className="text-sm text-gray-500">{cat.description}</p>}
                              </div>
                              <ChevronRight className="h-5 w-5 text-gray-400" />
                            </div>
                          </button>
                        ))
                      )}
                      <Button variant="ghost" onClick={() => { setStep('anonymous'); setIsAnonymous(null); }} className="mt-2">Volver</Button>
                    </motion.div>
                  )}

                  {step === 'form' && selectedCode && (
                    <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                      <DynamicForm formCode={selectedCode} onSuccess={() => setStep('anonymous')} />
                      <Button variant="ghost" onClick={() => { setStep('category'); setSelectedCode(null); }} className="mt-4">Volver a categorías</Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="text-base">Líneas de Ayuda</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 rounded-lg bg-violet-50 p-3">
                  <Phone className="mt-0.5 h-5 w-5 text-violet-600" />
                  <div><p className="font-medium text-violet-900">Línea 100</p><p className="text-sm text-violet-700">Atención 24/7 gratuita</p></div>
                </div>
                <div className="flex items-start gap-3 rounded-lg bg-violet-50 p-3">
                  <Phone className="mt-0.5 h-5 w-5 text-violet-600" />
                  <div><p className="font-medium text-violet-900">WhatsApp</p><p className="text-sm text-violet-700">955 410 010</p></div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Tus Derechos</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  {['Derecho a una vida libre de violencia', 'Derecho a ser protegida y asistida', 'Derecho a la confidencialidad', 'Derecho a atención especializada'].map((d) => (
                    <li key={d} className="flex items-start gap-2"><ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />{d}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
