import {
  IsOptional,
  IsString,
  IsEnum,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ReportStatus, ViolenceLevel } from '@prisma/client';

export class UpdateReportDto {
  @ApiPropertyOptional({ enum: ReportStatus, description: 'Estado del reporte' })
  @IsOptional()
  @IsEnum(ReportStatus)
  status?: ReportStatus;

  @ApiPropertyOptional({ enum: ViolenceLevel, description: 'Nivel de violencia' })
  @IsOptional()
  @IsEnum(ViolenceLevel)
  level?: ViolenceLevel;

  @ApiPropertyOptional({ description: 'Notas de resolución' })
  @IsOptional()
  @IsString()
  resolutionNotes?: string;

  @ApiPropertyOptional({ description: 'ID del profesional asignado' })
  @IsOptional()
  @IsString()
  assignedProfessionalId?: string;
}
