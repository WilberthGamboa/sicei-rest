import { IsNotEmpty, IsString, IsNumber, Min, Max, IsOptional } from 'class-validator';

export class CreateAlumnoDto {

    @IsNumber()
    @Min(0)
   
    @IsNotEmpty()
  id:number;
  
  @IsString()
  @IsNotEmpty()
  nombres: string;

  @IsString()
  @IsNotEmpty()
  apellidos: string;

  @IsString()
  @IsNotEmpty()
  matricula: string;

  @IsNumber()
  promedio: number;
}


