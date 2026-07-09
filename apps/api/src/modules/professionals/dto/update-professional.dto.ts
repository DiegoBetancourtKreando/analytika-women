import {
  IsOptional,
  IsString,
  IsEmail,
  IsInt,
  IsBoolean,
  IsEnum,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ProfessionalSpecialty } from '@prisma/client';

export class UpdateProfessionalDto {
  @ApiPropertyOptional({ example: 'Ana', description: 'Nombre(s)' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Martínez Ruiz', description: 'Apellido(s)' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ example: 'ana.martinez@example.com', description: 'Correo electrónico' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '+521234567890', description: 'Teléfono' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ enum: ProfessionalSpecialty, example: 'PSYCHOLOGIST', description: 'Especialidad' })
  @IsOptional()
  @IsEnum(ProfessionalSpecialty)
  specialty?: ProfessionalSpecialty;

  @ApiPropertyOptional({ description: 'Biografía' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ example: 5, description: 'Años de experiencia' })
  @IsOptional()
  @IsInt()
  @Min(0)
  experience?: number;

  @ApiPropertyOptional({ example: true, description: '¿Está activo?' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: false, description: '¿Es miembro del equipo?' })
  @IsOptional()
  @IsBoolean()
  isTeamMember?: boolean;

  @ApiPropertyOptional({ description: 'URL de la foto' })
  @IsOptional()
  @IsString()
  photo?: string;
}
