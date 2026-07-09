import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Button,
  Input,
  Select,
  Skeleton,
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
  useToast,
} from '@analytika/ui';
import {
  Calendar,
  Clock,
  MapPin,
  Monitor,
  Users,
  Tag,
  AlertCircle,
  ChevronRight,
  CheckCircle2,
  X,
} from 'lucide-react';
import { apiGet, apiPost } from '../services/api';
import type { Event } from '@analytika/types';

const TYPE_CONFIG: Record<string, { label: string; variant: 'default' | 'info' | 'success' | 'warning' | 'secondary' | 'danger' }> = {
  COURSE: { label: 'Curso', variant: 'default' },
  WORKSHOP: { label: 'Taller', variant: 'info' },
  CONFERENCE: { label: 'Conferencia', variant: 'success' },
  SEMINAR: { label: 'Seminario', variant: 'warning' },
  SOCIAL: { label: 'Social', variant: 'secondary' },
  COMMUNITY: { label: 'Comunitario', variant: 'danger' },
  OTHER: { label: 'Otro', variant: 'secondary' },
};

const TABS = [
  { value: 'ALL', label: 'Todos' },
  { value: 'COURSE', label: 'Cursos' },
  { value: 'WORKSHOP', label: 'Talleres' },
  { value: 'CONFERENCE', label: 'Conferencias' },
  { value: 'SEMINAR', label: 'Seminarios' },
  { value: 'SOCIAL', label: 'Sociales' },
  { value: 'COMMUNITY', label: 'Comunitarios' },
];

