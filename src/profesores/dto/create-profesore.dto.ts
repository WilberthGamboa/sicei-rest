import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateProfesorDto {
  @IsInt()
  @IsOptional() // El campo 'id' es opcional en algunos casos, como al crear un nuevo profesor
  id?: number;

  @IsString()
  @IsNotEmpty()
  nombres: string;

  @IsString()
  @IsNotEmpty()
  apellidos: string;

  @IsInt()
  @Min(0)
  numeroEmpleado: number;

  @IsInt()
  @Min(0)
  horasClase: number;
}
