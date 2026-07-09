import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ViolenceReportsService } from './violence-reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CurrentUserPayload } from '../../common/decorators/current-user.decorator';

@ApiTags('Violence Reports')
@Controller()
export class ViolenceReportsController {
  constructor(private readonly violenceReportsService: ViolenceReportsService) {}

  @Public()
  @Post('violence-reports')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear reporte de violencia (público)' })
  async create(@Body() dto: CreateReportDto) {
    return this.violenceReportsService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('violence-reports')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener todos los reportes (paginado)' })
  async findAll(@Query() dto: PaginationDto) {
    return this.violenceReportsService.findAll(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('violence-reports/:id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener reporte por ID' })
  async findById(@Param('id') id: string) {
    return this.violenceReportsService.findById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  @Patch('violence-reports/:id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar reporte (estado/asignación)' })
  async update(@Param('id') id: string, @Body() dto: UpdateReportDto) {
    return this.violenceReportsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('violence-reports/:id/assign')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Asignar profesional a reporte' })
  async assignProfessional(
    @Param('id') id: string,
    @Body() body: { professionalId: string },
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.violenceReportsService.assignProfessional(id, body.professionalId, user.id);
  }
}
