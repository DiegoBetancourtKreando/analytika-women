import {
  IsString,
  IsOptional,
  IsEmail,
  IsBoolean,
  IsEnum,
  IsObject,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ViolenceLevel } from '@prisma/client';

export class CreateReportDto {
  @ApiPropertyOptional({ example: 'María López', description: 'Nombre de quien reporta' })
  @IsOptional()
  @IsString()
  reporterName?: string;

  @ApiPropertyOptional({ example: 'maria@example.com', description: 'Correo de quien reporta' })
  @IsOptional()
  @IsEmail()
  reporterEmail?: string;

  @ApiPropertyOptional({ example: '+521234567890', description: 'Teléfono de quien reporta' })
  @IsOptional()
  @IsString()
  reporterPhone?: string;

  @ApiProperty({ example: false, description: '¿Es anónimo?' })
  @IsBoolean()
  isAnonymous: boolean;

  @ApiProperty({ description: 'Tipo(s) de violencia (JSON array)' })
  @IsObject()
  violenceType: Record<string, any>;

  @ApiProperty({ example: 'Descripción detallada del incidente...', description: 'Descripción del reporte' })
  @IsString()
  description: string;

  @ApiProperty({ enum: ViolenceLevel, example: 'MODERATE', description: 'Nivel de violencia' })
  @IsEnum(ViolenceLevel)
  level: ViolenceLevel;

  @ApiPropertyOptional({ example: true, description: '¿Desea derivación?' })
  @IsOptional()
  @IsBoolean()
  wantsReferral?: boolean;

  @ApiPropertyOptional({ description: 'Especialidad para derivación' })
  @IsOptional()
  @IsString()
  referralSpecialty?: string;

  @ApiProperty({ description: 'Evidencias (JSON)' })
  @IsObject()
  evidence: Record<string, any>;
}
