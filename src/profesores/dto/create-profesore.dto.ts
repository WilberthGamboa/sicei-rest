// create-profesor.dto.ts
import { IsString, IsInt, IsNotEmpty } from 'class-validator';

export class CreateProfesorDto {
  @IsString()
  @IsNotEmpty()
  numeroEmpleado: string;

  @IsString()
  @IsNotEmpty()
  nombres: string;

  @IsString()
  @IsNotEmpty()
  apellidos: string;

  @IsInt()
  horasClase: number;
}
