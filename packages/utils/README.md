# @playertracker/utils

Fonctions utilitaires partagées pour les applications PlayerTracker.

## Installation

Ce package est déjà disponible dans le monorepo :

```json
{
    "dependencies": {
        "@playertracker/utils": "workspace:*"
    }
}
```

## Exports disponibles

### CSS & Styling

```typescript
import { cn } from '@playertracker/utils';

// Merge classes Tailwind intelligemment
const className = cn('bg-primary', isActive && 'text-white', 'p-4');
```

### Dates

```typescript
import { formatDate, formatDateDistance } from '@playertracker/utils';

formatDate(new Date(), 'PPP'); // "1 janvier 2025"
formatDateDistance(new Date()); // "il y a 2 heures"
```

### Strings

```typescript
import { capitalize, truncateText, slugify } from '@playertracker/utils';

capitalize('hello'); // "Hello"
truncateText('Long text...', 10); // "Long text..."
slugify('Hello World!'); // "hello-world"
```

### Numbers

```typescript
import { formatNumber, formatCurrency, clamp } from '@playertracker/utils';

formatNumber(1234); // "1 234" (format français)
formatCurrency(99.99); // "99,99 €"
clamp(150, 0, 100); // 100
```

### Arrays

```typescript
import { groupBy, unique, shuffle } from '@playertracker/utils';

groupBy([{ id: 1, role: 'player' }], (item) => item.role);
// { player: [{ id: 1, role: 'player' }] }

unique([1, 2, 2, 3]); // [1, 2, 3]
shuffle([1, 2, 3]); // [2, 3, 1] (ordre aléatoire)
```

### Validation

```typescript
import { isEmail, isUrl, isPhoneNumber } from '@playertracker/utils';

isEmail('user@example.com'); // true
isUrl('https://example.com'); // true
isPhoneNumber('0612345678'); // true (format français)
```

### Objects

```typescript
import { pick, omit } from '@playertracker/utils';

pick({ a: 1, b: 2, c: 3 }, ['a', 'b']); // { a: 1, b: 2 }
omit({ a: 1, b: 2, c: 3 }, ['c']); // { a: 1, b: 2 }
```

### Errors

```typescript
import { AppError, safeJsonParse } from '@playertracker/utils';

throw new AppError('Invalid input', 400);

const data = safeJsonParse('invalid json', { fallback: true });
// { fallback: true }
```

## Technologies

- **clsx** - Utilitaire de classes CSS
- **tailwind-merge** - Fusion de classes Tailwind
- **date-fns** - Manipulation de dates
- **zod** - Validation de schémas

## Build

```bash
# Compiler
pnpm build

# Mode watch
pnpm dev

# Linting
pnpm lint
```

## Utilisation dans les apps

```typescript
// Web
import { cn, formatDate } from '@playertracker/utils';

// Mobile
import { isEmail, slugify } from '@playertracker/utils';

// API
import { AppError, safeJsonParse } from '@playertracker/utils';
```
