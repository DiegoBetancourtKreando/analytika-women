import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Skeleton,
  Button,
  Separator,
} from '@analytika/ui';
import {
  MapPin,
  Briefcase,
  Award,
  BookOpen,
  ExternalLink,
  Star,
  Quote,
  Calendar,
  Mail,
  Users,
} from 'lucide-react';
import { apiGet } from '../services/api';
import type { Professional, Certification, Publication } from '@analytika/types';

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

export function TeamPage() {
  const [team, setTeam] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTeam();
  }, []);

  async function fetchTeam() {
    try {
      setLoading(true);
      setError(null);
      const data = await apiGet<Professional[]>('/professionals?isTeamMember=true');
      setTeam(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el equipo');
    } finally {
      setLoading(false);
    }
  }

  const manager = team.find((m) => m.specialty === 'DATA_SCIENCE' || m.specialty === 'RESEARCH');
  const members = manager ? team.filter((m) => m.id !== manager.id) : team;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="mx-auto h-24 w-24 rounded-full" />
                  <Skeleton className="mx-auto mt-4 h-5 w-32" />
                  <Skeleton className="mx-auto mt-2 h-4 w-24" />
                  <Skeleton className="mt-4 h-12 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <Button onClick={fetchTeam} className="mt-4">
            Reintentar
          </Button>
        </div>
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
          <h1 className="text-4xl font-bold text-white sm:text-5xl">Nuestro Equipo</h1>
          <p className="mt-6 text-lg text-violet-100/80">
            Profesionales multidisciplinarias comprometidas con la innovación, la tecnología 
            y la transformación social.
          </p>
        </motion.div>
      </section>

      {/* Manager Profile */}
      {manager && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Card className="overflow-hidden border-violet-100">
                <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-300 fill-yellow-300" />
                    <span className="font-medium text-white">Liderazgo</span>
                  </div>
                </div>
                <CardContent className="p-8">
                  <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
                    <Avatar className="h-32 w-32 ring-4 ring-violet-100">
                      {manager.photo ? (
                        <AvatarImage src={manager.photo} alt={`${manager.firstName} ${manager.lastName}`} />
                      ) : null}
                      <AvatarFallback className="text-2xl">
                        {manager.firstName.charAt(0)}{manager.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-center md:text-left">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {manager.firstName} {manager.lastName}
                      </h2>
                      <Badge variant="default" className="mt-2">
                        {SPECIALTY_LABELS[manager.specialty] ?? manager.specialty}
                      </Badge>
                      <p className="mt-4 text-gray-600 leading-relaxed">
                        {manager.bio ?? 'Profesional con amplia experiencia en la gestión de proyectos de impacto social y tecnológico.'}
                      </p>
                      <div className="mt-4 flex flex-wrap items-center gap-4 justify-center md:justify-start">
                        <span className="flex items-center gap-1 text-sm text-gray-500">
                          <Briefcase className="h-4 w-4" />
                          {manager.experience} años de experiencia
                        </span>
                        {manager.email && (
                          <span className="flex items-center gap-1 text-sm text-gray-500">
                            <Mail className="h-4 w-4" />
                            {manager.email}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      )}

      {/* Team Members Grid */}
      {members.length > 0 && (
        <section className="pb-20 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-2xl font-bold text-gray-900 mb-10 text-center"
            >
              Equipo de Trabajo
            </motion.h2>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full transition-all hover:shadow-lg">
                    <CardContent className="p-6 text-center">
                      <Avatar className="mx-auto h-24 w-24 ring-2 ring-violet-100">
                        {member.photo ? (
                          <AvatarImage src={member.photo} alt={`${member.firstName} ${member.lastName}`} />
                        ) : null}
                        <AvatarFallback className="text-lg">
                          {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="mt-4 text-lg font-semibold text-gray-900">
                        {member.firstName} {member.lastName}
                      </h3>
                      <Badge variant="secondary" className="mt-2">
                        {SPECIALTY_LABELS[member.specialty] ?? member.specialty}
                      </Badge>
                      <p className="mt-3 text-sm text-gray-500">
                        {member.experience} años de experiencia
                      </p>
                      {member.bio && (
                        <p className="mt-3 text-sm text-gray-600 line-clamp-3">{member.bio}</p>
                      )}

                      {/* Certifications */}
                      {member.certifications && member.certifications.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center justify-center gap-1 text-sm text-violet-600">
                            <Award className="h-4 w-4" />
                            <span className="font-medium">{member.certifications.length} certificaciones</span>
                          </div>
                        </div>
                      )}

                      {/* Publications */}
                      {member.publications && member.publications.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-100">
                          <div className="flex items-center justify-center gap-1 text-sm text-violet-600">
                            <BookOpen className="h-4 w-4" />
                            <span className="font-medium">{member.publications.length} publicaciones</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Certifications & Publications Sections */}
      {team.length > 0 && (
        <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {/* All Certifications */}
              {(() => {
                const allCerts = team.flatMap((m) =>
                  (m.certifications ?? []).map((c) => ({ ...c, memberName: `${m.firstName} ${m.lastName}` }))
                );
                if (allCerts.length === 0) return null;
                return (
                  <div className="mb-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Certificaciones</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {allCerts.slice(0, 9).map((cert) => (
                        <Card key={cert.id}>
                          <CardContent className="flex items-start gap-3 p-4">
                            <Award className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" />
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{cert.name}</p>
                              <p className="text-xs text-gray-500">{cert.issuer} · {cert.year}</p>
                              <p className="text-xs text-violet-600 mt-0.5">{cert.memberName}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* All Publications */}
              {(() => {
                const allPubs = team.flatMap((m) =>
                  (m.publications ?? []).map((p) => ({ ...p, memberName: `${m.firstName} ${m.lastName}` }))
                );
                if (allPubs.length === 0) return null;
                return (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Publicaciones</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {allPubs.slice(0, 9).map((pub) => (
                        <Card key={pub.id}>
                          <CardContent className="flex items-start gap-3 p-4">
                            <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" />
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{pub.title}</p>
                              <p className="text-xs text-gray-500">{pub.publisher} · {pub.year}</p>
                              <p className="text-xs text-violet-600 mt-0.5">{pub.memberName}</p>
                              {pub.url && (
                                <a
                                  href={pub.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-1 inline-flex items-center gap-1 text-xs text-violet-600 hover:underline"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                  Ver publicación
                                </a>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </div>
        </section>
      )}

      {team.length === 0 && !loading && (
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="text-center">
            <Users className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-4 text-gray-500">No hay miembros del equipo disponibles en este momento.</p>
          </div>
        </div>
      )}
    </div>
  );
}
