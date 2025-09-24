import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";

import { FirebaseAuthGuard } from "../../common/guards/firebase-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { UserRole } from "../../common/enums/role.enum";
import { CompaniesService } from "./companies.service";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";

@Controller("companies")
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  @Roles(UserRole.PLATFORM_ADMIN)
  findAll(@Query() query: Partial<CreateCompanyDto>) {
    return this.companiesService.findAll(query);
  }

  @Get(":id")
  @Roles(UserRole.COMPANY, UserRole.PLATFORM_ADMIN)
  findOne(@Param("id") id: string) {
    return this.companiesService.findOne(id);
  }

  @Post()
  @Roles(UserRole.PLATFORM_ADMIN)
  create(@Body() body: CreateCompanyDto) {
    return this.companiesService.create(body);
  }

  @Patch(":id")
  @Roles(UserRole.COMPANY, UserRole.PLATFORM_ADMIN)
  update(@Param("id") id: string, @Body() body: UpdateCompanyDto) {
    return this.companiesService.update(id, body);
  }

  @Post(":id/validate/:studentId")
  @Roles(UserRole.COMPANY)
  validateApprentice(@Param("id") companyId: string, @Param("studentId") studentId: string) {
    return this.companiesService.validateApprentice(companyId, studentId);
  }
}
