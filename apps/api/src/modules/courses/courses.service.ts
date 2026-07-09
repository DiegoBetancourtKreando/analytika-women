import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { PaginationDto, PaginatedResult } from '../../common/dto/pagination.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCourseDto) {
    return this.prisma.course.create({
      data: {
        ...dto,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        syllabus: dto.syllabus ?? {},
      },
      include: {
        instructor: true,
      },
    });
  }

  async findAll(dto: PaginationDto): Promise<PaginatedResult<any>> {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 10;
    const skip = (page - 1) * limit;

    const where = { deletedAt: null };

    const [data, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          instructor: {
            select: { id: true, firstName: true, lastName: true, specialty: true },
          },
          _count: {
            select: { enrollments: true },
          },
        },
      }),
      this.prisma.course.count({ where }),
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
    const course = await this.prisma.course.findFirst({
      where: { id, deletedAt: null },
      include: {
        instructor: {
          select: { id: true, firstName: true, lastName: true, specialty: true, photo: true },
        },
        enrollments: true,
      },
    });

    if (!course) {
      throw new NotFoundException('Curso no encontrado');
    }

    return course;
  }

  async update(id: string, dto: UpdateCourseDto) {
    await this.findById(id);

    const data: any = { ...dto };
    if (dto.startDate) data.startDate = new Date(dto.startDate);
    if (dto.endDate) data.endDate = new Date(dto.endDate);

    return this.prisma.course.update({
      where: { id },
      data,
      include: {
        instructor: true,
      },
    });
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.findById(id);

    await this.prisma.course.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: 'Curso eliminado correctamente' };
  }

  async enrollStudent(courseId: string, dto: {
    email: string;
    fullName: string;
    phone?: string;
    userId?: string;
  }) {
    const course = await this.findById(courseId);

    if (course.enrolledCount >= course.capacity) {
      throw new BadRequestException('El curso ha alcanzado su capacidad máxima');
    }

    const existingEnrollment = await this.prisma.courseEnrollment.findFirst({
      where: { courseId, email: dto.email },
    });

    if (existingEnrollment) {
      throw new BadRequestException('El correo electrónico ya está inscrito en este curso');
    }

    const enrollment = await this.prisma.courseEnrollment.create({
      data: {
        courseId,
        ...dto,
      },
    });

    await this.prisma.course.update({
      where: { id: courseId },
      data: { enrolledCount: { increment: 1 } },
    });

    return enrollment;
  }

  async getEnrollments(courseId: string) {
    await this.findById(courseId);

    return this.prisma.courseEnrollment.findMany({
      where: { courseId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
