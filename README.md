# Alt Platform Monorepo

Monorepo pnpm + Turborepo combinant une application React (Vite) et une API NestJS, avec configuration partagée, CI/CD et outillage DevOps prêt pour la pré-production.

## Prérequis
- Node.js 20
- pnpm 10.7+
- Docker & Docker Compose
- Firebase CLI (optionnel pour gérer manuellement les émulateurs)

## Installation
```bash
pnpm install
```

## Variables d'environnement

### Front (`apps/web/.env`)
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_FIREBASE_API_KEY=demo-api-key
VITE_FIREBASE_AUTH_DOMAIN=localhost
VITE_FIREBASE_PROJECT_ID=alt-platform-dev
VITE_FIREBASE_STORAGE_BUCKET=alt-platform-dev.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=0000000000
VITE_FIREBASE_APP_ID=1:0000000000:web:demo
VITE_FIREBASE_EMULATORS=true
```

### API (`apps/api/.env`)
```env
PORT=3000
FIREBASE_PROJECT_ID=alt-platform-dev
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@alt-platform-dev.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nFAKEKEY\\n-----END PRIVATE KEY-----\\n"
FIREBASE_EMULATORS=true
```

Ajoutez vos secrets dans GitHub Actions (`REGISTRY`, `REGISTRY_USER`, `REGISTRY_TOKEN`, `ACME_EMAIL`) pour la publication d'images.

## Démarrage local
1. Lancer les émulateurs Firebase et le mode watch :
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
docker compose up -d # Traefik + API + Web + Firebase emulators
make build-images    # Build local Docker images
```

## Seed de données
```bash
pnpm --filter api seed
```
Le script insère 5 étudiants, 3 entreprises et 6 offres d'alternance dans Firestore.

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
- Auth Firebase (email + Google) avec session httpOnly via `/auth/session`.
- Tests : Vitest + Testing Library côté web, Jest + Supertest côté API.




## lancer projet 
# Voir l’état
docker compose ps

# Logs d’un service
docker compose logs -f api
docker compose logs -f web
docker compose logs -f firebase-emulators

# Redémarrer un service
docker compose up -d --force-recreate api

# Tout arrêter et supprimer
docker compose down

# web
docker compose build web
docker compose up -d --force-recreate web

# (optionnel) repartir propre
docker compose down

# construire uniquement ce qui a un Dockerfile (web/api/firebase-emulators)
docker compose build firebase-emulators api web

# démarrer Traefik + Firebase + API + Web (prod)
docker compose up -d traefik firebase-emulators api web

# suivre les logs (Ctrl+C pour quitter)
docker compose logs -f traefik api web firebase-emulators

