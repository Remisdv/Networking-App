import { IsArray, IsOptional, IsString } from "class-validator";

export class CreateStudentDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  fullName!: string;

  @IsString()
  headline!: string;

  @IsString()
  city!: string;

  @IsString()
  school!: string;

  @IsArray()
  @IsString({ each: true })
  skills!: string[];

  @IsString()
  bio!: string;
}
