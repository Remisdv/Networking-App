import { Module } from "@nestjs/common";

import { FirebaseModule } from "../../config/firebase.module";
import { FirebaseAuthGuard } from "../../common/guards/firebase-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { CompaniesController } from "./companies.controller";
import { CompaniesService } from "./companies.service";

@Module({
  imports: [FirebaseModule],
  controllers: [CompaniesController],
  providers: [CompaniesService, FirebaseAuthGuard, RolesGuard],
  exports: [CompaniesService],
})
export class CompaniesModule {}
