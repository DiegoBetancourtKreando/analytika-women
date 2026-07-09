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
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Events')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nuevo evento' })
  async create(@Body() dto: CreateEventDto) {
    return this.eventsService.create(dto);
  }

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener todos los eventos (paginado)' })
  async findAll(@Query() dto: PaginationDto) {
    return this.eventsService.findAll(dto);
  }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener evento por ID' })
  async findById(@Param('id') id: string) {
    return this.eventsService.findById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar evento' })
  async update(@Param('id') id: string, @Body() dto: UpdateEventDto) {
    return this.eventsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar evento (soft delete)' })
  async remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }

  @Post(':id/registrations')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrarse en evento' })
  async register(
    @Param('id') id: string,
    @Body() dto: { email: string; fullName: string; phone?: string; userId?: string },
  ) {
    return this.eventsService.register(id, dto);
  }

  @Get(':id/registrations')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener registros del evento' })
  async getRegistrations(@Param('id') id: string) {
    return this.eventsService.getRegistrations(id);
  }
}
