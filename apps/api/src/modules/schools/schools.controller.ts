import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";

import { FirebaseAuthGuard } from "../../common/guards/firebase-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { UserRole } from "../../common/enums/role.enum";
import { SchoolsService } from "./schools.service";
import { CreateSchoolDto } from "./dto/create-school.dto";
import { UpdateSchoolDto } from "./dto/update-school.dto";

@Controller("schools")
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @Get()
  @Roles(UserRole.PLATFORM_ADMIN)
  findAll(@Query() query: Partial<CreateSchoolDto>) {
    return this.schoolsService.findAll(query);
  }

  @Get(":id")
  @Roles(UserRole.SCHOOL_ADMIN, UserRole.PLATFORM_ADMIN)
  findOne(@Param("id") id: string) {
    return this.schoolsService.findOne(id);
  }

  @Post()
  @Roles(UserRole.PLATFORM_ADMIN)
  create(@Body() body: CreateSchoolDto) {
    return this.schoolsService.create(body);
  }

  @Patch(":id")
  @Roles(UserRole.PLATFORM_ADMIN)
  update(@Param("id") id: string, @Body() body: UpdateSchoolDto) {
    return this.schoolsService.update(id, body);
  }
}
