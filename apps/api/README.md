# PlayerTracker API

Backend NestJS pour la plateforme PlayerTracker - Gestion multi-sports des athlètes et du personnel.

## Stack

- **Framework:** NestJS 11
- **Database:** PostgreSQL 16 + Prisma 6
- **Auth:** JWT + OAuth (Google, Apple)
- **Validation:** class-validator + Zod
- **Documentation:** Swagger/OpenAPI 3.0

## Architecture Code-First OpenAPI

Les DTOs NestJS génèrent automatiquement le contrat OpenAPI qui est consommé par les clients web et mobile.

**Flux:**

```mermaid
graph LR
    A[DTOs + @ApiProperty] --> B[generate-openapi.ts]
    B --> C[specs/openapi.json]
    C --> D[Orval]
    D --> E[Clients web/mobile]
```

## Modules (17)

- **Auth** - JWT, OAuth, email verification
- **Users** - Gestion utilisateurs avec rôles
- **Players** - Profils joueurs avec métriques
- **Staff** - Personnel du club
- **Clubs** - Organisations multi-sports (multi-tenant)
- **Teams** - Équipes par club
- **Sports** - Types de sport
- **Positions** - Postes par sport
- **Questionnaires** - Système d'évaluation dynamique
- **Questions** - Questions individuelles
- **Question Templates** - Modèles réutilisables
- **Questionnaire Templates** - Modèles réutilisables
- **Answers** - Réponses des joueurs
- **Metrics** - Métriques de performance
- **Sensitive Player Data** - Données RGPD
- **Audit Logs** - Traçabilité
- **Email** - Service d'envoi d'emails

## Démarrage rapide

```bash
# Depuis la racine du monorepo (recommandé)
make dev        # Démarre tout (DB + Prisma + API)

# Ou depuis apps/api
pnpm dev        # Port 3001
```

## Commandes

```bash
# Développement
pnpm dev                    # Démarre l'API sur :3001

# Build
pnpm build                  # Compile TypeScript
pnpm start                  # Démarre en production

# Database
pnpm prisma:generate        # Génère Prisma Client
pnpm prisma:migrate         # Crée une migration
pnpm prisma:push            # Push schéma (dev)
pnpm prisma:studio          # Interface Prisma Studio
pnpm prisma:seed            # Seed avec données de test

# OpenAPI
pnpm generate:openapi       # Génère specs/openapi.json depuis DTOs

# Tests
pnpm test                   # Tests unitaires
pnpm test:e2e               # Tests E2E
pnpm test:cov               # Couverture
```

## Variables d'environnement

Voir `.env.example` pour la liste complète.

**Essentielles:**

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/playertracker
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
```

**OAuth (optionnel):**

```env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
APPLE_CLIENT_ID=...
```

## Sécurité

- Passwords hashés avec bcrypt 25 rounds
- Rate limiting configurable par endpoint
- Token revocation/blacklist
- CORS avec credentials
- Helmet security headers
- Session-based OAuth (CSRF protection)
- Validation stricte sur toutes les entrées

## Patterns & Conventions

### DTO Pattern

Tous les DTOs génèrent l'OpenAPI avec `@ApiProperty` :

```typescript
export class CreateUserDto {
    @ApiProperty({ description: '...', example: '...' })
    @IsEmail()
    email: string;
}
```

### Service Pattern

Les services mappent **toujours** Prisma → DTO :

```typescript
// ❌ JAMAIS exposer Prisma directement
async findAll(): Promise<PrismaUser[]> { ... }

// ✅ TOUJOURS mapper vers DTO
async findAll(): Promise<UserResponseDto[]> {
    const users = await this.prisma.user.findMany();
    return users.map(user => this.mapToDto(user));
}
```

### Structure Module

```txt
modules/{feature}/
├── dto/
│   ├── create-{feature}.dto.ts
│   ├── update-{feature}.dto.ts
│   └── {feature}-response.dto.ts
├── {feature}.controller.ts
├── {feature}.service.ts
└── {feature}.module.ts
```

## Documentation

- **Swagger UI:** http://localhost:3001/docs
- **OpenAPI Spec:** `/specs/openapi.json` (généré automatiquement)
- **Prisma Schema:** `prisma/schema.prisma`

## Multi-tenancy

Toutes les données sont isolées par `clubId`. Les STAFF ne voient que leur club.

## Endpoints principaux

- `POST /auth/register` - Inscription
- `POST /auth/login` - Connexion
- `POST /auth/refresh` - Refresh token
- `GET /auth/google` - OAuth Google
- `GET /auth/apple` - OAuth Apple
- `GET /players` - Liste des joueurs
- `GET /clubs` - Liste des clubs
- `GET /questionnaires` - Liste des questionnaires

Voir Swagger UI pour la documentation complète.
