import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { PaginationDto, PaginatedResult } from '../../common/dto/pagination.dto';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrganizationType } from '@prisma/client';

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateOrganizationDto) {
    return this.prisma.organization.create({
      data: dto,
    });
  }

  async findAll(
    dto: PaginationDto,
    type?: OrganizationType,
  ): Promise<PaginatedResult<any>> {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };
    if (type) {
      where.type = type;
    }

    const [data, total] = await Promise.all([
      this.prisma.organization.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.organization.count({ where }),
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
    const organization = await this.prisma.organization.findFirst({
      where: { id, deletedAt: null },
    });

    if (!organization) {
      throw new NotFoundException('Organización no encontrada');
    }

    return organization;
  }

  async update(id: string, dto: UpdateOrganizationDto) {
    await this.findById(id);

    return this.prisma.organization.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.findById(id);

    await this.prisma.organization.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: 'Organización eliminada correctamente' };
  }
}
