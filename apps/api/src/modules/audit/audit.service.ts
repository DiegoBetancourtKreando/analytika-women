import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { PaginationDto, PaginatedResult } from '../../common/dto/pagination.dto';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string | undefined,
    action: string,
    entity: string,
    entityId?: string,
    oldValue?: Record<string, any>,
    newValue?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string,
  ) {
    return this.prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId,
        oldValue: oldValue ?? undefined,
        newValue: newValue ?? undefined,
        ipAddress,
        userAgent,
      },
    });
  }

  async findAll(dto: PaginationDto): Promise<PaginatedResult<any>> {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
        },
      }),
      this.prisma.auditLog.count(),
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
}
