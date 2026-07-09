import {
  IsString,
  IsOptional,
  IsDateString,
  IsBoolean,
  IsObject,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCertificateDto {
  @ApiProperty({ example: 'Certificado de Finalización', description: 'Título del certificado' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Ana Martínez', description: 'Nombre del destinatario' })
  @IsString()
  recipientName: string;

  @ApiProperty({ example: 'ana@example.com', description: 'Correo del destinatario' })
  @IsString()
  recipientEmail: string;

  @ApiPropertyOptional({ description: 'ID del curso asociado' })
  @IsOptional()
  @IsString()
  courseId?: string;

  @ApiPropertyOptional({ description: 'ID del evento asociado' })
  @IsOptional()
  @IsString()
  eventId?: string;

  @ApiProperty({ example: '2026-07-15', description: 'Fecha de emisión' })
  @IsDateString()
  issueDate: string;

  @ApiPropertyOptional({ example: '2027-07-15', description: 'Fecha de expiración' })
  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @ApiPropertyOptional({ example: true, description: '¿Es válido?' })
  @IsOptional()
  @IsBoolean()
  isValid?: boolean;

  @ApiProperty({ description: 'Metadatos adicionales (JSON)' })
  @IsObject()
  metadata: Record<string, any>;
}
