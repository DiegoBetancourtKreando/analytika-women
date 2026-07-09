import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { PaginationDto, PaginatedResult } from '../../common/dto/pagination.dto';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateEventDto) {
    return this.prisma.event.create({
      data: {
        ...dto,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        tags: dto.tags ?? {},
      },
      include: {
        organizer: {
          select: { id: true, firstName: true, lastName: true },
        },
        organization: {
          select: { id: true, name: true },
        },
      },
    });
  }

  async findAll(dto: PaginationDto): Promise<PaginatedResult<any>> {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 10;
    const skip = (page - 1) * limit;

    const where = { deletedAt: null };

    const [data, total] = await Promise.all([
      this.prisma.event.findMany({
        where,
        skip,
        take: limit,
        orderBy: { startDate: 'desc' },
        include: {
          organizer: {
            select: { id: true, firstName: true, lastName: true },
          },
          organization: {
            select: { id: true, name: true },
          },
          _count: {
            select: { registrations: true },
          },
        },
      }),
      this.prisma.event.count({ where }),
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
    const event = await this.prisma.event.findFirst({
      where: { id, deletedAt: null },
      include: {
        organizer: {
          select: { id: true, firstName: true, lastName: true, avatar: true },
        },
        organization: {
          select: { id: true, name: true, logo: true },
        },
        registrations: true,
      },
    });

    if (!event) {
      throw new NotFoundException('Evento no encontrado');
    }

    return event;
  }

  async update(id: string, dto: UpdateEventDto) {
    await this.findById(id);

    const data: any = { ...dto };
    if (dto.startDate) data.startDate = new Date(dto.startDate);
    if (dto.endDate) data.endDate = new Date(dto.endDate);

    return this.prisma.event.update({
      where: { id },
      data,
      include: {
        organizer: {
          select: { id: true, firstName: true, lastName: true },
        },
        organization: {
          select: { id: true, name: true },
        },
      },
    });
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.findById(id);

    await this.prisma.event.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: 'Evento eliminado correctamente' };
  }

  async register(eventId: string, dto: {
    email: string;
    fullName: string;
    phone?: string;
    userId?: string;
  }) {
    const event = await this.findById(eventId);

    if (event.registeredCount >= event.capacity) {
      throw new BadRequestException('El evento ha alcanzado su capacidad máxima');
    }

    const existingRegistration = await this.prisma.eventRegistration.findFirst({
      where: { eventId, email: dto.email },
    });

    if (existingRegistration) {
      throw new BadRequestException('El correo electrónico ya está registrado en este evento');
    }

    const registration = await this.prisma.eventRegistration.create({
      data: {
        eventId,
        ...dto,
      },
    });

    await this.prisma.event.update({
      where: { id: eventId },
      data: { registeredCount: { increment: 1 } },
    });

    return registration;
  }

  async getRegistrations(eventId: string) {
    await this.findById(eventId);

    return this.prisma.eventRegistration.findMany({
      where: { eventId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
