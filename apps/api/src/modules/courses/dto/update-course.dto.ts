import {
  IsOptional,
  IsString,
  IsEnum,
  IsInt,
  IsDateString,
  IsObject,
  IsBoolean,
  IsNumber,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CourseModality, CourseStatus } from '@prisma/client';

export class UpdateCourseDto {
  @ApiPropertyOptional({ example: 'Introducción a la programación', description: 'Título del curso' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Descripción del curso' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: CourseModality, example: 'VIRTUAL', description: 'Modalidad' })
  @IsOptional()
  @IsEnum(CourseModality)
  modality?: CourseModality;

  @ApiPropertyOptional({ enum: CourseStatus, example: 'PUBLISHED', description: 'Estado del curso' })
  @IsOptional()
  @IsEnum(CourseStatus)
  status?: CourseStatus;

  @ApiPropertyOptional({ example: 40, description: 'Duración en horas' })
  @IsOptional()
  @IsInt()
  @Min(1)
  duration?: number;

  @ApiPropertyOptional({ example: 'hours', description: 'Unidad de duración' })
  @IsOptional()
  @IsString()
  durationUnit?: string;

  @ApiPropertyOptional({ example: 199.99, description: 'Precio' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ example: 30, description: 'Capacidad máxima' })
  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;

  @ApiPropertyOptional({ example: '2026-08-01', description: 'Fecha de inicio' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-09-30', description: 'Fecha de fin' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Plan de estudios (JSON)' })
  @IsOptional()
  @IsObject()
  syllabus?: Record<string, any>;

  @ApiPropertyOptional({ description: 'ID del instructor' })
  @IsOptional()
  @IsString()
  instructorId?: string;

  @ApiPropertyOptional({ example: false, description: '¿Otorga certificación?' })
  @IsOptional()
  @IsBoolean()
  hasCertification?: boolean;

  @ApiPropertyOptional({ example: false, description: '¿Es visible?' })
  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;
}
