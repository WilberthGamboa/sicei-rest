import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlumnosModule } from './alumnos/alumnos.module';
import { ProfesoresModule } from './profesores/profesores.module';

@Module({
  imports: [AlumnosModule, ProfesoresModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
