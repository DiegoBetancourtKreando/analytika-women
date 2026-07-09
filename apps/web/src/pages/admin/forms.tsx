import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Input, Select, Badge, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, useToast } from '@analytika/ui';
import { Plus, Pencil, Trash2, FileText, Eye, EyeOff, RefreshCw, XCircle } from 'lucide-react';
import { apiGet, apiPost, apiPatch, apiDelete } from '../../services/api';

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
  isActive: boolean;
  fields: DynamicField[];
  _count: { fields: number; submissions: number };
}

export function AdminFormsPage() {
  const [forms, setForms] = useState<DynamicForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState<DynamicForm | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAddField, setShowAddField] = useState(false);
  const [showEditField, setShowEditField] = useState<DynamicField | null>(null);
  const [newForm, setNewForm] = useState({ code: '', name: '' });
  const [newField, setNewField] = useState<{ label: string; type: string; options: { value: string; label: string }[] }>({ label: '', type: 'text', options: [] });
  const [saving, setSaving] = useState(false);
  const [setupLoading, setSetupLoading] = useState(false);
  const { addToast } = useToast();

  useEffect(() => { loadForms(); }, []);

  async function loadForms() {
    setLoading(true);
    try {
      const data = await apiGet<any[]>('/forms');
      setForms(Array.isArray(data) ? data : []);
    } catch { setForms([]); }
    finally { setLoading(false); }
  }

  async function handleCreateForm() {
    if (!newForm.code || !newForm.name) return;
    setSaving(true);
    try {
      await apiPost('/forms', { code: newForm.code, name: newForm.name, description: newForm.name });
      addToast({ type: 'success', title: 'Creado', description: 'Categoría creada correctamente' });
      setShowCreateForm(false);
      setNewForm({ code: '', name: '' });
      loadForms();
    } catch { addToast({ type: 'error', title: 'Error', description: 'No se pudo crear' }); }
    finally { setSaving(false); }
  }

  async function handleDeleteForm(code: string) {
    if (!confirm('¿Eliminar esta categoría y todas sus preguntas?')) return;
    try {
      await apiDelete(`/forms/${code}`);
      addToast({ type: 'success', title: 'Eliminado' });
      if (selectedForm?.code === code) { setShowDetail(false); setSelectedForm(null); }
      loadForms();
    } catch { addToast({ type: 'error', title: 'Error' }); }
  }

  async function handleAddField() {
    if (!newField.label || !selectedForm) return;
    setSaving(true);
    try {
      const key = newField.label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') || 'campo';
      await apiPost(`/forms/${selectedForm.code}/fields`, {
        key,
        label: newField.label,
        type: newField.type,
        options: newField.type === 'checkbox' ? newField.options : null,
      });
      addToast({ type: 'success', title: 'Pregunta agregada' });
      setShowAddField(false);
      setNewField({ label: '', type: 'text', options: [] });
      loadForms();
      const updated = await apiGet<any>(`/forms/${selectedForm.code}`);
      setSelectedForm(updated);
    } catch { addToast({ type: 'error', title: 'Error' }); }
    finally { setSaving(false); }
  }

  async function handleUpdateField() {
    if (!showEditField || !selectedForm) return;
    setSaving(true);
    try {
      await apiPatch(`/forms/${selectedForm.code}/fields/${(showEditField as any).id}`, {
        label: showEditField.label,
        type: showEditField.type,
        options: showEditField.type === 'checkbox' ? showEditField.options : null,
      });
      addToast({ type: 'success', title: 'Pregunta actualizada' });
      setShowEditField(null);
      loadForms();
      const updated = await apiGet<any>(`/forms/${selectedForm.code}`);
      setSelectedForm(updated);
    } catch { addToast({ type: 'error', title: 'Error' }); }
    finally { setSaving(false); }
  }

  async function handleDeleteField(fieldId: string) {
    if (!selectedForm || !confirm('¿Eliminar esta pregunta?')) return;
    try {
      await apiDelete(`/forms/${selectedForm.code}/fields/${fieldId}`);
      addToast({ type: 'success', title: 'Pregunta eliminada' });
      loadForms();
      const updated = await apiGet<any>(`/forms/${selectedForm.code}`);
      setSelectedForm(updated);
    } catch { addToast({ type: 'error', title: 'Error' }); }
  }

  async function handleToggleField(fieldId: string, isActive: boolean) {
    if (!selectedForm) return;
    try {
      await apiPatch(`/forms/${selectedForm.code}/fields/${fieldId}`, { isActive: !isActive });
      loadForms();
      const updated = await apiGet<any>(`/forms/${selectedForm.code}`);
      setSelectedForm(updated);
    } catch { addToast({ type: 'error', title: 'Error' }); }
  }

  async function handleSetupDefaults() {
    setSetupLoading(true);
    try {
      const result = await apiPost<any>('/forms/setup');
      addToast({ type: 'success', title: result.message ?? 'Formularios creados' });
      loadForms();
    } catch { addToast({ type: 'error', title: 'Error' }); }
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
          <p className="text-sm text-gray-500">Crea categorías y preguntas para los formularios</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleSetupDefaults} isLoading={setupLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${setupLoading ? 'animate-spin' : ''}`} />
            Por defecto
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
          <h3 className="mt-4 text-xl font-medium text-gray-900">No hay categorías</h3>
          <p className="mt-2 text-gray-500">Crea tu primera categoría o usa "Por defecto"</p>
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
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>{form._count?.fields ?? form.fields?.length ?? 0} preguntas</span>
                    <span>•</span>
                    <span>{form._count?.submissions ?? 0} respuestas</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nueva Categoría</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Input label="Código" value={newForm.code} onChange={(e) => setNewForm({ ...newForm, code: e.target.value })} placeholder="ej: violencia" />
            <Input label="Nombre" value={newForm.name} onChange={(e) => setNewForm({ ...newForm, name: e.target.value })} placeholder="ej: Denuncia por Violencia" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateForm(false)}>Cancelar</Button>
            <Button onClick={handleCreateForm} isLoading={saving}>Crear</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showDetail && selectedForm && (
        <Dialog open={showDetail} onOpenChange={setShowDetail}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle>{selectedForm.name}</DialogTitle>
                  <DialogDescription>Código: <span className="font-mono">{selectedForm.code}</span></DialogDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleDeleteForm(selectedForm.code)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
              </div>
            </DialogHeader>

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-700">Preguntas ({selectedForm.fields?.length ?? 0})</h3>
              <Button size="sm" onClick={() => { setNewField({ label: '', type: 'text', options: [] }); setShowAddField(true); }}>
                <Plus className="mr-2 h-4 w-4" /> Agregar Pregunta
              </Button>
            </div>

            {(!selectedForm.fields || selectedForm.fields.length === 0) ? (
              <div className="py-8 text-center text-gray-400">No hay preguntas.</div>
            ) : (
              <div className="space-y-2">
                {selectedForm.fields.filter(f => f.id).map((field, idx) => (
                  <div key={field.id} className={`flex items-start gap-4 rounded-lg border p-4 ${field.isActive ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50 opacity-60'}`}>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-violet-100 text-xs font-bold text-violet-700 shrink-0">{idx + 1}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-gray-900">{field.label}</span>
                        <Badge variant="secondary" className="text-xs">{field.type === 'checkbox' ? 'Selección múltiple' : 'Texto'}</Badge>
                      </div>
                      {field.options && Array.isArray(field.options) && field.options.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {field.options.map((opt, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{opt.label}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => setShowEditField({ ...field, options: field.options ?? [] })} className="p-1.5 text-gray-400 hover:text-violet-600"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => handleToggleField(field.id, field.isActive)} className="p-1.5 text-gray-400 hover:text-violet-600">{field.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}</button>
                      <button onClick={() => handleDeleteField(field.id)} className="p-1.5 text-gray-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
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

      <Dialog open={showAddField} onOpenChange={setShowAddField}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Nueva Pregunta</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Input label="Etiqueta" value={newField.label} onChange={(e) => setNewField({ ...newField, label: e.target.value })} placeholder="ej: ¿Cuál es tu nombre?" />
            <Select label="Tipo" options={[{ value: 'text', label: 'Texto' }, { value: 'checkbox', label: 'Selección múltiple' }]} value={newField.type} onChange={(e) => setNewField({ ...newField, type: e.target.value, options: e.target.value === 'checkbox' ? [] : [] })} />
            {newField.type === 'checkbox' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Opciones</label>
                <OptionsEditor
                  options={newField.options}
                  onChange={(opts) => setNewField({ ...newField, options: opts })}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddField(false)}>Cancelar</Button>
            <Button onClick={handleAddField} isLoading={saving}>Agregar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showEditField && (
        <Dialog open={!!showEditField} onOpenChange={() => setShowEditField(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Editar Pregunta</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <Input label="Etiqueta" value={showEditField.label} onChange={(e) => setShowEditField({ ...showEditField, label: e.target.value })} />
              <Select label="Tipo" options={[{ value: 'text', label: 'Texto' }, { value: 'checkbox', label: 'Selección múltiple' }]} value={showEditField.type} onChange={(e) => setShowEditField({ ...showEditField, type: e.target.value })} />
              {showEditField.type === 'checkbox' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Opciones</label>
                  <OptionsEditor
                    options={(showEditField as any).options ?? []}
                    onChange={(opts) => setShowEditField({ ...showEditField, options: opts })}
                  />
                </div>
              )}
            </div>
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

function OptionsEditor({ options, onChange }: { options: { value: string; label: string }[]; onChange: (opts: { value: string; label: string }[]) => void }) {
  return (
    <div className="space-y-2">
      {options.map((opt, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <input className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm" value={opt.label} onChange={(e) => {
            const copy = [...options];
            copy[idx] = { value: e.target.value.toLowerCase().replace(/\s+/g, '_'), label: e.target.value };
            onChange(copy);
          }} placeholder="Opción" />
          <button onClick={() => onChange(options.filter((_, i) => i !== idx))} className="p-1.5 text-gray-400 hover:text-red-500"><XCircle className="h-4 w-4" /></button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={() => onChange([...options, { value: '', label: '' }])}><Plus className="mr-2 h-4 w-4" /> Agregar opción</Button>
    </div>
  );
}
