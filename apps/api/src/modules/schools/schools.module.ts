import { Module } from "@nestjs/common";

import { FirebaseModule } from "../../config/firebase.module";
import { FirebaseAuthGuard } from "../../common/guards/firebase-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { SchoolsController } from "./schools.controller";
import { SchoolsService } from "./schools.service";

@Module({
  imports: [FirebaseModule],
  controllers: [SchoolsController],
  providers: [SchoolsService, FirebaseAuthGuard, RolesGuard],
  exports: [SchoolsService],
})
export class SchoolsModule {}
