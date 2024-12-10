import { IsNotEmpty, IsString, IsNumber, Min, Max, IsOptional } from 'class-validator';

export class CreateAlumnoDto {
  @IsString()
  @IsNotEmpty()
  matricula: string;

  @IsString()
  @IsNotEmpty()

  nombres: string;

  @IsString()
  @IsNotEmpty()
  apellidos: string;

  @IsNumber()
  promedio: number;

  @IsString()
  @IsNotEmpty()
  password: string;
}

