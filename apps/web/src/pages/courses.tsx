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
  Skeleton,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@analytika/ui';
import {
  GraduationCap,
  Monitor,
  MapPin,
  Users,
  Clock,
  Calendar,
  AlertCircle,
  Lock,
  Award,
} from 'lucide-react';
import { apiGet } from '../services/api';
import type { Course } from '@analytika/types';

const MODALITY_CONFIG: Record<string, { label: string; icon: typeof Monitor; variant: 'default' | 'info' | 'warning' }> = {
  VIRTUAL: { label: 'Virtual', icon: Monitor, variant: 'default' },
  IN_PERSON: { label: 'Presencial', icon: MapPin, variant: 'info' },
  HYBRID: { label: 'Híbrido', icon: Users, variant: 'warning' },
};

const STATUS_STYLES: Record<string, { label: string; variant: 'secondary' | 'info' | 'success' | 'warning' | 'danger' }> = {
  DRAFT: { label: 'Borrador', variant: 'secondary' },
  PUBLISHED: { label: 'Publicado', variant: 'info' },
  IN_PROGRESS: { label: 'En Progreso', variant: 'warning' },
  COMPLETED: { label: 'Completado', variant: 'success' },
  CANCELLED: { label: 'Cancelado', variant: 'danger' },
};

// Feature flag — in production this could come from config or API
const COURSES_ENABLED = (typeof import.meta !== 'undefined' ? import.meta.env.VITE_COURSES_ENABLED : undefined) === 'true';

export function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState('ALL');

  useEffect(() => {
    if (!COURSES_ENABLED) return;
    fetchCourses();
  }, []);

  async function fetchCourses() {
    try {
      setLoading(true);
      setError(null);
      const data = await apiGet<Course[]>('/courses');
      setCourses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los cursos');
    } finally {
      setLoading(false);
    }
  }

  const filteredCourses = tab === 'ALL'
    ? courses
    : courses.filter((c) => c.modality === tab);

  if (!COURSES_ENABLED) {
    return (
      <div className="bg-white">
        <section className="bg-gradient-to-br from-violet-900 via-violet-800 to-indigo-900 px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl">Formación</h1>
            <p className="mt-6 text-lg text-violet-100/80">
              Programas de capacitación y certificación especializada.
            </p>
          </div>
        </section>
        <section className="flex min-h-[40vh] items-center justify-center px-4 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md"
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-violet-100">
              <Lock className="h-10 w-10 text-violet-600" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-900">Próximamente</h2>
            <p className="mt-4 text-gray-500 leading-relaxed">
              El módulo de formación continua estará disponible próximamente. 
              Estamos trabajando en programas de capacitación especializada 
              en áreas STEM, liderazgo y tecnología para ti.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3 text-sm text-gray-400">
              <Clock className="h-4 w-4" />
              <span>Mantente atenta a nuestras novedades</span>
            </div>
          </motion.div>
        </section>
      </div>
    );
  }

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
          <Badge variant="default" className="mb-4 bg-white/10 text-violet-200 border-violet-400">
            <GraduationCap className="mr-1 h-4 w-4" />
            Formación Continua
          </Badge>
          <h1 className="text-4xl font-bold text-white sm:text-5xl">Cursos y Certificaciones</h1>
          <p className="mt-6 text-lg text-violet-100/80">
            Programas de capacitación diseñados para potenciar tus habilidades 
            en tecnología, ciencia de datos y liderazgo.
          </p>
        </motion.div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="mb-8">
              <TabsTrigger value="ALL">Todos</TabsTrigger>
              <TabsTrigger value="VIRTUAL">Virtual</TabsTrigger>
              <TabsTrigger value="IN_PERSON">Presencial</TabsTrigger>
              <TabsTrigger value="HYBRID">Híbrido</TabsTrigger>
            </TabsList>

            <TabsContent value={tab}>
              {loading ? (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="mt-3 h-6 w-full" />
                        <Skeleton className="mt-2 h-4 w-32" />
                        <Skeleton className="mt-4 h-8 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <AlertCircle className="h-12 w-12 text-red-400" />
                  <p className="mt-4 text-red-600">{error}</p>
                  <Button onClick={fetchCourses} className="mt-4">Reintentar</Button>
                </div>
              ) : filteredCourses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <GraduationCap className="h-16 w-16 text-gray-300" />
                  <h3 className="mt-4 text-xl font-medium text-gray-900">No hay cursos disponibles</h3>
                  <p className="mt-2 text-gray-500">
                    {tab !== 'ALL' ? 'No hay cursos en esta modalidad.' : 'No hay cursos disponibles en este momento.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {filteredCourses.map((course, index) => {
                    const modalityConfig = MODALITY_CONFIG[course.modality] ?? MODALITY_CONFIG.VIRTUAL;
                    const ModalityIcon = modalityConfig.icon;
                    const statusStyle = STATUS_STYLES[course.status] ?? { label: course.status, variant: 'secondary' as const };
                    return (
                      <motion.div
                        key={course.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                      >
                        <Card className="h-full transition-all hover:shadow-lg">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <Badge variant={modalityConfig.variant}>
                                <ModalityIcon className="mr-1 h-3 w-3" />
                                {modalityConfig.label}
                              </Badge>
                              <Badge variant={statusStyle.variant}>{statusStyle.label}</Badge>
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-gray-900 line-clamp-2">
                              {course.title}
                            </h3>
                            <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                              {course.description}
                            </p>
                            <div className="mt-4 space-y-2">
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Calendar className="h-4 w-4" />
                                Inicio: {new Date(course.startDate).toLocaleDateString('es-PE')}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Clock className="h-4 w-4" />
                                Duración: {course.duration} {course.durationUnit === 'HOURS' ? 'horas' : course.durationUnit === 'DAYS' ? 'días' : 'semanas'}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Users className="h-4 w-4" />
                                Cupos: {course.enrolledCount}/{course.capacity}
                              </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                              {course.hasCertification && (
                                <Badge variant="secondary">
                                  <Award className="mr-1 h-3 w-3" />
                                  Certificación
                                </Badge>
                              )}
                              {course.price != null && course.price > 0 && (
                                <span className="text-lg font-bold text-violet-700">
                                  S/ {course.price.toFixed(2)}
                                </span>
                              )}
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
    </div>
  );
}
