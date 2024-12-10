import { IsString, IsInt, IsOptional } from 'class-validator';

export class UpdateProfesorDto {
  @IsString()
  @IsOptional()
  numeroEmpleado?: string;

  @IsString()
  @IsOptional()
  nombres?: string;

  @IsString()
  @IsOptional()
  apellidos?: string;

  @IsInt()
  @IsOptional()
  horasClase?: number;
}