import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
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
  Building2,
  Globe,
  Mail,
  Phone,
  ExternalLink,
  AlertCircle,
  MapPin,
} from 'lucide-react';
import { apiGet } from '../services/api';
import { ORGANIZATION_TYPES } from '../constants';
import type { Organization } from '@analytika/types';

const TYPE_LABELS: Record<string, string> = {
  ALLY: 'Aliada',
  CLIENT: 'Cliente',
  GOVERNMENT: 'Gubernamental',
  NGO: 'ONG',
  ACADEMIC: 'Académica',
  OTHER: 'Otra',
};

export function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeType, setActiveType] = useState('ALL');

  useEffect(() => {
    fetchOrganizations();
  }, []);

  async function fetchOrganizations() {
    try {
      setLoading(true);
      setError(null);
      const data = await apiGet<Organization[]>('/organizations');
      setOrganizations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar organizaciones');
    } finally {
      setLoading(false);
    }
  }

  const filtered = activeType === 'ALL'
    ? organizations
    : organizations.filter((o) => o.type === activeType);

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
          <h1 className="text-4xl font-bold text-white sm:text-5xl">Organizaciones Aliadas</h1>
          <p className="mt-6 text-lg text-violet-100/80">
            Conoce las organizaciones que confían en nuestro trabajo y forman parte 
            de nuestra red de colaboración.
          </p>
        </motion.div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Tabs value={activeType} onValueChange={setActiveType}>
            <TabsList className="mb-8 flex-wrap">
              <TabsTrigger value="ALL">Todas</TabsTrigger>
              {ORGANIZATION_TYPES.map((type) => (
                <TabsTrigger key={type.value} value={type.value}>
                  {type.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeType}>
              {loading ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="mt-2 h-4 w-24" />
                        <Skeleton className="mt-4 h-12 w-full" />
                        <Skeleton className="mt-2 h-4 w-32" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <AlertCircle className="h-12 w-12 text-red-400" />
                  <p className="mt-4 text-red-600">{error}</p>
                  <Button onClick={fetchOrganizations} className="mt-4">Reintentar</Button>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Building2 className="h-16 w-16 text-gray-300" />
                  <h3 className="mt-4 text-xl font-medium text-gray-900">
                    {activeType === 'ALL' ? 'No hay organizaciones registradas' : 'No hay organizaciones de este tipo'}
                  </h3>
                  <p className="mt-2 text-gray-500">
                    {activeType === 'ALL' ? 'Pronto añadiremos nuevas organizaciones aliadas.' : 'Intenta con otro filtro.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((org, index) => (
                    <motion.div
                      key={org.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <Card className="h-full transition-all hover:shadow-lg hover:border-violet-200">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-fuchsia-100 text-violet-600">
                              {org.logo ? (
                                <img src={org.logo} alt={org.name} className="h-10 w-10 rounded-lg object-cover" />
                              ) : (
                                <Building2 className="h-7 w-7" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900">{org.name}</h3>
                              <Badge variant="secondary" className="mt-1">
                                {TYPE_LABELS[org.type] ?? org.type}
                              </Badge>
                            </div>
                          </div>

                          {org.description && (
                            <p className="mt-4 text-sm text-gray-600 line-clamp-3">{org.description}</p>
                          )}

                          <div className="mt-4 space-y-2 pt-4 border-t border-gray-100">
                            {org.email && (
                              <a
                                href={`mailto:${org.email}`}
                                className="flex items-center gap-2 text-sm text-gray-500 hover:text-violet-600 transition-colors"
                              >
                                <Mail className="h-3.5 w-3.5 shrink-0" />
                                <span className="truncate">{org.email}</span>
                              </a>
                            )}
                            {org.phone && (
                              <a
                                href={`tel:${org.phone}`}
                                className="flex items-center gap-2 text-sm text-gray-500 hover:text-violet-600 transition-colors"
                              >
                                <Phone className="h-3.5 w-3.5 shrink-0" />
                                {org.phone}
                              </a>
                            )}
                            {org.website && (
                              <a
                                href={org.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-violet-600 hover:text-violet-700 transition-colors"
                              >
                                <Globe className="h-3.5 w-3.5 shrink-0" />
                                <span className="truncate">{org.website}</span>
                                <ExternalLink className="h-3 w-3 shrink-0" />
                              </a>
                            )}
                            {org.address && (
                              <span className="flex items-center gap-2 text-sm text-gray-500">
                                <MapPin className="h-3.5 w-3.5 shrink-0" />
                                <span className="truncate">{org.address}</span>
                              </span>
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
