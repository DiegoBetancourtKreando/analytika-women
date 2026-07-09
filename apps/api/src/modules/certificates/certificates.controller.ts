import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CertificatesService } from './certificates.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Certificates')
@Controller()
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('certificates')
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear nuevo certificado' })
  async create(@Body() dto: CreateCertificateDto) {
    return this.certificatesService.create(dto);
  }

  @Public()
  @Get('certificates/verify/:code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verificar certificado por código (público)' })
  async verify(@Param('code') code: string) {
    return this.certificatesService.verify(code);
  }

  @UseGuards(JwtAuthGuard)
  @Get('certificates')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener todos los certificados (paginado)' })
  async findAll(@Query() dto: PaginationDto) {
    return this.certificatesService.findAll(dto);
  }
}
