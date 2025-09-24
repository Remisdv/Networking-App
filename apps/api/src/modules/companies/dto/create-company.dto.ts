import { IsArray, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateCompanyDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  name!: string;

  @IsString()
  sector!: string;

  @IsString()
  city!: string;

  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @IsString()
  description!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  validatedStudents?: string[];
}
