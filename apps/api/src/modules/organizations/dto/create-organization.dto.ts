import {
  IsString,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrganizationType } from '@prisma/client';

export class CreateOrganizationDto {
  @ApiProperty({ example: 'Fundación Mujeres Digitales', description: 'Nombre de la organización' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Descripción de la organización' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: OrganizationType, example: 'NGO', description: 'Tipo de organización' })
  @IsEnum(OrganizationType)
  type: OrganizationType;

  @ApiPropertyOptional({ example: 'https://example.com', description: 'Sitio web' })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({ example: 'contacto@example.com', description: 'Correo electrónico' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ example: '+521234567890', description: 'Teléfono' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'Calle Principal 123, Ciudad', description: 'Dirección' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'URL del logo' })
  @IsOptional()
  @IsString()
  logo?: string;
}
