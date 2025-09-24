import { Controller, Get, UseGuards } from "@nestjs/common";

import { FirebaseAuthGuard } from "../../common/guards/firebase-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { UserRole } from "../../common/enums/role.enum";
import { StatsService } from "./stats.service";

@Controller("stats")
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get("overview")
  @Roles(UserRole.PLATFORM_ADMIN)
  overview() {
    return this.statsService.overview();
  }
}
