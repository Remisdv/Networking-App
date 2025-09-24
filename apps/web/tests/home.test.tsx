import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { RouterProvider } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";

import { router, queryClient } from "../src/routes/router";

function renderWithProviders() {
  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

describe("Home page", () => {
  it("renders search form inputs", () => {
    renderWithProviders();

    expect(screen.getByLabelText(/keywords/i)).toBeInTheDocument();
    expect(screen.getByText(/search/i)).toBeInTheDocument();
  });
});
