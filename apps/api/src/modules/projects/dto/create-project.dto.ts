import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  IsObject,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectArea } from '@prisma/client';

export class CreateProjectDto {
  @ApiProperty({ example: 'Plataforma de capacitación digital', description: 'Título del proyecto' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Descripción del proyecto' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Objetivos del proyecto (JSON)' })
  @IsObject()
  objectives: Record<string, any>;

  @ApiProperty({ enum: ProjectArea, example: 'TECHNOLOGY', description: 'Área del proyecto' })
  @IsEnum(ProjectArea)
  area: ProjectArea;

  @ApiProperty({ example: '2026-01-01', description: 'Fecha de inicio' })
  @IsDateString()
  startDate: string;

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
