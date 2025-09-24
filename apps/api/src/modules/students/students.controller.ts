import {
  Body,
  Controller,
  Delete,
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
import { StudentsService } from "./students.service";
import { CreateStudentDto } from "./dto/create-student.dto";
import { UpdateStudentDto } from "./dto/update-student.dto";

@Controller("students")
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  @Roles(UserRole.SCHOOL_ADMIN, UserRole.PLATFORM_ADMIN)
  findAll(@Query() query: Partial<CreateStudentDto>) {
    return this.studentsService.search(query);
  }

  @Get(":id")
  @Roles(UserRole.STUDENT, UserRole.SCHOOL_ADMIN, UserRole.PLATFORM_ADMIN)
  findOne(@Param("id") id: string) {
    return this.studentsService.findOne(id);
  }

  @Post()
  @Roles(UserRole.SCHOOL_ADMIN, UserRole.PLATFORM_ADMIN)
  create(@Body() body: CreateStudentDto) {
    return this.studentsService.create(body);
  }

  @Patch(":id")
  @Roles(UserRole.STUDENT, UserRole.SCHOOL_ADMIN, UserRole.PLATFORM_ADMIN)
  update(@Param("id") id: string, @Body() body: UpdateStudentDto) {
    return this.studentsService.update(id, body);
  }

  @Delete(":id")
  @Roles(UserRole.SCHOOL_ADMIN, UserRole.PLATFORM_ADMIN)
  remove(@Param("id") id: string) {
    return this.studentsService.remove(id);
  }
}
