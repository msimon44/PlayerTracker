# Documentation Sécurité - PlayerTracker

## Authentification & Autorisation

### Vue d'ensemble de l'architecture

PlayerTracker utilise un **système d'authentification JWT sécurisé** basé sur les principes suivants :

- **Vérification côté serveur** : Tous les tokens JWT sont vérifiés côté serveur par l'API NestJS avec `passport-jwt`
- **UX côté client uniquement** : Le frontend web décode uniquement les tokens pour améliorer l'UX (vérification
  d'expiration)
- **Ne jamais faire confiance au client** : Toutes les décisions de sécurité sont prises par le backend avec validation
  cryptographique

### Stratégie JWT

#### Backend (API NestJS)

**Emplacement** : `apps/api/src/modules/auth/`

1. **Génération de tokens** (`auth.service.ts:31-46`)
    - Tokens d'accès : expiration 15 minutes
    - Tokens de rafraîchissement : expiration 7 jours
    - Secrets séparés pour access et refresh tokens
    - Payload contient : `sub` (userId), `email`, `role`

2. **Vérification de tokens** (`strategies/jwt.strategy.ts`)
    - Utilise `passport-jwt` avec `JWT_SECRET`
    - Valide la signature cryptographiquement
    - Vérifie le statut de révocation du token
    - Extrait l'utilisateur du payload après validation

3. **Révocation de tokens** (`auth.service.ts:481-510`)
    - Le logout ajoute les tokens à la liste de révocation
    - Les tokens révoqués sont vérifiés à chaque requête
    - Nettoyage automatique des tokens révoqués expirés

4. **Guard JWT global** (`auth.module.ts:72-74`)
    - Authentification JWT activée globalement via `APP_GUARD`
    - Tous les endpoints protégés par défaut
    - Utiliser le décorateur `@Public()` pour exempter des routes spécifiques

#### Frontend Web (Next.js)

**Emplacement** : `apps/web/src/`

1. **Stockage des tokens**
    - Access & refresh tokens stockés dans `localStorage`
    - Access token également dans les cookies pour le middleware
    - Tokens ajoutés à toutes les requêtes API via intercepteur Axios

2. **Rafraîchissement de tokens** (`lib/api-client.ts:29-74`)
    - Rafraîchissement automatique sur erreurs 401
    - Nouvelle tentative transparente de la requête avec nouveau token
    - Redirection vers login si le rafraîchissement échoue

3. **Utilitaires JWT côté client** (`lib/jwt.ts`)
    - **ATTENTION** : Ne vérifie PAS les signatures
    - Utilisé UNIQUEMENT pour l'UX (vérification d'expiration avant appels API)
    - Jamais utilisé pour des décisions de sécurité

4. **Protection par middleware** (`middleware.ts`)
    - Vérifie l'expiration du token avant accès aux pages
    - Redirige vers login si token invalide/expiré
    - Gère les routes publiques et les routes d'authentification

#### Application Mobile (Expo React Native)

**Emplacement** : `apps/mobile/src/`

1. **Stockage sécurisé** (`lib/secure-storage.ts`)
    - Utilise `expo-secure-store` (hardware-backed sur iOS, encrypted SharedPreferences sur Android)
    - Tokens stockés séparément : `playertracker_access_token`, `playertracker_refresh_token`
    - Données utilisateur sérialisées en JSON avec chiffrement système
    - Nettoyage complet au logout

2. **Client API** (`lib/api-client.ts`)
    - Configuration centralisée via `EXPO_PUBLIC_API_URL`
    - **Validation HTTPS stricte** : Refuse de démarrer en production sans HTTPS
    - Refresh token envoyé dans Authorization header (Bearer token)
    - Queue de requêtes pendant le rafraîchissement (anti race-condition)

3. **Rafraîchissement automatique** (`lib/api-client.ts:46-110`)
    - Intercepteur de réponse détecte les 401
    - Refresh automatique avec nouveau access token
    - Retry de la requête originale avec nouveau token
    - Déconnexion forcée si refresh échoue

4. **OAuth mobile** (`app/(auth)/login.tsx`)
    - Deep linking avec scheme `playertracker://`
    - State parameter CSRF protection (stocké dans SecureStore)
    - Authorization code exchange via POST sécurisé
    - Détection et alerte sur tentatives CSRF

5. **Contexte d'authentification** (`contexts/auth-context.tsx`)
    - Gestion d'état global avec React Context
    - Protection automatique des routes
    - Restauration de session au démarrage
    - Méthodes `signIn()`, `signOut()`, `updateUser()`

### Bonnes pratiques de sécurité implémentées

#### 1. Sécurité des mots de passe

