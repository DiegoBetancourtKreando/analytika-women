import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  IsDateString,
  IsObject,
  IsBoolean,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EventType, EventModality } from '@prisma/client';

export class CreateEventDto {
  @ApiProperty({ example: 'Conferencia de IA', description: 'Título del evento' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Descripción del evento' })
  @IsString()
  description: string;

  @ApiProperty({ enum: EventType, example: 'CONFERENCE', description: 'Tipo de evento' })
  @IsEnum(EventType)
  type: EventType;

  @ApiProperty({ enum: EventModality, example: 'VIRTUAL', description: 'Modalidad' })
  @IsEnum(EventModality)
  modality: EventModality;

  @ApiProperty({ example: '2026-08-15T09:00:00Z', description: 'Fecha de inicio' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2026-08-15T18:00:00Z', description: 'Fecha de fin' })
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional({ example: 'Auditorio Principal, Ciudad', description: 'Ubicación' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ example: 'https://zoom.us/j/123', description: 'Enlace virtual' })
  @IsOptional()
  @IsString()
  virtualLink?: string;

  @ApiProperty({ example: 100, description: 'Capacidad máxima' })
  @IsInt()
  @Min(1)
  capacity: number;

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

  @ApiProperty({ description: 'Etiquetas (JSON)' })
  @IsObject()
  tags: Record<string, any>;

  @ApiPropertyOptional({ example: true, description: '¿Es visible?' })
  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;
}
