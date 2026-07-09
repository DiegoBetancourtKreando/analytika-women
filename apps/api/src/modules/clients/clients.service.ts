import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { PaginationDto, PaginatedResult } from '../../common/dto/pagination.dto';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateClientDto) {
    const existing = await this.prisma.client.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new BadRequestException('El correo electrónico ya está registrado como cliente');
    }

    return this.prisma.client.create({
      data: dto,
    });
  }

  async findAll(dto: PaginationDto): Promise<PaginatedResult<any>> {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 10;
    const skip = (page - 1) * limit;

    const where = { deletedAt: null };

    const [data, total] = await Promise.all([
      this.prisma.client.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { projects: true },
          },
        },
      }),
      this.prisma.client.count({ where }),
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
    const client = await this.prisma.client.findFirst({
      where: { id, deletedAt: null },
      include: {
        projects: true,
        _count: {
          select: { projects: true },
        },
      },
    });

    if (!client) {
      throw new NotFoundException('Cliente no encontrado');
    }

    return client;
  }

  async update(id: string, dto: UpdateClientDto) {
    await this.findById(id);

    return this.prisma.client.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.findById(id);

    await this.prisma.client.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: 'Cliente eliminado correctamente' };
  }
}
