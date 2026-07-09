import { useState, useEffect } from 'react';
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
  Progress,
} from '@analytika/ui';
import {
  Users,
  FolderKanban,
  Shield,
  Sparkles,
  Calendar,
  Award,
  TrendingUp,
  Activity,
  ArrowRight,
  AlertTriangle,
  PieChart as PieChartIcon,
} from 'lucide-react';
import { apiGet } from '../../services/api';
import { ROUTES, VIOLENCE_LEVELS } from '../../constants';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

interface DashboardStats {
  counts: {
    users: number;
    projects: number;
    reports: number;
    opportunities: number;
    events: number;
    certificates: number;
    courses: number;
    organizations: number;
  };
  reportsByLevel: { level: string; count: number }[];
  projectsByStatus: { status: string; count: number }[];
  recentUsers: { id: string; firstName: string; lastName: string; email: string; role: string; createdAt: string }[];
  recentReports: { id: string; reportCode: string; level: string; status: string; createdAt: string }[];
}

const initialStats: DashboardStats = {
  counts: { users: 0, projects: 0, reports: 0, opportunities: 0, events: 0, certificates: 0, courses: 0, organizations: 0 },
  reportsByLevel: [],
  projectsByStatus: [],
  recentUsers: [],
  recentReports: [],
};

const STAT_CARDS = [
  { key: 'users', label: 'Usuarios', icon: Users, color: 'bg-blue-500', link: '' },
  { key: 'projects', label: 'Proyectos', icon: FolderKanban, color: 'bg-violet-500', link: ROUTES.PROJECTS },
  { key: 'reports', label: 'Denuncias', icon: Shield, color: 'bg-red-500', link: ROUTES.VIOLENCE_REPORT },
  { key: 'opportunities', label: 'Oportunidades', icon: Sparkles, color: 'bg-green-500', link: ROUTES.OPPORTUNITIES },
  { key: 'events', label: 'Eventos', icon: Calendar, color: 'bg-amber-500', link: ROUTES.EVENTS },
  { key: 'certificates', label: 'Certificados', icon: Award, color: 'bg-cyan-500', link: ROUTES.CERTIFICATES },
];

const LEVEL_COLORS: Record<string, string> = {
  LOW: '#22c55e',
  MODERATE: '#eab308',
  HIGH: '#f97316',
  CRITICAL: '#ef4444',
};

const AREA_COLORS = ['#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'];


export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      setLoading(true);
      setError(null);
      const data = await apiGet<DashboardStats>('/dashboard/stats');
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="mt-3 h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertTriangle className="h-12 w-12 text-red-400" />
        <p className="mt-4 text-red-600">{error}</p>
        <Button onClick={fetchStats} className="mt-4">Reintentar</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">Panel de control y monitoreo</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchStats}>
          <Activity className="mr-2 h-4 w-4" />
          Actualizar
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {STAT_CARDS.map((card, index) => {
          const Icon = card.icon;
          const value = stats.counts[card.key as keyof typeof stats.counts] ?? 0;
          return (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="transition-all hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.color} bg-opacity-10`}>
                      <Icon className={`h-5 w-5 ${card.color.replace('bg-', 'text-')}`} />
                    </div>
                  </div>
                  <p className="mt-4 text-2xl font-bold text-gray-900">{value}</p>
                  <p className="mt-1 text-sm text-gray-500">{card.label}</p>
                  {card.link && (
                    <Link
                      to={card.link}
                      className="mt-3 inline-flex items-center gap-1 text-xs text-violet-600 hover:text-violet-700"
                    >
                      Ver detalle
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Reports by Violence Level */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Denuncias por Nivel</CardTitle>
                  <CardDescription>Distribución de denuncias según nivel de violencia</CardDescription>
                </div>
                <Shield className="h-5 w-5 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              {stats.reportsByLevel.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-gray-400">
                  No hay datos disponibles
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.reportsByLevel}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="level"
                      tickFormatter={(val) => VIOLENCE_LEVELS.find((l) => l.value === val)?.label ?? val}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      formatter={(value: number, _name: string) => [value, 'Denuncias']}
                      labelFormatter={(label) => `Nivel: ${VIOLENCE_LEVELS.find((l) => l.value === label)?.label ?? label}`}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {stats.reportsByLevel.map((entry) => (
                        <Cell key={entry.level} fill={LEVEL_COLORS[entry.level] ?? '#7c3aed'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Projects by Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Proyectos por Área</CardTitle>
                  <CardDescription>Distribución de proyectos según área temática</CardDescription>
                </div>
                <PieChartIcon className="h-5 w-5 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              {(!stats.projectsByStatus || stats.projectsByStatus.length === 0) ? (
                <div className="flex items-center justify-center h-64 text-gray-400">
                  No hay datos disponibles
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.projectsByStatus}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ status, count }) => `${status}: ${count}`}
                      labelLine
                    >
                      {stats.projectsByStatus.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={AREA_COLORS[index % AREA_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number, _name: string) => [value, 'Proyectos']}
                      labelFormatter={(label) => label}
                    />
                    <Legend
                      formatter={(value) => value}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity + Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Actividad Reciente</CardTitle>
                  <CardDescription>Últimas acciones en la plataforma</CardDescription>
                </div>
                <Activity className="h-5 w-5 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              {(!stats.recentReports || stats.recentReports.length === 0) ? (
                <div className="flex items-center justify-center py-12 text-gray-400">
                  No hay actividad reciente
                </div>
              ) : (
                <div className="space-y-4">
                  {stats.recentReports.slice(0, 8).map((report) => {
                    const level = VIOLENCE_LEVELS.find((l) => l.value === report.level);
                    return (
                      <div key={report.id} className="flex items-start gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600 shrink-0">
                          <Shield className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">
                            Denuncia {level?.label ?? report.level} — {report.reportCode}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(report.createdAt).toLocaleDateString('es-PE', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
              <CardDescription>Atajos para tareas frecuentes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to={ROUTES.PROJECTS}>
                <Button variant="outline" className="w-full justify-start">
                  <FolderKanban className="mr-2 h-4 w-4" />
                  Ver proyectos
                </Button>
              </Link>
              <Link to={ROUTES.VIOLENCE_REPORT}>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="mr-2 h-4 w-4" />
                  Nueva denuncia
                </Button>
              </Link>
              <Link to={ROUTES.EVENTS}>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Ver eventos
                </Button>
              </Link>
              <Link to={ROUTES.CERTIFICATES}>
                <Button variant="outline" className="w-full justify-start">
                  <Award className="mr-2 h-4 w-4" />
                  Verificar certificado
                </Button>
              </Link>
              <Link to={ROUTES.OPPORTUNITIES}>
                <Button variant="outline" className="w-full justify-start">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Ver oportunidades
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
