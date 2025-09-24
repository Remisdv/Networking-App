import { IsBoolean, IsOptional, IsString } from "class-validator";

export class CreateSchoolDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  name!: string;

  @IsString()
  city!: string;

  @IsOptional()
  @IsBoolean()
  premium?: boolean;
}
