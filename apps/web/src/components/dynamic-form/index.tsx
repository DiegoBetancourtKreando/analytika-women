import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button, Input, Badge, Progress } from '@analytika/ui';
import { ChevronLeft, ChevronRight, Send, User, ShieldOff } from 'lucide-react';
import { apiGet, apiPost } from '../../services/api';

interface DynamicField {
  id: string;
  label: string;
  type: string;
  options: { value: string; label: string }[] | null;
  isActive: boolean;
}

interface DynamicForm {
  id: string;
  code: string;
  name: string;
  fields: DynamicField[];
}

interface DynamicFormProps {
  formCode: string;
  onSuccess?: () => void;
  className?: string;
}

export function DynamicForm({ formCode, onSuccess, className }: DynamicFormProps) {
  const [formConfig, setFormConfig] = useState<DynamicForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<Record<string, string | string[]>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await apiGet<any>(`/forms/${formCode}`);
        if (!cancelled) setFormConfig(data);
      } catch {
        // Form not found
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [formCode]);

  const visibleFields = (formConfig?.fields ?? []).filter((f) => {
    if (!f.isActive) return false;
    return true;
  });

  const [currentStep, setCurrentStep] = useState(0);
  const steps = splitSteps(visibleFields);

  function handleChange(key: string, value: string | string[]) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  function canGoNext(stepIndex: number): boolean {
    const fields = steps[stepIndex] ?? [];
    return fields.every((f) => {
      const val = formData[f.label];
      if (!val || (Array.isArray(val) && val.length === 0)) return false;
      return true;
    });
  }

  async function handleSubmit() {
    if (!canGoNext(currentStep)) return;
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
      return;
    }
    setSubmitting(true);
    try {
      await apiPost(`/forms/${formCode}/submit`, { data: formData });
      setSubmitted(true);
      onSuccess?.();
    } catch {
      // error
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-600 border-t-transparent" /></div>;
  }

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <Send className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="mt-4 text-xl font-semibold text-green-900">¡Formulario enviado!</h3>
        <p className="mt-2 text-green-700">Gracias por confiar en nosotras. Pronto recibirás una respuesta.</p>
      </motion.div>
    );
  }

  if (!formConfig || visibleFields.length === 0) {
    return (
      <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-6 text-center">
        <p className="text-yellow-700">No hay preguntas configuradas para este formulario.</p>
      </div>
    );
  }

  const currentFields = steps[currentStep] ?? [];
  const totalSteps = steps.length;

  return (
    <div className={className}>
      {totalSteps > 1 && (
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Paso {currentStep + 1} de {totalSteps}</span>
            <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}%</span>
          </div>
          <Progress value={((currentStep + 1) / totalSteps) * 100} className="mt-2" />
        </div>
      )}

      <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
        {currentFields.map((field) => (
          <FormField key={field.id} field={field} value={formData[field.label]} onChange={(val) => handleChange(field.label, val)} />
        ))}
      </motion.div>

      <div className="mt-8 flex items-center justify-between gap-4">
        {currentStep > 0 ? (
          <Button variant="outline" onClick={() => setCurrentStep((s) => s - 1)}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Anterior
          </Button>
        ) : <div />}
        <Button onClick={handleSubmit} isLoading={submitting} disabled={!canGoNext(currentStep)}>
          {currentStep < totalSteps - 1 ? <>Siguiente <ChevronRight className="ml-2 h-4 w-4" /></> : <><Send className="mr-2 h-4 w-4" /> Enviar</>}
        </Button>
      </div>
    </div>
  );
}

function splitSteps(fields: DynamicField[]): DynamicField[][] {
  const steps: DynamicField[][] = [];
  let current: DynamicField[] = [];
  for (const f of fields) {
    if (f.type === 'checkbox' && current.length > 0) {
      steps.push(current);
      current = [];
    }
    current.push(f);
  }
  if (current.length > 0) steps.push(current);
  return steps;
}

function FormField({ field, value, onChange }: { field: DynamicField; value: string | string[] | undefined; onChange: (val: string | string[]) => void }) {
  if (field.type === 'checkbox' && field.options && field.options.length > 0) {
    const selected = Array.isArray(value) ? value : [];
    return (
      <div>
        <label className="mb-3 block text-sm font-medium text-gray-900">{field.label}</label>
        <div className="space-y-3">
          {field.options.map((opt) => {
            const isChecked = selected.includes(opt.value);
            return (
              <label key={opt.value} className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-all ${isChecked ? 'border-violet-500 bg-violet-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                <input type="checkbox" className="mt-0.5 h-5 w-5 rounded border-gray-300 text-violet-600 focus:ring-violet-500" checked={isChecked}
                  onChange={(e) => onChange(e.target.checked ? [...selected, opt.value] : selected.filter((v) => v !== opt.value))} />
                <span className="font-medium text-gray-900">{opt.label}</span>
              </label>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-900">{field.label}</label>
      <Input value={String(value ?? '')} onChange={(e) => onChange(e.target.value)} placeholder={field.label} />
    </div>
  );
}
