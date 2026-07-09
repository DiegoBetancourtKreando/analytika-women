import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { PaginationDto, PaginatedResult } from '../../common/dto/pagination.dto';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';
import { OpportunityType, OpportunityStatus } from '@prisma/client';

@Injectable()
export class OpportunitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateOpportunityDto) {
    return this.prisma.opportunity.create({
      data: {
        ...dto,
        applicationDeadline: dto.applicationDeadline
          ? new Date(dto.applicationDeadline)
          : null,
      },
      include: {
        organization: {
          select: { id: true, name: true },
        },
      },
    });
  }

  async findAll(
    dto: PaginationDto,
    type?: OpportunityType,
    status?: OpportunityStatus,
  ): Promise<PaginatedResult<any>> {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };
    if (type) where.type = type;
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      this.prisma.opportunity.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          organization: {
            select: { id: true, name: true, logo: true },
          },
        },
      }),
      this.prisma.opportunity.count({ where }),
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
    const opportunity = await this.prisma.opportunity.findFirst({
      where: { id, deletedAt: null },
      include: {
        organization: {
          select: { id: true, name: true, logo: true, website: true },
        },
      },
    });

    if (!opportunity) {
      throw new NotFoundException('Oportunidad no encontrada');
    }

    return opportunity;
  }

  async update(id: string, dto: UpdateOpportunityDto) {
    await this.findById(id);

    const data: any = { ...dto };
    if (dto.applicationDeadline) {
      data.applicationDeadline = new Date(dto.applicationDeadline);
    }

    return this.prisma.opportunity.update({
      where: { id },
      data,
      include: {
        organization: {
          select: { id: true, name: true },
        },
      },
    });
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.findById(id);

    await this.prisma.opportunity.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: 'Oportunidad eliminada correctamente' };
  }
}
