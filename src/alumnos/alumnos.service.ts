import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateAlumnoDto } from './dto/create-alumno.dto';
import { UpdateAlumnoDto } from './dto/update-alumno.dto';


@Injectable()
export class AlumnosService {
  private alumnos = [
   
  ];

  // Obtener todos los alumnos
  findAll() {
    return this.alumnos;
  }

  // Obtener un alumno por su ID
  findOne(id: number) {
    console.log(id)
    const alumno = this.alumnos.find((alumno) => alumno.id === id);
    if (!alumno) {
      throw new NotFoundException(`Alumno with id ${id} not found`);
    }
    console.log(this.alumnos)
    return alumno;
  }

  // Crear un nuevo alumno
  create(createAlumnoDto: CreateAlumnoDto) {
    if (!createAlumnoDto.nombres || !createAlumnoDto.matricula || createAlumnoDto.promedio < 0 || createAlumnoDto.promedio > 10) {
      throw new BadRequestException('Invalid alumno fields');
    }

    const newAlumno = { ...createAlumnoDto, id: createAlumnoDto.id };
    this.alumnos.push(newAlumno);
    console.log(this.alumnos)
    return newAlumno;
  }

  // Actualizar un alumno existente
  update(id: number, updateAlumnoDto: UpdateAlumnoDto) {
    const existingAlumno = this.findOne(id);
    
   

    const updatedAlumno = { ...existingAlumno, ...updateAlumnoDto };
    const index = this.alumnos.findIndex((alumno) => alumno.id === id);
    this.alumnos[index] = updatedAlumno;
    console.log(this.alumnos)
    return updatedAlumno;
  }

  // Eliminar un alumno por su ID
  delete(id: number) {
    const index = this.alumnos.findIndex((alumno) => alumno.id === id);
    if (index === -1) {
      throw new NotFoundException(`Alumno with id ${id} not found`);
    }
    this.alumnos.splice(index, 1);
    console.log(this.alumnos)
    return { message: 'Alumno deleted successfully' };
  }

  // Generar un ID aleatorio para el nuevo alumno

}
