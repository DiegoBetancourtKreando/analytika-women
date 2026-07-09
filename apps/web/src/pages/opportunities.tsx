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
  Separator,
  useToast,
} from '@analytika/ui';
import {
  Sparkles,
  Calendar,
  Clock,
  FileText,
  CheckCircle2,
  Briefcase,
  GraduationCap,
  Heart,
  Users,
  ExternalLink,
  AlertCircle,
  MapPin,
  Monitor,
  Mail,
} from 'lucide-react';
import { apiGet } from '../services/api';
import type { Opportunity, OpportunityType } from '@analytika/types';

const TYPE_CONFIG: Record<string, { label: string; icon: typeof Sparkles; variant: 'default' | 'info' | 'success' | 'warning' | 'secondary' | 'danger' }> = {
  SCHOLARSHIP: { label: 'Becas', icon: GraduationCap, variant: 'info' },
  JOB: { label: 'Empleo', icon: Briefcase, variant: 'default' },
  VOLUNTEER: { label: 'Voluntariado', icon: Heart, variant: 'success' },
  INTERNSHIP: { label: 'Prácticas', icon: Users, variant: 'warning' },
  CALL: { label: 'Convocatorias', icon: FileText, variant: 'secondary' },
  TRAINING: { label: 'Capacitación', icon: Sparkles, variant: 'danger' },
};

const TABS = [
  { value: 'ALL', label: 'Todas' },
  { value: 'SCHOLARSHIP', label: 'Becas' },
  { value: 'JOB', label: 'Empleo' },
  { value: 'VOLUNTEER', label: 'Voluntariado' },
  { value: 'INTERNSHIP', label: 'Prácticas' },
  { value: 'CALL', label: 'Convocatorias' },
];

const MODALITY_LABELS: Record<string, string> = {
  VIRTUAL: 'Virtual',
  IN_PERSON: 'Presencial',
  HYBRID: 'Híbrido',
};

export function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState('ALL');

  useEffect(() => {
    fetchOpportunities();
  }, []);

  async function fetchOpportunities() {
    try {
      setLoading(true);
      setError(null);
      const data = await apiGet<Opportunity[]>('/opportunities');
      setOpportunities(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar oportunidades');
    } finally {
      setLoading(false);
    }
  }

  const filtered = tab === 'ALL'
    ? opportunities
    : opportunities.filter((o) => o.type === tab);

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
          <h1 className="text-4xl font-bold text-white sm:text-5xl">Oportunidades</h1>
          <p className="mt-6 text-lg text-violet-100/80">
            Explora becas, empleos, voluntariados, prácticas y convocatorias 
            diseñadas para impulsar tu desarrollo profesional.
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
                        <Skeleton className="mt-2 h-4 w-2/3" />
                        <Skeleton className="mt-4 h-8 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <AlertCircle className="h-12 w-12 text-red-400" />
                  <p className="mt-4 text-red-600">{error}</p>
                  <Button onClick={fetchOpportunities} className="mt-4">Reintentar</Button>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Sparkles className="h-16 w-16 text-gray-300" />
                  <h3 className="mt-4 text-xl font-medium text-gray-900">
                    {tab === 'ALL' ? 'No hay oportunidades disponibles' : 'No hay oportunidades de este tipo'}
                  </h3>
                  <p className="mt-2 text-gray-500">
                    {tab === 'ALL' ? 'Pronto publicaremos nuevas oportunidades.' : 'Intenta con otra categoría.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((opp, index) => {
                    const typeConfig = TYPE_CONFIG[opp.type] ?? TYPE_CONFIG.CALL;
                    const TypeIcon = typeConfig.icon;
                    const isExpired = opp.applicationDeadline ? new Date(opp.applicationDeadline) < new Date() : false;
                    return (
                      <motion.div
                        key={opp.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                      >
                        <Card className={`h-full transition-all hover:shadow-lg ${opp.status === 'CLOSED' || isExpired ? 'opacity-70' : ''}`}>
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <Badge variant={typeConfig.variant}>
                                <TypeIcon className="mr-1 h-3 w-3" />
                                {typeConfig.label}
                              </Badge>
                              {(opp.status === 'CLOSED' || isExpired) && (
                                <Badge variant="danger">Cerrada</Badge>
                              )}
                            </div>

                            <h3 className="mt-4 text-lg font-semibold text-gray-900 line-clamp-2">
                              {opp.title}
                            </h3>
                            <p className="mt-2 text-sm text-gray-500 line-clamp-3">
                              {opp.description}
                            </p>

                            <Separator className="my-4" />

                            <div className="space-y-2">
                              {opp.modality && (
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  <Monitor className="h-3.5 w-3.5" />
                                  {MODALITY_LABELS[opp.modality] ?? opp.modality}
                                </div>
                              )}
                              {opp.applicationDeadline && (
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  <Calendar className="h-3.5 w-3.5" />
                                  Cierre: {new Date(opp.applicationDeadline).toLocaleDateString('es-PE')}
                                </div>
                              )}
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Mail className="h-3.5 w-3.5" />
                                {opp.contactEmail}
                              </div>
                            </div>

                            {/* Requirements */}
                            {opp.requirements && opp.requirements.length > 0 && (
                              <div className="mt-4">
                                <p className="text-xs font-medium text-gray-700 mb-1">Requisitos:</p>
                                <ul className="space-y-0.5">
                                  {opp.requirements.slice(0, 3).map((req, idx) => (
                                    <li key={idx} className="flex items-start gap-1.5 text-xs text-gray-500">
                                      <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-green-500" />
                                      <span className="line-clamp-1">{req}</span>
                                    </li>
                                  ))}
                                  {opp.requirements.length > 3 && (
                                    <li className="text-xs text-violet-600 ml-5">
                                      +{opp.requirements.length - 3} más
                                    </li>
                                  )}
                                </ul>
                              </div>
                            )}

                            {/* Benefits */}
                            {opp.benefits && opp.benefits.length > 0 && (
                              <div className="mt-3">
                                <p className="text-xs font-medium text-gray-700 mb-1">Beneficios:</p>
                                <div className="flex flex-wrap gap-1">
                                  {opp.benefits.slice(0, 3).map((benefit, idx) => (
                                    <Badge key={idx} variant="success" className="text-[10px]">
                                      {benefit}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="mt-4">
                              <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => window.open(`mailto:${opp.contactEmail}`, '_blank')}
                                disabled={!!(opp.status === 'CLOSED' || isExpired)}
                              >
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Aplicar
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
    </div>
  );
}
