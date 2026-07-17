# Sécurité — Synthèse OWASP Top 10 (2021)

Ce document mappe les mesures de sécurité effectivement implémentées dans PlayerTracker
aux 10 catégories du classement OWASP Top 10 (édition 2021, toujours la référence
actuelle). Il complète `SECURITY.md`, qui détaille l'architecture d'authentification ;
ce document se concentre sur la couverture des failles OWASP spécifiquement.

## A01:2021 — Broken Access Control (contrôle d'accès défaillant)

**Couvert.**

- `JwtAuthGuard` appliqué globalement (`APP_GUARD` dans `AuthModule`) : toute route est
  protégée par défaut, l'accès public est une exception explicite via le décorateur
  `@Public()` — pas l'inverse. Ce choix "secure by default" évite d'oublier de protéger
  une route.
- `RolesGuard` + décorateur `@Roles()` pour le contrôle d'accès basé sur les rôles
  (STAFF / PLAYER / ADMIN).
- Restrictions de plateforme (web réservé aux STAFF, mobile aux PLAYER), validées
  côté serveur dans `AuthService`, pas seulement côté client — cf. les tests unitaires
  `auth.service.spec.ts`.

## A02:2021 — Cryptographic Failures (failles cryptographiques)

**Couvert.**

- Mots de passe hachés avec `bcrypt` (12 rounds), jamais stockés ni journalisés en
  clair.
- Tokens OAuth (access/refresh) chiffrés au repos via `EncryptionService`
  (AES-256-GCM, clé dérivée par `scrypt`).
- JWT signés avec des secrets dédiés et distincts pour access token / refresh token
  (`JWT_SECRET` / `JWT_REFRESH_SECRET`), validés comme requis au démarrage
  (`config.module.ts`, schéma Joi).
- Cookies de session `httpOnly` + `secure` en production (`main.ts`).

## A03:2021 — Injection

**Couvert.**

- Accès base de données exclusivement via Prisma ORM (requêtes paramétrées), aucune
  requête SQL brute concaténée nulle part dans le code.
- Validation stricte des entrées : `ValidationPipe` global (`whitelist: true`,
  `forbidNonWhitelisted: true`) + décorateurs `class-validator` sur les DTOs +
  `ZodValidationPipe` en complément. Toute propriété non déclarée dans un DTO est
  rejetée plutôt qu'ignorée silencieusement.

## A04:2021 — Insecure Design (conception non sécurisée)

**Partiellement couvert.**

- Exemple positif : la liaison d'un compte OAuth à un compte existant n'est jamais
  automatique — elle nécessite une confirmation explicite par email
  (`AuthService.validateOAuthUser`), ce qui empêche un attaquant de prendre le contrôle
  d'un compte via un provider OAuth qu'il maîtrise avec la même adresse email.
- Point trouvé et corrigé pendant ce travail : la vérification "mot de passe courant"
  du validateur de force de mot de passe était du code mort en pratique (voir
  `password-strength.validator.spec.ts`) — un défaut de conception silencieux, sans
  message d'erreur ni log, qui aurait pu rester indétecté indéfiniment sans tests.
  Corrigé.

## A05:2021 — Security Misconfiguration (mauvaise configuration)

**Couvert.**

- `helmet()` activé globalement (en-têtes de sécurité HTTP par défaut).
- CORS explicitement configuré par variable d'environnement (`CORS_ORIGIN`), pas de
  wildcard `*` en production.
- Filtre d'exception global (`GlobalExceptionFilter`) : ne renvoie jamais la stack
  trace ni les détails internes au client en cas d'erreur 500, seulement un message
  générique — les détails complets vont uniquement dans les logs serveur.
- Variables sensibles validées comme requises au démarrage (`DATABASE_URL`,
  `JWT_SECRET`) : l'application refuse de démarrer plutôt que de tourner avec une
  configuration incomplète ou des valeurs par défaut dangereuses.

## A06:2021 — Vulnerable and Outdated Components (composants vulnérables)

**Couvert (et une faille critique corrigée pendant cet audit).**

