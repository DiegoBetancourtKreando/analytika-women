import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  IsObject,
  IsEmail,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OpportunityType, OpportunityModality } from '@prisma/client';

export class CreateOpportunityDto {
  @ApiProperty({ example: 'Beca de desarrollo tecnológico', description: 'Título de la oportunidad' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Descripción de la oportunidad' })
  @IsString()
  description: string;

  @ApiProperty({ enum: OpportunityType, example: 'SCHOLARSHIP', description: 'Tipo de oportunidad' })
  @IsEnum(OpportunityType)
  type: OpportunityType;

  @ApiPropertyOptional({ enum: OpportunityModality, example: 'VIRTUAL', description: 'Modalidad' })
  @IsOptional()
  @IsEnum(OpportunityModality)
  modality?: OpportunityModality;

  @ApiPropertyOptional({ example: '2026-12-31', description: 'Fecha límite de postulación' })
  @IsOptional()
  @IsDateString()
  applicationDeadline?: string;

  @ApiProperty({ description: 'Requisitos (JSON)' })
  @IsObject()
  requirements: Record<string, any>;

  @ApiPropertyOptional({ description: 'Beneficios (JSON)' })
  @IsOptional()
  @IsObject()
  benefits?: Record<string, any>;

  @ApiProperty({ example: 'contacto@example.com', description: 'Correo de contacto' })
  @IsEmail()
  contactEmail: string;

  @ApiPropertyOptional({ description: 'ID de la organización' })
  @IsOptional()
  @IsString()
  organizationId?: string;

  @ApiPropertyOptional({ example: true, description: '¿Está activa?' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
