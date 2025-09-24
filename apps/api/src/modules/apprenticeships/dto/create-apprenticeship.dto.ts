import { IsDateString, IsOptional, IsString } from "class-validator";

export class CreateApprenticeshipDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  title!: string;

  @IsString()
  companyId!: string;

  @IsOptional()
  @IsString()
  studentId?: string;

  @IsString()
  location!: string;

  @IsDateString()
  startDate!: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
