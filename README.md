# PlayerTracker - Monorepo

[![CI](https://github.com/msimon44/PlayerTracker/actions/workflows/ci.yml/badge.svg)](https://github.com/msimon44/PlayerTracker/actions/workflows/ci.yml)

Plateforme de gestion d'athlètes construite avec TypeScript, utilisant une architecture monorepo avec Turborepo et une
approche **Code-First OpenAPI**.

## 🏗️ Architecture

```txt
📦 PlayerTracker/
├── 📁 apps/                          # Applications
│   ├── 📱 api/                       # Backend NestJS + Prisma
│   ├── 🌐 web/                       # Application Next.js
│   ├── 🏠 landing/                   # Landing page Next.js
│   └── 📱 mobile/                    # Application mobile Expo (à venir)
├── 📁 packages/                      # Packages partagés
│   ├── 🔧 utils/                     # Fonctions utilitaires
│   └── ⚙️ config/                    # Configurations partagées
├── 📁 specs/                         # Contrats API
│   └── openapi.json                  # Contrat OpenAPI (généré)
└── 📋 Makefile                       # Commandes de développement
```

## ✨ Architecture Code-First OpenAPI

**Les DTOs NestJS sont la source de vérité** pour l'API :

```mermaid
graph LR
    A[DTOs NestJS + @ApiProperty] --> B[generate-openapi.ts]
    B --> C[specs/openapi.json]
    C --> D[Orval]
    D --> E[Clients web/mobile + React Query Hooks]
```

### Flux de développement

1. **Définir les DTOs** (backend) avec décorateurs Swagger
2. **Commit les changements** → Husky génère automatiquement le contrat OpenAPI 🤖
3. **Générer les clients** : `pnpm --filter @playertracker/web generate:client`
4. **Utiliser les hooks** React Query générés automatiquement

## 🚀 Démarrage Rapide

> **Pas d'utilitaire `make` sur votre machine, ou besoin de lancer le projet rapidement pour évaluation ?** Voir
> **[DEMARRAGE-RAPIDE.md](./DEMARRAGE-RAPIDE.md)** — procédure complète sans `make`, avec comptes de démonstration prêts
> à l'emploi.

### Prérequis

- Node.js 18+
- pnpm 8+
- Docker & Docker Compose

### Installation

```bash
# 1. Cloner le projet
git clone https://github.com/msimon44/PlayerTracker.git
cd PlayerTracker

# 2. Configuration automatique
make setup
```

Le script `make setup` s'occupe de tout :

- ✅ Installation des dépendances
- ✅ Configuration de l'environnement (.env)
- ✅ Build des packages partagés
- ✅ Démarrage de PostgreSQL
- ✅ Configuration de la base de données

### Développement

```bash
# Démarrer tous les apps
make dev

# Démarrer uniquement API + Web
make dev-web

# Démarrer uniquement API + Mobile
make dev-mobile
```

**URLs de développement :**

- API : <http://localhost:3001>
- API Docs (Swagger) : <http://localhost:3001/docs>
- Web App : <http://localhost:3000>
- Landing : <http://localhost:3002>
- Mobile : Expo (voir console)

## 📦 Commandes Make

### Développement

```bash
make dev            # Démarre tous les apps
make dev-web        # Démarre API + Web uniquement
make dev-mobile     # Démarre API + Mobile uniquement
make ports          # Affiche les ports et aide
```

### Build & Tests

```bash
make build          # Build complet
make lint           # Linting du code
make type-check     # Vérification TypeScript
make test           # Lance les tests
```

### Base de données

```bash
make prisma-generate   # Génère le client Prisma
make prisma-migrate    # Lance les migrations
make prisma-studio     # Ouvre Prisma Studio
```

### OpenAPI & Génération clients

```bash
make generate-openapi  # Génère le contrat OpenAPI depuis les DTOs
make ensure-openapi    # Vérifie et génère le contrat si nécessaire
make check-openapi     # Vérifie que le contrat existe (pour CI)

# Puis générer les clients
pnpm --filter @playertracker/web generate:client      # Client web
pnpm --filter @playertracker/mobile generate:client   # Client mobile
```

### Docker

```bash
make docker-dev        # Démarre PostgreSQL
make docker-dev-down   # Arrête les services
make docker-prod       # Démarre la stack production
```

### Utilitaires

```bash
make help           # Affiche toutes les commandes
make clean          # Nettoie les fichiers de build
make status         # Statut des services Docker
```

## 📚 Packages Partagés

### Utils (`packages/utils`)

Fonctions utilitaires partagées.

```typescript
import { formatDate, capitalize } from '@playertracker/utils';
```

## 📖 Documentation

- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Guide de contribution
- **[CHANGELOG.md](./CHANGELOG.md)** - Journal de version
- **Swagger UI** - <http://localhost:3001/docs> (en développement)

### Documentation projet (dossier `docs/`)

- **[Manuel de déploiement](./docs/manuel-deploiement.md)**
- **[Manuel d'utilisation](./docs/manuel-utilisation.md)**
- **[Manuel de mise à jour](./docs/manuel-mise-a-jour.md)**
- **[User stories](./docs/user-stories.md)**
- **[Cahier de recettes](./docs/cahier-de-recettes.md)**
- **[Plan de correction des bogues](./docs/plan-correction-bogues.md)**
- **[Synthèse sécurité OWASP](./docs/securite-owasp.md)**
- **[Démarche accessibilité (RGAA)](./docs/accessibilite.md)**

---

**PlayerTracker** - Plateforme de gestion d'athlètes moderne 🏃‍♂️
