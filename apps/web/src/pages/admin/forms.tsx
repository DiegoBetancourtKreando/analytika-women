import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Input, Textarea, Select, Badge, Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, useToast } from '@analytika/ui';
import { Plus, Pencil, Trash2, FileText, Eye, EyeOff, GripVertical } from 'lucide-react';
import { apiGet, apiPost, apiPatch, apiDelete } from '../../services/api';

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
  isActive: boolean;
}

interface DynamicForm {
  id: string;
  code: string;
  name: string;
  description: string | null;
  isActive: boolean;
  fields: DynamicField[];
  _count: { fields: number; submissions: number };
}

const FIELD_TYPES = [
  { value: 'text', label: 'Texto' },
  { value: 'textarea', label: 'Área de texto' },
  { value: 'email', label: 'Correo' },
  { value: 'phone', label: 'Teléfono' },
  { value: 'radio', label: 'Opción única' },
  { value: 'checkbox', label: 'Opción múltiple' },
  { value: 'select', label: 'Selector' },
];

export function AdminFormsPage() {
  const [forms, setForms] = useState<DynamicForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState<DynamicForm | null>(null);
  const [showFormDetail, setShowFormDetail] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    loadForms();
  }, []);

  async function loadForms() {
    try {
      setLoading(true);
      const data = await apiGet<DynamicForm[]>('/forms');
      setForms(data);
    } catch {
      addToast({ type: 'error', title: 'Error', description: 'No se pudieron cargar los formularios' });
    } finally {
      setLoading(false);
    }
  }

  async function toggleField(fieldId: string, isActive: boolean) {
    try {
      await apiPatch(`/forms/${selectedForm?.code}/fields/${fieldId}`, { isActive });
      addToast({ type: 'success', title: 'Campo actualizado' });
      loadForms();
    } catch {
      addToast({ type: 'error', title: 'Error', description: 'No se pudo actualizar el campo' });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Formularios Dinámicos</h1>
          <p className="text-sm text-gray-500">Gestiona los formularios y sus preguntas</p>
        </div>
        <Button onClick={loadForms} variant="outline" size="sm">Actualizar</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-600 border-t-transparent" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {forms.map((form) => (
            <motion.div
              key={form.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="cursor-pointer transition-all hover:shadow-md" onClick={() => { setSelectedForm(form); setShowFormDetail(true); }}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <FileText className="h-5 w-5 text-violet-600" />
                    <h3 className="font-semibold text-gray-900">{form.name}</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">{form.description}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>{form._count.fields} campos</span>
                    <span>•</span>
                    <span>{form._count.submissions} respuestas</span>
                    <span>•</span>
                    <Badge variant={form.isActive ? 'success' : 'secondary'}>
                      {form.isActive ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Form Detail Dialog */}
      {showFormDetail && selectedForm && (
        <Dialog open={showFormDetail} onOpenChange={setShowFormDetail}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedForm.name}</DialogTitle>
              <DialogDescription>{selectedForm.description}</DialogDescription>
            </DialogHeader>

            <div className="space-y-3 mt-4">
              {selectedForm.fields
                .sort((a, b) => a.order - b.order)
                .map((field, index) => (
                  <div
                    key={field.id}
                    className={`flex items-start gap-4 rounded-lg border p-4 transition-all ${field.isActive ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50 opacity-60'}`}
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-xs font-medium text-gray-500 shrink-0 mt-1">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{field.label}</span>
                        {!!((field.validation as Record<string, unknown>)?.required) && (
                          <span className="text-red-500 text-sm">*</span>
                        )}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                        <Badge variant="secondary" className="text-xs">
                          {FIELD_TYPES.find(t => t.value === field.type)?.label ?? field.type}
                        </Badge>
                        <span>Orden: {field.order}</span>
                        {field.key && <span>Clave: {field.key}</span>}
                        {field.conditional && (
                          <Badge variant="warning" className="text-xs">
                            Condicional: {field.conditional.field} = {field.conditional.value}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleField(field.id, !field.isActive)}
                      className="p-2 text-gray-400 hover:text-violet-600 transition-colors"
                      title={field.isActive ? 'Deshabilitar' : 'Habilitar'}
                    >
                      {field.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                  </div>
                ))}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowFormDetail(false)}>
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
