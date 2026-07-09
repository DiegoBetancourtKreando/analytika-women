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
import { ProfessionalsService } from './professionals.service';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Professionals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('professionals')
export class ProfessionalsController {
  constructor(private readonly professionalsService: ProfessionalsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nuevo profesional' })
  async create(@Body() dto: CreateProfessionalDto) {
    return this.professionalsService.create(dto);
  }

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener todos los profesionales (paginado)' })
  async findAll(@Query() dto: PaginationDto) {
    return this.professionalsService.findAll(dto);
  }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener profesional por ID' })
  async findById(@Param('id') id: string) {
    return this.professionalsService.findById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar profesional' })
  async update(@Param('id') id: string, @Body() dto: UpdateProfessionalDto) {
    return this.professionalsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar profesional (soft delete)' })
  async remove(@Param('id') id: string) {
    return this.professionalsService.remove(id);
  }

  @Post(':id/certifications')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Agregar certificación a profesional' })
  async addCertification(
    @Param('id') id: string,
    @Body() dto: { name: string; issuer: string; year: number; expirationYear?: number; fileUrl?: string },
  ) {
    return this.professionalsService.addCertification(id, dto);
  }

  @Delete(':id/certifications/:certificationId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remover certificación' })
  async removeCertification(
    @Param('id') id: string,
    @Param('certificationId') certificationId: string,
  ) {
    return this.professionalsService.removeCertification(id, certificationId);
  }

  @Post(':id/publications')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Agregar publicación a profesional' })
  async addPublication(
    @Param('id') id: string,
    @Body() dto: { title: string; publisher: string; year: number; url?: string; doi?: string },
  ) {
    return this.professionalsService.addPublication(id, dto);
  }

  @Delete(':id/publications/:publicationId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remover publicación' })
  async removePublication(
    @Param('id') id: string,
    @Param('publicationId') publicationId: string,
  ) {
    return this.professionalsService.removePublication(id, publicationId);
  }
}
