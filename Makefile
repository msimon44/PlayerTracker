.PHONY: help init setup install build dev lint test clean docker-dev docker-prod

# Couleurs pour l'affichage
GREEN := \033[32m
YELLOW := \033[33m
BLUE := \033[34m
RED := \033[31m
RESET := \033[0m

# Variables
COMPOSE_DEV := docker compose -f docker-compose.dev.yml
COMPOSE_PROD := docker compose

help: ## Affiche cette aide
	@echo "$(BLUE)🏃‍♂️ PlayerTracker - Commandes disponibles$(RESET)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(GREEN)%-20s$(RESET) %s\n", $$1, $$2}'

init: ## Initialise le projet (alias pour setup)
	@./scripts/init.sh

setup: ## Initialise le projet
	@./scripts/init.sh

install: ## Installe les dépendances
	@echo "$(YELLOW)📦 Installation des dépendances...$(RESET)"
	@pnpm install

build: install ## Build tous les packages
	@echo "$(YELLOW)🔨 Build des packages...$(RESET)"
	@pnpm build

build-api: ## Build uniquement le package API
	@echo "$(YELLOW)🔨 Build du package API...$(RESET)"
	@pnpm --filter @playertracker/api build

build-web: ## Build uniquement le package Web
	@echo "$(YELLOW)🔨 Build du package Web...$(RESET)"
	@pnpm --filter @playertracker/web build

build-mobile: ## Build uniquement le package Mobile
	@echo "$(YELLOW)🔨 Build du package Mobile...$(RESET)"
	@pnpm --filter @playertracker/mobile build

build-landing: ## Build uniquement le package Landing
	@echo "$(YELLOW)🔨 Build du package Landing...$(RESET)"
	@pnpm --filter @playertracker/landing build

build-shared: ## Build uniquement les packages partagés
	@echo "$(YELLOW)🔨 Build des packages partagés...$(RESET)"
	@pnpm --filter @playertracker/utils build

prepare-dev: ## Prépare l'environnement de développement (DB + Prisma + OpenAPI)
	@echo "$(BLUE)🔧 Préparation de l'environnement de développement...$(RESET)"
	@echo "$(YELLOW)1/3 Démarrage de la base de données...$(RESET)"
	@$(COMPOSE_DEV) up -d postgres 2>/dev/null || true
	@echo "$(YELLOW)2/3 Génération du client Prisma...$(RESET)"
	@pnpm --filter @playertracker/api prisma:generate > /dev/null 2>&1 || true
	@echo "$(YELLOW)3/3 Vérification du contrat OpenAPI...$(RESET)"
	@$(MAKE) ensure-openapi
	@echo "$(GREEN)✅ Environnement de base prêt !$(RESET)"

prepare-dev-web: prepare-dev ## Prépare l'environnement + génère le client web
	@echo "$(YELLOW)4/4 Génération du client API web...$(RESET)"
	@pnpm --filter @playertracker/web generate:client > /dev/null 2>&1 || true
	@echo "$(GREEN)✅ Client web généré !$(RESET)"

prepare-dev-mobile: prepare-dev ## Prépare l'environnement + génère le client mobile
	@echo "$(YELLOW)4/4 Génération du client API mobile...$(RESET)"
	@if [ -f apps/mobile/orval.config.ts ]; then \
		pnpm --filter @playertracker/mobile generate:client > /dev/null 2>&1 || true; \
		echo "$(GREEN)✅ Client mobile généré !$(RESET)"; \
	else \
		echo "$(BLUE)ℹ️  Client mobile non configuré (à venir)$(RESET)"; \
	fi

dev: prepare-dev ## Démarre le développement (tous les apps)
	@echo "$(YELLOW)🚀 Démarrage de tous les apps...$(RESET)"
	@pnpm dev

dev-web: prepare-dev-web ## Démarre API + Web app
	@echo "$(YELLOW)🌐 Démarrage API + Web...$(RESET)"
	-@$(MAKE) clean-dev 2>/dev/null || true
	@pnpm --filter @playertracker/api start:dev & pnpm --filter @playertracker/web dev

dev-mobile: prepare-dev-mobile ## Démarre API + Mobile app
	@echo "$(YELLOW)📱 Démarrage API + Mobile...$(RESET)"
	-@$(MAKE) clean-dev 2>/dev/null || true
	@pnpm --filter @playertracker/api start:dev & pnpm --filter @playertracker/mobile dev

dev-landing: ## Démarre Landing page (seul)
	@echo "$(YELLOW)🏠 Démarrage Landing...$(RESET)"
	@pnpm --filter @playertracker/landing dev

lint: ## Lance le linting
	@echo "$(YELLOW)🔍 Linting du code...$(RESET)"
	@pnpm lint

format: ## Formate le code avec Prettier
	@echo "$(YELLOW)✨ Formatage du code...$(RESET)"
	@pnpm format

type-check: ## Vérifie les types TypeScript
	@echo "$(YELLOW)🔍 Vérification des types...$(RESET)"
	@pnpm type-check

pre-commit: ## Exécute manuellement les checks du pre-commit hook
	@echo "$(BLUE)🔍 Simulation du pre-commit hook...$(RESET)"
	@if [ -f .husky/pre-commit ]; then \
		sh .husky/pre-commit; \
	else \
		echo "$(RED)❌ .husky/pre-commit not found$(RESET)"; \
		exit 1; \
	fi

test: ## Lance les tests
	@echo "$(YELLOW)🧪 Lancement des tests...$(RESET)"
	@pnpm test

test-e2e: ## Lance les tests e2e
	@echo "$(YELLOW)🧪 Lancement des tests e2e...$(RESET)"
	@pnpm test:e2e

clean: ## Nettoie les fichiers de build
	@echo "$(YELLOW)🧹 Nettoyage...$(RESET)"
	@pnpm clean

clean-dev: ## Arrête tous les process de développement (API, Expo, etc.)
	@echo "$(YELLOW)🛑 Arrêt de tous les process de développement...$(RESET)"
	@# Kill processes by name (pkill available on Linux and macOS)
	-@command -v pkill >/dev/null 2>&1 && pkill -f "@playertracker/api" 2>/dev/null || true
	-@command -v pkill >/dev/null 2>&1 && pkill -f "@playertracker/mobile" 2>/dev/null || true
	-@command -v pkill >/dev/null 2>&1 && pkill -f "@playertracker/web" 2>/dev/null || true
	-@command -v pkill >/dev/null 2>&1 && pkill -f "nest start" 2>/dev/null || true
	-@command -v pkill >/dev/null 2>&1 && pkill -f "expo start" 2>/dev/null || true
	-@command -v pkill >/dev/null 2>&1 && pkill -f "next dev" 2>/dev/null || true
	@# Kill processes by port (lsof on macOS/Linux, fuser as fallback on Linux)
	-@if command -v lsof >/dev/null 2>&1; then \
		lsof -ti:3001 2>/dev/null | xargs -r kill -9 2>/dev/null || true; \
		lsof -ti:8081 2>/dev/null | xargs -r kill -9 2>/dev/null || true; \
	elif command -v fuser >/dev/null 2>&1; then \
		fuser -k 3001/tcp 2>/dev/null || true; \
		fuser -k 8081/tcp 2>/dev/null || true; \
	fi
	-@sleep 1
	@echo "$(GREEN)✅ Tous les process arrêtés$(RESET)"

# Base de données
prisma-generate: ## Génère le client Prisma
	@echo "$(YELLOW)🗄️  Génération du client Prisma...$(RESET)"
	@pnpm --filter @playertracker/api prisma:generate

prisma-migrate: ## Lance les migrations
	@echo "$(YELLOW)🗄️  Exécution des migrations...$(RESET)"
	@pnpm --filter @playertracker/api prisma:migrate

prisma-push: ## Push le schéma vers la db
	@echo "$(YELLOW)🗄️  Push du schéma...$(RESET)"
	@pnpm --filter @playertracker/api prisma:push

prisma-studio: ## Ouvre Prisma Studio
	@echo "$(YELLOW)🗄️  Ouverture de Prisma Studio...$(RESET)"
	@pnpm --filter @playertracker/api prisma:studio

prisma-reset: ## Réinitialise la base de données
	@echo "$(YELLOW)🗄️  Réinitialisation de la base de données...$(RESET)"
	@pnpm --filter @playertracker/api prisma:reset
	@pnpm --filter @playertracker/api run seed

# OpenAPI
generate-openapi: ## Génère le contrat OpenAPI depuis les DTOs NestJS
	@echo "$(YELLOW)📄 Génération du contrat OpenAPI...$(RESET)"
	@pnpm --filter @playertracker/api generate:openapi
	@echo "$(GREEN)✅ Contrat généré : specs/openapi.json$(RESET)"

ensure-openapi: ## Vérifie et génère le contrat OpenAPI si nécessaire (utilisé par make dev*)
	@if [ ! -f specs/openapi.json ]; then \
		echo "$(YELLOW)⚠️  Contrat OpenAPI manquant, génération...$(RESET)"; \
		$(MAKE) generate-openapi; \
	else \
		echo "$(GREEN)✅ Contrat OpenAPI présent$(RESET)"; \
	fi

check-openapi: ## Vérifie que le contrat OpenAPI existe
	@echo "$(YELLOW)🔍 Vérification du contrat OpenAPI...$(RESET)"
	@if [ ! -f specs/openapi.json ]; then \
		echo "$(RED)❌ Erreur : specs/openapi.json manquant$(RESET)"; \
		echo "$(YELLOW)💡 Exécutez: make generate-openapi$(RESET)"; \
		exit 1; \
	fi
	@echo "$(GREEN)✅ Contrat OpenAPI présent$(RESET)"
	@echo "$(BLUE)💡 Note: Le pre-commit hook Husky régénère automatiquement le contrat$(RESET)"

# Docker - Développement
docker-dev: ## Démarre TOUS les services de développement (PostgreSQL + API + Web)
	@echo "$(YELLOW)🐳 Démarrage de TOUS les services de développement...$(RESET)"
	@$(COMPOSE_DEV) up -d
	@echo "$(GREEN)✅ Services démarrés !$(RESET)"
	@echo "$(BLUE)📊 Applications disponibles :$(RESET)"
	@echo "• API:      http://localhost:3001"
	@echo "• API Docs: http://localhost:3001/docs"
	@echo "• Web App:  http://localhost:3000"
	@echo ""
	@echo "$(YELLOW)💡 Commandes utiles :$(RESET)"
	@echo "• make docker-dev-logs     - Voir les logs"
	@echo "• make docker-dev-status   - Statut des services"
	@echo "• make docker-dev-down     - Arrêter les services"

docker-dev-db: ## Démarre uniquement PostgreSQL
	@echo "$(YELLOW)🐳 Démarrage de PostgreSQL...$(RESET)"
	@$(COMPOSE_DEV) up -d postgres
	@echo "$(GREEN)✅ PostgreSQL démarré !$(RESET)"

docker-dev-build: ## Rebuild les images de développement
	@echo "$(YELLOW)🔨 Build des images de développement...$(RESET)"
	@$(COMPOSE_DEV) build --no-cache
	@echo "$(GREEN)✅ Images construites !$(RESET)"

docker-dev-rebuild: docker-dev-down docker-dev-build docker-dev ## Rebuild et redémarre tout
	@echo "$(GREEN)✅ Environnement reconstruit !$(RESET)"

docker-dev-down: ## Arrête les services de développement
	@echo "$(YELLOW)🐳 Arrêt des services de développement...$(RESET)"
	@$(COMPOSE_DEV) down
	@echo "$(GREEN)✅ Services arrêtés !$(RESET)"

docker-dev-clean: ## Arrête et nettoie tout (volumes inclus)
	@echo "$(YELLOW)🧹 Nettoyage complet...$(RESET)"
	@$(COMPOSE_DEV) down -v
	@docker system prune -f
	@echo "$(GREEN)✅ Nettoyage terminé !$(RESET)"

docker-dev-logs: ## Affiche les logs des services de développement
	@$(COMPOSE_DEV) logs -f

docker-dev-logs-api: ## Affiche les logs de l'API uniquement
	@$(COMPOSE_DEV) logs -f api

docker-dev-logs-web: ## Affiche les logs du Web uniquement
	@$(COMPOSE_DEV) logs -f web

docker-dev-logs-db: ## Affiche les logs de PostgreSQL uniquement
	@$(COMPOSE_DEV) logs -f postgres

docker-dev-status: ## Affiche le statut des services de développement
	@echo "$(BLUE)📊 Statut des services Docker (développement) :$(RESET)"
	@$(COMPOSE_DEV) ps

docker-dev-restart: ## Redémarre les services de développement
	@echo "$(YELLOW)🔄 Redémarrage des services...$(RESET)"
	@$(COMPOSE_DEV) restart
	@echo "$(GREEN)✅ Services redémarrés !$(RESET)"

docker-dev-restart-api: ## Redémarre uniquement l'API
	@echo "$(YELLOW)🔄 Redémarrage de l'API...$(RESET)"
	@$(COMPOSE_DEV) restart api
	@echo "$(GREEN)✅ API redémarrée !$(RESET)"

docker-dev-restart-web: ## Redémarre uniquement le Web
	@echo "$(YELLOW)🔄 Redémarrage du Web...$(RESET)"
	@$(COMPOSE_DEV) restart web
	@echo "$(GREEN)✅ Web redémarré !$(RESET)"

docker-dev-shell-api: ## Ouvre un shell dans le container API
	@$(COMPOSE_DEV) exec api sh

docker-dev-shell-web: ## Ouvre un shell dans le container Web
	@$(COMPOSE_DEV) exec web sh

docker-dev-shell-db: ## Ouvre un shell PostgreSQL
	@$(COMPOSE_DEV) exec postgres psql -U postgres -d playertracker

docker-dev-prisma-migrate: ## Exécute les migrations Prisma dans le container
	@$(COMPOSE_DEV) exec api sh -c "cd apps/api && npx prisma migrate dev"

docker-dev-prisma-studio: ## Ouvre Prisma Studio depuis le container
	@$(COMPOSE_DEV) exec api sh -c "cd apps/api && npx prisma studio"

# Docker - Production
docker-build: ## Build les images Docker
	@echo "$(YELLOW)🐳 Build des images Docker...$(RESET)"
	@$(COMPOSE_PROD) build

docker-prod: docker-build ## Démarre la stack de production
	@echo "$(YELLOW)🐳 Démarrage de la stack de production...$(RESET)"
	@$(COMPOSE_PROD) up -d

docker-prod-down: ## Arrête la stack de production
	@echo "$(YELLOW)🐳 Arrêt de la stack de production...$(RESET)"
	@$(COMPOSE_PROD) down

docker-logs: ## Affiche les logs de production
	@$(COMPOSE_PROD) logs -f

# Docker - Test
docker-test: ## Teste la configuration Docker
	@./scripts/test-docker.sh

docker-test-build: ## Teste la configuration Docker avec build
	@./scripts/test-docker.sh --build

docker-test-full: ## Teste la configuration Docker avec build et démarrage
	@./scripts/test-docker.sh --build --start

# Environnement
env: ## Copie tous les fichiers .env.example vers .env (root, api, web, mobile, landing)
	@echo "$(YELLOW)📝 Configuration des fichiers .env...$(RESET)"
	@if [ ! -f .env ]; then cp .env.example .env && echo "$(GREEN)✅ Fichier .env racine créé$(RESET)"; else echo "$(BLUE)ℹ️  .env racine existe déjà$(RESET)"; fi
	@if [ ! -f apps/api/.env ]; then cp apps/api/.env.example apps/api/.env && echo "$(GREEN)✅ Fichier .env API créé$(RESET)"; else echo "$(BLUE)ℹ️  apps/api/.env existe déjà$(RESET)"; fi
	@if [ ! -f apps/web/.env ]; then cp apps/web/.env.example apps/web/.env && echo "$(GREEN)✅ Fichier .env Web créé$(RESET)"; else echo "$(BLUE)ℹ️  apps/web/.env existe déjà$(RESET)"; fi
	@if [ ! -f apps/mobile/.env ]; then cp apps/mobile/.env.example apps/mobile/.env && echo "$(GREEN)✅ Fichier .env Mobile créé$(RESET)"; else echo "$(BLUE)ℹ️  apps/mobile/.env existe déjà$(RESET)"; fi
	@if [ ! -f apps/landing/.env ]; then cp apps/landing/.env.example apps/landing/.env && echo "$(GREEN)✅ Fichier .env Landing créé$(RESET)"; else echo "$(BLUE)ℹ️  apps/landing/.env existe déjà$(RESET)"; fi
	@echo "$(YELLOW)⚠️  N'oubliez pas de personnaliser vos fichiers .env$(RESET)"

env-reset: ## Réinitialise TOUS les fichiers .env (écrase les existants)
	@echo "$(YELLOW)🔄 Réinitialisation de tous les fichiers .env...$(RESET)"
	@cp .env.example .env && echo "$(GREEN)✅ Fichier .env racine réinitialisé$(RESET)"
	@cp apps/api/.env.example apps/api/.env && echo "$(GREEN)✅ Fichier .env API réinitialisé$(RESET)"
	@cp apps/web/.env.example apps/web/.env && echo "$(GREEN)✅ Fichier .env Web réinitialisé$(RESET)"
	@cp apps/mobile/.env.example apps/mobile/.env && echo "$(GREEN)✅ Fichier .env Mobile réinitialisé$(RESET)"
	@cp apps/landing/.env.example apps/landing/.env && echo "$(GREEN)✅ Fichier .env Landing réinitialisé$(RESET)"
	@echo "$(RED)⚠️  ATTENTION: Tous les fichiers .env ont été écrasés - pensez à reconfigurer vos valeurs personnalisées$(RESET)"

# Développement rapide
quick-start: env install build-shared docker-dev ## Configuration rapide pour démarrer
	@echo "$(GREEN)🎉 Configuration terminée !$(RESET)"
	@echo "$(BLUE)Prochaines étapes :$(RESET)"
	@echo "1. Configurez .env avec vos valeurs"
	@echo "2. Lancez: make dev"

# Déploiement
deploy: build docker-prod ## Déploie en production
	@echo "$(GREEN)🚀 Déployé en production !$(RESET)"

# Maintenance
update: ## Met à jour les dépendances
	@echo "$(YELLOW)📦 Mise à jour des dépendances...$(RESET)"
	@pnpm update

audit: ## Audit de sécurité
	@echo "$(YELLOW)🔍 Audit de sécurité...$(RESET)"
	@pnpm audit

# Utilitaires
status: ## Affiche le statut des services
	@echo "$(BLUE)📊 Statut des services Docker :$(RESET)"
	@docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

ports: ## Affiche les ports utilisés
	@echo "$(BLUE)🔌 Ports de l'application :$(RESET)"
	@echo ""
	@echo "$(GREEN)Applications :$(RESET)"
	@echo "• API:         http://localhost:3001"
	@echo "• API Docs:    http://localhost:3001/docs"
	@echo "• Web App:     http://localhost:3000"
	@echo "• Mobile:      (Expo - voir console)"
	@echo "• Landing:     http://localhost:3002"
	@echo ""
	@echo "$(GREEN)Services :$(RESET)"
	@echo "• PostgreSQL:  localhost:5432"
	@echo "• Traefik:     http://localhost:8080"
	@echo ""
	@echo "$(BLUE)💡 Commandes de développement :$(RESET)"
	@echo "• make dev        - Tous les apps"
	@echo "• make dev-web    - API + Web uniquement"
	@echo "• make dev-mobile - API + Mobile uniquement"

logs: ## Affiche les logs en temps réel
	@echo "$(BLUE)📋 Logs en temps réel...$(RESET)"
	@pnpm dev 2>&1 | grep -E "(error|warn|info)" || true
