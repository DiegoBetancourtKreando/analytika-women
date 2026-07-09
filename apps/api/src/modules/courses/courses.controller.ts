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
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Courses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nuevo curso' })
  async create(@Body() dto: CreateCourseDto) {
    return this.coursesService.create(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener todos los cursos (paginado)' })
  async findAll(@Query() dto: PaginationDto) {
    return this.coursesService.findAll(dto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener curso por ID' })
  async findById(@Param('id') id: string) {
    return this.coursesService.findById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar curso' })
  async update(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
    return this.coursesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar curso (soft delete)' })
  async remove(@Param('id') id: string) {
    return this.coursesService.remove(id);
  }

  @Post(':id/enrollments')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Inscribir estudiante en curso' })
  async enrollStudent(
    @Param('id') id: string,
    @Body() dto: { email: string; fullName: string; phone?: string; userId?: string },
  ) {
    return this.coursesService.enrollStudent(id, dto);
  }

  @Get(':id/enrollments')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener inscripciones del curso' })
  async getEnrollments(@Param('id') id: string) {
    return this.coursesService.getEnrollments(id);
  }
}
