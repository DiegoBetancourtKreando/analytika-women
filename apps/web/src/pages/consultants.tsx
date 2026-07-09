import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Button,
  Input,
  Textarea,
  Select,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Skeleton,
  Avatar,
  AvatarImage,
  AvatarFallback,
  useToast,
} from '@analytika/ui';
import {
  Briefcase,
  Building2,
  Award,
  BookOpen,
  Globe,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Plus,
  Users,
  AlertCircle,
  Star,
} from 'lucide-react';
import { apiGet, apiPost } from '../services/api';
import type { Professional, Organization, ProfessionalSpecialty } from '@analytika/types';

const SPECIALTY_LABELS: Record<string, string> = {
  LAWYER: 'Abogada',
  PSYCHOLOGIST: 'Psicóloga',
  SOCIAL_WORKER: 'Trabajadora Social',
  DATA_SCIENCE: 'Ciencia de Datos',
  TECHNOLOGY: 'Tecnología',
  RESEARCH: 'Investigación',
  CONSULTING: 'Consultoría',
  EDUCATION: 'Educación',
  OTHER: 'Otra',
};

const ORGANIZATION_TYPE_LABELS: Record<string, string> = {
  ALLY: 'Aliada',
  CLIENT: 'Cliente',
  GOVERNMENT: 'Gubernamental',
  NGO: 'ONG',
  ACADEMIC: 'Académica',
  OTHER: 'Otra',
};

const CONSULTANT_SPECIALTIES = [
  { value: 'LAWYER', label: 'Abogada' },
  { value: 'PSYCHOLOGIST', label: 'Psicóloga' },
  { value: 'SOCIAL_WORKER', label: 'Trabajadora Social' },
  { value: 'DATA_SCIENCE', label: 'Ciencia de Datos' },
  { value: 'TECHNOLOGY', label: 'Tecnología' },
  { value: 'RESEARCH', label: 'Investigación' },
  { value: 'CONSULTING', label: 'Consultoría' },
  { value: 'EDUCATION', label: 'Educación' },
  { value: 'OTHER', label: 'Otra' },
];

interface ProfessionalFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialty: string;
  bio: string;
  experience: number;
}

interface OrganizationFormData {
  name: string;
  type: string;
  email: string;
  phone: string;
  website: string;
  description: string;
}

const initialProfessionalForm: ProfessionalFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  specialty: '',
  bio: '',
  experience: 0,
};

const initialOrganizationForm: OrganizationFormData = {
  name: '',
  type: '',
  email: '',
  phone: '',
  website: '',
  description: '',
};

