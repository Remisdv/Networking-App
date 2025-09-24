import { z } from "zod";

export const searchSchema = z.object({
  query: z.string().min(1, "Please provide search keywords"),
  company: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  sector: z.string().optional().or(z.literal("")),
  school: z.string().optional().or(z.literal("")),
  startDate: z.string().optional().or(z.literal("")),
  endDate: z.string().optional().or(z.literal("")),
});

export type SearchFormValues = z.infer<typeof searchSchema>;
