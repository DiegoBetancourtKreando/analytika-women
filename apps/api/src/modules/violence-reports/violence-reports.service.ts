import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { PaginationDto, PaginatedResult } from '../../common/dto/pagination.dto';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ReportStatus } from '@prisma/client';
import * as crypto from 'crypto';

@Injectable()
export class ViolenceReportsService {
  constructor(private readonly prisma: PrismaService) {}

  private generateReportCode(): string {
    const prefix = 'VR';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }

  async create(dto: CreateReportDto) {
    return this.prisma.violenceReport.create({
      data: {
        ...dto,
        reportCode: this.generateReportCode(),
        status: ReportStatus.RECEIVED,
      },
    });
  }

  async findAll(dto: PaginationDto): Promise<PaginatedResult<any>> {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 10;
    const skip = (page - 1) * limit;

    const where = { deletedAt: null };

    const [data, total] = await Promise.all([
      this.prisma.violenceReport.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          assignedProfessional: {
            select: { id: true, firstName: true, lastName: true, specialty: true },
          },
          assignedBy: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
      }),
      this.prisma.violenceReport.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      },
    };
  }

  async findById(id: string) {
    const report = await this.prisma.violenceReport.findFirst({
      where: { id, deletedAt: null },
      include: {
        assignedProfessional: {
          select: { id: true, firstName: true, lastName: true, specialty: true, photo: true },
        },
        assignedBy: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });

    if (!report) {
      throw new NotFoundException('Reporte no encontrado');
    }

    return report;
  }

  async update(id: string, dto: UpdateReportDto) {
    await this.findById(id);

    const data: any = { ...dto };
    if (dto.status === ReportStatus.CLOSED) {
      data.resolvedAt = new Date();
    }

    return this.prisma.violenceReport.update({
      where: { id },
      data,
      include: {
        assignedProfessional: {
          select: { id: true, firstName: true, lastName: true, specialty: true },
        },
      },
    });
  }

  async assignProfessional(id: string, professionalId: string, assignedById: string) {
    const report = await this.findById(id);

    const professional = await this.prisma.professional.findFirst({
      where: { id: professionalId, deletedAt: null },
    });

    if (!professional) {
      throw new NotFoundException('Profesional no encontrado');
    }

    return this.prisma.violenceReport.update({
      where: { id },
      data: {
        assignedProfessionalId: professionalId,
        assignedById,
        status: ReportStatus.DERIVED,
      },
      include: {
        assignedProfessional: {
          select: { id: true, firstName: true, lastName: true, specialty: true },
        },
      },
    });
  }
}