- **Hachage Bcrypt** : 25 rounds pour une sécurité renforcée (configurable dans `auth.service.ts:150, 408, 442`)
    - Augmenté de 10 à 25 rounds pour protéger les données sensibles des athlètes
    - Coût computationnel : ~6+ secondes par tentative de hash (vs ~10ms avec 10 rounds)
    - Rend les attaques par force brute computationnellement infaisables
- **Validation de la force du mot de passe** : Validateur personnalisé (`validators/password-strength.validator.ts`)
    - Minimum 8 caractères
    - Majuscules, minuscules, chiffres et caractères spéciaux requis
    - Rejet des mots de passe courants (liste SecLists top 1000)
- **Pas de mot de passe dans les réponses** : Les mots de passe ne sont jamais exposés dans les DTOs

#### 2. Sécurité des tokens

- **Secrets séparés** pour access et refresh tokens
- **Tokens d'accès à courte durée de vie** (15 min)
- **Révocation des tokens** au logout avec vérification à chaque requête
- **Rotation des refresh tokens** lors du rafraîchissement
- **Protection mobile** :
    - Refresh tokens envoyés dans l'Authorization header (Bearer token)
    - Stockage sécurisé avec `expo-secure-store` (hardware-backed)
    - Validation HTTPS stricte en production
    - Auto-refresh transparent sur erreurs 401

#### 3. Limitation de débit (Rate Limiting)

**Throttling appliqué** (`auth.controller.ts`) :

- Inscription : 5 par heure
- Connexion : 3 par minute
- Réinitialisation mot de passe : 3 par minute
- Vérification email : 10 par minute

#### 4. Configuration CORS

- Configuré via la variable d'environnement `CORS_ORIGIN`
- Par défaut : `http://localhost:3000` (dev)
- Doit être défini sur votre domaine de production

#### 5. Sécurité OAuth

**Protection de liaison de compte** (`auth.service.ts:180-249`) :

- Les comptes OAuth ne sont pas automatiquement liés aux emails existants
- Confirmation par email requise avant liaison
- Tokens de liaison à durée limitée (15 minutes)
- Tokens à usage unique

**Flow d'autorisation sécurisé** (`auth.controller.ts`) :

