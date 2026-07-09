import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Input, Textarea, Select, Badge, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, useToast } from '@analytika/ui';
import { Plus, Pencil, Trash2, FileText, Eye, EyeOff, AlertTriangle, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
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
  icon: string | null;
  config: any;
  isActive: boolean;
  createdAt: string;
  fields: DynamicField[];
  _count: { fields: number; submissions: number };
}

const FIELD_TYPES = [
  { value: 'text', label: 'Texto corto' },
  { value: 'textarea', label: 'Área de texto' },
  { value: 'email', label: 'Correo electrónico' },
  { value: 'phone', label: 'Teléfono' },
  { value: 'radio', label: 'Opción única (radio)' },
  { value: 'checkbox', label: 'Opción múltiple (checkbox)' },
  { value: 'select', label: 'Selector desplegable' },
];

const EMPTY_FIELD = { key: '', label: '', type: 'text', placeholder: '', helpText: '', options: null, validation: null, conditional: null, order: 0 };

export function AdminFormsPage() {
  const [forms, setForms] = useState<DynamicForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState<DynamicForm | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAddField, setShowAddField] = useState(false);
  const [showEditField, setShowEditField] = useState<DynamicField | null>(null);
  const [newForm, setNewForm] = useState({ code: '', name: '', description: '' });
  const [newField, setNewField] = useState<any>({ ...EMPTY_FIELD });
  const [saving, setSaving] = useState(false);
  const [setupLoading, setSetupLoading] = useState(false);
  const { addToast } = useToast();

  useEffect(() => { loadForms(); }, []);

  async function loadForms() {
    setLoading(true);
    try {
      const data = await apiGet<any[]>('/forms');
      const list = Array.isArray(data) ? data : [];
      setForms(list);
    } catch { setForms([]); }
    finally { setLoading(false); }
  }

  async function handleCreateForm() {
    if (!newForm.code || !newForm.name) return;
    setSaving(true);
    try {
      await apiPost('/forms', newForm);
      addToast({ type: 'success', title: 'Creado', description: 'Formulario creado correctamente' });
      setShowCreateForm(false);
      setNewForm({ code: '', name: '', description: '' });
      loadForms();
    } catch { addToast({ type: 'error', title: 'Error', description: 'No se pudo crear' }); }
    finally { setSaving(false); }
  }

  async function handleDeleteForm(code: string) {
    if (!confirm('¿Eliminar este formulario y todos sus campos?')) return;
    try {
      await apiDelete(`/forms/${code}`);
      addToast({ type: 'success', title: 'Eliminado' });
      if (selectedForm?.code === code) { setShowDetail(false); setSelectedForm(null); }
      loadForms();
    } catch { addToast({ type: 'error', title: 'Error', description: 'No se pudo eliminar' }); }
  }

  async function handleAddField() {
    if (!newField.label || !newField.key || !selectedForm) return;
    setSaving(true);
    try {
      await apiPost(`/forms/${selectedForm.code}/fields`, newField);
      addToast({ type: 'success', title: 'Campo agregado' });
      setShowAddField(false);
      setNewField({ ...EMPTY_FIELD });
      loadForms();
      const updated = (await apiGet<any>(`/forms/${selectedForm.code}`));
      setSelectedForm(updated);
    } catch { addToast({ type: 'error', title: 'Error' }); }
    finally { setSaving(false); }
  }

  async function handleUpdateField() {
    if (!showEditField || !selectedForm) return;
    setSaving(true);
    try {
      await apiPatch(`/forms/${selectedForm.code}/fields/${showEditField.id}`, showEditField);
      addToast({ type: 'success', title: 'Campo actualizado' });
      setShowEditField(null);
      loadForms();
      const updated = (await apiGet<any>(`/forms/${selectedForm.code}`));
      setSelectedForm(updated);
    } catch { addToast({ type: 'error', title: 'Error' }); }
    finally { setSaving(false); }
  }

  async function handleDeleteField(fieldId: string) {
    if (!selectedForm || !confirm('¿Eliminar este campo?')) return;
    try {
      await apiDelete(`/forms/${selectedForm.code}/fields/${fieldId}`);
      addToast({ type: 'success', title: 'Campo eliminado' });
      loadForms();
      const updated = (await apiGet<any>(`/forms/${selectedForm.code}`));
      setSelectedForm(updated);
    } catch { addToast({ type: 'error', title: 'Error' }); }
  }

  async function handleToggleField(fieldId: string, isActive: boolean) {
    if (!selectedForm) return;
    try {
      await apiPatch(`/forms/${selectedForm.code}/fields/${fieldId}`, { isActive: !isActive });
      loadForms();
      const updated = (await apiGet<any>(`/forms/${selectedForm.code}`));
      setSelectedForm(updated);
    } catch { addToast({ type: 'error', title: 'Error' }); }
  }

  async function handleSetupDefaults() {
    setSetupLoading(true);
    try {
      const result = await apiPost<any>('/forms/setup');
      addToast({ type: 'success', title: result.message });
      loadForms();
    } catch { addToast({ type: 'error', title: 'Error', description: 'No se pudieron crear los formularios' }); }
    finally { setSetupLoading(false); }
  }

  async function openFormDetail(form: DynamicForm) {
    try {
      const data = await apiGet<any>(`/forms/${form.code}`);
      setSelectedForm(data);
      setShowDetail(true);
    } catch { addToast({ type: 'error', title: 'Error' }); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Formularios Dinámicos</h1>
          <p className="text-sm text-gray-500">Gestiona las categorías, preguntas y opciones de los formularios</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleSetupDefaults} isLoading={setupLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${setupLoading ? 'animate-spin' : ''}`} />
            Crear por defecto
          </Button>
          <Button onClick={() => setShowCreateForm(true)} size="sm">
            <Plus className="mr-2 h-4 w-4" /> Nueva Categoría
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-600 border-t-transparent" /></div>
      ) : forms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FileText className="h-16 w-16 text-gray-300" />
          <h3 className="mt-4 text-xl font-medium text-gray-900">No hay formularios</h3>
          <p className="mt-2 text-gray-500">Crea tu primer formulario o usa "Crear por defecto"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {forms.map((form) => (
            <motion.div key={form.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="cursor-pointer transition-all hover:shadow-md" onClick={() => openFormDetail(form)}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <FileText className="h-5 w-5 shrink-0 text-violet-600" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{form.name}</h3>
                      <p className="text-xs text-gray-400 font-mono">{form.code}</p>
                    </div>
                    <Badge variant={form.isActive ? 'success' : 'secondary'}>{form.isActive ? 'Activo' : 'Inactivo'}</Badge>
                  </div>
                  {form.description && <p className="text-sm text-gray-500 mb-3 line-clamp-2">{form.description}</p>}
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>{form._count?.fields ?? form.fields?.length ?? 0} campos</span>
                    <span>•</span>
                    <span>{form._count?.submissions ?? 0} respuestas</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Form Dialog */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nueva Categoría de Formulario</DialogTitle><DialogDescription>Crea una nueva categoría para agrupar preguntas</DialogDescription></DialogHeader>
          <div className="space-y-4">
            <Input label="Código (identificador único)" value={newForm.code} onChange={(e) => setNewForm({ ...newForm, code: e.target.value })} placeholder="ej: violence_report" />
            <Input label="Nombre" value={newForm.name} onChange={(e) => setNewForm({ ...newForm, name: e.target.value })} placeholder="ej: Denuncia por Violencia" />
            <Textarea label="Descripción" value={newForm.description} onChange={(e) => setNewForm({ ...newForm, description: e.target.value })} placeholder="Descripción del formulario" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateForm(false)}>Cancelar</Button>
            <Button onClick={handleCreateForm} isLoading={saving}>Crear</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Form Detail Dialog */}
      {showDetail && selectedForm && (
        <Dialog open={showDetail} onOpenChange={setShowDetail}>
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle>{selectedForm.name}</DialogTitle>
                  <DialogDescription>{selectedForm.description} <span className="font-mono text-xs ml-2">{selectedForm.code}</span></DialogDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleDeleteForm(selectedForm.code)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
              </div>
            </DialogHeader>

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-700">Preguntas ({selectedForm.fields?.length ?? 0})</h3>
              <Button size="sm" onClick={() => { setNewField({ ...EMPTY_FIELD, order: (selectedForm.fields?.length ?? 0) + 1 }); setShowAddField(true); }}>
                <Plus className="mr-2 h-4 w-4" /> Agregar Pregunta
              </Button>
            </div>

            {(!selectedForm.fields || selectedForm.fields.length === 0) ? (
              <div className="py-8 text-center text-gray-400">No hay preguntas. Agrega la primera.</div>
            ) : (
              <div className="space-y-3">
                {[...(selectedForm.fields || [])].sort((a, b) => a.order - b.order).map((field, idx) => (
                  <div key={field.id} className={`flex items-start gap-4 rounded-lg border p-4 transition-all ${field.isActive ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50 opacity-60'}`}>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-violet-100 text-xs font-bold text-violet-700 shrink-0">{idx + 1}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-gray-900">{field.label}</span>
                        {field.validation && (field.validation as any)?.required && <span className="text-red-500 text-sm">*</span>}
                        <Badge variant="secondary" className="text-xs">{FIELD_TYPES.find(t => t.value === field.type)?.label ?? field.type}</Badge>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                        <span>Clave: <code className="bg-gray-100 px-1 rounded">{field.key}</code></span>
                        {field.conditional && <Badge variant="warning" className="text-xs">Muestra si {field.conditional.field} = {field.conditional.value}</Badge>}
                        {field.options && Array.isArray(field.options) && <span>{field.options.length} opciones</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => setShowEditField({ ...field })} className="p-1.5 text-gray-400 hover:text-violet-600 transition-colors" title="Editar"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => handleToggleField(field.id, field.isActive)} className="p-1.5 text-gray-400 hover:text-violet-600 transition-colors" title={field.isActive ? 'Deshabilitar' : 'Habilitar'}>{field.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}</button>
                      <button onClick={() => handleDeleteField(field.id)} className="p-1.5 text-gray-400 hover:text-red-600 transition-colors" title="Eliminar"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDetail(false)}>Cerrar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Field Dialog */}
      <Dialog open={showAddField} onOpenChange={setShowAddField}>
        <DialogContent className="max-w-xl">
          <DialogHeader><DialogTitle>Nueva Pregunta</DialogTitle><DialogDescription>Agrega una pregunta al formulario</DialogDescription></DialogHeader>
          <FieldForm value={newField} onChange={setNewField} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddField(false)}>Cancelar</Button>
            <Button onClick={handleAddField} isLoading={saving}>Agregar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Field Dialog */}
      {showEditField && (
        <Dialog open={!!showEditField} onOpenChange={() => setShowEditField(null)}>
          <DialogContent className="max-w-xl">
            <DialogHeader><DialogTitle>Editar Pregunta</DialogTitle></DialogHeader>
            <FieldForm value={showEditField} onChange={setShowEditField} />
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditField(null)}>Cancelar</Button>
              <Button onClick={handleUpdateField} isLoading={saving}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function FieldForm({ value, onChange }: { value: any; onChange: (v: any) => void }) {
  function set(key: string, val: any) { onChange({ ...value, [key]: val }); }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input label="Clave (identificador)" value={value.key} onChange={(e) => set('key', e.target.value)} placeholder="ej: full_name" />
        <Select label="Tipo" options={FIELD_TYPES} value={value.type} onChange={(e) => set('type', e.target.value)} />
      </div>
      <Input label="Etiqueta (pregunta)" value={value.label} onChange={(e) => set('label', e.target.value)} placeholder="ej: ¿Cuál es tu nombre?" />
      <Input label="Texto de ayuda" value={value.helpText ?? ''} onChange={(e) => set('helpText', e.target.value)} placeholder="Opcional: texto pequeño de ayuda" />
      <Input label="Placeholder" value={value.placeholder ?? ''} onChange={(e) => set('placeholder', e.target.value)} placeholder="Texto dentro del campo" />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Orden" type="number" value={value.order ?? 0} onChange={(e) => set('order', parseInt(e.target.value) || 0)} />
        <div className="flex items-center gap-2 pt-6">
          <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500" checked={value.validation?.required ?? false} onChange={(e) => set('validation', { ...(value.validation || {}), required: e.target.checked })} />
          <span className="text-sm text-gray-700">Obligatorio</span>
        </div>
      </div>

      {(value.type === 'radio' || value.type === 'checkbox' || value.type === 'select') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Opciones</label>
          <OptionsEditor options={value.options ?? []} onChange={(opts: any[]) => set('options', opts)} />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Condicional (opcional)</label>
        <div className="flex items-center gap-2">
          <Input placeholder="Campo padre" value={value.conditional?.field ?? ''} onChange={(e) => set('conditional', { ...(value.conditional || {}), field: e.target.value })} />
          <span className="text-gray-400">=</span>
          <Input placeholder="Valor" value={value.conditional?.value ?? ''} onChange={(e) => set('conditional', { ...(value.conditional || {}), value: e.target.value })} />
          <button onClick={() => set('conditional', null)} className="p-2 text-gray-400 hover:text-red-500"><XCircle className="h-5 w-5" /></button>
        </div>
        <p className="text-xs text-gray-400 mt-1">Ej: campo padre "is_anonymous" con valor "false"</p>
      </div>
    </div>
  );
}

function OptionsEditor({ options, onChange }: { options: any[]; onChange: (opts: any[]) => void }) {
  function setOption(idx: number, key: string, val: any) {
    const copy = [...options];
    copy[idx] = { ...copy[idx], [key]: val };
    onChange(copy);
  }

  return (
    <div className="space-y-2">
      {options.map((opt, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <input className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm" value={opt.label ?? ''} onChange={(e) => setOption(idx, 'label', e.target.value)} placeholder="Etiqueta" />
          <input className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-sm" value={opt.value ?? ''} onChange={(e) => setOption(idx, 'value', e.target.value)} placeholder="Valor" />
          <input className="w-16 rounded-lg border border-gray-300 px-3 py-2 text-sm" type="number" value={opt.severity ?? ''} onChange={(e) => setOption(idx, 'severity', parseInt(e.target.value) || undefined)} placeholder="Nivel" title="Nivel de severidad (1-4)" />
          <button onClick={() => onChange(options.filter((_, i) => i !== idx))} className="p-1.5 text-gray-400 hover:text-red-500"><XCircle className="h-4 w-4" /></button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={() => onChange([...options, { value: '', label: '' }])}><Plus className="mr-2 h-4 w-4" /> Agregar opción</Button>
    </div>
  );
}
