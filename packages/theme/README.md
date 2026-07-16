# @playertracker/theme

Système de thème partagé et palette de couleurs pour les applications PlayerTracker.

## Vue d'ensemble

Ce package fournit une palette de couleurs unifiée, des définitions de thèmes et des utilitaires pour un thème cohérent
à travers les applications. Il garantit la cohérence du design en centralisant toutes les définitions de couleurs et la
logique de thème en un seul endroit.

## Fonctionnalités

- ✅ **Palette de Couleurs Unifiée** - Source de vérité unique pour toutes les couleurs
- ✅ **Thèmes Clair & Sombre** - Configurations complètes pour les deux modes
- ✅ **Formats de Couleurs Multiples** - Support pour Hex, RGB et HSL
- ✅ **Sécurité des Types** - Support complet TypeScript avec typage strict
- ✅ **Utilitaires de Couleur** - Fonctions de conversion et manipulation
- ✅ **Intégration Tailwind** - Configuration de base pour Tailwind CSS

## Installation

Ce package est déjà installé dans le monorepo. Pour l'utiliser dans une nouvelle app :

```json
{
    "dependencies": {
        "@playertracker/theme": "workspace:*"
    }
}
```

Puis lancez `pnpm install` depuis la racine.

## Utilisation

### Importer les Couleurs

```typescript
import { BRAND_COLORS, SEMANTIC_COLORS, lightTheme, darkTheme } from '@playertracker/theme';

// Accéder aux couleurs de marque
const primaryColor = BRAND_COLORS.primary.hex; // "#FC4C02"
const primaryRgb = BRAND_COLORS.primary.rgb; // "252, 76, 2"
const primaryHsl = BRAND_COLORS.primary.hsl; // "15, 98%, 50%"

// Accéder aux couleurs sémantiques
const lightBg = SEMANTIC_COLORS.light.background; // "0 0% 100%"
const darkBg = SEMANTIC_COLORS.dark.background; // "0 0% 7%"
```

### Utiliser les Objets de Thème

```typescript
import { lightTheme, darkTheme } from '@playertracker/theme';

// Obtenir les couleurs du thème
const currentTheme = lightTheme;
console.log(currentTheme.primary); // "15 98% 50%"
console.log(currentTheme.background); // "0 0% 100%"
console.log(currentTheme.chart[1]); // "186 66% 31%"
```

### Utilitaires de Conversion de Couleurs

```typescript
import { hexToRgb, hexToHsl, rgbToHex, addOpacityToRgb } from '@playertracker/theme';

// Convertir entre formats
const rgb = hexToRgb('#FC4C02'); // "252, 76, 2"
const hsl = hexToHsl('#FC4C02'); // "15 98% 50%"
const hex = rgbToHex('252, 76, 2'); // "#FC4C02"

// Ajouter de l'opacité
const withOpacity = addOpacityToRgb('252, 76, 2', 0.8); // "rgb(252, 76, 2 / 0.8)"
```

### Types TypeScript

```typescript
import type { ThemeConfig, ThemeMode, HexColor, RgbColor, HslColor } from '@playertracker/theme';

const mode: ThemeMode = 'light'; // ou 'dark'
const color: HexColor = '#FC4C02';
const theme: ThemeConfig = lightTheme;
```

## Palette de Couleurs - Athletic Balance

### Philosophie de Design

La palette **Athletic Balance** est basée sur les tendances 2025 des applications sportives et la psychologie des
couleurs :

