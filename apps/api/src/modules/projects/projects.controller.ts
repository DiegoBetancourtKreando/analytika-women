import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nuevo proyecto' })
  async create(@Body() dto: CreateProjectDto) {
    return this.projectsService.create(dto);
  }

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener todos los proyectos (paginado)' })
  async findAll(@Query() dto: PaginationDto) {
    return this.projectsService.findAll(dto);
  }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener proyecto por ID' })
  async findById(@Param('id') id: string) {
    return this.projectsService.findById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar proyecto' })
  async update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projectsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar proyecto (soft delete)' })
  async remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }

  @Post(':id/evidences')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Agregar evidencia a proyecto' })
  async addEvidence(
    @Param('id') id: string,
    @Body() dto: { title: string; fileUrl: string; type: string },
  ) {
    return this.projectsService.addEvidence(id, dto);
  }

  @Delete(':id/evidences/:evidenceId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remover evidencia' })
  async removeEvidence(
    @Param('id') id: string,
    @Param('evidenceId') evidenceId: string,
  ) {
    return this.projectsService.removeEvidence(id, evidenceId);
  }

  @Patch(':id/indicators/:indicatorId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar valor de indicador' })
  async updateIndicator(
    @Param('id') id: string,
    @Param('indicatorId') indicatorId: string,
    @Body() dto: { currentValue: number },
  ) {
    return this.projectsService.updateIndicator(id, indicatorId, dto);
  }
}
