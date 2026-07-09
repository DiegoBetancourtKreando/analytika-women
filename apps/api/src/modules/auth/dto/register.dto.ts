import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com', description: 'Correo electrónico' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Contraseña', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'María', description: 'Nombre(s)' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'García López', description: 'Apellido(s)' })
  @IsString()
  lastName: string;

  @ApiPropertyOptional({ example: '+521234567890', description: 'Teléfono' })
  @IsOptional()
  @IsString()
  phone?: string;
}
