import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ example: 'MANAGER', description: 'Nombre del rol' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Rol de gestión administrativa', description: 'Descripción del rol' })
  @IsOptional()
  @IsString()
  description?: string;
}
