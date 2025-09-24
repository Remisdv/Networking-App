# Alt Platform Monorepo

Monorepo pnpm + Turborepo combinant une application React (Vite) et une API NestJS, avec configuration partagée, CI/CD et outillage DevOps prêts pour la pré-production. La pile de données repose désormais sur PostgreSQL.

## Prérequis

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

> Lors d'un démarrage via `docker compose`, ces variables sont surchargées pour pointer vers le conteneur Postgres (`DATABASE_HOST=postgres`).

Ajoutez vos secrets dans GitHub Actions (`REGISTRY`, `REGISTRY_USER`, `REGISTRY_TOKEN`, `ACME_EMAIL`) pour la publication d'images.

## Démarrage local

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

## Seed de données

```bash
pnpm --filter api seed
```

Le script insère 5 étudiants, 3 entreprises et 6 offres d'alternance dans PostgreSQL.

## Déploiement (VPS / Traefik)

1. Définir `REGISTRY`, `REGISTRY_USER`, `REGISTRY_TOKEN`, `ACME_EMAIL` dans les secrets GitHub.
2. Sur le serveur, récupérer les images buildées (`docker compose pull`).
3. Lancer l'infrastructure :
   ```bash
   docker compose up -d
   ```
4. Traefik route les domaines `app.localhost` et `api.localhost` vers les services correspondants (adapter selon votre DNS).

## Notes

- ESLint, Prettier, Tailwind partagés dans `packages/config`.
- UI librairie Tailwind dans `packages/ui`.
- Authentification désormais gérée par l'API (Postgres) plutôt que Firebase.
- Tests : Vitest + Testing Library côté web, Jest + Supertest côté API.

## Lancer projet

### Voir l'état

```bash
docker compose ps
```

### Logs d'un service

```bash
docker compose logs -f api
docker compose logs -f web
docker compose logs -f postgres
```

### Redémarrer un service

```bash
docker compose up -d --force-recreate api
```

### Tout arrêter et supprimer

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

### démarrer Traefik + Postgres + API + Web (prod)

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
- Les mots de passe ne sont jamais renvoyés par l'API ni stockés en clair; pensez à activer HTTPS et à définir des secrets forts en production.
