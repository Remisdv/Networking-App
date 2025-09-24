import { useParams } from "@tanstack/react-router";
import { Badge, Card } from "@alt-platform/ui";

import { useStudent } from "../hooks/useStudent";

export function StudentProfilePage() {
  const { studentId } = useParams({ from: "/students/$studentId" });
  const { data, isLoading, isError, error } = useStudent(studentId);

  if (isLoading) {
    return <p>Loading student profile...</p>;
  }

  if (isError) {
    return <p className="text-sm text-amber-600">{(error as Error).message}</p>;
  }

  if (!data) {
    return <p>No student found.</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">{data.fullName}</h1>
        <p className="text-slate-600">{data.headline}</p>
      </div>

      <Card className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge>{data.school}</Badge>
          <Badge variant="success">{data.city}</Badge>
        </div>
        <p>{data.bio}</p>
      </Card>

      <section>
        <h2 className="text-xl font-semibold">Skills</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {data.skills.map((skill) => (
            <Badge key={skill} variant="success">
              {skill}
            </Badge>
          ))}
        </div>
      </section>
    </div>
  );
}
