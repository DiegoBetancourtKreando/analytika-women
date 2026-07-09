import { useState, useEffect } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Input,
  Badge,
  Skeleton,
  Separator,
  useToast,
} from '@analytika/ui';
import {
  Award,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  User,
  Mail,
  Shield,
  QrCode,
  ExternalLink,
} from 'lucide-react';
import { apiGet, apiPost } from '../services/api';
import type { Certificate } from '@analytika/types';

export function CertificatesPage() {
  const { code: paramCode } = useParams<{ code: string }>();
  const [searchParams] = useSearchParams();
  const queryCode = searchParams.get('code');

  const [code, setCode] = useState(paramCode ?? queryCode ?? '');
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    if (paramCode || queryCode) {
      verifyCertificate();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function verifyCertificate() {
    if (!code.trim()) {
      setError('Ingresa un código de certificado válido.');
      return;
    }

    try {
      setVerifying(true);
      setError(null);
      setSearched(true);
      const data = await apiGet<Certificate>(`/certificates/verify/${code.trim()}`);
      setCertificate(data);
      addToast({ type: 'success', title: 'Certificado válido', description: 'El certificado ha sido verificado correctamente.' });
    } catch (err) {
      setCertificate(null);
      const message = err instanceof Error ? err.message : 'Certificado no encontrado o código inválido';
      setError(message);
      addToast({ type: 'error', title: 'Error de verificación', description: message });
    } finally {
      setVerifying(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    verifyCertificate();
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
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-violet-100/10 mb-6">
            <Award className="h-8 w-8 text-violet-200" />
          </div>
          <h1 className="text-4xl font-bold text-white sm:text-5xl">Certificados</h1>
          <p className="mt-6 text-lg text-violet-100/80">
            Verifica la autenticidad de tus certificados digitales emitidos por Analytika Women.
          </p>
        </motion.div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-violet-100">
              <CardHeader>
                <CardTitle className="text-xl">Verificar Certificado</CardTitle>
                <CardDescription>
                  Ingresa el código único del certificado para verificar su autenticidad.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="flex gap-3">
                  <div className="flex-1">
                    <Input
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="Ej: AW-CERT-2024-XXXX"
                      className="font-mono"
                    />
                  </div>
                  <Button type="submit" isLoading={verifying}>
                    <Search className="mr-2 h-4 w-4" />
                    Verificar
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Result */}
          {verifying && (
            <Card className="mt-6">
              <CardContent className="p-8">
                <div className="flex flex-col items-center text-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-600 border-t-transparent" />
                  <p className="mt-4 text-gray-500">Verificando certificado...</p>
                </div>
              </CardContent>
            </Card>
          )}

          {!verifying && error && searched && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6"
            >
              <Card className="border-red-200">
                <CardContent className="flex flex-col items-center p-8 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                    <XCircle className="h-8 w-8 text-red-500" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-gray-900">Certificado no válido</h3>
                  <p className="mt-2 text-gray-500">{error}</p>
                  <p className="mt-2 text-sm text-gray-400">
                    Verifica que el código ingresado sea correcto e intenta nuevamente.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {!verifying && certificate && searched && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6"
            >
              <Card className="border-green-200 overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                    <span className="font-medium text-white">Certificado Verificado</span>
                  </div>
                </div>
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-violet-100">
                      <Award className="h-10 w-10 text-violet-600" />
                    </div>
                    <h2 className="mt-4 text-2xl font-bold text-gray-900">{certificate.title}</h2>
                    <p className="mt-2 text-gray-500">Certificado digital emitido por Analytika Women</p>
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-violet-600 shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500">Titular</p>
                        <p className="font-medium text-gray-900">{certificate.recipientName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-violet-600 shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500">Correo</p>
                        <p className="font-medium text-gray-900">{certificate.recipientEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-violet-600 shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500">Fecha de emisión</p>
                        <p className="font-medium text-gray-900">
                          {new Date(certificate.issueDate).toLocaleDateString('es-PE', {
                            day: 'numeric', month: 'long', year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    {certificate.expiryDate && (
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-violet-600 shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500">Fecha de vencimiento</p>
                          <p className="font-medium text-gray-900">
                            {new Date(certificate.expiryDate).toLocaleDateString('es-PE', {
                              day: 'numeric', month: 'long', year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-violet-600 shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500">Código único</p>
                        <p className="font-mono font-medium text-gray-900">{certificate.code}</p>
                      </div>
                    </div>
                  </div>

                  {certificate.qrCode && (
                    <>
                      <Separator className="my-6" />
                      <div className="flex flex-col items-center">
                        <p className="text-sm font-medium text-gray-700 mb-3">Código QR de verificación</p>
                        <img
                          src={certificate.qrCode}
                          alt="QR Code"
                          className="h-32 w-32"
                        />
                      </div>
                    </>
                  )}

                  {certificate.metadata && Object.keys(certificate.metadata).length > 0 && (
                    <>
                      <Separator className="my-6" />
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Información adicional</p>
                        {Object.entries(certificate.metadata).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">{key}</span>
                            <span className="text-gray-900 font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {!searched && !verifying && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-12 text-center"
            >
              <p className="text-gray-400">
                Los certificados digitales de Analytika Women cuentan con códigos únicos 
                y verificación mediante tecnología QR para garantizar su autenticidad.
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
