import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Input, Textarea, Select, Checkbox, Badge, Progress } from '@analytika/ui';
import { Shield, ChevronLeft, ChevronRight, Send, AlertTriangle, Info } from 'lucide-react';
import { apiGet, apiPost } from '../../services/api';
import { useToast } from '@analytika/ui';

interface DynamicField {
  id: string;
  key: string;
  label: string;
  type: string;
  placeholder: string | null;
  helpText: string | null;
  options: Record<string, unknown>[] | null;
  validation: Record<string, unknown> | null;
  conditional: { field: string; value: string } | null;
  order: number;
}

interface DynamicFormConfig {
  id: string;
  code: string;
  name: string;
  description: string | null;
  icon: string | null;
  config: { steps?: boolean } | null;
  fields: DynamicField[];
}

interface DynamicFormProps {
  formCode: string;
  onSuccess?: () => void;
  className?: string;
}

const FIELD_ICONS: Record<string, string> = {
  text: '✏️',
  textarea: '📝',
  email: '📧',
  phone: '📞',
  radio: '◉',
  checkbox: '☑',
  select: '📋',
};

function isFieldVisible(field: DynamicField, formData: Record<string, unknown>): boolean {
  if (!field.conditional) return true;
  const parentValue = String(formData[field.conditional.field] ?? '');
  return parentValue === field.conditional.value;
}

function validateField(field: DynamicField, value: unknown): string | null {
  const validation = field.validation as Record<string, unknown> | null;
  if (!validation) return null;

  const required = validation.required as boolean;
  const strValue = String(value ?? '').trim();

  if (required && !strValue) {
    return 'Este campo es obligatorio';
  }

  if (!strValue) return null;

  if (validation.minLength && strValue.length < (validation.minLength as number)) {
    return `Debe tener al menos ${validation.minLength} caracteres`;
  }

  if (validation.maxLength && strValue.length > (validation.maxLength as number)) {
    return `Debe tener máximo ${validation.maxLength} caracteres`;
  }

  if (validation.pattern) {
    const regex = new RegExp(validation.pattern as string);
    if (!regex.test(strValue)) {
      return 'Formato inválido';
    }
  }

  return null;
}

