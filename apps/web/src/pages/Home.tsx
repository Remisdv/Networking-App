import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge, Button, Card } from '@alt-platform/ui';

import { getOffers } from '../api/offers';
import { getStudents } from '../api/students';
import type { Offer, Student } from '../api/types';

function formatError(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Une erreur est survenue';
}

function StudentList({
  students,
  isLoading,
  error,
}: {
  students?: Student[];
  isLoading: boolean;
  error?: unknown;
}) {
  if (isLoading) {
    return <p className="text-sm text-slate-500">Chargement des etudiants...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{formatError(error)}</p>;
  }

  if (!students || students.length === 0) {
    return <p className="text-sm text-slate-500">Aucun etudiant reference pour le moment.</p>;
  }

  return (
    <ul className="space-y-4">
      {students.map((student) => (
        <li key={student.id} className="rounded-lg border border-slate-200 p-4">
          <div className="flex flex-col gap-2">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {student.firstName} {student.lastName}
              </p>
              <p className="text-xs text-slate-500">Promo {student.graduationYear}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {student.skills.map((skill) => (
                <Badge key={skill} variant="warning" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

function OfferList({
  offers,
  isLoading,
  error,
}: {
  offers?: Offer[];
  isLoading: boolean;
  error?: unknown;
}) {
  if (isLoading) {
    return <p className="text-sm text-slate-500">Chargement des offres...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{formatError(error)}</p>;
  }

  if (!offers || offers.length === 0) {
    return <p className="text-sm text-slate-500">Aucune offre publiee pour le moment.</p>;
  }

  return (
    <ul className="space-y-4">
      {offers.map((offer) => (
        <li key={offer.id} className="rounded-lg border border-slate-200 p-4">
          <div className="flex flex-col gap-2">
            <div>
              <p className="text-sm font-semibold text-slate-900">{offer.title}</p>
              <p className="text-xs text-slate-500">
                {offer.company.name} - {offer.location}
              </p>
            </div>
            <p className="text-sm text-slate-600">{offer.description}</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="success" className="text-xs">
                {offer.contractType}
              </Badge>
              {offer.tags.map((tag) => (
                <Badge key={tag} variant="default" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function HomePage() {
  const {
    data: offers,
    isLoading: offersLoading,
    error: offersError,
  } = useQuery({
    queryKey: ['offers'],
    queryFn: getOffers,
  });

  const {
    data: students,
    isLoading: studentsLoading,
    error: studentsError,
  } = useQuery({
    queryKey: ['students'],
    queryFn: getStudents,
  });

  const featuredOffers = useMemo(() => offers?.slice(0, 4) ?? [], [offers]);
  const featuredStudents = useMemo(() => students?.slice(0, 4) ?? [], [students]);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 py-12">
      <header className="space-y-3 text-center">
        <Badge variant="success" className="uppercase tracking-wide">
          Alt Platform
        </Badge>
        <h1 className="text-4xl font-bold text-slate-900">
          Plateforme reseau propulsee par PostgreSQL
        </h1>
        <p className="text-lg text-slate-600">
          Application React + Nest alignee sur Postgres. Utilisez cette page pour verifier la bonne
          communication entre le front et l{"'"}API.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        <Card className="space-y-3">
          <h2 className="text-2xl font-semibold text-slate-900">API status</h2>
          <p className="text-sm text-slate-600">
            La Nest API expose les points d{"'"}acces pour etudiants, entreprises et offres.
            Consultez{' '}
            <code className="rounded bg-slate-100 px-1 py-0.5">http://localhost:3000/docs</code>{' '}
            pour voir le Swagger.
          </p>
          <a
            href="http://localhost:3000/docs"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Ouvrir Swagger UI
          </a>
        </Card>

        <Card className="space-y-3">
          <h2 className="text-2xl font-semibold text-slate-900">PostgreSQL</h2>
          <p className="text-sm text-slate-600">
            Les donnees de demo sont stockees dans Postgres. Lancez{' '}
            <code className="rounded bg-slate-100 px-1 py-0.5">docker compose up postgres</code>{' '}
            puis <code className="rounded bg-slate-100 px-1 py-0.5">pnpm --filter api seed</code>{' '}
            pour recharger l{"'"}echantillon.
          </p>
          <Button type="button" disabled>
            Port 5432 expose (psql)
          </Button>
        </Card>

        <Card className="space-y-3">
          <h2 className="text-2xl font-semibold text-slate-900">Frontend status</h2>
          <p className="text-sm text-slate-600">
            Interface servie depuis{' '}
            <code className="rounded bg-slate-100 px-1 py-0.5">apps/web</code> sur{' '}
            <code className="rounded bg-slate-100 px-1 py-0.5">http://localhost:5173</code>.
            Consultez{' '}
            <code className="rounded bg-slate-100 px-1 py-0.5">docker compose logs -f web</code> en
            cas de souci.
          </p>
          <Button type="button" onClick={() => window.location.reload()}>
            Recharger la page
          </Button>
        </Card>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Card className="space-y-4">
          <header className="space-y-2">
            <h2 className="text-2xl font-semibold text-slate-900">Offres d{"'"}alternance</h2>
            <p className="text-sm text-slate-600">
              Donnees servies par{' '}
              <code className="rounded bg-slate-100 px-1 py-0.5">GET /offers</code>. Les quatre
              dernieres offres sont affichees ci-dessous.
            </p>
          </header>
          <OfferList offers={featuredOffers} isLoading={offersLoading} error={offersError} />
        </Card>

        <Card className="space-y-4">
          <header className="space-y-2">
            <h2 className="text-2xl font-semibold text-slate-900">Talents disponibles</h2>
            <p className="text-sm text-slate-600">
              Donnees servies par{' '}
              <code className="rounded bg-slate-100 px-1 py-0.5">GET /students</code>. Apercu des
              profils en base Postgres.
            </p>
          </header>
          <StudentList
            students={featuredStudents}
            isLoading={studentsLoading}
            error={studentsError}
          />
        </Card>
      </section>
    </div>
  );
}
