import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.systemSetting.findMany({
      orderBy: { category: 'asc' },
    });
  }

  async findByKey(key: string) {
    const setting = await this.prisma.systemSetting.findUnique({
      where: { key },
    });

    if (!setting) {
      throw new NotFoundException(`Configuración '${key}' no encontrada`);
    }

    return setting;
  }

  async update(key: string, value: any) {
    const existing = await this.prisma.systemSetting.findUnique({
      where: { key },
    });

    if (!existing) {
      throw new NotFoundException(`Configuración '${key}' no encontrada`);
    }

    return this.prisma.systemSetting.update({
      where: { key },
      data: { value },
    });
  }

  async getFeatureFlags() {
    const flags = await this.prisma.featureFlag.findMany({
      orderBy: { name: 'asc' },
    });

    return flags.map((flag) => ({
      code: flag.code,
      name: flag.name,
      description: flag.description,
      isEnabled: flag.isEnabled,
    }));
  }
}
