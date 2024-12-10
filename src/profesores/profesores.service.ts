import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profesor } from './entities/profesore.entity';
import { CreateProfesorDto } from './dto/create-profesore.dto';
import { UpdateProfesorDto } from './dto/update-profesore.dto';


@Injectable()
export class ProfesoresService {
  constructor(
    @InjectRepository(Profesor)
    private profesoresRepository: Repository<Profesor>,
  ) {}

  // Obtener todos los profesores
  findAll() {
    return this.profesoresRepository.find();
  }

  // Obtener un profesor por su ID
  async findOne(id: number) {
    const profesor = await this.profesoresRepository.findOneBy({id});
    if (!profesor) {
      throw new NotFoundException(`Profesor con id ${id} no encontrado`);
    }
    return profesor;
  }

  // Crear un nuevo profesor
  async create(createProfesorDto: CreateProfesorDto) {
    const newProfesor = this.profesoresRepository.create(createProfesorDto);
    return await this.profesoresRepository.save(newProfesor);
  }

  // Actualizar un profesor existente
  async update(id: number, updateProfesorDto: UpdateProfesorDto) {
    const profesor = await this.findOne(id);
    const updatedProfesor = Object.assign(profesor, updateProfesorDto);
    return await this.profesoresRepository.save(updatedProfesor);
  }

  // Eliminar un profesor por su ID
  async delete(id: number) {
    const profesor = await this.findOne(id);
    await this.profesoresRepository.remove(profesor);
    return { message: 'Profesor eliminado exitosamente' };
  }
}
