import { Controller, Get, Post, Body, Param, Put, Delete, NotFoundException, BadRequestException, HttpException } from '@nestjs/common';
import { AlumnosService } from './alumnos.service';
import { CreateAlumnoDto } from './dto/create-alumno.dto';
import { UpdateAlumnoDto } from './dto/update-alumno.dto';


@Controller('alumnos')
export class AlumnosController {
  constructor(private readonly alumnosService: AlumnosService) {}

  // GET all alumnos
  @Get()
  getAlumnos() {
    return this.alumnosService.findAll();
  }

  // POST a new alumno
  @Post()
  createAlumno(@Body() createAlumnoDto: CreateAlumnoDto) {
    return this.alumnosService.create(createAlumnoDto);
  }

  // GET alumno by id
  @Get(':id')
  getAlumno(@Param('id') id: number) {
    return this.alumnosService.findOne(+id);
  }

  // PUT update an existing alumno
  @Put(':id')
  updateAlumno(@Param('id') id: number, @Body() updateAlumnoDto: UpdateAlumnoDto) {
    console.log('Estamos en put')
    return this.alumnosService.update(+id, updateAlumnoDto);
  }

  // DELETE an alumno

  @Delete()
  deleteInvalid() {
    throw new HttpException('Método no permitido', 405);
  }

  @Delete(':id')
  deleteAlumno(@Param('id') id: number) {
    return this.alumnosService.delete(id);
  }
}
