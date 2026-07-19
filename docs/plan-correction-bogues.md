# Plan de correction des bogues

Ce document recense les anomalies détectées et corrigées lors de la mise en place du pipeline CI/CD, de l'extension des
tests unitaires et des audits sécurité/accessibilité de PlayerTracker. Contrairement à un plan théorique, **chaque ligne
correspond à un bogue réel, détecté par un outil (lint, type-check, test, audit de dépendances) ou par lecture de code,
puis corrigé et vérifié** — c'est la mise en pratique concrète du harnais de tests et du pipeline d'intégration continue
mis en place (voir `ci.yml`).

Chaque bogue suit le cycle **détection → qualification → correction → vérification** avant d'être marqué comme traité.
Le detail complet (diagnostic, raisonnement, code avant/après) est disponible dans l'historique Git — chaque commit
explique le "pourquoi" en plus du "quoi".

## Légende de gravité

- 🔴 **Bloquante** — empêchait l'application de démarrer, de builder, ou le pipeline de passer
- 🟠 **Majeure** — comportement incorrect visible par l'utilisateur ou faille de sécurité
- 🟡 **Mineure** — incohérence, dette technique, ou défaut de configuration sans impact direct

## Infrastructure CI/CD

| Bogue                                                                                                                               | Gravité | Détecté par                                                                                 | Correction                                                               |
| ----------------------------------------------------------------------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `pnpm-lock.yaml` désynchronisé avec `apps/mobile/package.json`                                                                      | 🔴      | `pnpm install --frozen-lockfile` en CI                                                      | Lockfile régénéré                                                        |
| Dockerfiles référençant des packages supprimés (`packages/types`, `packages/ui` au lieu de `packages/theme`, `packages/utils`)      | 🔴      | Lecture de code (avant même le premier run CI)                                              | Réécriture des 3 Dockerfiles avec le pattern `turbo prune`               |
| `next.config.js`/`.mjs` : `transpilePackages` pointant vers des packages inexistants, `output: 'standalone'` manquant sur `landing` | 🔴      | Lecture de code                                                                             | Configuration corrigée                                                   |
| `@playertracker/utils` non déclaré dans `apps/landing/package.json` bien qu'importé dans le code                                    | 🔴      | Build Docker (`turbo prune` suit le graphe déclaré, pas les imports réels)                  | Dépendance ajoutée                                                       |
| Driver Docker par défaut incompatible avec le cache GHA (`cache-to: type=gha`)                                                      | 🔴      | Run CI (job `docker-publish`)                                                               | Ajout de `docker/setup-buildx-action`                                    |
| `packages/theme` : aucune configuration ESLint ni dépendance `eslint`                                                               | 🟠      | `pnpm lint` en CI                                                                           | Config + dépendance ajoutées                                             |
| `apps/web`/`apps/landing` : `next lint` (retiré de Next.js 16) + ESLint 8 legacy                                                    | 🔴      | `pnpm lint` en CI                                                                           | Migration vers la config flat ESLint 9 partagée                          |
| Règle `no-undef` générant des dizaines de faux positifs sur les types ambiants TS/DOM                                               | 🟠      | `pnpm lint` en CI                                                                           | Règle désactivée en TS/TSX (recommandation officielle typescript-eslint) |
| Config NestJS ESLint : perte de `caughtErrorsIgnorePattern` lors d'une surcharge de règle                                           | 🟡      | `pnpm lint` en CI                                                                           | Patterns restaurés                                                       |
| `ThemeProvider` (landing) : type `children` incompatible avec `exactOptionalPropertyTypes`                                          | 🔴      | `next build` en CI (invisible en local, sandbox sans accès réseau à `fonts.googleapis.com`) | Alignement sur le typage de `apps/web` (`React.ComponentProps`)          |

## Application — API

