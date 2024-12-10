import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlumnosModule } from './alumnos/alumnos.module';
import { ProfesoresModule } from './profesores/profesores.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profesor } from './profesores/entities/profesore.entity';
import { Alumno } from './alumnos/entities/alumno.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres', // Usa el tipo de base de datos que tengas en RDS (e.g., 'postgres', 'mysql')
      host: 'siceiaws-instance-1.cmwst3emlexr.us-east-1.rds.amazonaws.com', // Endpoint de tu RDS
      port: 5432, // El puerto de PostgreSQL, o el que sea adecuado para tu DB
      username: 'postgres', // Usuario de la base de datos
      password: 'root2024', // Contraseña de la base de datos
      entities: [Profesor,Alumno],
      synchronize: true, // Solo en desarrollo, no usar en producción
    }),
    
    AlumnosModule, ProfesoresModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
