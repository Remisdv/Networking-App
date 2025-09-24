import { Controller, Get, Param, Query } from "@nestjs/common";

import { PublicService } from "./public.service";
import { PublicSearchQueryDto } from "./dto/public-search-query.dto";

@Controller("public")
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get("search")
  search(@Query() query: PublicSearchQueryDto) {
    return this.publicService.search(query);
  }

  @Get("students/:id")
  getStudent(@Param("id") id: string) {
    return this.publicService.getStudent(id);
  }

  @Get("companies/:id")
  getCompany(@Param("id") id: string) {
    return this.publicService.getCompany(id);
  }
}
