import { PrismaClient, UserRole, UserStatus, ProjectArea, ViolenceLevel, ReportStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const hashedPassword = await bcrypt.hash('Admin12345', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@analytikawomen.com' },
    update: {},
    create: {
      email: 'admin@analytikawomen.com',
      passwordHash: hashedPassword,
      firstName: 'Admin',
      lastName: 'Analytika',
      role: 'ADMIN',
      status: 'ACTIVE',
      emailVerified: true,
    },
  });
  console.log('Admin user created:', admin.email);

  await prisma.user.upsert({
    where: { email: 'gerente@analytikawomen.com' },
    update: {},
    create: {
      email: 'gerente@analytikawomen.com',
      passwordHash: hashedPassword,
      firstName: 'María',
      lastName: 'García',
      role: 'MANAGER',
      status: 'ACTIVE',
      emailVerified: true,
    },
  });
  console.log('Manager user created');

  await prisma.featureFlag.createMany({
    skipDuplicates: true,
    data: [
      { code: 'courses_module', name: 'Módulo de Formación', description: 'Habilita el módulo de cursos y certificaciones', isEnabled: false },
      { code: 'clients_module', name: 'Módulo de Clientes', description: 'Habilita la gestión de clientes institucionales', isEnabled: false },
      { code: 'ai_assistant', name: 'Asistente IA', description: 'Habilita el asistente con inteligencia artificial', isEnabled: true },
      { code: 'violence_reports', name: 'Denuncias de Violencia', description: 'Habilita el módulo de denuncias', isEnabled: true },
      { code: 'public_registration', name: 'Registro Público', description: 'Permite el registro de nuevos usuarios', isEnabled: true },
    ],
  });
  console.log('Feature flags created');

  await prisma.systemSetting.createMany({
    skipDuplicates: true,
    data: [
      { key: 'organization_name', value: '"Analytika Women"', category: 'general' },
      { key: 'organization_email', value: '"contacto@analytikawomen.com"', category: 'general' },
      { key: 'organization_phone', value: '"+51 999 999 999"', category: 'contact' },
      { key: 'primary_color', value: '"#7C3AED"', category: 'appearance' },
      { key: 'whatsapp_number', value: '"+51999999999"', category: 'integration' },
    ],
  });
  console.log('System settings created');

  const sampleProject = await prisma.project.create({
    data: {
      title: 'Plataforma de Datos para Mujeres Emprendedoras',
      description: 'Proyecto de análisis de datos para identificar brechas de género en emprendimientos tecnológicos.',
      objectives: JSON.stringify([
        'Identificar las principales barreras tecnológicas para mujeres emprendedoras',
        'Desarrollar un dashboard interactivo con indicadores de género',
        'Generar recomendaciones basadas en evidencia para políticas públicas',
      ]),
      area: 'TECHNOLOGY',
      status: 'IN_PROGRESS',
      startDate: new Date('2025-01-15'),
      endDate: new Date('2025-12-31'),
      clientName: 'Ministerio de la Mujer',
    },
  });
  console.log('Sample project created:', sampleProject.title);

  const sampleReport = await prisma.violenceReport.create({
    data: {
      reportCode: 'VR-2025-0001',
      reporterName: 'Ana López',
      reporterEmail: 'ana@example.com',
      reporterPhone: '+51999888777',
      isAnonymous: false,
      violenceType: JSON.stringify(['PSYCHOLOGICAL', 'ECONOMIC']),
      description: 'Situación de violencia psicológica y control económico por parte de la pareja durante más de 2 años.',
      level: 'HIGH',
      status: 'RECEIVED',
      wantsReferral: true,
      referralSpecialty: 'PSYCHOLOGIST',
      evidence: JSON.stringify([]),
    },
  });
  console.log('Sample report created:', sampleReport.reportCode);

  await prisma.opportunity.create({
    data: {
      title: 'Beca para Mujeres en STEM',
      description: 'Beca completa para mujeres interesadas en cursar carreras de ciencia, tecnología, ingeniería y matemáticas.',
      type: 'SCHOLARSHIP',
      modality: 'VIRTUAL',
      status: 'OPEN',
      applicationDeadline: new Date('2025-12-31'),
      requirements: JSON.stringify([
        'Ser mujer mayor de 18 años',
        'Contar con secundaria completa',
        'Demostrar interés en áreas STEM',
        'Disponibilidad de 20 horas semanales',
      ]),
      benefits: JSON.stringify([
        'Cobertura total de matrícula',
        'Mentoría personalizada',
        'Certificación internacional',
        'Bolsa de trabajo preferencial',
      ]),
      contactEmail: 'becas@analytikawomen.com',
    },
  });
  console.log('Sample opportunity created');

  await prisma.event.create({
    data: {
      title: 'Taller: Liderazgo Digital para Mujeres',
      description: 'Taller práctico para desarrollar habilidades de liderazgo en entornos digitales.',
      type: 'WORKSHOP',
      modality: 'VIRTUAL',
      status: 'PUBLISHED',
      startDate: new Date('2025-08-15'),
      endDate: new Date('2025-08-16'),
      virtualLink: 'https://meet.google.com/abc-defg-hij',
      capacity: 50,
      registeredCount: 0,
      isPublic: true,
      tags: JSON.stringify(['liderazgo', 'digital', 'mujeres', 'taller']),
    },
  });
  console.log('Sample event created');

  await prisma.organization.create({
    data: {
      name: 'ONU Mujeres Perú',
      description: 'Entidad de las Naciones Unidas para la Igualdad de Género y el Empoderamiento de las Mujeres.',
      type: 'GOVERNMENT',
      website: 'https://peru.unwomen.org',
      email: 'contacto@unwomen.pe',
      isActive: true,
    },
  });
  console.log('Sample organization created');

  // Dynamic Forms
  const violenceForm = await prisma.dynamicForm.upsert({
    where: { code: 'violence_report' },
    update: {},
    create: {
      code: 'violence_report',
      name: 'Denuncia por Violencia de Género',
      description: 'Formulario inteligente para reportar situaciones de violencia de género. Tus datos están seguros y protegidos.',
      icon: 'Shield',
      isActive: true,
      config: JSON.stringify({ steps: true }),
    },
  });

  await prisma.dynamicField.createMany({
    skipDuplicates: true,
    data: [
      {
        formId: violenceForm.id,
        key: 'is_anonymous',
        label: '¿Deseas permanecer anónima?',
        type: 'radio',
        order: 1,
        validation: JSON.stringify({ required: true }),
        options: JSON.stringify([
          { value: 'true', label: 'Sí, prefiero el anonimato' },
          { value: 'false', label: 'No, identificarme' },
        ]),
        helpText: 'Puedes denunciar de forma anónima sin proporcionar tus datos personales.',
      },
      {
        formId: violenceForm.id,
        key: 'full_name',
        label: 'Nombres y apellidos',
        type: 'text',
        placeholder: 'Ej: María García López',
        order: 2,
        validation: JSON.stringify({ required: true, minLength: 3 }),
        conditional: JSON.stringify({ field: 'is_anonymous', value: 'false' }),
      },
      {
        formId: violenceForm.id,
        key: 'email',
        label: 'Correo electrónico',
        type: 'email',
        placeholder: 'tucorreo@ejemplo.com',
        order: 3,
        validation: JSON.stringify({ required: true, pattern: '^[\\w.-]+@[\\w.-]+\\.\\w{2,}$' }),
        conditional: JSON.stringify({ field: 'is_anonymous', value: 'false' }),
      },
      {
        formId: violenceForm.id,
        key: 'phone',
        label: 'Teléfono de contacto',
        type: 'phone',
        placeholder: '+51 999 999 999',
        order: 4,
        conditional: JSON.stringify({ field: 'is_anonymous', value: 'false' }),
      },
      {
        formId: violenceForm.id,
        key: 'violence_types',
        label: '¿Qué tipo(s) de violencia estás sufriendo?',
        type: 'checkbox',
        order: 5,
        validation: JSON.stringify({ required: true }),
        options: JSON.stringify([
          { value: 'PSYCHOLOGICAL', label: 'Violencia Psicológica', severity: 2 },
          { value: 'PHYSICAL', label: 'Violencia Física', severity: 4 },
          { value: 'SEXUAL', label: 'Violencia Sexual', severity: 4 },
          { value: 'ECONOMIC', label: 'Violencia Económica', severity: 2 },
          { value: 'PATRIMONIAL', label: 'Violencia Patrimonial', severity: 1 },
          { value: 'DIGITAL', label: 'Violencia Digital', severity: 2 },
        ]),
        helpText: 'Selecciona todas las opciones que apliquen a tu situación.',
      },
      {
        formId: violenceForm.id,
        key: 'description',
        label: 'Cuéntanos qué está pasando',
        type: 'textarea',
        placeholder: 'Describe tu situación con el mayor detalle posible...',
        order: 6,
        validation: JSON.stringify({ required: true, minLength: 20, maxLength: 2000 }),
        helpText: 'Describe la situación, incluyendo fechas, lugares y cualquier detalle relevante.',
      },
      {
        formId: violenceForm.id,
        key: 'has_evidence',
        label: '¿Tienes evidencias o documentos que respalden tu denuncia?',
        type: 'radio',
        order: 7,
        validation: JSON.stringify({ required: true }),
        options: JSON.stringify([
          { value: 'true', label: 'Sí, tengo evidencias' },
          { value: 'false', label: 'No, no tengo evidencias' },
        ]),
      },
      {
        formId: violenceForm.id,
        key: 'wants_referral',
        label: '¿Deseas ser direccionada a una profesional especializada?',
        type: 'radio',
        order: 8,
        validation: JSON.stringify({ required: true }),
        options: JSON.stringify([
          { value: 'true', label: 'Sí, quiero ayuda profesional' },
          { value: 'false', label: 'No por el momento' },
        ]),
        helpText: 'Podemos derivarte de forma gratuita y confidencial a una abogada, psicóloga o trabajadora social.',
      },
      {
        formId: violenceForm.id,
        key: 'referral_specialty',
        label: '¿Qué tipo de profesional necesitas?',
        type: 'radio',
        order: 9,
        options: JSON.stringify([
          { value: 'LAWYER', label: 'Abogada', description: 'Asesoría legal y patrocinio judicial' },
          { value: 'PSYCHOLOGIST', label: 'Psicóloga', description: 'Apoyo emocional y contención psicológica' },
          { value: 'SOCIAL_WORKER', label: 'Trabajadora Social', description: 'Orientación en recursos sociales y protección' },
        ]),
        conditional: JSON.stringify({ field: 'wants_referral', value: 'true' }),
      },
    ],
  });
  console.log('Dynamic forms created: violence_report');

  const contactForm = await prisma.dynamicForm.upsert({
    where: { code: 'contact' },
    update: {},
    create: {
      code: 'contact',
      name: 'Formulario de Contacto',
      description: 'Comunícate con nosotras. Te responderemos a la brevedad.',
      icon: 'Mail',
      isActive: true,
      config: JSON.stringify({ steps: false }),
    },
  });

  await prisma.dynamicField.createMany({
    skipDuplicates: true,
    data: [
      {
        formId: contactForm.id,
        key: 'name',
        label: 'Nombre completo',
        type: 'text',
        placeholder: 'Tu nombre',
        order: 1,
        validation: JSON.stringify({ required: true, minLength: 3 }),
      },
      {
        formId: contactForm.id,
        key: 'email',
        label: 'Correo electrónico',
        type: 'email',
        placeholder: 'tucorreo@ejemplo.com',
        order: 2,
        validation: JSON.stringify({ required: true }),
      },
      {
        formId: contactForm.id,
        key: 'phone',
        label: 'Teléfono',
        type: 'phone',
        placeholder: '+51 999 999 999',
        order: 3,
      },
      {
        formId: contactForm.id,
        key: 'subject',
        label: 'Asunto',
        type: 'select',
        order: 4,
        validation: JSON.stringify({ required: true }),
        options: JSON.stringify([
          { value: 'general', label: 'Consulta general' },
          { value: 'services', label: 'Servicios y consultoría' },
          { value: 'training', label: 'Programas de formación' },
          { value: 'partnership', label: 'Alianzas y convenios' },
          { value: 'support', label: 'Apoyo y acompañamiento' },
          { value: 'other', label: 'Otro' },
        ]),
      },
      {
        formId: contactForm.id,
        key: 'message',
        label: 'Mensaje',
        type: 'textarea',
        placeholder: 'Escribe tu mensaje aquí...',
        order: 5,
        validation: JSON.stringify({ required: true, minLength: 10 }),
      },
    ],
  });
  console.log('Dynamic forms created: contact');

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
