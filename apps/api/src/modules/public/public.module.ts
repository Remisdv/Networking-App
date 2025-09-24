import { Module } from "@nestjs/common";

import { ApprenticeshipsModule } from "../apprenticeships/apprenticeships.module";
import { CompaniesModule } from "../companies/companies.module";
import { StudentsModule } from "../students/students.module";
import { PublicController } from "./public.controller";
import { PublicService } from "./public.service";

@Module({
  imports: [StudentsModule, CompaniesModule, ApprenticeshipsModule],
  controllers: [PublicController],
  providers: [PublicService],
})
export class PublicModule {}
