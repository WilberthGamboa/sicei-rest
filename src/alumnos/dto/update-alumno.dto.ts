import { IsString, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateAlumnoDto {
  @IsString()
  @IsOptional()
  matricula?: string;

  @IsString()

  @IsNotEmpty() // Asegura que 'nombres' no sea vacío ni null
  nombres: string;

  @IsString()
  @IsOptional()
  apellidos?: string;

  @IsNumber()
  @IsOptional()
  promedio?: number;

  @IsString()
  @IsOptional()
  password?: string;
}
