import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { PaginationDto, PaginatedResult } from '../../common/dto/pagination.dto';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import * as crypto from 'crypto';

@Injectable()
export class CertificatesService {
  constructor(private readonly prisma: PrismaService) {}

  private generateCode(): string {
    const prefix = 'CERT';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = crypto.randomBytes(4).toString('hex').toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }

  private generateQRDataUrl(code: string): string {
    const baseUrl = process.env.APP_URL || 'https://analytika.app';
    return `${baseUrl}/certificates/verify/${code}`;
  }

  async create(dto: CreateCertificateDto) {
    const code = this.generateCode();
    const qrCode = this.generateQRDataUrl(code);

    return this.prisma.certificate.create({
      data: {
        ...dto,
        code,
        qrCode,
        issueDate: new Date(dto.issueDate),
        expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : null,
      },
      include: {
        course: {
          select: { id: true, title: true },
        },
        event: {
          select: { id: true, title: true },
        },
      },
    });
  }

  async findAll(dto: PaginationDto): Promise<PaginatedResult<any>> {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 10;
    const skip = (page - 1) * limit;

    const where = {};

    const [data, total] = await Promise.all([
      this.prisma.certificate.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          course: {
            select: { id: true, title: true },
          },
          event: {
            select: { id: true, title: true },
          },
        },
      }),
      this.prisma.certificate.count({ where }),
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

  async findByCode(code: string) {
    const certificate = await this.prisma.certificate.findUnique({
      where: { code },
      include: {
        course: {
          select: { id: true, title: true },
        },
        event: {
          select: { id: true, title: true },
        },
      },
    });

    if (!certificate) {
      throw new NotFoundException('Certificado no encontrado');
    }

    return {
      isValid: certificate.isValid,
      certificate: {
        title: certificate.title,
        recipientName: certificate.recipientName,
        recipientEmail: certificate.recipientEmail,
        issueDate: certificate.issueDate,
        expiryDate: certificate.expiryDate,
        code: certificate.code,
        course: certificate.course,
        event: certificate.event,
      },
    };
  }

  async verify(code: string) {
    try {
      const result = await this.findByCode(code);
      return {
        valid: result.isValid,
        ...result,
      };
    } catch (error) {
      return {
        valid: false,
        message: 'Certificado no encontrado o inválido',
      };
    }
  }
}
