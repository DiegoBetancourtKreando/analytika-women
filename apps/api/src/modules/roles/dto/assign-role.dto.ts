import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignRoleDto {
  @ApiProperty({ description: 'ID del usuario' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'ID del rol' })
  @IsString()
  roleId: string;
}
