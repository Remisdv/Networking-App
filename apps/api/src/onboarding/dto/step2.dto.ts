import { IsDateString, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class CompanyInputDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  siren?: string;

  @IsOptional()
  @IsString()
  name?: string;
}

export class Step2Dto {
  @IsObject()
  company?: CompanyInputDto;

  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  title?: string;
}