export function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState('ALL');
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [registered, setRegistered] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      setLoading(true);
      setError(null);
      const data = await apiGet<Event[]>('/events');
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar eventos');
    } finally {
      setLoading(false);
    }
  }

  function openRegisterDialog(event: Event) {
    setSelectedEvent(event);
    setRegisterName('');
    setRegisterEmail('');
    setRegistered(false);
    setShowRegisterDialog(true);
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedEvent) return;
    try {
      setSubmitting(true);
      await apiPost(`/events/${selectedEvent.id}/register`, {
        name: registerName,
        email: registerEmail,
      });
      setRegistered(true);
      addToast({ type: 'success', title: 'Registro exitoso', description: `Te has registrado en: ${selectedEvent.title}` });
    } catch (err) {
      addToast({ type: 'error', title: 'Error', description: err instanceof Error ? err.message : 'Error al registrarse' });
    } finally {
      setSubmitting(false);
    }
  }

  const filtered = tab === 'ALL'
    ? events
    : events.filter((e) => e.type === tab);

  const sorted = [...filtered].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

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
          <h1 className="text-4xl font-bold text-white sm:text-5xl">Eventos</h1>
          <p className="mt-6 text-lg text-violet-100/80">
            Participa en nuestros eventos, talleres, conferencias y actividades 
            diseñadas para tu crecimiento profesional y personal.
          </p>
        </motion.div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="mb-8 flex-wrap">
              {TABS.map((t) => (
                <TabsTrigger key={t.value} value={t.value}>{t.label}</TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={tab}>
              {loading ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="mt-3 h-6 w-3/4" />
                        <Skeleton className="mt-2 h-4 w-full" />
                        <Skeleton className="mt-4 h-4 w-32" />
                        <Skeleton className="mt-2 h-4 w-24" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <AlertCircle className="h-12 w-12 text-red-400" />
                  <p className="mt-4 text-red-600">{error}</p>
                  <Button onClick={fetchEvents} className="mt-4">Reintentar</Button>
                </div>
              ) : sorted.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Calendar className="h-16 w-16 text-gray-300" />
                  <h3 className="mt-4 text-xl font-medium text-gray-900">
                    {tab === 'ALL' ? 'No hay eventos programados' : 'No hay eventos de este tipo'}
                  </h3>
                  <p className="mt-2 text-gray-500">
                    {tab === 'ALL' ? 'Pronto anunciaremos nuevos eventos.' : 'Intenta con otra categoría.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {sorted.map((event, index) => {
                    const typeConfig = TYPE_CONFIG[event.type] ?? TYPE_CONFIG.OTHER;
                    const isPast = new Date(event.endDate) < new Date();
                    const available = event.capacity - event.registeredCount;
                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                      >
                        <Card className={`h-full transition-all hover:shadow-lg ${isPast || event.status === 'CANCELLED' || event.status === 'COMPLETED' ? 'opacity-70' : ''}`}>
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <Badge variant={typeConfig.variant}>{typeConfig.label}</Badge>
                              {event.modality && (
                                <Badge variant="secondary">
                                  {event.modality === 'VIRTUAL' ? <Monitor className="mr-1 h-3 w-3" /> : event.modality === 'IN_PERSON' ? <MapPin className="mr-1 h-3 w-3" /> : null}
                                  {event.modality === 'VIRTUAL' ? 'Virtual' : event.modality === 'IN_PERSON' ? 'Presencial' : 'Híbrido'}
                                </Badge>
                              )}
                            </div>

                            <h3 className="mt-4 text-lg font-semibold text-gray-900 line-clamp-2">
                              {event.title}
                            </h3>
                            <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                              {event.description}
                            </p>

                            <div className="mt-4 space-y-2">
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Calendar className="h-3.5 w-3.5" />
                                {new Date(event.startDate).toLocaleDateString('es-PE', {
                                  day: 'numeric', month: 'long', year: 'numeric',
                                })}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Clock className="h-3.5 w-3.5" />
                                {new Date(event.startDate).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })} - {new Date(event.endDate).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                              </div>
                              {event.location && (
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  <MapPin className="h-3.5 w-3.5" />
                                  {event.location}
                                </div>
                              )}
                              {event.virtualLink && (
                                <div className="flex items-center gap-2 text-sm text-violet-600">
                                  <Monitor className="h-3.5 w-3.5" />
                                  <a href={event.virtualLink} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
                                    Enlace virtual
                                  </a>
                                </div>
                              )}
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Users className="h-3.5 w-3.5" />
                                {event.registeredCount}/{event.capacity} registrados
                                {available > 0 && available <= 10 && (
                                  <span className="text-amber-600 font-medium">
                                    (quedan {available} cupos)
                                  </span>
                                )}
                              </div>
                            </div>

                            {event.tags && event.tags.length > 0 && (
                              <div className="mt-4 flex flex-wrap gap-1">
                                {event.tags.map((tag, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-[10px]">
                                    <Tag className="mr-0.5 h-2.5 w-2.5" />
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            <div className="mt-4">
                              <Button
                                className="w-full"
                                variant={isPast || event.status === 'CANCELLED' || event.status === 'COMPLETED' || available <= 0 ? 'secondary' : 'default'}
                                disabled={isPast || event.status === 'CANCELLED' || event.status === 'COMPLETED' || available <= 0}
                                onClick={() => openRegisterDialog(event)}
                              >
                                {available <= 0 ? 'Cupos agotados' : isPast ? 'Finalizado' : 'Registrarse'}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Registration Dialog */}
      <Dialog open={showRegisterDialog} onOpenChange={setShowRegisterDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registro al Evento</DialogTitle>
            <DialogDescription>
              {selectedEvent?.title}
            </DialogDescription>
          </DialogHeader>

          {registered ? (
            <div className="py-6 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">¡Registro exitoso!</h3>
              <p className="mt-2 text-sm text-gray-500">
                Te hemos enviado la información del evento a tu correo electrónico.
              </p>
              <Button className="mt-6" onClick={() => setShowRegisterDialog(false)}>
                Cerrar
              </Button>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <Input
                label="Nombre completo"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                required
                placeholder="Tu nombre"
              />
              <Input
                label="Correo electrónico"
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                required
                placeholder="tu@correo.com"
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowRegisterDialog(false)}>
                  Cancelar
                </Button>
                <Button type="submit" isLoading={submitting}>
                  Confirmar registro
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
