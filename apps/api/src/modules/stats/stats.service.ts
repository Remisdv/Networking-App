import { Injectable } from "@nestjs/common";

import { ApprenticeshipsService } from "../apprenticeships/apprenticeships.service";
import { CompaniesService } from "../companies/companies.service";
import { StudentsService } from "../students/students.service";

@Injectable()
export class StatsService {
  constructor(
    private readonly studentsService: StudentsService,
    private readonly companiesService: CompaniesService,
    private readonly apprenticeshipsService: ApprenticeshipsService
  ) {}

  async overview() {
    const [students, companies, apprenticeships] = await Promise.all([
      this.studentsService.search({}),
      this.companiesService.findAll({}),
      this.apprenticeshipsService.findAll({}),
    ]);

    return {
      students: students.length,
      companies: companies.length,
      apprenticeships: apprenticeships.length,
    };
  }
}
