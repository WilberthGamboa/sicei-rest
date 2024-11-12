import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class UpdateAlumnoDto {
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