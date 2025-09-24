import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { RouterProvider } from '@tanstack/react-router';
import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient, router } from '../src/routes/router';

const offersFixture = [
  {
    id: 'offer-1',
    title: 'Developpeur Front React',
    description: 'Integration des composants UI et gestion des requetes API.',
    location: 'Paris',
    contractType: 'Alternance',
    weeklyHours: 35,
    salaryRange: '1000-1200 EUR brut / mois',
    tags: ['react', 'typescript'],
    companyId: 'company-1',
    company: {
      id: 'company-1',
      name: 'TechNova',
      logoUrl: undefined,
      website: undefined,
      description: undefined,
      location: 'Paris',
    },
  },
];

const studentsFixture = [
  {
    id: 'student-1',
    firstName: 'Amelie',
    lastName: 'Durand',
    email: 'amelie.durand@example.com',
    graduationYear: 2025,
    skills: ['React', 'Tailwind'],
  },
];

function renderWithProviders() {
  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

describe('Home page', () => {
  beforeEach(() => {
    queryClient.clear();

    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url =
        typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;

      if (url.includes('/offers')) {
        return {
          ok: true,
          status: 200,
          json: async () => offersFixture,
          text: async () => JSON.stringify(offersFixture),
        } as Response;
      }

      if (url.includes('/students')) {
        return {
          ok: true,
          status: 200,
          json: async () => studentsFixture,
          text: async () => JSON.stringify(studentsFixture),
        } as Response;
      }

      return {
        ok: false,
        status: 404,
        json: async () => ({ message: 'Not found' }),
        text: async () => 'Not found',
      } as Response;
    });

    vi.stubGlobal('fetch', fetchMock as unknown as typeof fetch);
  });

  it('renders landing content and hydrated data', async () => {
    renderWithProviders();

    expect(
      await screen.findByRole('heading', { name: /plateforme reseau propulsee par postgresql/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Les donnees de demo sont stockees dans Postgres/i),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /ouvrir swagger ui/i })).toHaveAttribute(
      'href',
      'http://localhost:3000/docs',
    );
    expect(screen.getByRole('button', { name: /Recharger la page/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Developpeur Front React/i)).toBeInTheDocument();
      expect(screen.getByText(/Amelie Durand/i)).toBeInTheDocument();
    });
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});