- **Authorization Code Flow** : Les tokens ne sont jamais exposés dans les URLs
    - OAuth callback génère un code temporaire (64 caractères, 15 min expiration)
    - Code échangé via POST `/auth/exchange-code` pour obtenir les tokens
    - Tokens transmis dans le body de la réponse (pas dans l'URL)
    - Codes à usage unique avec nettoyage automatique
- **Protection CSRF** : State parameter avec validation
    - Token aléatoire 32 bytes généré à l'initiation OAuth
    - Stocké côté serveur et client avec expiration 10 minutes
    - Validation obligatoire au callback (échec si invalide/expiré)
    - One-time use pour prévenir les attaques replay
- **Chiffrement des tokens OAuth en base de données** :
    - Tokens Google/Apple chiffrés avec AES-256-GCM
    - IV unique et authentication tag pour chaque token
    - Protection contre les fuites en cas de breach DB
    - Service de chiffrement centralisé (`EncryptionService`)
- **Deep linking mobile** :
    - Scheme `playertracker://auth/callback` configuré
    - Gestion automatique des callbacks OAuth
    - Validation du state parameter côté mobile
    - Détection des tentatives CSRF avec alertes utilisateur

#### 6. Contrôle d'accès basé sur les rôles (RBAC)

- `RolesGuard` global applique les restrictions de rôles
- Utiliser le décorateur `@Roles()` sur les contrôleurs/endpoints
- Rôles disponibles : `PLAYER`, `STAFF`, `ADMIN`

#### 7. Isolation multi-tenant

- Toutes les données limitées au `clubId`
- Le personnel ne peut accéder qu'aux données de son club
- Les joueurs ne peuvent accéder qu'à leurs propres données

### Sécurité des variables d'environnement

**Secrets requis** (voir `apps/api/.env.example`) :

```bash
# CRITIQUE : Changer ces valeurs en production
JWT_SECRET="your-super-secret-jwt-key-here-change-this-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-here-change-this-in-production"

# NOUVEAU : Chiffrement des tokens OAuth (min 32 caractères)
ENCRYPTION_KEY="your-32-character-or-longer-encryption-key-change-in-production"

# Base de données
DATABASE_URL="postgresql://..."

# OAuth (optionnel mais recommandé)
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GOOGLE_CALLBACK_URL="http://localhost:3001/auth/google/callback"

# Production uniquement
APPLE_CLIENT_ID="..."
APPLE_TEAM_ID="..."
APPLE_KEY_ID="..."
APPLE_PRIVATE_KEY_PATH="..."
APPLE_CALLBACK_URL="https://api.playertracker.fr/auth/apple/callback"

# Mobile deep linking
MOBILE_CALLBACK_URL="playertracker://auth/callback"
```

**Ne jamais commiter les fichiers `.env` dans le contrôle de version !**

### Liste de contrôle d'audit

#### Authentification & Tokens

- [x] Vérification JWT côté serveur avec validation cryptographique
- [x] Client jamais considéré de confiance pour les décisions de sécurité
- [x] Mots de passe hachés avec bcrypt (25 rounds)
- [x] Limitation de débit sur les endpoints d'authentification
- [x] Révocation de tokens implémentée avec vérification à chaque requête
- [x] Rotation des refresh tokens lors du rafraîchissement
- [x] Tokens d'accès à courte durée de vie (15 min)
- [x] Refresh tokens envoyés dans Authorization header (mobile)
- [x] Validation HTTPS stricte en production (mobile)

#### OAuth & Sécurité Externe

- [x] Liaison de compte OAuth nécessite confirmation email
- [x] Authorization code flow (tokens jamais dans URL)
- [x] State parameter CSRF protection
- [x] Tokens OAuth chiffrés en DB (AES-256-GCM)
- [x] Deep linking mobile avec validation state
- [x] Codes d'autorisation one-time use avec expiration

#### Architecture & Configuration

- [x] CORS correctement configuré
- [x] Contrôle d'accès basé sur les rôles (RBAC)
- [x] Isolation des données multi-tenant
- [x] Pas de données sensibles dans le payload JWT
- [x] Stockage sécurisé mobile (expo-secure-store hardware-backed)

#### Mobile Security

- [x] Refresh token dans Authorization header (pas body)
- [x] HTTPS enforcement en production
- [x] Secure storage (hardware-backed)
- [x] Auto-refresh avec queue anti race-condition
- [x] OAuth CSRF protection avec state parameter
- [x] Deep linking sécurisé avec validation

### Réponse aux incidents de sécurité

1. **JWT_SECRET compromis** :
    - Faire tourner `JWT_SECRET` et `JWT_REFRESH_SECRET`
    - Forcer la déconnexion de tous les utilisateurs (vider la table des tokens révoqués)
    - Notifier les utilisateurs de se reconnecter

2. **ENCRYPTION_KEY compromis** :
    - Générer une nouvelle clé de chiffrement (min 32 caractères)
    - Les tokens OAuth déjà chiffrés ne pourront pas être déchiffrés
    - Les nouveaux tokens seront chiffrés avec la nouvelle clé
    - Considérer forcer une re-authentification OAuth

3. **Vol de token suspecté** :
    - L'utilisateur peut se déconnecter pour révoquer son token
    - L'admin peut ajouter manuellement des tokens à la liste de révocation
    - Les tokens expirent automatiquement (15 min pour access, 7 jours pour refresh)
    - Mobile : tokens stockés dans secure storage hardware-backed

4. **Attaque par force brute** :
    - La limitation de débit va ralentir les requêtes (3/min login, 5/h register)
    - Bcrypt 25 rounds rend chaque tentative coûteuse (~6+ secondes)
    - Surveiller les logs pour les erreurs 429 répétées
    - Envisager un blocage par adresse IP si nécessaire

5. **Attaque CSRF sur OAuth** :
    - State parameter validation empêche les attaques CSRF
    - Tokens state à usage unique avec expiration 10 minutes
    - Validation côté serveur ET client (mobile)
    - Logs automatiques des tentatives échouées

### Améliorations de sécurité futures

#### Priorité Haute

- [ ] **Authentification à deux facteurs (2FA/TOTP)** - En roadmap pour 2026
    - Support TOTP (Google Authenticator, Authy)
    - Codes de backup pour recovery
    - Support SMS optionnel
- [ ] **Journalisation d'audit** pour les événements de sécurité
    - Logs de connexion (succès/échec)
    - Logs de changement de mot de passe
    - Logs d'accès OAuth
    - Détection d'anomalies

#### Priorité Moyenne

- [ ] Ajouter des cookies `HttpOnly` pour le stockage des tokens web (plus sécurisé que localStorage)
- [ ] Implémenter le suivi des appareils et la détection de connexions suspectes
- [ ] Implémenter l'historique des mots de passe pour éviter la réutilisation (5-10 derniers)
- [ ] Ajouter un CAPTCHA sur login/register après 3 tentatives échouées
- [ ] Implémenter les en-têtes CSP (Content Security Policy)
- [ ] Ajouter une limitation de débit par adresse IP (en plus de par utilisateur)

#### Priorité Basse

- [ ] Certificate pinning pour mobile en production
- [ ] Détection de jailbreak/root sur mobile
- [ ] Prévention de screenshots sur écrans sensibles (mobile)
- [ ] Refresh token proactif (avant expiration)
- [ ] Sessions multiples avec gestion des appareils
- [ ] Notifications de connexion sur nouveau device

### Contacts sécurité

Pour les vulnérabilités de sécurité, veuillez contacter :

- **Email** : <security@playertracker.fr>
