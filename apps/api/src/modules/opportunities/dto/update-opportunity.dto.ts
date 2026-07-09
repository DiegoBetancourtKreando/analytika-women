import {
  IsOptional,
  IsString,
  IsEnum,
  IsDateString,
  IsObject,
  IsEmail,
  IsBoolean,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { OpportunityType, OpportunityModality, OpportunityStatus } from '@prisma/client';

export class UpdateOpportunityDto {
  @ApiPropertyOptional({ example: 'Beca de desarrollo tecnológico', description: 'Título de la oportunidad' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Descripción de la oportunidad' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: OpportunityType, example: 'SCHOLARSHIP', description: 'Tipo de oportunidad' })
  @IsOptional()
  @IsEnum(OpportunityType)
  type?: OpportunityType;

  @ApiPropertyOptional({ enum: OpportunityModality, example: 'VIRTUAL', description: 'Modalidad' })
  @IsOptional()
  @IsEnum(OpportunityModality)
  modality?: OpportunityModality;

  @ApiPropertyOptional({ enum: OpportunityStatus, example: 'OPEN', description: 'Estado' })
  @IsOptional()
  @IsEnum(OpportunityStatus)
  status?: OpportunityStatus;

  @ApiPropertyOptional({ example: '2026-12-31', description: 'Fecha límite de postulación' })
  @IsOptional()
  @IsDateString()
  applicationDeadline?: string;

  @ApiPropertyOptional({ description: 'Requisitos (JSON)' })
  @IsOptional()
  @IsObject()
  requirements?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Beneficios (JSON)' })
  @IsOptional()
  @IsObject()
  benefits?: Record<string, any>;

  @ApiPropertyOptional({ example: 'contacto@example.com', description: 'Correo de contacto' })
  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @ApiPropertyOptional({ description: 'ID de la organización' })
  @IsOptional()
  @IsString()
  organizationId?: string;

  @ApiPropertyOptional({ example: true, description: '¿Está activa?' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
