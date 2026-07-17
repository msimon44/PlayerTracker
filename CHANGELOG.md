# Journal de version

Ce journal suit le format [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/). Le projet suit le
[versionnement sémantique](https://semver.org/lang/fr/).

## [Non publié]

### Ajouté

- Pipeline CI/CD complet (GitHub Actions) : lint, type-check, tests unitaires, tests e2e sur base PostgreSQL éphémère,
  build, publication automatique des images Docker (api, web, landing) sur GHCR après validation complète.
- 69 tests unitaires (modules auth, clubs, teams, players) et harmonisation des tests e2e existants.
- Documentation du projet : cahier de recettes, plan de correction des bogues, synthèse de sécurité OWASP, démarche
  d'accessibilité RGAA, manuels de déploiement, d'utilisation et de mise à jour (dossier `docs/`).
- Migration du dépôt de Framagit vers GitHub.
- `.github/dependabot.yml` : veille automatisée des dépendances npm, images Docker de base et actions GitHub.

### Corrigé

- **Sécurité (critique)** : mise à jour de Next.js (16.0.3 → 16.0.7) suite à la découverte d'une vulnérabilité RCE dans
  le protocole React Flight (GHSA-9qr9-h5gf-34mp).
- **Sécurité** : la vérification des mots de passe courants dans le validateur de force de mot de passe était du code
  mort (aucune entrée de la liste ne contenait de caractère spécial) ; corrigée pour rejeter les dérivés triviaux (ex.
  `Password1!`).
- **Bloquant** : `GoogleStrategy` empêchait le démarrage de l'API dans tout environnement sans credentials Google OAuth
  réelles (dev, tests, CI).
- **Bloquant** : import JSON incorrect (`import * as X`) faisant échouer la validation du mot de passe sur chaque
  inscription.
- Contrat d'API : 10 routes d'authentification renvoyaient 201 au lieu de 200, incohérent avec leur documentation
  Swagger.
- `ClubsService`, `TeamsService`, `StaffController` : exceptions génériques renvoyant une erreur 500 au lieu du code
  HTTP approprié (404/401).
- Accessibilité : langue de page incorrecte sur le site vitrine, boutons icône-seule sans nom accessible, champ de
  recherche sans étiquette (voir `docs/accessibilite.md`).
- Dockerfiles obsolètes (référençaient des packages supprimés du monorepo), dépendance manquante (`@playertracker/utils`
  dans `apps/landing`).

Le détail complet, ligne par ligne, de chaque anomalie et de sa correction est dans `docs/plan-correction-bogues.md`.

## [1.0.0]

Version initiale du monorepo (API NestJS/Prisma, applications Next.js web et landing, application mobile Expo en
développement) — historique antérieur non détaillé dans ce journal, disponible dans l'historique Git.
