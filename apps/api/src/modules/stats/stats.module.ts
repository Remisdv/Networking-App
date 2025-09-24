import { Module } from "@nestjs/common";

import { FirebaseAuthGuard } from "../../common/guards/firebase-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { ApprenticeshipsModule } from "../apprenticeships/apprenticeships.module";
import { CompaniesModule } from "../companies/companies.module";
import { StudentsModule } from "../students/students.module";
import { StatsController } from "./stats.controller";
import { StatsService } from "./stats.service";

@Module({
  imports: [StudentsModule, CompaniesModule, ApprenticeshipsModule],
  controllers: [StatsController],
  providers: [StatsService, FirebaseAuthGuard, RolesGuard],
})
export class StatsModule {}