export function ConsultantsPage() {
  const [tab, setTab] = useState('consultants');
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Registration dialogs
  const [showConsultantForm, setShowConsultantForm] = useState(false);
  const [showOrgForm, setShowOrgForm] = useState(false);
  const [profFormData, setProfFormData] = useState<ProfessionalFormData>(initialProfessionalForm);
  const [orgFormData, setOrgFormData] = useState<OrganizationFormData>(initialOrganizationForm);
  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      setError(null);
      const [profs, orgs] = await Promise.all([
        apiGet<Professional[]>('/professionals'),
        apiGet<Organization[]>('/organizations'),
      ]);
      setProfessionals(profs);
      setOrganizations(orgs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  }

  async function handleProfessionalSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSubmitting(true);
      await apiPost('/professionals', { ...profFormData, isTeamMember: false });
      addToast({ type: 'success', title: 'Registro exitoso', description: 'Tu registro ha sido enviado correctamente.' });
      setShowConsultantForm(false);
      setProfFormData(initialProfessionalForm);
      fetchData();
    } catch (err) {
      addToast({ type: 'error', title: 'Error', description: err instanceof Error ? err.message : 'Error al registrar' });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleOrganizationSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSubmitting(true);
      await apiPost('/organizations', orgFormData);
      addToast({ type: 'success', title: 'Registro exitoso', description: 'La organización ha sido registrada correctamente.' });
      setShowOrgForm(false);
      setOrgFormData(initialOrganizationForm);
      fetchData();
    } catch (err) {
      addToast({ type: 'error', title: 'Error', description: err instanceof Error ? err.message : 'Error al registrar' });
    } finally {
      setSubmitting(false);
    }
  }

  const isLoading = loading;

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-violet-900 via-violet-800 to-indigo-900 px-4 py-20 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-4xl text-center"
        >
          <h1 className="text-4xl font-bold text-white sm:text-5xl">Consultores y Organizaciones</h1>
          <p className="mt-6 text-lg text-violet-100/80">
            Conoce nuestra red de especialistas y organizaciones aliadas que trabajan por 
            la transformación social.
          </p>
        </motion.div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Tabs value={tab} onValueChange={setTab}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <TabsList>
                <TabsTrigger value="consultants">
                  <Briefcase className="mr-2 h-4 w-4" />
                  Consultores
                </TabsTrigger>
                <TabsTrigger value="organizations">
                  <Building2 className="mr-2 h-4 w-4" />
                  Organizaciones
                </TabsTrigger>
              </TabsList>
              {tab === 'consultants' ? (
                <Dialog open={showConsultantForm} onOpenChange={setShowConsultantForm}>
                  <DialogTrigger>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Registrarse como consultor
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Registro de Consultor</DialogTitle>
                      <DialogDescription>
                        Completa el formulario para formar parte de nuestra red de especialistas.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleProfessionalSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Nombres"
                          value={profFormData.firstName}
                          onChange={(e) => setProfFormData((p) => ({ ...p, firstName: e.target.value }))}
                          required
                        />
                        <Input
                          label="Apellidos"
                          value={profFormData.lastName}
                          onChange={(e) => setProfFormData((p) => ({ ...p, lastName: e.target.value }))}
                          required
                        />
                      </div>
                      <Input
                        label="Correo electrónico"
                        type="email"
                        value={profFormData.email}
                        onChange={(e) => setProfFormData((p) => ({ ...p, email: e.target.value }))}
                        required
                      />
                      <Input
                        label="Teléfono"
                        type="tel"
                        value={profFormData.phone}
                        onChange={(e) => setProfFormData((p) => ({ ...p, phone: e.target.value }))}
                      />
                      <Select
                        label="Especialidad"
                        options={CONSULTANT_SPECIALTIES}
                        placeholder="Selecciona una especialidad"
                        value={profFormData.specialty}
                        onChange={(e) => setProfFormData((p) => ({ ...p, specialty: e.target.value }))}
                        required
                      />
                      <Input
                        label="Años de experiencia"
                        type="number"
                        min={0}
                        value={profFormData.experience || ''}
                        onChange={(e) => setProfFormData((p) => ({ ...p, experience: parseInt(e.target.value) || 0 }))}
                        required
                      />
                      <Textarea
                        label="Biografía profesional"
                        value={profFormData.bio}
                        onChange={(e) => setProfFormData((p) => ({ ...p, bio: e.target.value }))}
                        rows={3}
                      />
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setShowConsultantForm(false)}>
                          Cancelar
                        </Button>
                        <Button type="submit" isLoading={submitting}>
                          Enviar registro
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              ) : (
                <Dialog open={showOrgForm} onOpenChange={setShowOrgForm}>
                  <DialogTrigger>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Registrar organización
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Registro de Organización</DialogTitle>
                      <DialogDescription>
                        Registra tu organización para formar parte de nuestra red de aliadas.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleOrganizationSubmit} className="space-y-4">
                      <Input
                        label="Nombre de la organización"
                        value={orgFormData.name}
                        onChange={(e) => setOrgFormData((p) => ({ ...p, name: e.target.value }))}
                        required
                      />
                      <Select
                        label="Tipo de organización"
                        options={[
                          { value: 'ALLY', label: 'Aliada' },
                          { value: 'CLIENT', label: 'Cliente' },
                          { value: 'GOVERNMENT', label: 'Gubernamental' },
                          { value: 'NGO', label: 'ONG' },
                          { value: 'ACADEMIC', label: 'Académica' },
                          { value: 'OTHER', label: 'Otra' },
                        ]}
                        placeholder="Selecciona un tipo"
                        value={orgFormData.type}
                        onChange={(e) => setOrgFormData((p) => ({ ...p, type: e.target.value }))}
                        required
                      />
                      <Input
                        label="Correo electrónico"
                        type="email"
                        value={orgFormData.email}
                        onChange={(e) => setOrgFormData((p) => ({ ...p, email: e.target.value }))}
                      />
                      <Input
                        label="Teléfono"
                        type="tel"
                        value={orgFormData.phone}
                        onChange={(e) => setOrgFormData((p) => ({ ...p, phone: e.target.value }))}
                      />
                      <Input
                        label="Sitio web"
                        value={orgFormData.website}
                        onChange={(e) => setOrgFormData((p) => ({ ...p, website: e.target.value }))}
                      />
                      <Textarea
                        label="Descripción"
                        value={orgFormData.description}
                        onChange={(e) => setOrgFormData((p) => ({ ...p, description: e.target.value }))}
                        rows={3}
                      />
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setShowOrgForm(false)}>
                          Cancelar
                        </Button>
                        <Button type="submit" isLoading={submitting}>
                          Enviar registro
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            <TabsContent value="consultants">
              {isLoading ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <Skeleton className="mx-auto h-20 w-20 rounded-full" />
                        <Skeleton className="mx-auto mt-4 h-5 w-32" />
                        <Skeleton className="mx-auto mt-2 h-4 w-24" />
                        <Skeleton className="mt-4 h-12 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <AlertCircle className="h-12 w-12 text-red-400" />
                  <p className="mt-4 text-red-600">{error}</p>
                  <Button onClick={fetchData} className="mt-4">Reintentar</Button>
                </div>
              ) : professionals.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Users className="h-16 w-16 text-gray-300" />
                  <h3 className="mt-4 text-xl font-medium text-gray-900">No hay consultores registrados</h3>
                  <p className="mt-2 text-gray-500">Sé el primero en registrarte como consultor.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {professionals.map((prof, index) => (
                    <motion.div
                      key={prof.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <Card className="h-full transition-all hover:shadow-lg">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-14 w-14 ring-2 ring-violet-100">
                              {prof.photo ? <AvatarImage src={prof.photo} alt={`${prof.firstName} ${prof.lastName}`} /> : null}
                              <AvatarFallback>{prof.firstName.charAt(0)}{prof.lastName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 truncate">
                                {prof.firstName} {prof.lastName}
                              </h3>
                              <Badge variant="secondary" className="mt-1">
                                {SPECIALTY_LABELS[prof.specialty] ?? prof.specialty}
                              </Badge>
                              <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
                                <Star className="h-3.5 w-3.5" />
                                {prof.experience} años de experiencia
                              </div>
                            </div>
                          </div>

                          {prof.bio && (
                            <p className="mt-4 text-sm text-gray-600 line-clamp-3">{prof.bio}</p>
                          )}

                          {prof.certifications && prof.certifications.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                              <div className="flex items-center gap-1 text-xs text-violet-600">
                                <Award className="h-3.5 w-3.5" />
                                <span className="font-medium">{prof.certifications.length} certificaciones</span>
                              </div>
                            </div>
                          )}

                          {prof.publications && prof.publications.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-gray-100">
                              <div className="flex items-center gap-1 text-xs text-violet-600">
                                <BookOpen className="h-3.5 w-3.5" />
                                <span className="font-medium">{prof.publications.length} publicaciones</span>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="organizations">
              {isLoading ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="mt-2 h-4 w-24" />
                        <Skeleton className="mt-4 h-12 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : organizations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Building2 className="h-16 w-16 text-gray-300" />
                  <h3 className="mt-4 text-xl font-medium text-gray-900">No hay organizaciones registradas</h3>
                  <p className="mt-2 text-gray-500">Registra tu organización para aparecer aquí.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {organizations.map((org, index) => (
                    <motion.div
                      key={org.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <Card className="h-full transition-all hover:shadow-lg">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                              <Building2 className="h-6 w-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900">{org.name}</h3>
                              <Badge variant="secondary" className="mt-1">
                                {ORGANIZATION_TYPE_LABELS[org.type] ?? org.type}
                              </Badge>
                            </div>
                          </div>

                          {org.description && (
                            <p className="mt-4 text-sm text-gray-600 line-clamp-3">{org.description}</p>
                          )}

                          <div className="mt-4 space-y-2">
                            {org.email && (
                              <a href={`mailto:${org.email}`} className="flex items-center gap-2 text-sm text-gray-500 hover:text-violet-600">
                                <Mail className="h-3.5 w-3.5" />
                                {org.email}
                              </a>
                            )}
                            {org.phone && (
                              <a href={`tel:${org.phone}`} className="flex items-center gap-2 text-sm text-gray-500 hover:text-violet-600">
                                <Phone className="h-3.5 w-3.5" />
                                {org.phone}
                              </a>
                            )}
                            {org.website && (
                              <a href={org.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-500 hover:text-violet-600">
                                <Globe className="h-3.5 w-3.5" />
                                {org.website}
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
