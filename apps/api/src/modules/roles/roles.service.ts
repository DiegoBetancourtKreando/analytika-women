import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.role.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
    });

    if (!role) {
      throw new NotFoundException('Rol no encontrado');
    }

    return role;
  }

  async create(dto: CreateRoleDto) {
    const existing = await this.prisma.role.findUnique({
      where: { name: dto.name },
    });

    if (existing) {
      throw new ConflictException('El rol ya existe');
    }

    return this.prisma.role.create({
      data: dto,
    });
  }

  async assignRoleToUser(userId: string, roleId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const role = await this.prisma.role.findUnique({
      where: { id: roleId },
    });

    if (!role) {
      throw new NotFoundException('Rol no encontrado');
    }

    const existingAssignment = await this.prisma.userRoleAssignment.findUnique({
      where: {
        userId_roleId: { userId, roleId },
      },
    });

    if (existingAssignment) {
      throw new ConflictException('El usuario ya tiene asignado este rol');
    }

    return this.prisma.userRoleAssignment.create({
      data: { userId, roleId },
      include: {
        role: true,
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async removeRoleFromUser(userId: string, roleId: string): Promise<{ message: string }> {
    const assignment = await this.prisma.userRoleAssignment.findUnique({
      where: {
        userId_roleId: { userId, roleId },
      },
    });

    if (!assignment) {
      throw new NotFoundException('La asignación de rol no existe');
    }

    await this.prisma.userRoleAssignment.delete({
      where: {
        userId_roleId: { userId, roleId },
      },
    });

    return { message: 'Rol removido del usuario correctamente' };
  }
}
