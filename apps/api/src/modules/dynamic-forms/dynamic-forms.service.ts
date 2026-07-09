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
      where: { isActive: true },
      include: {
        _count: { select: { fields: true, submissions: true } },
      },
    });
  }
}
