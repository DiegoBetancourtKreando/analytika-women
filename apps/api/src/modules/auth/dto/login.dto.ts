import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com', description: 'Correo electrónico' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Contraseña', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;
}
