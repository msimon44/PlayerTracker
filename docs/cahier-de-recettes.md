# Cahier de recettes

Ce document reprend les scénarios de test exécutés sur PlayerTracker, avec le résultat attendu pour chacun. Il couvre
trois types de test, tous automatisés et exécutés à chaque push dans le pipeline CI/CD (`ci.yml`) :

- **Tests structurels** (unitaires) : vérifient qu'une fonction/méthode isolée se comporte comme prévu, y compris sur
  ses cas d'erreur.
- **Tests fonctionnels** (end-to-end) : vérifient qu'un parcours complet (requête HTTP → base de données → réponse)
  produit le résultat attendu, sur une vraie base PostgreSQL éphémère.
- **Tests de sécurité** : scénarios ciblant spécifiquement les règles d'autorisation et de validation.

Statut au **19/07/2026** : 318 tests unitaires + 12 tests e2e, tous passants (voir le badge CI dans le README). Chaque
scénario ci-dessous est traçable jusqu'au fichier de test correspondant.

## 1. Authentification — Inscription

| #    | Scénario                                   | Étapes                                                                       | Résultat attendu                                                                | Type        | Fichier                                  |
| ---- | ------------------------------------------ | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ----------- | ---------------------------------------- |
| 1.1  | Inscription STAFF sur la plateforme web    | `POST /auth/register` avec `role: STAFF`, `platform: web`, `clubName` fourni | `201 Created`, réponse contient `user` (role STAFF) et `tokens`                 | Fonctionnel | `auth-platform-restrictions.e2e-spec.ts` |
| 1.2  | Inscription PLAYER sur mobile              | `POST /auth/register` avec `role: PLAYER`, `platform: mobile`                | `201 Created`, `user.role === PLAYER`                                           | Fonctionnel | idem                                     |
| 1.3  | Rejet — PLAYER sur web                     | `role: PLAYER`, `platform: web`                                              | `403 Forbidden`, message _"Web platform is restricted to STAFF users only"_     | Sécurité    | idem                                     |
| 1.4  | Rejet — STAFF sur mobile                   | `role: STAFF`, `platform: mobile`                                            | `403 Forbidden`, message _"Mobile platform is restricted to PLAYER users only"_ | Sécurité    | idem                                     |
| 1.5  | Rejet — ADMIN sur mobile                   | `role: ADMIN`, `platform: mobile`                                            | `403 Forbidden`                                                                 | Sécurité    | idem                                     |
| 1.6  | Rejet — plateforme manquante               | Payload sans `platform`                                                      | `400 Bad Request`, message mentionnant "platform"                               | Structurel  | idem                                     |
| 1.7  | Rejet — email déjà utilisé                 | Inscription avec un email existant                                           | `409 Conflict` (`ConflictException`)                                            | Structurel  | `auth.service.spec.ts`                   |
| 1.8  | Rejet — STAFF sans prénom/nom              | `role: STAFF` sans `firstName`/`lastName`                                    | `400 Bad Request`                                                               | Structurel  | idem                                     |
| 1.9  | Rejet — STAFF sans club                    | `role: STAFF` sans `clubId` ni `clubName`                                    | `400 Bad Request`                                                               | Structurel  | idem                                     |
| 1.10 | Rejet — `clubId` inexistant                | `role: STAFF`, `clubId: 999` (n'existe pas)                                  | `400 Bad Request` (_"Club not found"_)                                          | Structurel  | idem                                     |
| 1.11 | Création d'un nouveau club à l'inscription | `role: STAFF`, `clubName` fourni (pas de `clubId`)                           | Le club est créé, le compte STAFF y est rattaché                                | Structurel  | idem                                     |

## 2. Authentification — Connexion

| #   | Scénario                       | Étapes                                                   | Résultat attendu            | Type        | Fichier                                  |
| --- | ------------------------------ | -------------------------------------------------------- | --------------------------- | ----------- | ---------------------------------------- |
| 2.1 | Connexion STAFF sur web        | `POST /auth/login`, credentials valides, `platform: web` | `200 OK`, `user` + `tokens` | Fonctionnel | `auth-platform-restrictions.e2e-spec.ts` |
| 2.2 | Connexion PLAYER sur mobile    | Credentials valides, `platform: mobile`                  | `200 OK`                    | Fonctionnel | idem                                     |
| 2.3 | Rejet — STAFF sur mobile       | STAFF valide, `platform: mobile`                         | `403 Forbidden`             | Sécurité    | idem                                     |
| 2.4 | Rejet — PLAYER sur web         | PLAYER valide, `platform: web`                           | `403 Forbidden`             | Sécurité    | idem                                     |
| 2.5 | Rejet — plateforme manquante   | Payload sans `platform`                                  | `400 Bad Request`           | Structurel  | idem                                     |
| 2.6 | Rejet — utilisateur inexistant | Email non enregistré                                     | `401 Unauthorized`          | Sécurité    | `auth.service.spec.ts`                   |
| 2.7 | Rejet — mot de passe incorrect | Email valide, mauvais mot de passe                       | `401 Unauthorized`          | Sécurité    | idem                                     |

## 3. Gestion des tokens

| #   | Scénario                                                  | Résultat attendu                                           | Type       | Fichier                |
| --- | --------------------------------------------------------- | ---------------------------------------------------------- | ---------- | ---------------------- |
| 3.1 | Rafraîchissement de token pour un utilisateur existant    | Nouveaux `accessToken`/`refreshToken` émis                 | Structurel | `auth.service.spec.ts` |
| 3.2 | Rafraîchissement pour un utilisateur supprimé entre-temps | `401 Unauthorized`                                         | Structurel | idem                   |
| 3.3 | Échange d'un code d'autorisation OAuth valide             | Retourne les tokens stockés, une seule fois (usage unique) | Structurel | idem                   |
| 3.4 | Réutilisation d'un code déjà échangé                      | `401 Unauthorized`                                         | Sécurité   | idem                   |
| 3.5 | Code d'autorisation inconnu                               | `401 Unauthorized`                                         | Sécurité   | idem                   |
| 3.6 | Déconnexion avec un token valide                          | Token ajouté à la liste de révocation                      | Structurel | idem                   |
| 3.7 | Déconnexion avec un token invalide/expiré                 | `401 Unauthorized`                                         | Sécurité   | idem                   |

## 4. Mot de passe (oubli / réinitialisation / changement)

| #    | Scénario                                                                                              | Résultat attendu                                                                 | Type        | Fichier                               |
| ---- | ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ----------- | ------------------------------------- |
| 4.1  | Demande de réinitialisation pour un compte existant                                                   | Email envoyé, token stocké                                                       | Fonctionnel | `auth.service.spec.ts`                |
| 4.2  | Demande pour un email inconnu                                                                         | Aucune erreur renvoyée, aucun email envoyé (ne révèle pas l'existence du compte) | Sécurité    | idem                                  |
| 4.3  | Réinitialisation avec un token valide et non expiré                                                   | Mot de passe mis à jour, token marqué utilisé                                    | Fonctionnel | idem                                  |
| 4.4  | Réinitialisation avec un token inconnu                                                                | `400 Bad Request`                                                                | Sécurité    | idem                                  |
| 4.5  | Réinitialisation avec un token expiré                                                                 | `400 Bad Request`                                                                | Sécurité    | idem                                  |
| 4.6  | Réinitialisation avec un token déjà utilisé                                                           | `400 Bad Request`                                                                | Sécurité    | idem                                  |
| 4.7  | Changement de mot de passe (utilisateur connecté), mot de passe actuel correct                        | Mot de passe mis à jour                                                          | Fonctionnel | idem                                  |
| 4.8  | Changement avec mot de passe actuel incorrect                                                         | `401 Unauthorized`                                                               | Sécurité    | idem                                  |
| 4.9  | Robustesse — mot de passe hors des règles de complexité (longueur, casse, chiffre, caractère spécial) | Rejeté par le validateur                                                         | Structurel  | `password-strength.validator.spec.ts` |
| 4.10 | Robustesse — dérivé trivial d'un mot de passe courant (`Password1!`)                                  | Rejeté                                                                           | Sécurité    | idem                                  |
| 4.11 | Confirmation de mot de passe ne correspondant pas                                                     | Rejeté (`matchPassword`)                                                         | Structurel  | `match-password.validator.spec.ts`    |

## 5. Gestion des clubs, équipes, joueurs (CRUD)

| #    | Scénario                                                      | Résultat attendu                                                            | Type       | Fichier                   |
| ---- | ------------------------------------------------------------- | --------------------------------------------------------------------------- | ---------- | ------------------------- |
| 5.1  | Liste des clubs avec compteurs (joueurs/équipes/staff)        | Liste correctement mappée                                                   | Structurel | `clubs.service.spec.ts`   |
| 5.2  | Consultation d'un club existant                               | Détail du club retourné                                                     | Structurel | idem                      |
| 5.3  | Consultation d'un club inexistant                             | `404 Not Found` (`NotFoundException`)                                       | Structurel | idem                      |
| 5.4  | Création / modification / suppression d'un club               | Données correctement persistées                                             | Structurel | idem                      |
| 5.5  | Liste des équipes, filtrée par club                           | Filtre `clubId` appliqué à la requête                                       | Structurel | `teams.service.spec.ts`   |
| 5.6  | Rattachement d'un joueur à une équipe                         | Le joueur est connecté à l'équipe et marqué actif                           | Structurel | idem                      |
| 5.7  | Retrait d'un joueur d'une équipe                              | Le joueur est déconnecté et marqué inactif                                  | Structurel | idem                      |
| 5.8  | Rattachement à une équipe supprimée en cours d'opération      | `404 Not Found`                                                             | Structurel | idem                      |
| 5.9  | Consultation d'un joueur inexistant                           | `404 Not Found`                                                             | Structurel | `players.service.spec.ts` |
| 5.10 | Création d'un joueur sans équipe/position (champs optionnels) | Création réussie, relations non connectées                                  | Structurel | idem                      |
| 5.11 | Suppression d'un joueur ayant un compte utilisateur lié       | Le compte utilisateur est supprimé avant le joueur (suppression en cascade) | Structurel | idem                      |
| 5.12 | Suppression d'un joueur inexistant                            | `404 Not Found`                                                             | Structurel | idem                      |

## 6. Questionnaires — statuts et cycle de vie

| #    | Scénario                                                                                | Résultat attendu                                                                                                                                  | Type       | Fichier                          |
| ---- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | -------------------------------- |
| 6.1  | Consultation des résultats d'un questionnaire en brouillon                              | `400 Bad Request` — résultats disponibles seulement après clôture                                                                                 | Structurel | `questionnaires.service.spec.ts` |
| 6.2  | Consultation des résultats d'un questionnaire publié mais non encore clos               | `400 Bad Request`                                                                                                                                 | Structurel | idem                             |
| 6.3  | Consultation des résultats une fois le statut `COMPLETED`                               | Résultats retournés                                                                                                                               | Structurel | idem                             |
| 6.4  | Consultation des résultats une fois la date de clôture dépassée (statut non mis à jour) | Résultats retournés malgré tout                                                                                                                   | Structurel | idem                             |
| 6.5  | Liste des répondants — calcul du taux de réponse                                        | Le joueur ayant répondu à au moins une question est marqué "a répondu", avec la date de sa réponse la plus récente                                | Structurel | idem                             |
| 6.6  | Modification ou suppression d'un questionnaire en brouillon                             | Autorisé                                                                                                                                          | Structurel | idem                             |
| 6.7  | Modification ou suppression d'un questionnaire déjà publié                              | `400 Bad Request` — seul un brouillon peut être modifié/supprimé                                                                                  | Structurel | idem                             |
| 6.8  | Ajout d'une question à un questionnaire non-brouillon                                   | `400 Bad Request` (même règle, dupliquée et testée côté module `questions`)                                                                       | Structurel | `questions.service.spec.ts`      |
| 6.9  | Réponse à une question : complétion automatique du questionnaire                        | Une fois que tous les joueurs actifs de l'équipe ont répondu à toutes les questions obligatoires, le statut bascule automatiquement à `COMPLETED` | Structurel | `answers.service.spec.ts`        |
| 6.10 | Réponse partielle (tous les joueurs n'ont pas encore répondu)                           | Le questionnaire reste `ACTIVE`, pas de bascule automatique                                                                                       | Structurel | idem                             |

## 7. Suivi individuel par événement (notes de match)

| #   | Scénario                                                    | Résultat attendu                                               | Type       | Fichier                              |
| --- | ----------------------------------------------------------- | -------------------------------------------------------------- | ---------- | ------------------------------------ |
| 7.1 | Première note de staff sur un joueur pour un match donné    | Création de la note (`upsert` sur la paire événement + joueur) | Structurel | `match-player-notes.service.spec.ts` |
| 7.2 | Nouvelle note du staff pour le même couple événement/joueur | La note existante est mise à jour plutôt que dupliquée         | Structurel | idem                                 |
| 7.3 | Liste des notes filtrée par événement et/ou par joueur      | Filtres combinables indépendamment                             | Structurel | idem                                 |
| 7.4 | Modification d'une note inexistante                         | `404 Not Found`                                                | Structurel | idem                                 |

## 8. Référentiels de configuration (sports, positions, clubs, staff)

| #   | Scénario                                                           | Résultat attendu                                                                       | Type       | Fichier                     |
| --- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------- | ---------- | --------------------------- |
| 8.1 | Consultation d'un sport avec ses postes et modèles associés        | Détail retourné avec les relations                                                     | Structurel | `sports.service.spec.ts`    |
| 8.2 | Consultation d'un poste (position) inexistant                      | `404 Not Found`                                                                        | Structurel | `positions.service.spec.ts` |
| 8.3 | Consultation du profil du membre du staff actuellement connecté    | Profil retourné à partir de l'identifiant utilisateur authentifié                      | Structurel | `staff.controller.spec.ts`  |
| 8.4 | Accès à `/staff/me` sans utilisateur authentifié (garde défensive) | `401 Unauthorized`                                                                     | Sécurité   | idem                        |
| 8.5 | Visibilité des métriques d'un joueur                               | Une métrique n'est visible que si le questionnaire dont elle est issue est `COMPLETED` | Structurel | `metrics.service.spec.ts`   |

## 9. Disponibilité de service

| #   | Scénario                        | Résultat attendu                             | Type        | Fichier           |
| --- | ------------------------------- | -------------------------------------------- | ----------- | ----------------- |
| 9.1 | Vérification de l'état de l'API | `GET /health` → `200 OK`, `{ status: 'ok' }` | Fonctionnel | `app.e2e-spec.ts` |

## Traçabilité avec le plan de correction des bogues

Plusieurs scénarios de ce cahier de recettes (1.7 à 1.10, 3.4-3.5, 4.4-4.6, 5.3, 5.8, 5.9, 5.12, 8.4) correspondent
directement à des anomalies détectées puis corrigées — voir `docs/plan-correction-bogues.md`. Le cahier de recettes
n'est donc pas une liste théorique rédigée a priori : chaque cas d'erreur qui y figure a été vérifié comme produisant
réellement le comportement attendu après correction.
