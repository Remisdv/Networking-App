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
import { ApprenticeshipsService } from "./apprenticeships.service";
import { CreateApprenticeshipDto } from "./dto/create-apprenticeship.dto";
import { UpdateApprenticeshipDto } from "./dto/update-apprenticeship.dto";

@Controller("apprenticeships")
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class ApprenticeshipsController {
  constructor(private readonly apprenticeshipsService: ApprenticeshipsService) {}

  @Get()
  @Roles(UserRole.COMPANY, UserRole.SCHOOL_ADMIN, UserRole.PLATFORM_ADMIN)
  findAll(@Query() query: Partial<CreateApprenticeshipDto>) {
    return this.apprenticeshipsService.findAll(query);
  }

  @Get(":id")
  @Roles(UserRole.COMPANY, UserRole.SCHOOL_ADMIN, UserRole.PLATFORM_ADMIN)
  findOne(@Param("id") id: string) {
    return this.apprenticeshipsService.findOne(id);
  }

  @Post()
  @Roles(UserRole.COMPANY)
  create(@Body() body: CreateApprenticeshipDto) {
    return this.apprenticeshipsService.create(body);
  }

  @Patch(":id")
  @Roles(UserRole.COMPANY)
  update(@Param("id") id: string, @Body() body: UpdateApprenticeshipDto) {
    return this.apprenticeshipsService.update(id, body);
  }

  @Delete(":id")
  @Roles(UserRole.COMPANY, UserRole.PLATFORM_ADMIN)
  remove(@Param("id") id: string) {
    return this.apprenticeshipsService.remove(id);
  }
}
