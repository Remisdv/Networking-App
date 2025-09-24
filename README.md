# Alt Platform Monorepo

Monorepo pnpm + Turborepo combinant une application React (Vite) et une API NestJS, avec configuration partag�e, CI/CD et outillage DevOps pr�ts pour la pr�-production. La pile de donn�es repose d�sormais sur PostgreSQL.

## Pr�requis

- Node.js 20
- pnpm 10.7+
- Docker & Docker Compose
- (Optionnel) psql ou un client Postgres pour inspecter la base

## Installation

```bash
pnpm install
```

## Variables d'environnement

### Front (`apps/web/.env`)

```env
VITE_API_BASE_URL=http://localhost:3000
```

### API (`apps/api/.env`)

```env
NODE_ENV=development
PORT=3000
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=root
DATABASE_PASSWORD=zDb1kpvxpj0xTAfDflTk8k4B
DATABASE_NAME=networking-database
```

> Lors d'un d�marrage via `docker compose`, ces variables sont surcharg�es pour pointer vers le conteneur Postgres (`DATABASE_HOST=postgres`).

Ajoutez vos secrets dans GitHub Actions (`REGISTRY`, `REGISTRY_USER`, `REGISTRY_TOKEN`, `ACME_EMAIL`) pour la publication d'images.

## D�marrage local

1. Lancer Postgres et le mode watch :
   ```bash
   make dev
   ```
2. Les applications sont disponibles sur :
   - API : `http://localhost:3000` (Swagger sur `/docs`)
   - Front : `http://localhost:5173`

## Commandes utiles

```bash
pnpm dev          # Turbo dev (web + api)
pnpm lint         # ESLint monorepo
pnpm test         # Vitest + Jest
pnpm build        # Builds web + api
pnpm --filter api migration:run   # Applique les migrations TypeORM
docker compose up -d # Traefik + API + Web + Postgres
make build-images    # Build local Docker images
```

## Seed de donn�es

```bash
pnpm --filter api seed
```

Le script ins�re 5 �tudiants, 3 entreprises et 6 offres d'alternance dans PostgreSQL.

## D�ploiement (VPS / Traefik)

1. D�finir `REGISTRY`, `REGISTRY_USER`, `REGISTRY_TOKEN`, `ACME_EMAIL` dans les secrets GitHub.
2. Sur le serveur, r�cup�rer les images build�es (`docker compose pull`).
3. Lancer l'infrastructure :
   ```bash
   docker compose up -d
   ```
4. Traefik route les domaines `app.localhost` et `api.localhost` vers les services correspondants (adapter selon votre DNS).

## Notes

- ESLint, Prettier, Tailwind partag�s dans `packages/config`.
- UI librairie Tailwind dans `packages/ui`.
- Authentification d�sormais g�r�e par l'API (Postgres) plut�t que Firebase.
- Tests : Vitest + Testing Library c�t� web, Jest + Supertest c�t� API.

## Lancer projet

### Voir l'�tat

```bash
docker compose ps
```

### Logs d'un service

```bash
docker compose logs -f api
docker compose logs -f web
docker compose logs -f postgres
```

### Red�marrer un service

```bash
docker compose up -d --force-recreate api
```

### Tout arr�ter et supprimer

```bash
docker compose down
```

### web

```bash
docker compose build web
docker compose up -d --force-recreate web
```

### (optionnel) repartir propre

```bash
docker compose down
```

### construire uniquement ce qui a un Dockerfile (web/api)

```bash
docker compose build api web
```

### d�marrer Traefik + Postgres + API + Web (prod)

```bash
docker compose up -d traefik postgres api web
```

### suivre les logs (Ctrl+C pour quitter)

```bash
docker compose logs -f traefik api web postgres
```

## Inscription utilisateurs

- Front : formulaire disponible sur `/register` (TanStack Router) avec validation forte via Zod et react-hook-form.
- API : endpoint `POST /auth/register` (NestJS) qui chiffre les mots de passe avec Argon2id avant stockage et refuse les doublons.
- Les mots de passe ne sont jamais renvoy�s par l'API ni stock�s en clair; pensez � activer HTTPS et � d�finir des secrets forts en production.