export function DynamicForm({ formCode, onSuccess, className }: DynamicFormProps) {
  const [formConfig, setFormConfig] = useState<DynamicFormConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    async function loadForm() {
      try {
        const data = await apiGet<DynamicFormConfig>(`/forms/${formCode}`);
        setFormConfig(data);
      } catch {
        addToast({ type: 'error', title: 'Error', description: 'No se pudo cargar el formulario' });
      } finally {
        setLoading(false);
      }
    }
    loadForm();
  }, [formCode, addToast]);

  const handleFieldChange = useCallback((key: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const visibleFields = formConfig?.fields.filter((f) => isFieldVisible(f, formData)) ?? [];
  const isSteps = formConfig?.config?.steps ?? false;
  const steps = isSteps ? splitIntoSteps(visibleFields) : [visibleFields];
  const totalSteps = steps.length;
  const canGoNext = currentStep < totalSteps - 1;
  const canGoPrev = currentStep > 0;

  function validateStep(stepIndex: number): boolean {
    const fields = steps[stepIndex] ?? [];
    const newErrors: Record<string, string> = {};

    for (const field of fields) {
      const error = validateField(field, formData[field.key]);
      if (error) newErrors[field.key] = error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (isSteps) {
      if (!validateStep(currentStep)) return;
      if (canGoNext) {
        setCurrentStep((s) => s + 1);
        return;
      }
    } else {
      for (const field of visibleFields) {
        const error = validateField(field, formData[field.key]);
        if (error) {
          setErrors((prev) => ({ ...prev, [field.key]: error }));
        }
      }
      if (Object.keys(errors).length > 0) return;
    }

    setSubmitting(true);
    try {
      await apiPost(`/forms/${formCode}/submit`, {
        data: formData,
        metadata: {
          submittedAt: new Date().toISOString(),
          userAgent: navigator.userAgent,
        },
      });
      setSubmitted(true);
      addToast({ type: 'success', title: 'Formulario enviado', description: 'Hemos recibido tus datos correctamente.' });
      onSuccess?.();
    } catch {
      addToast({ type: 'error', title: 'Error', description: 'No se pudo enviar el formulario. Intenta de nuevo.' });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-600 border-t-transparent" />
      </div>
    );
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <Send className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="mt-4 text-xl font-semibold text-green-900">¡Formulario enviado con éxito!</h3>
        <p className="mt-2 text-green-700">
          Gracias por confiar en nosotras. Pronto recibirás una respuesta.
        </p>
      </motion.div>
    );
  }

  if (!formConfig) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <AlertTriangle className="mx-auto h-8 w-8 text-red-500" />
        <p className="mt-2 text-red-700">No se pudo cargar el formulario.</p>
      </div>
    );
  }

  const currentFields = steps[currentStep] ?? [];

  return (
    <div className={className}>
      {isSteps && totalSteps > 1 && (
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Paso {currentStep + 1} de {totalSteps}</span>
            <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}%</span>
          </div>
          <Progress value={((currentStep + 1) / totalSteps) * 100} className="mt-2" />
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          {currentFields.map((field) => (
            <FormField
              key={field.id}
              field={field}
              value={formData[field.key]}
              error={errors[field.key]}
              onChange={(value) => handleFieldChange(field.key, value)}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex items-center justify-between gap-4">
        {isSteps ? (
          <>
            <Button
              variant="outline"
              onClick={() => setCurrentStep((s) => s - 1)}
              disabled={!canGoPrev}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Anterior
            </Button>
            {canGoNext ? (
              <Button onClick={() => { if (validateStep(currentStep)) setCurrentStep((s) => s + 1); }}>
                Siguiente
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} isLoading={submitting}>
                <Send className="mr-2 h-4 w-4" />
                Enviar
              </Button>
            )}
          </>
        ) : (
          <Button onClick={handleSubmit} isLoading={submitting} className="w-full">
            <Send className="mr-2 h-4 w-4" />
            Enviar
          </Button>
        )}
      </div>
    </div>
  );
}

function splitIntoSteps(fields: DynamicField[]): DynamicField[][] {
  const steps: DynamicField[][] = [];
  let currentStep: DynamicField[] = [];

  for (const field of fields) {
    if (field.type === 'textarea' || field.type === 'checkbox') {
      if (currentStep.length > 0) {
        steps.push(currentStep);
        currentStep = [];
      }
      steps.push([field]);
    } else {
      currentStep.push(field);
    }
  }

  if (currentStep.length > 0) {
    steps.push(currentStep);
  }

  return steps;
}

function FormField({
  field,
  value,
  error,
  onChange,
}: {
  field: DynamicField;
  value: unknown;
  error?: string;
  onChange: (value: unknown) => void;
}) {
  const options = (field.options ?? []) as Array<Record<string, unknown>>;

  const renderField = () => {
    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            placeholder={field.placeholder ?? ''}
            value={String(value ?? '')}
            onChange={(e) => onChange(e.target.value)}
            error={error}
            rows={5}
          />
        );

      case 'select':
        return (
          <Select
            options={options.map((opt) => ({
              value: String(opt.value ?? ''),
              label: String(opt.label ?? ''),
            }))}
            value={String(value ?? '')}
            onChange={(e) => onChange(e.target.value)}
            error={error}
            placeholder="Selecciona una opción"
          />
        );

      case 'radio':
        return (
          <div className="space-y-3">
            {options.map((option) => {
              const optValue = String(option.value ?? '');
              const isSelected = String(value ?? '') === optValue;
              return (
                <button
                  key={optValue}
                  type="button"
                  onClick={() => onChange(optValue)}
                  className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                    isSelected
                      ? 'border-violet-500 bg-violet-50 ring-2 ring-violet-200'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                        isSelected ? 'border-violet-600 bg-violet-600' : 'border-gray-300'
                      }`}
                    >
                      {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{String(option.label ?? '')}</p>
                      {!!option.description && (
                        <p className="mt-0.5 text-sm text-gray-500">{String(option.description)}</p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
            {error && <p className="text-xs text-red-600">{error}</p>}
          </div>
        );

      case 'checkbox':
        const selectedValues = (value as string[]) ?? [];
        return (
          <div className="space-y-3">
            {options.map((option) => {
              const optValue = String(option.value ?? '');
              const isChecked = selectedValues.includes(optValue);
              const severity = option.severity as number | undefined;

              return (
                <label
                  key={optValue}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-all ${
                    isChecked
                      ? 'border-violet-500 bg-violet-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="mt-0.5 h-5 w-5 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                    checked={isChecked}
                    onChange={(e) => {
                      const newValues = e.target.checked
                        ? [...selectedValues, optValue]
                        : selectedValues.filter((v) => v !== optValue);
                      onChange(newValues);
                    }}
                  />
                  <div className="flex-1">
                    <span className="font-medium text-gray-900">{String(option.label ?? '')}</span>
                  </div>
                  {severity && (
                    <Badge
                      variant={
                        severity >= 4 ? 'danger' : severity >= 3 ? 'warning' : 'info'
                      }
                    >
                      {severity >= 4 ? 'Crítico' : severity >= 3 ? 'Alto' : severity >= 2 ? 'Moderado' : 'Leve'}
                    </Badge>
                  )}
                </label>
              );
            })}
            {error && <p className="text-xs text-red-600">{error}</p>}
          </div>
        );

      case 'email':
        return (
          <Input
            type="email"
            placeholder={field.placeholder ?? ''}
            value={String(value ?? '')}
            onChange={(e) => onChange(e.target.value)}
            error={error}
          />
        );

      case 'phone':
        return (
          <Input
            type="tel"
            placeholder={field.placeholder ?? ''}
            value={String(value ?? '')}
            onChange={(e) => onChange(e.target.value)}
            error={error}
          />
        );

      default:
        return (
          <Input
            type="text"
            placeholder={field.placeholder ?? ''}
            value={String(value ?? '')}
            onChange={(e) => onChange(e.target.value)}
            error={error}
          />
        );
    }
  };

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-900">
        {field.label}
        {!!((field.validation as Record<string, unknown>)?.required) && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>
      {renderField()}
      {!!field.helpText && !error && (
        <div className="mt-1.5 flex items-start gap-1.5 text-xs text-gray-500">
          <Info className="mt-0.5 h-3 w-3 shrink-0" />
          <span>{field.helpText}</span>
        </div>
      )}
    </div>
  );
}
