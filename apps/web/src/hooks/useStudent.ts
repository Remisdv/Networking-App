import { useQuery } from "@tanstack/react-query";

import { fetchStudent } from "../lib/api-client";

export function useStudent(studentId?: string) {
  return useQuery({
    queryKey: ["student", studentId],
    queryFn: () => {
      if (!studentId) {
        throw new Error("Student id is required");
      }
      return fetchStudent(studentId);
    },
    enabled: Boolean(studentId),
  });
}
