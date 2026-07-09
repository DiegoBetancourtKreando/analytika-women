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
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { OpportunitiesService } from './opportunities.service';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { OpportunityType, OpportunityStatus } from '@prisma/client';

@ApiTags('Opportunities')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('opportunities')
export class OpportunitiesController {
  constructor(private readonly opportunitiesService: OpportunitiesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nueva oportunidad' })
  async create(@Body() dto: CreateOpportunityDto) {
    return this.opportunitiesService.create(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener todas las oportunidades (paginado)' })
  @ApiQuery({ name: 'type', enum: OpportunityType, required: false })
  @ApiQuery({ name: 'status', enum: OpportunityStatus, required: false })
  async findAll(
    @Query() dto: PaginationDto,
    @Query('type') type?: OpportunityType,
    @Query('status') status?: OpportunityStatus,
  ) {
    return this.opportunitiesService.findAll(dto, type, status);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener oportunidad por ID' })
  async findById(@Param('id') id: string) {
    return this.opportunitiesService.findById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar oportunidad' })
  async update(@Param('id') id: string, @Body() dto: UpdateOpportunityDto) {
    return this.opportunitiesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar oportunidad (soft delete)' })
  async remove(@Param('id') id: string) {
    return this.opportunitiesService.remove(id);
  }
}
