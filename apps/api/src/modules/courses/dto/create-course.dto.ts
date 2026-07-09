import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  IsDateString,
  IsObject,
  IsBoolean,
  IsNumber,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CourseModality } from '@prisma/client';

export class CreateCourseDto {
  @ApiProperty({ example: 'Introducción a la programación', description: 'Título del curso' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Descripción del curso' })
  @IsString()
  description: string;

  @ApiProperty({ enum: CourseModality, example: 'VIRTUAL', description: 'Modalidad' })
  @IsEnum(CourseModality)
  modality: CourseModality;

  @ApiProperty({ example: 40, description: 'Duración en horas' })
  @IsInt()
  @Min(1)
  duration: number;

  @ApiProperty({ example: 'hours', description: 'Unidad de duración' })
  @IsString()
  durationUnit: string;

  @ApiPropertyOptional({ example: 199.99, description: 'Precio' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiProperty({ example: 30, description: 'Capacidad máxima' })
  @IsInt()
  @Min(1)
  capacity: number;

  @ApiProperty({ example: '2026-08-01', description: 'Fecha de inicio' })
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional({ example: '2026-09-30', description: 'Fecha de fin' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ description: 'Plan de estudios (JSON)' })
  @IsObject()
  syllabus: Record<string, any>;

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
