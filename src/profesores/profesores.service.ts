import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { UpdateProfesoreDto } from './dto/update-profesore.dto';
import { CreateProfesorDto } from './dto/create-profesore.dto';




@Injectable()
export class ProfesoresService {
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
  create(createAlumnoDto: CreateProfesorDto) {
   

    const newAlumno = { ...createAlumnoDto, id: createAlumnoDto.id };
    this.alumnos.push(newAlumno);
    console.log(this.alumnos)
    return newAlumno;
  }

  // Actualizar un alumno existente
  update(id: number, updateAlumnoDto: UpdateProfesoreDto) {
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
