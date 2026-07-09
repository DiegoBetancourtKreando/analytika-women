import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { PaginationDto, PaginatedResult } from '../../common/dto/pagination.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        ...dto,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        objectives: dto.objectives ?? {},
      },
      include: {
        evidences: true,
        indicators: true,
        organization: true,
        client: true,
      },
    });
  }

  async findAll(dto: PaginationDto): Promise<PaginatedResult<any>> {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 10;
    const skip = (page - 1) * limit;

    const where = { deletedAt: null };

    const [data, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { evidences: true, indicators: true },
          },
          organization: {
            select: { id: true, name: true },
          },
        },
      }),
      this.prisma.project.count({ where }),
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
    const project = await this.prisma.project.findFirst({
      where: { id, deletedAt: null },
      include: {
        evidences: true,
        indicators: true,
        organization: true,
        client: true,
      },
    });

    if (!project) {
      throw new NotFoundException('Proyecto no encontrado');
    }

    return project;
  }

  async update(id: string, dto: UpdateProjectDto) {
    await this.findById(id);

    const data: any = { ...dto };
    if (dto.startDate) data.startDate = new Date(dto.startDate);
    if (dto.endDate) data.endDate = new Date(dto.endDate);

    return this.prisma.project.update({
      where: { id },
      data,
      include: {
        evidences: true,
        indicators: true,
        organization: true,
        client: true,
      },
    });
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.findById(id);

    await this.prisma.project.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: 'Proyecto eliminado correctamente' };
  }

  async addEvidence(projectId: string, dto: {
    title: string;
    fileUrl: string;
    type: string;
  }) {
    await this.findById(projectId);

    return this.prisma.projectEvidence.create({
      data: {
        projectId,
        ...dto,
      },
    });
  }

  async removeEvidence(projectId: string, evidenceId: string): Promise<{ message: string }> {
    const evidence = await this.prisma.projectEvidence.findFirst({
      where: { id: evidenceId, projectId },
    });

    if (!evidence) {
      throw new NotFoundException('Evidencia no encontrada');
    }

    await this.prisma.projectEvidence.delete({
      where: { id: evidenceId },
    });

    return { message: 'Evidencia eliminada correctamente' };
  }

  async updateIndicator(projectId: string, indicatorId: string, dto: { currentValue: number }) {
    await this.findById(projectId);

    const indicator = await this.prisma.projectIndicator.findFirst({
      where: { id: indicatorId, projectId },
    });

    if (!indicator) {
      throw new NotFoundException('Indicador no encontrado');
    }

    return this.prisma.projectIndicator.update({
      where: { id: indicatorId },
      data: { currentValue: dto.currentValue },
    });
  }
}
