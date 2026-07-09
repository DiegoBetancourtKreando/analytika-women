import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { PaginationDto, PaginatedResult } from '../../common/dto/pagination.dto';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';

@Injectable()
export class ProfessionalsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProfessionalDto) {
    const existing = await this.prisma.professional.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new BadRequestException('El correo electrónico ya está registrado como profesional');
    }

    return this.prisma.professional.create({
      data: dto,
      include: {
        certifications: true,
        publications: true,
      },
    });
  }

  async findAll(dto: PaginationDto): Promise<PaginatedResult<any>> {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 10;
    const skip = (page - 1) * limit;

    const where = { deletedAt: null };

    const [data, total] = await Promise.all([
      this.prisma.professional.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          certifications: true,
          publications: true,
          _count: {
            select: { assignedReports: true, courses: true },
          },
        },
      }),
      this.prisma.professional.count({ where }),
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
    const professional = await this.prisma.professional.findFirst({
      where: { id, deletedAt: null },
      include: {
        certifications: true,
        publications: true,
        _count: {
          select: { assignedReports: true, courses: true },
        },
      },
    });

    if (!professional) {
      throw new NotFoundException('Profesional no encontrado');
    }

    return professional;
  }

  async update(id: string, dto: UpdateProfessionalDto) {
    await this.findById(id);

    return this.prisma.professional.update({
      where: { id },
      data: dto,
      include: {
        certifications: true,
        publications: true,
      },
    });
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.findById(id);

    await this.prisma.professional.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: 'Profesional eliminado correctamente' };
  }

  async addCertification(professionalId: string, dto: {
    name: string;
    issuer: string;
    year: number;
    expirationYear?: number;
    fileUrl?: string;
  }) {
    await this.findById(professionalId);

    return this.prisma.certification.create({
      data: {
        professionalId,
        ...dto,
      },
    });
  }

  async removeCertification(professionalId: string, certificationId: string): Promise<{ message: string }> {
    const certification = await this.prisma.certification.findFirst({
      where: { id: certificationId, professionalId },
    });

    if (!certification) {
      throw new NotFoundException('Certificación no encontrada');
    }

    await this.prisma.certification.delete({
      where: { id: certificationId },
    });

    return { message: 'Certificación eliminada correctamente' };
  }

  async addPublication(professionalId: string, dto: {
    title: string;
    publisher: string;
    year: number;
    url?: string;
    doi?: string;
  }) {
    await this.findById(professionalId);

    return this.prisma.publication.create({
      data: {
        professionalId,
        ...dto,
      },
    });
  }

  async removePublication(professionalId: string, publicationId: string): Promise<{ message: string }> {
    const publication = await this.prisma.publication.findFirst({
      where: { id: publicationId, professionalId },
    });

    if (!publication) {
      throw new NotFoundException('Publicación no encontrada');
    }

    await this.prisma.publication.delete({
      where: { id: publicationId },
    });

    return { message: 'Publicación eliminada correctamente' };
  }
}
