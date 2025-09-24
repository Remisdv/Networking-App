.PHONY: dev build-images up logs down

DEV_SERVICES = firebase-emulators

dev:
	docker compose up -d $(DEV_SERVICES)
	pnpm dev

build-images:
	docker build -t alt-platform-api -f infra/docker/Dockerfile.api .
	docker build -t alt-platform-web -f infra/docker/Dockerfile.web .

up:
	docker compose up -d

logs:
	docker compose logs -f

down:
	docker compose down
