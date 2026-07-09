import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class DynamicFormsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByCode(code: string) {
    const form = await this.prisma.dynamicForm.findUnique({
      where: { code, isActive: true },
      include: {
        fields: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!form) {
      throw new NotFoundException(`Formulario "${code}" no encontrado`);
    }

    return form;
  }

  async submit(code: string, data: Record<string, unknown>, metadata?: Record<string, unknown>) {
    const form = await this.prisma.dynamicForm.findUnique({
      where: { code },
    });

    if (!form) {
      throw new NotFoundException(`Formulario "${code}" no encontrado`);
    }

    return this.prisma.dynamicSubmission.create({
      data: {
        formId: form.id,
        data: data as any,
        metadata: (metadata ?? {}) as any,
      },
    });
  }

  async getSubmissions(code: string, page = 1, limit = 10) {
    const form = await this.prisma.dynamicForm.findUnique({
      where: { code },
    });

    if (!form) {
      throw new NotFoundException(`Formulario "${code}" no encontrado`);
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.dynamicSubmission.findMany({
        where: { formId: form.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.dynamicSubmission.count({
        where: { formId: form.id },
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrevious: page > 1,
      },
    };
  }

  async findAll() {
    return this.prisma.dynamicForm.findMany({
      include: {
        fields: {
          orderBy: { order: 'asc' },
        },
        _count: { select: { fields: true, submissions: true } },
      },
    });
  }

  async updateField(fieldId: string, data: any) {
    return this.prisma.dynamicField.update({
      where: { id: fieldId },
      data,
    });
  }

  async createForm(data: { code: string; name: string; description?: string; icon?: string; config?: any }) {
    return this.prisma.dynamicForm.create({
      data: {
        code: data.code,
        name: data.name,
        description: data.description,
        icon: data.icon,
        config: data.config ?? {},
        isActive: true,
      },
    });
  }

  async updateForm(code: string, data: any) {
    return this.prisma.dynamicForm.update({
      where: { code },
      data,
    });
  }

  async deleteForm(code: string) {
    await this.prisma.dynamicForm.delete({ where: { code } });
    return { message: 'Formulario eliminado' };
  }

  async addField(code: string, data: any) {
    const form = await this.prisma.dynamicForm.findUnique({ where: { code } });
    if (!form) throw new NotFoundException(`Formulario "${code}" no encontrado`);
    return this.prisma.dynamicField.create({
      data: {
        formId: form.id,
        key: data.key,
        label: data.label,
        type: data.type,
        placeholder: data.placeholder,
        helpText: data.helpText,
        options: data.options ?? null,
        validation: data.validation ?? null,
        conditional: data.conditional ?? null,
        order: data.order ?? 0,
        isActive: true,
      },
    });
  }

  async deleteField(fieldId: string) {
    await this.prisma.dynamicField.delete({ where: { id: fieldId } });
    return { message: 'Campo eliminado' };
  }

  async setupDefaults() {
    const existing = await this.prisma.dynamicForm.findUnique({ where: { code: 'violence_report' } });
    if (existing) return { message: 'Los formularios ya existen' };

    const violenceForm = await this.prisma.dynamicForm.create({
      data: {
        code: 'violence_report',
        name: 'Denuncia por Violencia de Género',
        description: 'Formulario inteligente para reportar situaciones de violencia de género.',
        icon: 'Shield',
        isActive: true,
        config: { steps: true },
      },
    });

    await this.prisma.dynamicField.createMany({
      data: [
        { formId: violenceForm.id, key: 'is_anonymous', label: '¿Deseas permanecer anónima?', type: 'radio', order: 1, validation: { required: true }, options: [{ value: 'true', label: 'Sí, prefiero el anonimato' }, { value: 'false', label: 'No, identificarme' }], helpText: 'Puedes denunciar de forma anónima sin proporcionar tus datos personales.' },
        { formId: violenceForm.id, key: 'full_name', label: 'Nombres y apellidos', type: 'text', placeholder: 'Ej: María García López', order: 2, validation: { required: true, minLength: 3 }, conditional: { field: 'is_anonymous', value: 'false' } },
        { formId: violenceForm.id, key: 'email', label: 'Correo electrónico', type: 'email', placeholder: 'tucorreo@ejemplo.com', order: 3, validation: { required: true }, conditional: { field: 'is_anonymous', value: 'false' } },
        { formId: violenceForm.id, key: 'phone', label: 'Teléfono de contacto', type: 'phone', placeholder: '+51 999 999 999', order: 4, conditional: { field: 'is_anonymous', value: 'false' } },
        { formId: violenceForm.id, key: 'violence_types', label: '¿Qué tipo(s) de violencia estás sufriendo?', type: 'checkbox', order: 5, validation: { required: true }, options: [{ value: 'PSYCHOLOGICAL', label: 'Violencia Psicológica', severity: 2 }, { value: 'PHYSICAL', label: 'Violencia Física', severity: 4 }, { value: 'SEXUAL', label: 'Violencia Sexual', severity: 4 }, { value: 'ECONOMIC', label: 'Violencia Económica', severity: 2 }, { value: 'PATRIMONIAL', label: 'Violencia Patrimonial', severity: 1 }, { value: 'DIGITAL', label: 'Violencia Digital', severity: 2 }], helpText: 'Selecciona todas las opciones que apliquen.' },
        { formId: violenceForm.id, key: 'description', label: 'Cuéntanos qué está pasando', type: 'textarea', placeholder: 'Describe tu situación...', order: 6, validation: { required: true, minLength: 20, maxLength: 2000 }, helpText: 'Incluye fechas, lugares y cualquier detalle relevante.' },
        { formId: violenceForm.id, key: 'wants_referral', label: '¿Deseas ser direccionada a una profesional?', type: 'radio', order: 7, validation: { required: true }, options: [{ value: 'true', label: 'Sí, quiero ayuda profesional' }, { value: 'false', label: 'No por el momento' }], helpText: 'Podemos derivarte a una abogada, psicóloga o trabajadora social.' },
        { formId: violenceForm.id, key: 'referral_specialty', label: '¿Qué tipo de profesional?', type: 'radio', order: 8, options: [{ value: 'LAWYER', label: 'Abogada' }, { value: 'PSYCHOLOGIST', label: 'Psicóloga' }, { value: 'SOCIAL_WORKER', label: 'Trabajadora Social' }], conditional: { field: 'wants_referral', value: 'true' } },
      ],
    });

    return { message: 'Formularios creados exitosamente' };
  }
}
