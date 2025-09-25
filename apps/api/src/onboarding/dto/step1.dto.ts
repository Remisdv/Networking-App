import { Type } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsEnum, IsIn, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

import { ContactType, EmploymentType } from '../../common/enums';

export class ContactDto {
  @IsString()
  @IsNotEmpty()
  label!: string;

  @IsString()
  @IsIn([ContactType.EMAIL, ContactType.LINKEDIN, ContactType.URL, ContactType.OTHER])
  type!: ContactType;

  @IsString()
  @IsNotEmpty()
  value!: string;

  @IsOptional()
  ord?: number;
}

export class Step1Dto {
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsEnum(EmploymentType)
  employment!: EmploymentType;

  @IsArray()
  @ArrayMaxSize(5)
  @ValidateNested({ each: true })
  @Type(() => ContactDto)
  contacts!: ContactDto[];
}
