import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button, Input, Select } from "@alt-platform/ui";

import { searchSchema } from "../lib/validation";
import type { SearchFormValues } from "../lib/validation";

type Props = {
  defaultValues: SearchFormValues;
  onSubmit: (values: SearchFormValues) => void;
  isSubmitting?: boolean;
};

const sectors = [
  "Technology",
  "Finance",
  "Education",
  "Health",
  "Engineering",
];

const schools = [
  "Polytechnique",
  "HEC",
  "ESCP",
  "INSA",
  "Epitech",
];

export function SearchFilters({ defaultValues, onSubmit, isSubmitting = false }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues,
  });

  const submitHandler = handleSubmit((values) => {
    onSubmit(values);
  });

  const resetFilters = () => {
    reset(defaultValues);
    onSubmit(defaultValues);
  };

  return (
    <form
      onSubmit={submitHandler}
      className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2"
    >
      <div className="md:col-span-2">
        <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="query">
          Keywords
        </label>
        <Input
          id="query"
          placeholder="Ex: Product Manager"
          {...register("query")}
          aria-invalid={Boolean(errors.query)}
        />
        {errors.query && (
          <p className="mt-1 text-xs text-amber-600">{errors.query.message}</p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="company">
          Company
        </label>
        <Input id="company" placeholder="Company name" {...register("company")} />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="city">
          City
        </label>
        <Input id="city" placeholder="City" {...register("city")} />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="sector">
          Sector
        </label>
        <Select id="sector" defaultValue={defaultValues.sector ?? ""} {...register("sector")}>
          <option value="">All sectors</option>
          {sectors.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="school">
          School
        </label>
        <Select id="school" defaultValue={defaultValues.school ?? ""} {...register("school")}>
          <option value="">All schools</option>
          {schools.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="startDate">
          Start date
        </label>
        <Input id="startDate" type="date" {...register("startDate")} />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="endDate">
          End date
        </label>
        <Input id="endDate" type="date" {...register("endDate")} />
      </div>

      <div className="md:col-span-2 flex items-center justify-end gap-3">
        <Button type="button" variant="ghost" onClick={resetFilters}>
          Reset
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Searching..." : "Search"}
        </Button>
      </div>
    </form>
  );
}
