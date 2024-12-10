import { Controller, Get, Post, Body, Param, Put, Delete, HttpException } from '@nestjs/common';
import { ProfesoresService } from './profesores.service';
import { CreateProfesorDto } from './dto/create-profesore.dto';
import { UpdateProfesorDto } from './dto/update-profesore.dto';


@Controller('profesores')
export class ProfesoresController {
  constructor(private readonly profesoresService: ProfesoresService) {}

  // Obtener todos los profesores
  @Get()
  getProfesores() {
    return this.profesoresService.findAll();
  }

  // Crear un nuevo profesor
  @Post()
  createProfesor(@Body() createProfesorDto: CreateProfesorDto) {
    return this.profesoresService.create(createProfesorDto);
  }

  // Obtener un profesor por su ID
  @Get(':id')
  getProfesor(@Param('id') id: number) {
    return this.profesoresService.findOne(id);
  }

  // Actualizar un profesor existente
  @Put(':id')
  updateProfesor(@Param('id') id: number, @Body() updateProfesorDto: UpdateProfesorDto) {
    return this.profesoresService.update(id, updateProfesorDto);
  }

  // Eliminar un profesor por su ID
  @Delete(':id')
  deleteProfesor(@Param('id') id: number) {
    return this.profesoresService.delete(id);
  }

  @Delete()
deleteInvalid() {
  throw new HttpException('Método no permitido', 405);
}
}





