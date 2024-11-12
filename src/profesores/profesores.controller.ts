import { Controller, Get, Post, Body, Param, Put, Delete, NotFoundException, BadRequestException, HttpException } from '@nestjs/common';


import { ProfesoresService } from './profesores.service';

import { UpdateProfesoreDto } from './dto/update-profesore.dto';
import { CreateProfesorDto } from './dto/create-profesore.dto';



@Controller('profesores')
export class ProfesoresController {
  constructor(private readonly alumnosService: ProfesoresService) {}

  // GET all alumnos
  @Get()
  getAlumnos() {
    return this.alumnosService.findAll();
  }

  // POST a new alumno
  @Post()
  createAlumno(@Body() createAlumnoDto: CreateProfesorDto) {
    return this.alumnosService.create(createAlumnoDto);
  }

  // GET alumno by id
  @Get(':id')
  getAlumno(@Param('id') id: number) {
    return this.alumnosService.findOne(+id);
  }

  // PUT update an existing alumno
  @Put(':id')
  updateAlumno(@Param('id') id: number, @Body() updateAlumnoDto: UpdateProfesoreDto) {
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
