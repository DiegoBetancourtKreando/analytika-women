import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get('roles')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener todos los roles' })
  async findAll() {
    return this.rolesService.findAll();
  }

  @Post('roles')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo rol' })
  async create(@Body() dto: CreateRoleDto) {
    return this.rolesService.create(dto);
  }

  @Post('roles/assign')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Asignar rol a usuario' })
  async assignRole(@Body() dto: AssignRoleDto) {
    return this.rolesService.assignRoleToUser(dto.userId, dto.roleId);
  }

  @Delete('roles/:roleId/users/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remover rol de usuario' })
  async removeRole(
    @Param('roleId') roleId: string,
    @Param('userId') userId: string,
  ) {
    return this.rolesService.removeRoleFromUser(userId, roleId);
  }
}
