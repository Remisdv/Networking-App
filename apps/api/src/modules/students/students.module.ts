import { Module } from "@nestjs/common";

import { FirebaseModule } from "../../config/firebase.module";
import { FirebaseAuthGuard } from "../../common/guards/firebase-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { StudentsController } from "./students.controller";
import { StudentsService } from "./students.service";

@Module({
  imports: [FirebaseModule],
  controllers: [StudentsController],
  providers: [StudentsService, FirebaseAuthGuard, RolesGuard],
  exports: [StudentsService],
})
export class StudentsModule {}