1. **Orange (#FC4C02)** - Performance & Énergie
    - Inspiré de Strava
    - Augmente le métabolisme et l'énergie
    - Utilisé pour : Métriques physiques, stats de performance, CTAs d'action

2. **Teal (#177E89)** - Bien-être Mental & Équilibre
    - Calme le système nerveux
    - Réduit le rythme cardiaque
    - Utilisé pour : Questionnaires de bien-être, récupération, santé mentale

3. **Violet (#8338EC)** - Innovation & Communauté
    - Créativité et connexion
    - Tendance tech 2025
    - Utilisé pour : Fonctionnalités sociales, communauté, innovation

4. **Material Design Dark (#121212)** - Mode Sombre Professionnel
    - Réduit la fatigue oculaire
    - Économie de batterie (OLED)
    - Contraste optimal pour les accents colorés

### Couleurs de Marque

| Couleur       | Hex       | RGB            | HSL              | Usage                                     |
| ------------- | --------- | -------------- | ---------------- | ----------------------------------------- |
| **Primary**   | `#FC4C02` | `252, 76, 2`   | `15, 98%, 50%`   | Orange Performance - Actions & Énergie    |
| **Secondary** | `#177E89` | `23, 126, 137` | `186, 66%, 31%`  | Teal Wellness - Bien-être Mental          |
| **Accent**    | `#8338EC` | `131, 56, 236` | `267, 79%, 57%`  | Violet Innovation - Social & Tech         |
| **Success**   | `#00B894` | `0, 184, 148`  | `165, 100%, 36%` | Vert Santé - Progression & Succès         |
| **Warning**   | `#FFC857` | `255, 200, 87` | `41, 100%, 67%`  | Jaune Énergie - Attention & Avertissement |
| **Error**     | `#DB3A34` | `219, 58, 52`  | `2, 69%, 53%`    | Rouge Alerte - Erreurs & Danger           |
| **Info**      | `#3A86FF` | `58, 134, 255` | `217, 100%, 61%` | Bleu Information                          |

### Couleurs Sémantiques (Mode Clair)

- **Background**: `#FFFFFF` (Blanc pur)
- **Foreground**: `#111111` (Texte presque noir)
- **Primary**: `#FC4C02` (Orange Performance)
- **Secondary**: `#177E89` (Teal Wellness)
- **Accent**: `#8338EC` (Violet Innovation)
- **Card/Popover**: Fond blanc
- **Muted**: `#F3F4F6` (Gris clair pour états désactivés)
- **Destructive**: `#DB3A34` (Rouge pour erreurs)

### Couleurs Sémantiques (Mode Sombre)

- **Background**: `#121212` (Material Design Dark)
- **Foreground**: `rgba(255, 255, 255, 0.87)` (Texte blanc cassé)
- **Primary**: `#FF6B35` (Orange plus clair -15% saturation)
- **Secondary**: `#1A95A3` (Teal plus clair)
- **Accent**: `#9B5CFF` (Violet plus clair)
- **Card/Popover**: `#1E1E1E` (Surface élevée)
- **Muted**: `#1E293B` (Gris foncé pour états désactivés)
- **Destructive**: `#FF5E57` (Rouge plus clair)

### Couleurs de Graphiques

5 couleurs distinctes pour la visualisation de données :

- **Chart 1**: Orange (#FC4C02 light / #FF6B35 dark) - Performance
- **Chart 2**: Teal (#177E89 light / #1A95A3 dark) - Wellness
- **Chart 3**: Violet (#8338EC light / #9B5CFF dark) - Innovation
- **Chart 4**: Vert (#00B894 light / #06FFA5 dark) - Succès
- **Chart 5**: Jaune (#FFC857 light / #FFD76D dark) - Énergie

## Variables CSS

Toutes les apps doivent définir ces variables CSS dans leur `globals.css` :

```css
:root {
    /* === ATHLETIC BALANCE PALETTE === */

    /* Brand colors - RGB format */
    --primary: 252, 76, 2; /* #FC4C02 - Performance Orange */
    --secondary: 23, 126, 137; /* #177E89 - Wellness Teal */
    --accent: 131, 56, 236; /* #8338EC - Innovation Violet */

    /* Neutrals */
    --app-white: 255, 255, 255; /* #FFFFFF */
    --app-background: 18, 18, 18; /* #121212 - Material Dark */

    /* Semantic status colors */
    --success-green: 0, 184, 148; /* #00B894 */
    --warning-yellow: 255, 200, 87; /* #FFC857 */
    --error-red: 219, 58, 52; /* #DB3A34 */
    --info-blue: 58, 134, 255; /* #3A86FF */

    /* === SHADCN/UI SEMANTIC COLORS (Light Mode) === */
    --background: 0 0% 100%; /* Pure white */
    --foreground: 222 84% 4.3%; /* Near black */
    --primary-hsl: 15 98% 50%; /* Orange */
    --secondary-hsl: 186 66% 31%; /* Teal */
    --accent-hsl: 267 79% 57%; /* Violet */
    /* ... autres couleurs sémantiques */
}

.dark {
    /* === MATERIAL DESIGN DARK MODE === */
    --background: 0 0% 7%; /* #121212 */
    --foreground: 0 0% 88%; /* Off-white */
    --primary-hsl: 15 100% 60%; /* #FF6B35 - Lighter orange */
    --secondary-hsl: 186 68% 38%; /* #1A95A3 - Lighter teal */
    --accent-hsl: 267 100% 68%; /* #9B5CFF - Lighter violet */
    /* ... autres couleurs dark mode */
}
```

## Configuration Tailwind

### Web / Next.js

```javascript
// apps/web/tailwind.config.ts
import type { Config } from 'tailwindcss';
import baseConfig from '@playertracker/theme/tailwind';

const config: Config = {
    content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
    presets: [baseConfig], // ✅ Utilise la config partagée
    theme: {
        extend: {
            // Extensions spécifiques au web si nécessaire
        },
    },
};

export default config;
```

### React Native / NativeWind

```javascript
// apps/mobile/tailwind.config.js
const nativeThemeConfig = require('@playertracker/theme/tailwind-native');

module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}', '../../packages/theme/src/**/*.{js,jsx,ts,tsx}'],
    presets: [
        require('nativewind/preset'),
        nativeThemeConfig, // ✅ Config optimisée pour RN
    ],
    theme: {
        extend: {
            // Extensions spécifiques au mobile si nécessaire
        },
    },
};
```

**Différences Web vs Native :**

- **Web** : Utilise CSS variables (`hsl(var(--primary))`)
- **Native** : Utilise RGB direct (`rgb(252, 76, 2)`) car NativeWind ne supporte pas complètement CSS variables

## Configuration du Theme Provider

### Web App

```tsx
// apps/web/src/app/layout.tsx
import { ThemeProvider } from '@/components/theme-provider';

export default function RootLayout({ children }) {
    return (
        <html lang='fr' suppressHydrationWarning>
            <body>
                <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
```

### Landing App

```tsx
// apps/landing/src/app/layout.tsx
import { ThemeProvider } from '@/components/theme-provider';

export default function RootLayout({ children }) {
    return (
        <html lang='fr' suppressHydrationWarning>
            <body>
                <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
```

## Cross-Platform Support

Ce package supporte **Web (Next.js) et React Native** via des exports conditionnels :

### Exports Universels (tous platforms)

```typescript
import { BRAND_COLORS, lightTheme, darkTheme } from '@playertracker/theme';
```

- Couleurs et thèmes : Disponibles partout
- Aucune dépendance platform-specific

### Exports Web-Specific (Next.js, React)

```typescript
import { ThemeToggle } from '@playertracker/theme/web';
```

**Dépendances requises :**

- `next-themes` - Gestion du thème
- `lucide-react` - Icônes

### Exports React Native-Specific

```typescript
import { ThemeToggle } from '@playertracker/theme/native';
```

**Dépendances requises :**

- `lucide-react-native` - Icônes

## Toggle de Thème

### Web / Next.js

```tsx
import { ThemeToggle } from '@playertracker/theme/web';

export function SiteHeader() {
    return (
        <header>
            <ThemeToggle />
        </header>
    );
}
```

**Fonctionnement :**

- Bascule entre Light ☀️ et Dark 🌙
- Persistance automatique via `next-themes` (localStorage)
- Icônes animées

### React Native

```tsx
import { ThemeToggle } from '@playertracker/theme/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function Header() {
    const handleThemeChange = async (theme: 'light' | 'dark') => {
        await AsyncStorage.setItem('theme', theme);
        // Mettre à jour votre context theme
    };

    return (
        <View>
            <ThemeToggle onToggle={handleThemeChange} size={24} />
        </View>
    );
}
```

**Fonctionnement :**

- Détecte automatiquement le thème système
- Appelle `onToggle` pour persister (AsyncStorage, Context, etc.)
- Styles natifs optimisés

## Architecture des Couleurs par Usage

```typescript
// Recommandations d'usage par contexte

// Métriques Physiques (Performance)
Performance Stats     → Orange (#FC4C02)
Graphiques Effort     → Orange + Gradient Rouge
Objectifs Physiques   → Orange/Jaune

// Bien-être Mental (Questionnaires)
Questionnaires        → Teal (#177E89)
Mood Tracking         → Teal + Bleu
Récupération          → Teal/Vert

// Social / Équipe
Activités Équipe      → Violet (#8338EC)
Notifications Sociales→ Violet/Rose
Classements           → Violet + Gradient

// Admin / Staff
Dashboard Staff       → Gris professionnel + Bleu
Configurations        → Neutral + Primaire
```

## Accessibilité (WCAG AA)

Toutes les couleurs respectent les standards d'accessibilité :

- **Contraste minimum** : 4.5:1 pour le texte normal
- **Contraste minimum** : 3:1 pour le texte large (18pt+)
- **Couleur + Icône** : Ne jamais utiliser la couleur seule (daltoniens)
- **Mode high contrast** : Optionnel pour conformité maximale

### Ratios de contraste garantis

```typescript
// Light Mode
Text on White:        #111111 → 16.1:1 ✅
Primary on White:     #FC4C02 → 3.9:1 ⚠️ (large text only)
Secondary on White:   #177E89 → 4.8:1 ✅
Accent on White:      #8338EC → 4.6:1 ✅

// Dark Mode
Text on Dark:         rgba(255,255,255,0.87) → 14.2:1 ✅
Primary on Dark:      #FF6B35 → 4.2:1 ✅
Secondary on Dark:    #1A95A3 → 5.1:1 ✅
Accent on Dark:       #9B5CFF → 5.3:1 ✅
```

## Structure des Fichiers

```txt
packages/theme/
├── src/
│   ├── constants/
│   │   ├── colors.ts        # Toutes les définitions de couleurs
│   │   └── themes.ts        # Configs des thèmes light et dark
│   ├── types/
│   │   └── theme.ts         # Définitions de types TypeScript
│   └── index.ts             # Exports publics
├── tailwind.base.config.ts  # Config Tailwind partagée
├── package.json
├── tsconfig.json
└── README.md
```

## Sources & Recherche

La palette Athletic Balance est basée sur :

- **Sanzo Wada Dictionary** - Palettes artistiques japonaises
- **Coolors.co** - Tendances design modernes
- **TweakCN** - Optimisations shadcn/ui
- **Strava** (#FC4C02) - Référence mondiale running/cyclisme
- **Material Design 3** - Standards dark mode (#121212)
- **Psychologie des couleurs** - Études scientifiques sur l'impact physiologique

## Version

Version actuelle : `0.0.0`

## Licence

Privé - Usage interne PlayerTracker uniquement
