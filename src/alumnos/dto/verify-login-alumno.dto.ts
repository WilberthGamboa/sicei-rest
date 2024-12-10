import { IsNotEmpty, IsString, IsNumber, Min, Max, IsOptional } from 'class-validator';

export class VerifyAlumnoDto {
  @IsString()
  @IsNotEmpty()
  sessionString: string;
}

