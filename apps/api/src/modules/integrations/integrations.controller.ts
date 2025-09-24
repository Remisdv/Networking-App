import { Controller, Get, Query } from "@nestjs/common";

import { IntegrationsService } from "./integrations.service";

@Controller("integrations")
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Get("sirene")
  lookupSirene(@Query("siren") siren: string) {
    return this.integrationsService.lookupSirene(siren);
  }

  @Get("logos")
  fetchLogo(@Query("domain") domain: string) {
    return this.integrationsService.fetchLogo(domain);
  }
}
