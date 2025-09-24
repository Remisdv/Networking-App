import { Module } from "@nestjs/common";

import { FirebaseModule } from "../../config/firebase.module";
import { FirebaseAuthGuard } from "../../common/guards/firebase-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { ApprenticeshipsController } from "./apprenticeships.controller";
import { ApprenticeshipsService } from "./apprenticeships.service";

@Module({
  imports: [FirebaseModule],
  controllers: [ApprenticeshipsController],
  providers: [ApprenticeshipsService, FirebaseAuthGuard, RolesGuard],
  exports: [ApprenticeshipsService],
})
export class ApprenticeshipsModule {}
