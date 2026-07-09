import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Separator } from '@analytika/ui';
import {
  Target,
  Eye,
  Heart,
  Lightbulb,
  Shield,
  Users,
  Globe,
  BookOpen,
  ChevronRight,
} from 'lucide-react';

const VALUES = [
  {
    icon: Heart,
    title: 'Empatía',
    description: 'Actuamos con comprensión y sensibilidad hacia las necesidades de nuestra comunidad.',
  },
  {
    icon: Shield,
    title: 'Integridad',
    description: 'Mantenemos altos estándares éticos en todas nuestras acciones y decisiones.',
  },
  {
    icon: Lightbulb,
    title: 'Innovación',
    description: 'Buscamos constantemente nuevas formas de resolver problemas y generar impacto.',
  },
  {
    icon: Users,
    title: 'Inclusión',
    description: 'Promovemos la diversidad y la participación equitativa en todos los espacios.',
  },
  {
    icon: Globe,
    title: 'Compromiso Social',
    description: 'Trabajamos incansablemente por una sociedad más justa e igualitaria.',
  },
  {
    icon: BookOpen,
    title: 'Excelencia',
    description: 'Nos esforzamos por alcanzar los más altos estándares de calidad profesional.',
  },
];

const STRATEGIC_AXES = [
  {
    title: 'Tecnología con Enfoque de Género',
    description: 'Desarrollamos soluciones tecnológicas que consideran las necesidades específicas de las mujeres.',
    color: 'border-violet-500',
    bg: 'bg-violet-50',
  },
  {
    title: 'Investigación Aplicada',
    description: 'Generamos conocimiento basado en datos para informar políticas y prácticas inclusivas.',
    color: 'border-fuchsia-500',
    bg: 'bg-fuchsia-50',
  },
  {
    title: 'Formación Especializada',
    description: 'Capacitamos a mujeres en áreas STEM, liderazgo y gestión de proyectos.',
    color: 'border-blue-500',
    bg: 'bg-blue-50',
  },
  {
    title: 'Consultoría Estratégica',
    description: 'Asesoramos a organizaciones en la implementación de proyectos con impacto social.',
    color: 'border-amber-500',
    bg: 'bg-amber-50',
  },
];

const TIMELINE = [
  { year: '2018', event: 'Fundación de Analytika Women' },
  { year: '2019', event: 'Primeros proyectos de investigación en género y tecnología' },
  { year: '2020', event: 'Expansión a consultoría y formación especializada' },
  { year: '2021', event: 'Alianzas estratégicas con organizaciones internacionales' },
  { year: '2022', event: 'Lanzamiento de programas de responsabilidad social' },
  { year: '2023', event: 'Reconocimiento como organización líder en innovación social' },
  { year: '2024', event: 'Plataforma digital integrada con módulo de denuncias' },
];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

export function AboutPage() {
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
            Nosotras
          </Badge>
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            Quiénes Somos
          </h1>
          <p className="mt-6 text-lg text-violet-100/80 leading-relaxed">
            Analytika Women es una organización innovadora liderada por mujeres en áreas STEM, 
            tecnología y análisis estratégico. Integramos inteligencia de datos, formación especializada 
            y consultoría para generar evidencia que impulse la transformación social.
          </p>
        </motion.div>
      </section>

      {/* Mission, Vision */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <motion.div {...fadeInUp}>
              <Card className="h-full border-violet-100">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                    <Target className="h-6 w-6" />
                  </div>
                  <CardTitle className="mt-4 text-2xl">Misión</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    Empoderar a mujeres y comunidades a través de la tecnología, la ciencia de datos 
                    y la investigación, generando soluciones innovadoras que promuevan la equidad de 
                    género, el desarrollo sostenible y la transformación social basada en evidencia.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div {...fadeInUp} transition={{ duration: 0.6, delay: 0.2 }}>
              <Card className="h-full border-violet-100">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                    <Eye className="h-6 w-6" />
                  </div>
                  <CardTitle className="mt-4 text-2xl">Visión</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    Ser una organización de referencia internacional en la integración de tecnología, 
                    datos y responsabilidad social para la defensa de los derechos de las mujeres, 
                    liderando la construcción de una sociedad más equitativa, inclusiva y sostenible.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div {...fadeInUp} className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Nuestros Valores</h2>
            <p className="mt-4 text-lg text-gray-500">
              Principios que guían cada una de nuestras acciones
            </p>
          </motion.div>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full transition-all hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                      <value.icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-gray-900">{value.title}</h3>
                    <p className="mt-2 text-sm text-gray-500 leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategic Axes */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div {...fadeInUp} className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Ejes Estratégicos</h2>
            <p className="mt-4 text-lg text-gray-500">
              Áreas fundamentales que guían nuestro trabajo
            </p>
          </motion.div>

          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
            {STRATEGIC_AXES.map((axis, index) => (
              <motion.div
                key={axis.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className={`rounded-xl border-l-4 ${axis.color} ${axis.bg} p-6`}
              >
                <h3 className="text-xl font-semibold text-gray-900">{axis.title}</h3>
                <p className="mt-3 text-gray-600 leading-relaxed">{axis.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div {...fadeInUp} className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Nuestra Historia</h2>
            <p className="mt-4 text-lg text-gray-500">
              Un recorrido por los hitos más importantes de Analytika Women
            </p>
          </motion.div>

          <div className="relative mt-16">
            <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-violet-200 hidden md:block" />
            <div className="space-y-12">
              {TIMELINE.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative flex flex-col md:flex-row items-center gap-4 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className={`inline-block rounded-lg bg-white px-4 py-2 shadow-sm border border-gray-100`}>
                      <span className="text-lg font-bold text-violet-600">{item.year}</span>
                      <p className="mt-1 text-gray-600">{item.event}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex h-4 w-4 shrink-0 rounded-full bg-violet-600 ring-4 ring-white z-10" />
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile timeline */}
          <div className="mt-8 space-y-4 md:hidden">
            {TIMELINE.map((item) => (
              <div key={item.year} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-violet-600 mt-1" />
                  <div className="w-0.5 flex-1 bg-violet-200" />
                </div>
                <div>
                  <span className="text-sm font-bold text-violet-600">{item.year}</span>
                  <p className="text-sm text-gray-600">{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
