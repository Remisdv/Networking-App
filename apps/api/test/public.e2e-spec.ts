import request from "supertest";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";

import { PublicController } from "../src/modules/public/public.controller";
import { PublicService } from "../src/modules/public/public.service";
import { StudentsService } from "../src/modules/students/students.service";
import { CompaniesService } from "../src/modules/companies/companies.service";
import { ApprenticeshipsService } from "../src/modules/apprenticeships/apprenticeships.service";

describe("PublicController (e2e)", () => {
  let app: INestApplication;

  const studentsService = {
    search: jest.fn().mockResolvedValue([
      {
        id: "student-1",
        fullName: "Jane Doe",
        headline: "UX Designer",
        city: "Paris",
        school: "HEC",
        skills: ["UI", "Research"],
        bio: "Curious designer",
      },
    ]),
    findOne: jest.fn().mockResolvedValue(null),
  } as unknown as StudentsService;

  const companiesService = {
    findAll: jest.fn().mockResolvedValue([
      {
        id: "company-1",
        name: "Tech Corp",
        sector: "Technology",
        city: "Paris",
        description: "Innovative company",
      },
    ]),
    findOne: jest.fn().mockResolvedValue(null),
  } as unknown as CompaniesService;

  const apprenticeshipsService = {
    findAll: jest.fn().mockResolvedValue([
      {
        id: "apprenticeship-1",
        title: "Frontend Apprentice",
        companyId: "company-1",
        location: "Paris",
        startDate: new Date().toISOString(),
      },
    ]),
  } as unknown as ApprenticeshipsService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [PublicController],
      providers: [
        PublicService,
        { provide: StudentsService, useValue: studentsService },
        { provide: CompaniesService, useValue: companiesService },
        { provide: ApprenticeshipsService, useValue: apprenticeshipsService },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("returns search results for public directory", async () => {
    const response = await request(app.getHttpServer()).get("/public/search").query({ query: "design" });

    expect(response.status).toBe(200);
    expect(response.body.students).toHaveLength(1);
    expect(response.body.companies).toHaveLength(1);
    expect(response.body.apprenticeships).toHaveLength(1);
  });
});
