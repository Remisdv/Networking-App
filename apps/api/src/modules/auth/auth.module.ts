// import { Module } from "@nestjs/common";

// import { FirebaseModule } from "../../config/firebase.module";
// import { FirebaseAuthGuard } from "../../common/guards/firebase-auth.guard";
// import { RolesGuard } from "../../common/guards/roles.guard";
// import { AuthController } from "./auth.controller";
// import { AuthService } from "./auth.service";

// @Module({
//   imports: [FirebaseModule],
//   controllers: [AuthController],
//   providers: [AuthService, FirebaseAuthGuard, RolesGuard],
//   exports: [AuthService],
// })
// export class AuthModule {}
import { Module } from '@nestjs/common';
import { FirebaseModule } from '../../config/firebase.module';
import { FirebaseAuthGuard } from '../../common/guards/firebase-auth.guard';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [FirebaseModule],
  controllers: [AuthController],
  providers: [AuthService, FirebaseAuthGuard],
  exports: [AuthService],
})
export class AuthModule {}
