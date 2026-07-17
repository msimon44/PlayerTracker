# Manuel de mise à jour

Ce manuel décrit comment faire évoluer PlayerTracker de manière sûre : mise à jour des dépendances, évolutions du schéma
de base de données, versionnement, et procédure de mise en production d'une nouvelle version.

## 1. Principe général

Toute mise à jour suit le même chemin que n'importe quelle évolution du code : une branche, une Pull Request, le
pipeline CI/CD complet (lint, type-check, tests unitaires, tests e2e, build), puis un merge sur `main` qui déclenche
automatiquement la publication des images Docker. **Il n'existe pas de procédure de mise à jour manuelle "à côté" du
pipeline** — c'est une garantie que toute mise à jour est passée par les mêmes vérifications qu'une fonctionnalité
neuve.

## 2. Mise à jour des dépendances

### 2.1 Veille automatisée (Dependabot)

`.github/dependabot.yml` ouvre automatiquement des Pull Requests hebdomadaires pour :

- les dépendances npm (regroupées par mise à jour mineure/patch pour limiter le nombre de PR ; les montées de version
  majeures restent séparées pour revue individuelle),
- les images Docker de base (`node:20-alpine`),
- les actions GitHub utilisées dans `ci.yml`.

Chaque PR Dependabot passe par le pipeline CI complet avant de pouvoir être fusionnée — une mise à jour de dépendance
qui casserait le build ou les tests est donc détectée avant la mise en production, pas après.

### 2.2 Mise à jour manuelle ponctuelle

```bash
# Vérifier les vulnérabilités connues sur les dépendances de production
pnpm audit --prod

# Mettre à jour une dépendance précise dans un package donné
pnpm --filter @playertracker/api update next-versionname

# Régénérer le lockfile après toute modification de package.json
pnpm install --no-frozen-lockfile
```

**Toujours vérifier `pnpm audit --prod` avant une mise en production** — c'est cette commande qui a révélé la
vulnérabilité critique Next.js documentée dans `docs/securite-owasp.md` et `docs/plan-correction-bogues.md`. Une faille
critique ou haute sur une dépendance de production doit être traitée avant tout autre travail.

## 3. Évolutions du schéma de base de données (Prisma)

```bash
# 1. Modifier apps/api/prisma/schema.prisma

# 2. Générer la migration (développement local, avec une base de dev)
pnpm --filter @playertracker/api prisma:migrate
# -> crée un nouveau dossier horodaté dans apps/api/prisma/migrations/

# 3. Vérifier le SQL généré avant de committer (apps/api/prisma/migrations/<horodatage>_<nom>/migration.sql)

# 4. Committer le dossier de migration avec le code qui l'utilise
```

En production, les migrations ne sont **jamais** générées automatiquement : elles sont committées à l'avance et
appliquées explicitement au moment du déploiement (`prisma migrate deploy`, voir `docs/manuel-deploiement.md` section
6). Le pipeline CI applique déjà chaque migration sur une base PostgreSQL éphémère à chaque push (job `test-e2e`), ce
qui garantit qu'une migration cassée est détectée avant la production.

**Règle de compatibilité** : une migration ne doit jamais rendre l'ancienne version du code incompatible avec le nouveau
schéma le temps du déploiement (fenêtre où l'ancien conteneur `api` tourne encore pendant que la migration s'applique).
Concrètement : ajouter une colonne obligatoire sans valeur par défaut, ou supprimer une colonne encore lue par le code
en cours d'exécution, sont à éviter en une seule étape — préférer une approche en deux temps (colonne nullable puis
rendue obligatoire dans une migration suivante, une fois le nouveau code déployé).

## 4. Versionnement

Le projet suit le versionnement sémantique (`major.minor.patch`, champ `version` des `package.json`). En pratique à ce
stade du projet :

- **patch** : correctif de bogue sans changement de comportement attendu (voir `docs/plan-correction-bogues.md` pour des
  exemples réels)
- **minor** : nouvelle fonctionnalité rétrocompatible
- **major** : changement de contrat d'API (`specs/openapi.json`) non rétrocompatible, ou changement de schéma de base de
  données nécessitant une intervention manuelle

Le contrat d'API (`specs/openapi.json`) étant généré depuis le code de l'API (approche Code-First), toute divergence
entre l'implémentation et la documentation Swagger est mécaniquement impossible — la régénération (`generate:openapi`)
fait partie de la CI de pré-commit sur les fichiers DTO/Controller (hook Husky).

## 5. Journal de version

Voir `CHANGELOG.md` à la racine du projet. Chaque entrée notable (fonctionnalité, correctif, migration de sécurité) y
est consignée avec sa date et sa portée. C'est le même document qui sert de "journal de version" pour le suivi en
production (Bloc 4 du référentiel de certification).

## 6. Traçabilité des images déployées

Chaque image Docker publiée sur GHCR est taguée à la fois `latest` et par le SHA du commit source
(`ghcr.io/msimon44/playertracker-api:<sha>`). Pour savoir précisément quelle version du code tourne en production à un
instant donné :

```bash
docker inspect --format='{{index .Config.Labels "org.opencontainers.image.revision"}}' \
  ghcr.io/msimon44/playertracker-api:latest
```

Cette information est également disponible dans l'onglet "Packages" du dépôt GitHub, avec l'historique complet des
versions publiées.
