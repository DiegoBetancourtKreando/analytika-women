import {
  IsOptional,
  IsString,
  IsEnum,
  IsInt,
  IsDateString,
  IsObject,
  IsBoolean,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { EventType, EventModality, EventStatus } from '@prisma/client';

export class UpdateEventDto {
  @ApiPropertyOptional({ example: 'Conferencia de IA', description: 'Título del evento' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Descripción del evento' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: EventType, example: 'CONFERENCE', description: 'Tipo de evento' })
  @IsOptional()
  @IsEnum(EventType)
  type?: EventType;

  @ApiPropertyOptional({ enum: EventModality, example: 'VIRTUAL', description: 'Modalidad' })
  @IsOptional()
  @IsEnum(EventModality)
  modality?: EventModality;

  @ApiPropertyOptional({ enum: EventStatus, example: 'PUBLISHED', description: 'Estado' })
  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;

  @ApiPropertyOptional({ example: '2026-08-15T09:00:00Z', description: 'Fecha de inicio' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-08-15T18:00:00Z', description: 'Fecha de fin' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ example: 'Auditorio Principal, Ciudad', description: 'Ubicación' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ example: 'https://zoom.us/j/123', description: 'Enlace virtual' })
  @IsOptional()
  @IsString()
  virtualLink?: string;

  @ApiPropertyOptional({ example: 100, description: 'Capacidad máxima' })
  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;

  @ApiPropertyOptional({ description: 'ID del organizador' })
  @IsOptional()
  @IsString()
  organizerId?: string;

  @ApiPropertyOptional({ description: 'ID de la organización' })
  @IsOptional()
  @IsString()
  organizationId?: string;

  @ApiPropertyOptional({ example: true, description: '¿Es público?' })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiPropertyOptional({ description: 'Etiquetas (JSON)' })
  @IsOptional()
  @IsObject()
  tags?: Record<string, any>;

  @ApiPropertyOptional({ example: true, description: '¿Es visible?' })
  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;
}
