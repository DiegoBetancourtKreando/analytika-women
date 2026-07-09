import {
  IsOptional,
  IsString,
  IsEnum,
  IsDateString,
  IsObject,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectArea, ProjectStatus } from '@prisma/client';

export class UpdateProjectDto {
  @ApiPropertyOptional({ example: 'Plataforma de capacitación digital', description: 'Título del proyecto' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Descripción del proyecto' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Objetivos del proyecto (JSON)' })
  @IsOptional()
  @IsObject()
  objectives?: Record<string, any>;

  @ApiPropertyOptional({ enum: ProjectArea, example: 'TECHNOLOGY', description: 'Área del proyecto' })
  @IsOptional()
  @IsEnum(ProjectArea)
  area?: ProjectArea;

  @ApiPropertyOptional({ enum: ProjectStatus, example: 'IN_PROGRESS', description: 'Estado del proyecto' })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @ApiPropertyOptional({ example: '2026-01-01', description: 'Fecha de inicio' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-12-31', description: 'Fecha de fin' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ example: 'Cliente S.A.', description: 'Nombre del cliente' })
  @IsOptional()
  @IsString()
  clientName?: string;

  @ApiPropertyOptional({ description: 'ID de la organización' })
  @IsOptional()
  @IsString()
  organizationId?: string;

  @ApiPropertyOptional({ description: 'ID del cliente' })
  @IsOptional()
  @IsString()
  clientId?: string;
}
