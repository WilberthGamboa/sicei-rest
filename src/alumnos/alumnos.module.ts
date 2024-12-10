import { Module } from '@nestjs/common';
import { AlumnosService } from './alumnos.service';
import { AlumnosController } from './alumnos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alumno } from './entities/alumno.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports:[
    ConfigModule,
    TypeOrmModule.forFeature([Alumno])
  ],
  controllers: [AlumnosController],
  providers: [AlumnosService],
})
export class AlumnosModule {}
