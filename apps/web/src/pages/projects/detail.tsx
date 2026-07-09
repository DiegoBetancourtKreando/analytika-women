import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Button,
  Progress,
  Skeleton,
  Separator,
} from '@analytika/ui';
import {
  Calendar,
  ArrowLeft,
  Target,
  Image,
  BarChart3,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  ListChecks,
} from 'lucide-react';
import { apiGet } from '../../services/api';
import { ROUTES } from '../../constants';
import type { Project } from '@analytika/types';

const STATUS_STYLES: Record<string, { label: string; variant: 'warning' | 'info' | 'success' | 'secondary' | 'danger'; icon: typeof Circle }> = {
  PLANNING: { label: 'Planificación', variant: 'warning', icon: Circle },
  IN_PROGRESS: { label: 'En Progreso', variant: 'info', icon: Clock },
  COMPLETED: { label: 'Completado', variant: 'success', icon: CheckCircle2 },
  ON_HOLD: { label: 'En Pausa', variant: 'secondary', icon: Circle },
  CANCELLED: { label: 'Cancelado', variant: 'danger', icon: AlertCircle },
};

const AREA_LABELS: Record<string, string> = {
  SOCIAL: 'Social',
  TECHNOLOGY: 'Tecnológico',
  ENVIRONMENTAL: 'Ambiental',
  ECONOMIC: 'Económico',
  POLITICAL: 'Político',
};

const STATUS_ORDER = ['PLANNING', 'IN_PROGRESS', 'COMPLETED'] as const;

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchProject();
  }, [id]);

  async function fetchProject() {
    try {
      setLoading(true);
      setError(null);
      const data = await apiGet<Project>(`/projects/${id}`);
      setProject(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el proyecto');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="mt-4 h-10 w-3/4" />
          <Skeleton className="mt-6 h-40 w-full" />
          <Skeleton className="mt-6 h-32 w-full" />
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
          <p className="mt-4 text-red-600">{error ?? 'Proyecto no encontrado'}</p>
          <Link to={ROUTES.PROJECTS}>
            <Button className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a proyectos
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentStatusIndex = STATUS_ORDER.indexOf(project.status as typeof STATUS_ORDER[number]);

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-violet-900 via-violet-800 to-indigo-900 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              to={ROUTES.PROJECTS}
              className="inline-flex items-center gap-1 text-sm text-violet-200 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a proyectos
            </Link>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Badge variant="default">{AREA_LABELS[project.area] ?? project.area}</Badge>
              <Badge variant={(STATUS_STYLES[project.status]?.variant as 'warning' | 'info' | 'success' | 'secondary' | 'danger') ?? 'secondary'}>
                {STATUS_STYLES[project.status]?.label ?? project.status}
              </Badge>
            </div>
            <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">{project.title}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-6 text-sm text-violet-200">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Inicio: {new Date(project.startDate).toLocaleDateString('es-PE')}
              </span>
              {project.endDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Fin: {new Date(project.endDate).toLocaleDateString('es-PE')}
                </span>
              )}
              {project.clientName && (
                <span>Cliente: {project.clientName}</span>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-10">
          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Descripción</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">{project.description}</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Objectives */}
          {project.objectives && project.objectives.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-violet-600" />
                    <CardTitle className="text-xl">Objetivos</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {project.objectives.map((obj, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-medium text-violet-700">
                          {idx + 1}
                        </span>
                        <span className="text-gray-600">{obj}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Indicators */}
          {project.indicators && project.indicators.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-violet-600" />
                    <CardTitle className="text-xl">Indicadores</CardTitle>
                  </div>
                  <CardDescription>Avance de los indicadores del proyecto</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {project.indicators.map((indicator) => {
                    const percentage = Math.round((indicator.currentValue / Math.max(indicator.targetValue, 1)) * 100);
                    return (
                      <div key={indicator.id}>
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{indicator.name}</p>
                            <p className="text-xs text-gray-500">{indicator.description}</p>
                          </div>
                          <span className="text-sm font-medium text-violet-700">
                            {indicator.currentValue}/{indicator.targetValue} {indicator.unit}
                          </span>
                        </div>
                        <Progress value={percentage} className="h-2.5" />
                        <p className="mt-1 text-xs text-gray-400 text-right">{percentage}%</p>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Evidence Gallery */}
          {project.evidence && project.evidence.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Image className="h-5 w-5 text-violet-600" />
                    <CardTitle className="text-xl">Galería de Evidencias</CardTitle>
                  </div>
                  <CardDescription>{project.evidence.length} archivos adjuntos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {project.evidence.map((ev) => (
                      <a
                        key={ev.id}
                        href={ev.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative aspect-video overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
                      >
                        {ev.type.startsWith('image/') ? (
                          <img
                            src={ev.fileUrl}
                            alt={ev.title}
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Image className="h-8 w-8 text-gray-300" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                          <span className="text-sm text-white font-medium">{ev.title}</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Status Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ListChecks className="h-5 w-5 text-violet-600" />
                  <CardTitle className="text-xl">Estado del Proyecto</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {STATUS_ORDER.map((status, idx) => {
                    const StatusIcon = STATUS_STYLES[status].icon;
                    const isCompleted = idx <= currentStatusIndex;
                    const isCurrent = idx === currentStatusIndex;
                    return (
                      <div key={status} className="flex items-center flex-1">
                        <div className="flex flex-col items-center">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                              isCompleted
                                ? 'bg-violet-600 text-white'
                                : 'bg-gray-100 text-gray-400'
                            } ${isCurrent ? 'ring-2 ring-violet-300 ring-offset-2' : ''}`}
                          >
                            <StatusIcon className="h-4 w-4" />
                          </div>
                          <span className={`mt-1 text-xs text-center ${
                            isCompleted ? 'text-violet-700 font-medium' : 'text-gray-400'
                          }`}>
                            {STATUS_STYLES[status].label}
                          </span>
                        </div>
                        {idx < STATUS_ORDER.length - 1 && (
                          <div
                            className={`flex-1 h-0.5 mx-2 ${
                              idx < currentStatusIndex ? 'bg-violet-600' : 'bg-gray-200'
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
