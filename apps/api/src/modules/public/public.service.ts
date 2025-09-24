import { Injectable } from "@nestjs/common";

import { ApprenticeshipsService } from "../apprenticeships/apprenticeships.service";
import { CompaniesService } from "../companies/companies.service";
import { StudentsService } from "../students/students.service";
import type { PublicSearchQueryDto } from "./dto/public-search-query.dto";

@Injectable()
export class PublicService {
  constructor(
    private readonly studentsService: StudentsService,
    private readonly companiesService: CompaniesService,
    private readonly apprenticeshipsService: ApprenticeshipsService
  ) {}

  async search(query: PublicSearchQueryDto) {
    const { query: keywords, ...filters } = query;
    const normalizedQuery = keywords?.toLowerCase() ?? "";

    const [students, companies, apprenticeships] = await Promise.all([
      this.studentsService.search({
        city: filters.city,
        school: filters.school,
      }),
      this.companiesService.findAll({
        city: filters.city,
        sector: filters.sector,
      }),
      this.apprenticeshipsService.findAll({
        location: filters.city,
        startDate: filters.startDate,
      }),
    ]);

    const filterByQuery = <T extends Record<string, unknown>>(items: T[], searchableFields: (keyof T)[]) => {
      if (!normalizedQuery) {
        return items;
      }
      return items.filter((item) =>
        searchableFields.some((field) => {
          const value = item[field];
          if (!value) {
            return false;
          }
          return String(value).toLowerCase().includes(normalizedQuery);
        })
      );
    };

    const studentsResult = filterByQuery(students, ["fullName", "headline", "bio"]).filter((student) => {
      if (!filters.school) {
        return true;
      }
      return student.school.toLowerCase().includes(filters.school.toLowerCase());
    });

    const companiesResult = filterByQuery(companies, ["name", "description", "sector"]).filter((company) => {
      if (!filters.company) {
        return true;
      }
      return company.name.toLowerCase().includes(filters.company.toLowerCase());
    });

    const apprenticeshipsResult = filterByQuery(apprenticeships, ["title", "location"]).filter((apprenticeship) => {
      if (!filters.company) {
        return true;
      }
      const companyMatch = companiesResult.find((company) => company.id === apprenticeship.companyId);
      return companyMatch ? companyMatch.name.toLowerCase().includes(filters.company.toLowerCase()) : false;
    });

    return {
      students: studentsResult,
      companies: companiesResult,
      apprenticeships: apprenticeshipsResult,
    };
  }

  getStudent(id: string) {
    return this.studentsService.findOne(id);
  }

  getCompany(id: string) {
    return this.companiesService.findOne(id);
  }
}

