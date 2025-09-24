import { useQuery } from "@tanstack/react-query";

import { fetchCompany } from "../lib/api-client";

export function useCompany(companyId?: string) {
  return useQuery({
    queryKey: ["company", companyId],
    queryFn: () => {
      if (!companyId) {
        throw new Error("Company id is required");
      }
      return fetchCompany(companyId);
    },
    enabled: Boolean(companyId),
  });
}
