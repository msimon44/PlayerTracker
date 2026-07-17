# Manuel de déploiement

Ce manuel décrit comment déployer PlayerTracker, du poste de développement à un serveur de production. Il complète le
protocole de déploiement continu automatisé (`.github/workflows/ci.yml`), qu'il documente et permet de reproduire
manuellement si besoin (serveur sans accès à GHCR, environnement de démonstration ponctuel, etc.).

## 1. Vue d'ensemble

PlayerTracker se compose de 3 services déployables indépendamment, chacun avec sa propre image Docker :

| Service   | Rôle                        | Port | Image                                    |
| --------- | --------------------------- | ---- | ---------------------------------------- |
| `api`     | Backend NestJS + Prisma     | 3001 | `ghcr.io/msimon44/playertracker-api`     |
| `web`     | Application Next.js (staff) | 3000 | `ghcr.io/msimon44/playertracker-web`     |
| `landing` | Site vitrine Next.js        | 3002 | `ghcr.io/msimon44/playertracker-landing` |

Ces trois images sont **publiées automatiquement sur GitHub Container Registry (GHCR)** à chaque merge sur `main`, une
fois l'intégralité du pipeline CI validée (lint, type-check, tests unitaires, tests e2e, build). C'est le protocole de
déploiement continu du projet.

## 2. Prérequis

- Docker et Docker Compose (v2+)
- Un serveur PostgreSQL 16 accessible (fourni par `docker-compose.yml` en local/petite prod, ou un service managé en
  production)
- Un nom de domaine (pour le déploiement avec Traefik/HTTPS ; optionnel en local)
- Les variables d'environnement listées en section 4

## 3. Déploiement local / démonstration (`docker-compose.dev.yml`)

Pour lancer l'ensemble de la stack en local à partir des images déjà construites :

```bash
git clone https://github.com/msimon44/PlayerTracker.git
cd PlayerTracker
cp .env.example .env
# Éditer .env avec des valeurs de développement (voir section 4)

make dev          # démarre la base de données, génère le client Prisma/OpenAPI, lance tous les apps
# ou, service par service :
make dev-web       # API + Web uniquement
make dev-mobile     # API + Mobile uniquement
```

L'API est alors disponible sur `http://localhost:3001` (documentation Swagger sur `/docs`), le web sur
`http://localhost:3000`, la landing sur `http://localhost:3002`.

## 4. Variables d'environnement

Variables minimales requises (voir `.env.example`, `apps/api/.env.example`, `apps/web/.env.example` pour la liste
complète et commentée) :

| Variable                                    | Description                                              | Obligatoire                                  |
| ------------------------------------------- | -------------------------------------------------------- | -------------------------------------------- |
| `DATABASE_URL`                              | Chaîne de connexion PostgreSQL                           | Oui (l'API refuse de démarrer sans)          |
| `JWT_SECRET`                                | Secret de signature des access tokens                    | Oui (idem)                                   |
| `JWT_REFRESH_SECRET`                        | Secret de signature des refresh tokens                   | Recommandé                                   |
| `SESSION_SECRET`                            | Secret de session (OAuth)                                | Recommandé                                   |
| `ENCRYPTION_KEY`                            | Clé de chiffrement des tokens OAuth (32 caractères min.) | Recommandé                                   |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Credentials OAuth Google                                 | Optionnel — voir note ci-dessous             |
| `CORS_ORIGIN`                               | Origine(s) autorisée(s) en CORS                          | Recommandé en production (évite le wildcard) |
| `NEXT_PUBLIC_API_URL`                       | URL de l'API vue par le frontend                         | Oui (web, landing)                           |

> **Note sur `GOOGLE_CLIENT_ID`** : l'API démarre correctement même sans ces variables (la connexion Google OAuth est
> alors simplement inopérante côté utilisateur, avec un message d'erreur explicite plutôt qu'un crash — voir
> `docs/plan-correction-bogues.md`). Elles ne sont donc bloquantes que si l'on veut activer la connexion Google.

**Sécurité** : en production, générer des secrets aléatoires forts pour chaque valeur `*_SECRET`/`*_KEY` (ex.
`openssl rand -hex 32`). Ne jamais réutiliser les valeurs d'exemple de `.env.example`.

## 5. Déploiement en production (`docker-compose.yml`)

Le fichier `docker-compose.yml` à la racine décrit un déploiement de production complet avec **Traefik** en reverse
proxy (HTTPS automatique via Let's Encrypt, routage par sous-domaine) :

- `app.<DOMAIN>` → `web`
- `api.<DOMAIN>` → `api`
- `<DOMAIN>` → `landing`
- `traefik.<DOMAIN>` → dashboard Traefik (protégé par authentification basique)

Étapes :

```bash
# Sur le serveur de production
git clone https://github.com/msimon44/PlayerTracker.git
cd PlayerTracker
cp .env.example .env
# Renseigner DOMAIN, ACME_EMAIL, POSTGRES_*, JWT_*, TRAEFIK_DASHBOARD_* avec de
# vraies valeurs de production (voir section 4 + section sécurité ci-dessus)

docker compose build     # ou : docker compose pull pour utiliser les images GHCR
docker compose up -d

# Vérifier que tout démarre correctement
docker compose ps
docker compose logs -f api
```

Le premier démarrage crée automatiquement les volumes PostgreSQL et Let's Encrypt. Les migrations Prisma doivent être
appliquées séparément (section 6) — elles ne sont **pas** exécutées automatiquement au démarrage du conteneur `api`,
pour garder le contrôle explicite sur ce moment sensible.

## 6. Migrations de base de données

```bash
# Appliquer les migrations en attente (production : pas de génération, juste l'application)
docker compose exec api npx prisma migrate deploy

# En développement, pour créer une nouvelle migration à partir du schema.prisma modifié
pnpm --filter @playertracker/api prisma:migrate
```

Le pipeline CI applique déjà `prisma migrate deploy` sur une base éphémère pour valider les tests e2e à chaque push —
c'est donc une opération déjà testée automatiquement avant tout déploiement en production.

## 7. Vérification post-déploiement

- `GET https://api.<DOMAIN>/health` → doit retourner `{ status: 'ok' }`
- `GET https://api.<DOMAIN>/docs` → documentation Swagger accessible
- Connexion/inscription fonctionnelle depuis `https://app.<DOMAIN>`

## 8. Rollback

Chaque image Docker publiée est taguée par le SHA du commit en plus de `latest`
(`ghcr.io/msimon44/playertracker-api:<sha>`). Pour revenir à une version antérieure :

```bash
docker compose pull    # si on cible un tag précis, l'indiquer dans docker-compose.yml
# ou directement :
docker pull ghcr.io/msimon44/playertracker-api:<sha-précédent>
docker compose up -d api
```

## 9. Pipeline de déploiement continu (référence)

Pour mémoire, ce que fait `.github/workflows/ci.yml` automatiquement sur `main` — voir ce fichier pour le détail exact :

1. Lint + type-check
2. Tests unitaires
3. Tests e2e (avec migration Prisma sur base PostgreSQL éphémère)
4. Build de l'ensemble du monorepo
5. **Seulement si tout ce qui précède a réussi** : build et publication des 3 images Docker sur GHCR (`api`, `web`,
   `landing`), avec cache de build partagé entre les exécutions (GitHub Actions cache).
