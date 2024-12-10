import { IsNotEmpty, IsString, IsNumber, Min, Max, IsOptional } from 'class-validator';

export class LoginAlumnoDto {
  @IsString()
  @IsNotEmpty()
  password: string;
}

