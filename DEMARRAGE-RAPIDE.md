# Démarrage rapide (évaluation)

Ce guide permet de lancer **la version web (PC)** de PlayerTracker en une dizaine de minutes, avec des données de
démonstration prêtes à l'emploi. L'application mobile n'est pas couverte par ce guide : elle est encore en développement
et n'est pas utilisable en l'état (voir `README.md`).

## 1. Prérequis

- [Node.js](https://nodejs.org) v20 ou plus
- [Docker Desktop](https://www.docker.com/products/docker-desktop) (doit être **lancé** avant de commencer — icône
  active dans la barre des tâches)
- pnpm : une fois Node installé, `npm install -g pnpm`

## 2. Installation

Depuis la racine du projet (dossier extrait du zip, ou dépôt cloné) :

```bash
# 1. Copier les fichiers d'environnement
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# 2. Installer les dépendances
pnpm install

# 3. Démarrer la base de données PostgreSQL
docker compose -f docker-compose.dev.yml up -d postgres

# 4. Générer le client Prisma
pnpm --filter @playertracker/api prisma:generate

# 5. Appliquer les migrations de base de données
pnpm --filter @playertracker/api prisma:migrate

# 6. Charger les données de démonstration (club, équipe, joueurs, questionnaires...)
pnpm --filter @playertracker/api run seed

# 7. Lancer l'API et l'application web
pnpm --filter @playertracker/api start:dev
# dans un second terminal :
pnpm --filter @playertracker/web dev
```

**Sur Windows (PowerShell)**, remplacer les commandes `cp` par :

```powershell
copy .env.example .env
copy apps\api\.env.example apps\api\.env
copy apps\web\.env.example apps\web\.env
```

## 3. Accès

- Application web : <http://localhost:3000>
- API : <http://localhost:3001> — documentation interactive sur <http://localhost:3001/docs>

## 4. Comptes de démonstration (créés par le seed)

| Rôle                      | Email                             | Mot de passe |
| ------------------------- | --------------------------------- | ------------ |
| STAFF (club Karmine Corp) | `coach.kc@playertracker.fr`       | `coach123`   |
| STAFF (club Vitality)     | `coach.vitality@playertracker.fr` | `coach123`   |

Ces comptes disposent déjà de clubs, d'équipes, de joueurs et de questionnaires préremplis — inutile de créer un compte
pour explorer l'application, il suffit de se connecter avec l'un des deux ci-dessus.

## 5. En cas de blocage

| Symptôme                                             | Cause probable                                   | Solution                                                            |
| ---------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------- |
| `docker compose` échoue avec une erreur de connexion | Docker Desktop n'est pas lancé                   | Démarrer Docker Desktop, attendre qu'il soit prêt, réessayer        |
| Erreur de connexion à la base de données             | Le conteneur PostgreSQL n'a pas fini de démarrer | Attendre quelques secondes après l'étape 3, ou vérifier `docker ps` |
| Port 3000/3001/5432 déjà utilisé                     | Un autre service tourne déjà sur ce port         | Arrêter le service en question, ou modifier le port dans `.env`     |

Pour une procédure plus détaillée (production, Docker complet, dépannage étendu), voir `docs/manuel-deploiement.md`.
