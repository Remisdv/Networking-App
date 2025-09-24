import { useQuery } from "@tanstack/react-query";

import { searchPublicDirectory } from "../lib/api-client";
import type { SearchFilters } from "../lib/types";

export function useSearch(filters: SearchFilters) {
  return useQuery({
    queryKey: ["search", filters],
    queryFn: () => searchPublicDirectory(filters),
    enabled: Boolean(filters.query),
    staleTime: 1000 * 60 * 5,
  });
}
