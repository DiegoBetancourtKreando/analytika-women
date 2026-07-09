import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, BarChart3, Search, GraduationCap, Briefcase, Heart, Shield, Users, Lightbulb, Globe, BookOpen } from 'lucide-react';

const VALUES = [
  { icon: Heart, title: 'Empatía', description: 'Actuamos con comprensión y sensibilidad hacia las necesidades de nuestra comunidad.' },
  { icon: Shield, title: 'Integridad', description: 'Mantenemos altos estándares éticos en todas nuestras acciones y decisiones.' },
  { icon: Lightbulb, title: 'Innovación', description: 'Buscamos constantemente nuevas formas de resolver problemas y generar impacto.' },
  { icon: Users, title: 'Inclusión', description: 'Promovemos la diversidad y la participación equitativa en todos los espacios.' },
  { icon: Globe, title: 'Compromiso Social', description: 'Trabajamos incansablemente por una sociedad más justa e igualitaria.' },
  { icon: BookOpen, title: 'Excelencia', description: 'Nos esforzamos por alcanzar los más altos estándares de calidad profesional.' },
];

const FEATURES = [
  { icon: BarChart3, title: 'Ciencia de Datos', description: 'Análisis estratégico basado en evidencia para la toma de decisiones informadas.' },
  { icon: Target, title: 'Tecnología', description: 'Soluciones tecnológicas innovadoras con enfoque de género e inclusión.' },
  { icon: Search, title: 'Investigación', description: 'Estudios y publicaciones académicas sobre género, tecnología y desarrollo social.' },
  { icon: GraduationCap, title: 'Formación', description: 'Programas de capacitación y certificación en áreas STEM y liderazgo.' },
  { icon: Briefcase, title: 'Consultoría', description: 'Asesoría especializada en proyectos de impacto social y organizacional.' },
  { icon: Heart, title: 'Responsabilidad Social', description: 'Programas de apoyo y atención comunitaria para el bienestar de las mujeres.' },
];

const STRATEGIC_AXES = [
  { title: 'Tecnología con Enfoque de Género', description: 'Desarrollamos soluciones tecnológicas que consideran las necesidades específicas de las mujeres.' },
  { title: 'Investigación Aplicada', description: 'Generamos conocimiento basado en datos para informar políticas y prácticas inclusivas.' },
  { title: 'Formación Especializada', description: 'Capacitamos a mujeres en áreas STEM, liderazgo y gestión de proyectos.' },
  { title: 'Consultoría Estratégica', description: 'Asesoramos a organizaciones en la implementación de proyectos con impacto social.' },
];

const TIMELINE = [
  { year: '2023', event: 'Fundación de Analytika Women' },
];

export function HomePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <>
      <section className="relative bg-gradient-to-b from-violet-900 via-violet-800 via-violet-600 via-violet-300 to-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(255,255,255,0.05),transparent_60%),radial-gradient(ellipse_at_70%_50%,rgba(200,150,255,0.08),transparent_60%)]" />
        <div className="relative mx-auto max-w-5xl px-4 pt-32 pb-16 text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={mounted ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={mounted ? { scale: 1, opacity: 1 } : {}} transition={{ delay: 0.2, duration: 0.6 }}>
              <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight text-white leading-none">
                Analytika
                <span className="block bg-gradient-to-r from-violet-300 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent">Women</span>
              </h1>
              <p className="mx-auto mt-8 max-w-2xl text-lg sm:text-xl text-violet-100/80 leading-relaxed">Gestión, formación, consultoría y responsabilidad social impulsados por tecnología, ciencia de datos e investigación para construir una sociedad más equitativa.</p>
            </motion.div>
          </motion.div>
        </div>

        <div className="relative mx-auto max-w-6xl px-4 pb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="relative border-r-0 md:border-r border-white/20 pr-0 md:pr-16 pb-16 md:pb-0">
              <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl" />
              <span className="inline-flex items-center gap-2 text-sm font-medium text-violet-200 tracking-wider uppercase mb-6"><Target className="h-4 w-4" />Misión</span>
              <p className="text-lg sm:text-xl text-white/80 leading-relaxed">Empoderar a mujeres y comunidades a través de la tecnología, la ciencia de datos y la investigación, generando soluciones innovadoras que promuevan la equidad de género y el desarrollo sostenible.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="relative pl-0 md:pl-16 pt-16 md:pt-0">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/20 to-transparent rounded-full blur-2xl" />
              <span className="inline-flex items-center gap-2 text-sm font-medium text-fuchsia-200 tracking-wider uppercase mb-6"><Eye className="h-4 w-4" />Visión</span>
              <p className="text-lg sm:text-xl text-white/80 leading-relaxed">Ser una organización de referencia internacional en la integración de tecnología, datos y responsabilidad social para la defensa de los derechos de las mujeres.</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative bg-white py-32">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-violet-600 mb-4">Nuestra Esencia</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">Valores que nos definen</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {VALUES.map((value, i) => (
              <motion.div key={value.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-violet-100 text-violet-700 group-hover:bg-violet-700 group-hover:text-white transition-all duration-300"><value.icon className="h-5 w-5" /></div>
                  <h3 className="text-xl font-semibold text-gray-900">{value.title}</h3>
                </div>
                <p className="text-gray-500 leading-relaxed pl-14">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-gray-50 py-32">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-violet-600 mb-4">Áreas de Trabajo</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">Nuestro expertise</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-violet-600 text-white mb-6 shadow-lg shadow-violet-200"><f.icon className="h-7 w-7" /></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-gradient-to-b from-violet-900 via-violet-700 to-white py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#7c3aed15,transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-violet-400 mb-4">Estrategia</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-white">Ejes Estratégicos</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {STRATEGIC_AXES.map((axis, i) => (
              <motion.div key={axis.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-start gap-6">
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-violet-500/10 text-violet-300 text-lg font-bold shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  <div><h3 className="text-xl font-semibold text-white mb-2">{axis.title}</h3><p className="text-violet-200/60 leading-relaxed">{axis.description}</p></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-white py-32">
        <div className="mx-auto max-w-4xl px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-violet-600 mb-4">Recorrido</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">Nuestra Historia</h2>
          </motion.div>
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-violet-200 via-violet-300 to-violet-200 md:-translate-x-px" />
            {TIMELINE.map((item, i) => (
              <motion.div key={item.year} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className={'relative flex items-start gap-8 mb-12 last:mb-0 ' + (i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse')}>
                <div className="hidden md:block flex-1" />
                <div className="relative z-10 flex md:absolute md:left-1/2 md:-translate-x-1/2 items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-200 shrink-0"><div className="w-3 h-3 rounded-full bg-white" /></div>
                <div className="flex-1 min-w-0 pt-1"><span className="inline-block text-sm font-bold text-violet-600 mb-1">{item.year}</span><h4 className="text-lg font-semibold text-gray-900">{item.event}</h4></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
