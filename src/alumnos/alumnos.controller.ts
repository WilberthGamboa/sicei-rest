import { Controller, Get, Post, Body, Param, Put, Delete, NotFoundException, BadRequestException, HttpException, UploadedFile, HttpStatus, UseInterceptors, HttpCode, Res } from '@nestjs/common';
import { AlumnosService } from './alumnos.service';
import { CreateAlumnoDto } from './dto/create-alumno.dto';
import { UpdateAlumnoDto } from './dto/update-alumno.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {  VerifyAlumnoDto } from './dto/verify-login-alumno.dto';
import { LoginAlumnoDto } from './dto/login-alumno.dto copy';
import { LogoutAlumnoDto } from './dto/logout-alumno.dto';
import { Response } from 'express';


@Controller('alumnos')
export class AlumnosController {
  constructor(private readonly alumnosService: AlumnosService) {}

  // Obtener todos los alumnos
  @Get()
  getAlumnos() {
    return this.alumnosService.findAll();
  }

  // Crear un nuevo alumno
  @Post()
  createAlumno(@Body() createAlumnoDto: CreateAlumnoDto) {
    return this.alumnosService.create(createAlumnoDto);
  }

  // Obtener un alumno por su ID
  @Get(':id')
  getAlumno(@Param('id') id: number) {
    return this.alumnosService.findOne(id);
  }

  // Actualizar un alumno existente
  @Put(':id')
  updateAlumno(@Param('id') id: number, @Body() updateAlumnoDto: UpdateAlumnoDto) {
    return this.alumnosService.update(id, updateAlumnoDto);
  }

  // Eliminar un alumno por su ID
  @Delete(':id')
  deleteAlumno(@Param('id') id: number) {
    return this.alumnosService.delete(id);
  }

  @Delete()
deleteInvalid() {
  throw new HttpException('Método no permitido', 405);
}

  // POST /alumnos/:id/fotoPerfil
 
  @Post(':id/fotoPerfil')
  @UseInterceptors(FileInterceptor('foto'))
  @HttpCode(200) // Establece el código de estado a 200
  async uploadFotoPerfil(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File
  ) {
    console.log(file);
    if (!file) {
      throw new HttpException('Archivo no proporcionado', HttpStatus.BAD_REQUEST);
    }
  
    // Subir foto a S3
    const url = await this.alumnosService.uploadPhotoToS3(id, file);
  
    return {
      message: 'Foto de perfil subida correctamente',
      alumnoId: id,
      fotoPerfilUrl:url,
    };
  }



  @Post(':id/email')
  @HttpCode(200) // Establece el código de estado a 200
  async email(
    @Param('id') id: number,
  
  ) {
   const response = await this.alumnosService.email(id)
   return {
    response
   }
  }



  
  @Post(':id/session/login')
  @HttpCode(200) // Establece el código de estado a 200
  async login(
    @Param('id') id: number,
    @Body() loginAlumnoDto: LoginAlumnoDto
  ) {
   const response = await this.alumnosService.login(id,loginAlumnoDto)

    return {
      sessionString:response
    }
  
  }






  @Post(':id/session/logout')
  @HttpCode(200) // Establece el código de estado a 200
  async logout(
    @Param('id') id: number,
    @Body() loginAlumnoDto: LogoutAlumnoDto
  ) {
   const response = await this.alumnosService.logout(id,loginAlumnoDto)

    return {
      sessionString:response
    }
  
  }



  @Post(':id/session/verify')
   // Establece 200 como el código de respuesta exitoso
  async verify(
    @Param('id') id: number,
    @Body() loginAlumnoDto: VerifyAlumnoDto,
    @Res() res: Response
  ) {
    try {
      const response = await this.alumnosService.verify(id, loginAlumnoDto);
      
      return res.status(200).json({ sessionString: response });
      
     
    } catch (error) {
      return res.status(400).json({ msg:'' });
    }
  }


}

