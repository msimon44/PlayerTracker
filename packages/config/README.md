# @playertracker/config

Configurations partagées pour ESLint, Prettier et TypeScript dans le monorepo PlayerTracker.

## Structure

```txt
packages/config/
├── eslint/                 # Configurations ESLint
│   ├── base.js             # Config de base
│   ├── nestjs.js           # Spécifique NestJS
│   ├── nextjs.js           # Spécifique Next.js
│   └── react-native.js     # Spécifique React Native
├── prettier/               # Configuration Prettier
│   └── .prettierrc.json
└── typescript/             # Configurations TypeScript
    ├── base.json           # Config de base
    ├── nestjs.json         # Spécifique NestJS
    ├── nextjs.json         # Spécifique Next.js
    └── react-native.json
```

## Utilisation

### ESLint

```javascript
// eslint.config.mjs
import baseConfig from '@playertracker/config/eslint/base';

export default [...baseConfig];
```

**Configs disponibles:**

- `@playertracker/config/eslint/base` - Configuration de base TypeScript
- `@playertracker/config/eslint/nestjs` - Pour apps/api
- `@playertracker/config/eslint/nextjs` - Pour apps/web
- `@playertracker/config/eslint/react-native` - Pour apps/mobile

### Prettier

```json
// .prettierrc.json
"@playertracker/config/prettier/.prettierrc.json"
```

**Configuration:**

```json
{
    "semi": true,
    "singleQuote": true,
    "printWidth": 120,
    "tabWidth": 4,
    "trailingComma": "all"
}
```

### TypeScript

```json
// tsconfig.json
{
    "extends": "@playertracker/config/typescript/base.json"
}
```

**Configs disponibles:**

- `@playertracker/config/typescript/base.json` - Configuration de base
- `@playertracker/config/typescript/nestjs.json` - Pour apps/api
- `@playertracker/config/typescript/nextjs.json` - Pour apps/web
- `@playertracker/config/typescript/react-native.json` - Pour apps/mobile

## Règles ESLint

### Base

- **Quotes:** Simple quotes obligatoires
- **Unused vars:** Autorisé avec préfixe `_`
- **Console:** Warning (pas d'erreur)
- **Debugger:** Erreur en production
- **Const:** Préférer `const` à `let`

### NestJS

Étend la config de base avec:

- Support des décorateurs NestJS
- Règles spécifiques pour les modules/controllers/services

### Next.js

Étend la config de base avec:

- Plugin Next.js officiel
- Règles React 19
- Support App Router

### React Native

Étend la config de base avec:

- Plugin React Native
- Règles spécifiques mobile

## TypeScript Config

### Base (strict mode)

```json
{
    "compilerOptions": {
        "target": "ES2022",
        "module": "ESNext",
        "strict": true,
        "noImplicitAny": true,
        "noUnusedLocals": true,
        "noUnusedParameters": true
    }
}
```

## Installation dans une app

```json
// package.json
{
    "devDependencies": {
        "@playertracker/config": "workspace:*"
    }
}
```

Puis étendre les configs selon les besoins de l'app.
