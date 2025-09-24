import { useParams } from "@tanstack/react-router";
import { Badge, Card } from "@alt-platform/ui";

import { useCompany } from "../hooks/useCompany";

export function CompanyProfilePage() {
  const { companyId } = useParams({ from: "/companies/$companyId" });
  const { data, isLoading, isError, error } = useCompany(companyId);

  if (isLoading) {
    return <p>Loading company profile...</p>;
  }

  if (isError) {
    return <p className="text-sm text-amber-600">{(error as Error).message}</p>;
  }

  if (!data) {
    return <p>No company found.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">{data.name}</h1>
          <p className="text-slate-600">{data.description}</p>
        </div>
        <Badge variant="success">{data.city}</Badge>
      </div>

      <Card className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <Badge>{data.sector}</Badge>
        </div>
      </Card>
    </div>
  );
}