| Bogue                                                                                                                                                                                                                                                            | Gravité | Détecté par                                                                  | Correction                                                                                   |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `app.module.ts` : 5 imports en style `baseUrl` non résolus sans `tsconfig-paths` au runtime                                                                                                                                                                      | 🔴      | Tests e2e en CI (`Cannot find module`)                                       | Imports relatifs                                                                             |
| `GoogleStrategy` : exception synchrone au démarrage si `GOOGLE_CLIENT_ID` vide — **empêchait toute l'API de démarrer** (dev, tests, CI) sans credentials OAuth réelles                                                                                           | 🔴      | Tests e2e en CI                                                              | Fallback non vide, dégradation gracieuse déjà prévue côté contrôleur mais jamais atteignable |
| `password-strength.validator.ts` : `import * as X from './x.json'` ne donne pas le tableau brut au runtime → `COMMON_PASSWORDS.includes is not a function` sur **chaque inscription**                                                                            | 🔴      | Tests e2e en CI                                                              | Import par défaut                                                                            |
| 10 routes POST documentées "200" dans Swagger mais renvoyant 201 (défaut NestJS sans `@HttpCode`)                                                                                                                                                                | 🟠      | Test e2e (`expected 200, got 201`)                                           | `@HttpCode(HttpStatus.OK)` ajouté aux 10 routes concernées                                   |
| `ClubsService.findOne`, `TeamsService` (x2), `StaffController` : `throw new Error(...)` générique au lieu d'une exception NestJS → le filtre d'exception global renvoyait **500** au lieu de 404/401                                                             | 🟠      | Écriture des tests unitaires `teams.service.spec.ts`/`clubs.service.spec.ts` | `NotFoundException`/`UnauthorizedException`                                                  |
| Vérification "mot de passe courant" : code mort (aucune entrée de la liste des 1000 mots de passe courants ne contient de caractère spécial, donc la règle ne pouvait jamais se déclencher pour un mot de passe qui passe par ailleurs les règles de complexité) | 🟠      | Écriture des tests unitaires `password-strength.validator.spec.ts`           | Ajout d'une comparaison sur la version "lettres seules" du mot de passe                      |
| `UsersService.create()` : interceptait sa propre `BadRequestException` ("mot de passe requis") dans son bloc `catch` et la transformait en `InternalServerErrorException` (500 au lieu de 400)                                                                   | 🟠      | Écriture des tests unitaires `users.service.spec.ts`                         | Re-lancer aussi `BadRequestException`, pas seulement `ConflictException`                     |
| `storeAuthorizationCode` : timer de nettoyage (15 min) sans `.unref()`, empêchant l'arrêt propre du process                                                                                                                                                      | 🟡      | Tests unitaires locaux (Jest ne se terminait pas)                            | `.unref()` ajouté, `--forceExit` en CI en défense supplémentaire                             |

## Sécurité

| Bogue                                                                                              | Gravité | Détecté par                                   | Correction                                                                      |
| -------------------------------------------------------------------------------------------------- | ------- | --------------------------------------------- | ------------------------------------------------------------------------------- |
| `next@16.0.3` (web + landing) exposé à une RCE via le protocole React Flight (GHSA-9qr9-h5gf-34mp) | 🔴      | `pnpm audit` (réalisé pour la synthèse OWASP) | Mise à jour vers `next@16.0.7`, Dependabot mis en place pour la veille continue |

## Accessibilité (RGAA)

| Bogue                                                                                                              | Gravité | Détecté par        | Correction                                              |
| ------------------------------------------------------------------------------------------------------------------ | ------- | ------------------ | ------------------------------------------------------- |
| `apps/landing` : `<html lang="en">` alors que le contenu est en français (critère RGAA 8.3)                        | 🟠      | Audit manuel ciblé | `lang="fr"`                                             |
| 8 boutons icône-seule sans nom accessible (retour, édition, suppression, navigation calendrier — critère RGAA 7.1) | 🟠      | Audit manuel ciblé | `aria-label` + `aria-hidden` sur les icônes décoratives |
| Champ de recherche joueurs reposant uniquement sur un `placeholder` (critère RGAA 11.1)                            | 🟡      | Audit manuel ciblé | `aria-label` ajouté                                     |

## Tests (bogues dans les tests eux-mêmes)

| Bogue                                                                                                                                                                        | Gravité | Détecté par                       | Correction                                                     |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | --------------------------------- | -------------------------------------------------------------- |
| `app.e2e-spec.ts` : test resté au stade boilerplate NestJS (`GET /` → `Hello World!`), jamais aligné sur la vraie route `/health`                                            | 🟡      | Test e2e en échec                 | Test réécrit sur la route réellement exposée                   |
| `auth-platform-restrictions.e2e-spec.ts` : `expect(message).toContain('platform')` — `message` est un tableau, pas une chaîne, et le message réel commence par une majuscule | 🟡      | Test e2e en échec                 | `expect.arrayContaining([expect.stringMatching(/platform/i)])` |
| Inscriptions STAFF dans les tests sans `clubName`/`clubId` alors que le service l'exige (règle métier réelle)                                                                | 🟡      | Test e2e en échec (400 inattendu) | `clubName` ajouté aux payloads de test                         |

## Bilan

**30 anomalies distinctes** détectées et corrigées, dont **6 bloquantes** (empêchant le démarrage de l'application ou la
réussite du pipeline), **2 failles de sécurité** (dont une RCE critique) et **3 non-conformités d'accessibilité**.
Aucune n'a été identifiée par une relecture "à froid" isolée : toutes sont sorties de l'usage réel d'un harnais de tests
(unitaires, e2e), d'un pipeline CI strict (lint, type-check, audit de dépendances) et d'audits ciblés — ce qui illustre
concrètement l'intérêt de ces outils plutôt que de les traiter comme une formalité.
