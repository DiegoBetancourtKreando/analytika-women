import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
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

  @Public() @Get()
  findAll() { return this.dynamicFormsService.findAll(); }

  @Public() @Get(':code')
  findByCode(@Param('code') code: string) { return this.dynamicFormsService.findByCode(code); }

  @Public() @Post(':code/submit')
  submit(@Param('code') code: string, @Body() body: any) {
    return this.dynamicFormsService.submit(code, body.data, body.metadata);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MANAGER') @Get(':code/submissions')
  getSubmissions(@Param('code') code: string, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.dynamicFormsService.getSubmissions(code, page ? +page : 1, limit ? +limit : 10);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN') @Post()
  createForm(@Body() body: { code: string; name: string; description?: string; icon?: string; config?: any }) {
    return this.dynamicFormsService.createForm(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN') @Patch(':code')
  updateForm(@Param('code') code: string, @Body() body: any) {
    return this.dynamicFormsService.updateForm(code, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN') @Delete(':code')
  deleteForm(@Param('code') code: string) {
    return this.dynamicFormsService.deleteForm(code);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN') @Post(':code/fields')
  addField(@Param('code') code: string, @Body() body: any) {
    return this.dynamicFormsService.addField(code, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MANAGER') @Patch(':code/fields/:fieldId')
  updateField(@Param('fieldId') fieldId: string, @Body() body: any) {
    return this.dynamicFormsService.updateField(fieldId, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN') @Delete(':code/fields/:fieldId')
  deleteField(@Param('fieldId') fieldId: string) {
    return this.dynamicFormsService.deleteField(fieldId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN') @Post('setup')
  setupDefaults() { return this.dynamicFormsService.setupDefaults(); }
}
