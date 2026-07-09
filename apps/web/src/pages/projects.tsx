import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
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
  Separator,
} from '@analytika/ui';
import {
  Calendar,
  FolderKanban,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
} from 'lucide-react';
import { apiGet } from '../services/api';
import { usePagination } from '../hooks/use-pagination';
import { PROJECT_AREAS, ROUTES } from '../constants';
import type { Project, ProjectArea, PaginatedResponse } from '@analytika/types';

const STATUS_STYLES: Record<string, { label: string; variant: 'warning' | 'info' | 'success' | 'secondary' | 'danger' }> = {
  PLANNING: { label: 'Planificación', variant: 'warning' },
  IN_PROGRESS: { label: 'En Progreso', variant: 'info' },
  COMPLETED: { label: 'Completado', variant: 'success' },
  ON_HOLD: { label: 'En Pausa', variant: 'secondary' },
  CANCELLED: { label: 'Cancelado', variant: 'danger' },
};

const AREA_LABELS: Record<string, string> = {
  SOCIAL: 'Social',
  TECHNOLOGY: 'Tecnológico',
  ENVIRONMENTAL: 'Ambiental',
  ECONOMIC: 'Económico',
  POLITICAL: 'Político',
};

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeArea, setActiveArea] = useState<string>('ALL');
  const [totalPages, setTotalPages] = useState(1);
  const { page, limit, nextPage, previousPage, goToPage } = usePagination({ initialPage: 1, initialLimit: 9 });

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params: Record<string, string | number | undefined> = { page, limit };
      if (activeArea !== 'ALL') params.area = activeArea;
      const data = await apiGet<PaginatedResponse<Project>>('/projects', params);
      setProjects(data.data ?? []);
      setTotalPages(data.meta?.totalPages ?? 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar proyectos');
    } finally {
      setLoading(false);
    }
  }, [page, limit, activeArea]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

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
          <h1 className="text-4xl font-bold text-white sm:text-5xl">Proyectos</h1>
          <p className="mt-6 text-lg text-violet-100/80">
            Conoce los proyectos que hemos desarrollado en diversas áreas de impacto social y tecnológico.
          </p>
        </motion.div>
      </section>

      {/* Filters */}
      <section className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-gray-200 px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button
              variant={activeArea === 'ALL' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => { setActiveArea('ALL'); goToPage(1); }}
            >
              Todos
            </Button>
            {PROJECT_AREAS.map((area) => (
              <Button
                key={area.value}
                variant={activeArea === area.value ? 'default' : 'ghost'}
                size="sm"
                onClick={() => { setActiveArea(area.value); goToPage(1); }}
              >
                {area.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="mt-3 h-6 w-full" />
                    <Skeleton className="mt-2 h-12 w-full" />
                    <Skeleton className="mt-4 h-4 w-32" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <AlertCircle className="h-12 w-12 text-red-400" />
              <p className="mt-4 text-red-600">{error}</p>
              <Button onClick={fetchProjects} className="mt-4">
                Reintentar
              </Button>
            </div>
          ) : projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <FolderKanban className="h-16 w-16 text-gray-300" />
              <h3 className="mt-4 text-xl font-medium text-gray-900">No hay proyectos</h3>
              <p className="mt-2 text-gray-500">
                {activeArea !== 'ALL'
                  ? 'No se encontraron proyectos en esta categoría.'
                  : 'No hay proyectos disponibles en este momento.'}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project, index) => {
                  const statusInfo = STATUS_STYLES[project.status] ?? { label: project.status, variant: 'secondary' as const };
                  return (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                    >
                      <Link to={`${ROUTES.PROJECTS}/${project.id}`} className="block h-full">
                        <Card className="h-full transition-all hover:shadow-lg hover:border-violet-200">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <Badge variant="default">
                                {AREA_LABELS[project.area] ?? project.area}
                              </Badge>
                              <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-gray-900 line-clamp-2">
                              {project.title}
                            </h3>
                            <p className="mt-2 text-sm text-gray-500 line-clamp-3">
                              {project.description}
                            </p>
                            <div className="mt-4 flex items-center gap-4 text-xs text-gray-400">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                {new Date(project.startDate).toLocaleDateString('es-PE')}
                              </span>
                              {project.endDate && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3.5 w-3.5" />
                                  {new Date(project.endDate).toLocaleDateString('es-PE')}
                                </span>
                              )}
                            </div>
                            <div className="mt-4 flex items-center text-sm text-violet-600 font-medium">
                              Ver detalle
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={previousPage}
                    disabled={page <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <Button
                        key={p}
                        variant={page === p ? 'default' : 'ghost'}
                        size="sm"
                        className="min-w-[2.5rem]"
                        onClick={() => goToPage(p)}
                      >
                        {p}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextPage}
                    disabled={page >= totalPages}
                  >
                    Siguiente
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