Un `pnpm audit` réalisé dans le cadre de ce travail a révélé une **vulnérabilité
critique** : `next@16.0.3` (utilisé par `apps/web` et `apps/landing`) était exposé à une
RCE (exécution de code arbitraire) via le protocole React Flight
([GHSA-9qr9-h5gf-34mp](https://github.com/advisories/GHSA-9qr9-h5gf-34mp)), corrigée en
`16.0.7`. **Les deux applications ont été mises à jour immédiatement.**

Mesures pérennes mises en place suite à ce constat :

- **Dependabot** configuré (`.github/dependabot.yml`) pour surveiller en continu les
  dépendances npm, les images Docker de base et les actions GitHub utilisées en CI,
  avec ouverture automatique de PR hebdomadaires.
- Le pipeline CI reconstruit les images Docker à chaque merge sur `main`, garantissant
  qu'une mise à jour de sécurité est effectivement déployée dès sa fusion plutôt que de
  rester dans un commit non déployé.

Vulnérabilité restante connue et documentée : une faille dans `shell-quote` (transitive
via les outils de développement d'Expo/React Native, `react-devtools-core`) — sans
correctif amont disponible à ce jour, sans impact en production (outil de dev
uniquement, jamais exécuté côté serveur ni dans le build de production).

## A07:2021 — Identification and Authentication Failures

**Couvert.**

- Politique de mot de passe forte (8 caractères min., majuscule, minuscule, chiffre,
  caractère spécial, rejet des mots de passe courants) — testée unitairement.
- Rate limiting spécifique sur les endpoints sensibles (`@Throttle`) : 3 tentatives de
  connexion par minute, 5 inscriptions par heure, etc. — protège contre le
  bruteforce/credential stuffing.
- Révocation de token à la déconnexion (table `RevokedToken`, vérifiée à chaque
  requête authentifiée).
- Access token courte durée (1h) / refresh token longue durée (30j) séparés, avec
  secrets distincts.

## A08:2021 — Software and Data Integrity Failures

**Partiellement couvert.**

- Le pipeline CI/CD (`turbo prune` + `pnpm install --frozen-lockfile`) garantit que le
  build utilise exactement les versions figées dans `pnpm-lock.yaml`, sans dérive
  possible entre environnements.
- Les images Docker publiées sur GHCR sont taguées par SHA de commit en plus de
  `latest`, ce qui permet de tracer précisément quelle version du code tourne en
  production.
- Non couvert à ce jour : signature des images Docker (ex. cosign/Sigstore) et
  vérification d'intégrité des dépendances tierces au-delà du lockfile (SBOM). Identifié
  comme amélioration future plutôt que traité dans ce cycle.

## A09:2021 — Security Logging and Monitoring Failures

**Couvert.**

- Table `AuditLog` dédiée (module `audit-logs`), qui trace utilisateur, action, type et
  ID de la ressource ciblée, horodatage.
- `LoggingInterceptor` global : journalise méthode, URL, code de statut et temps de
  réponse de chaque requête.
- `GlobalExceptionFilter` : les erreurs 500 sont journalisées avec la stack trace
  complète côté serveur (jamais exposée au client), les erreurs 4xx sont journalisées en
  warning avec le corps de la requête pour faciliter le diagnostic.

## A10:2021 — Server-Side Request Forgery (SSRF)

**Non applicable dans l'état actuel.** L'application ne fait pas de requêtes HTTP
sortantes construites à partir d'une entrée utilisateur (pas de fonctionnalité de type
"webhook", "import depuis une URL" ou proxy). Les seuls appels sortants sont vers des
providers OAuth connus et codés en dur (Google, Apple). Point de vigilance pour toute
future fonctionnalité qui accepterait une URL fournie par l'utilisateur.

## Synthèse

| Catégorie | Statut |
|---|---|
| A01 — Broken Access Control | ✅ Couvert |
| A02 — Cryptographic Failures | ✅ Couvert |
| A03 — Injection | ✅ Couvert |
| A04 — Insecure Design | ⚠️ Partiel (1 défaut corrigé) |
| A05 — Security Misconfiguration | ✅ Couvert |
| A06 — Vulnerable Components | ✅ Couvert (1 faille critique corrigée + veille continue mise en place) |
| A07 — Authentication Failures | ✅ Couvert |
| A08 — Software/Data Integrity | ⚠️ Partiel (signature d'images non traitée) |
| A09 — Logging & Monitoring | ✅ Couvert |
| A10 — SSRF | ➖ Non applicable |

8 catégories sur 10 sont couvertes par des mesures vérifiables dans le code, avec
preuves (fichiers, tests, configuration). Les 2 catégories partielles ont leurs limites
explicitement documentées plutôt que passées sous silence.
