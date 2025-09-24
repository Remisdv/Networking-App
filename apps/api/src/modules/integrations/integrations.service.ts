import { Injectable } from "@nestjs/common";

@Injectable()
export class IntegrationsService {
  async lookupSirene(siren: string) {
    // Placeholder payload for MVP until the live integration is implemented
    return {
      siren,
      name: "Demo Company",
      city: "Paris",
      sector: "Technology",
      status: "active",
    };
  }

  async fetchLogo(domain: string) {
    return {
      domain,
      logoUrl: `https://logo.dev/${domain}`,
      source: "logo.dev",
    };
  }
}
