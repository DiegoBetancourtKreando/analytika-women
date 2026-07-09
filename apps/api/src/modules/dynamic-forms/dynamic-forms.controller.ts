import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { DynamicFormsService } from './dynamic-forms.service';

@ApiTags('Dynamic Forms')
@Controller('forms')
export class DynamicFormsController {
  constructor(private readonly dynamicFormsService: DynamicFormsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar todos los formularios activos' })
  findAll() {
    return this.dynamicFormsService.findAll();
  }

  @Public()
  @Get(':code')
  @ApiOperation({ summary: 'Obtener configuración de un formulario' })
  findByCode(@Param('code') code: string) {
    return this.dynamicFormsService.findByCode(code);
  }

  @Public()
  @Post(':code/submit')
  @ApiOperation({ summary: 'Enviar respuesta de un formulario' })
  submit(
    @Param('code') code: string,
    @Body() body: { data: Record<string, unknown>; metadata?: Record<string, unknown> },
  ) {
    return this.dynamicFormsService.submit(code, body.data, body.metadata);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  @Get(':code/submissions')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar respuestas de un formulario' })
  getSubmissions(
    @Param('code') code: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.dynamicFormsService.getSubmissions(
      code,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  @Patch(':code/fields/:fieldId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar estado de un campo' })
  updateField(
    @Param('fieldId') fieldId: string,
    @Body() body: { isActive?: boolean },
  ) {
    return this.dynamicFormsService.updateField(fieldId, body);
  }
}
