import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener todas las configuraciones' })
  async findAll() {
    return this.settingsService.findAll();
  }

  @Get('flags')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener feature flags' })
  async getFeatureFlags() {
    return this.settingsService.getFeatureFlags();
  }

  @Put(':key')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar configuración por clave' })
  async update(@Param('key') key: string, @Body() body: { value: any }) {
    return this.settingsService.update(key, body.value);
  }
}
