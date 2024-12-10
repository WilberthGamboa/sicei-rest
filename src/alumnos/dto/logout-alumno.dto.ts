import { IsNotEmpty, IsString, IsNumber, Min, Max, IsOptional } from 'class-validator';

export class LogoutAlumnoDto {
  @IsString()
  @IsNotEmpty()
  sessionString: string;

  
}

