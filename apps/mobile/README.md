# PlayerTracker Mobile

Application mobile React Native / Expo pour PlayerTracker.

## 📱 Stack technique

- **Expo SDK 54** (New Architecture)
- **React Native 0.81.5**
- **Expo Router 6** (File-based routing)
- **NativeWind 4** (Tailwind CSS pour React Native)
- **React Query** (TanStack Query pour l'état serveur)
- **Orval** (Génération automatique du client API)

## 🚀 Démarrage rapide

### Depuis la racine du monorepo

    ```bash
    npm install
    ```

2. Start the app

    ```bash
    npx expo start
    ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses
[file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
# Installer Xcode depuis l'App Store
# Puis dans le terminal Expo, tapez:
i
```

**Android:**

```bash
# Installer Android Studio
# Configurer un émulateur Android
# Puis dans le terminal Expo, tapez:
a
```

### Option 3: Web (pour tests rapides)

```bash
# Dans le terminal Expo, tapez:
w
```

L'app s'ouvrira dans votre navigateur (fonctionnalités limitées)

## 🔧 Configuration

### Variables d'environnement

Créez un fichier `.env` (copier depuis `.env.example`):

```bash
cp .env.example .env
```

Variables disponibles:

- `EXPO_PUBLIC_API_URL` - URL de l'API backend (défaut: `http://localhost:3001`)

### Génération du client API

Le client API est généré automatiquement depuis le contrat OpenAPI:

```bash
# Générer le client
pnpm generate:client

# Ou depuis la racine
make dev-mobile  # Génère automatiquement
```

Fichiers générés dans `src/lib/generated/`

## 📁 Structure du projet

```txt
apps/mobile/
├── src/
│   ├── app/              # Routes (Expo Router)
│   │   ├── (tabs)/      # Navigation par tabs
│   │   │   ├── index.tsx
│   │   │   └── explore.tsx
│   │   └── _layout.tsx  # Layout racine
│   ├── components/      # Composants UI
│   ├── features/        # Features (auth, etc.)
│   ├── hooks/           # Custom hooks
│   ├── lib/
│   │   ├── api-client.ts      # Instance Axios
│   │   ├── react-query.tsx    # Config React Query
│   │   └── generated/         # Client API (généré)
│   ├── styles/
│   │   └── global.css         # Styles Tailwind
│   └── assets/          # Images, fonts
├── app.config.js        # Config Expo
├── metro.config.js      # Config Metro (monorepo)
├── orval.config.ts      # Config génération API
├── tailwind.config.js   # Config TailwindCSS
└── babel.config.js      # Config Babel
```

## 🛠 Scripts disponibles

```bash
pnpm start              # Démarre Expo
pnpm dev                # Alias de start
pnpm android            # Lance sur Android
pnpm ios                # Lance sur iOS
pnpm web                # Lance sur web
pnpm lint               # Lint le code
pnpm type-check         # Vérifie les types TS
pnpm generate:client    # Génère le client API
```

## 🎨 Styling avec NativeWind

Utilisez les classes Tailwind directement:

```tsx
import { View, Text } from 'react-native';

export default function MyComponent() {
    return (
        <View className='flex-1 items-center justify-center bg-white'>
            <Text className='text-2xl font-bold text-blue-500'>Hello PlayerTracker!</Text>
        </View>
    );
}
```

## 🔌 Utilisation du client API

Exemples avec React Query:

```tsx
import { useGetUsers, useCreateUser } from '@/lib/generated/users';

export default function UsersScreen() {
    // Récupérer les utilisateurs
    const { data: users, isLoading } = useGetUsers();

    // Créer un utilisateur
    const createUser = useCreateUser();

    const handleCreate = () => {
        createUser.mutate({
            email: 'john@example.com',
            name: 'John Doe',
        });
    };

    // ...
}
```

## 🐛 Debugging

### Clear cache

```bash
pnpm start --clear
```

### Reset tout

```bash
rm -rf node_modules .expo
pnpm install
```

### Logs détaillés

```bash
EXPO_DEBUG=true pnpm start
```

## 📦 Build pour production

### Avec EAS Build (recommandé)

```bash
# Installer EAS CLI
npm install -g eas-cli

# Login
eas login

# Configurer
eas build:configure

# Build iOS
eas build --platform ios

# Build Android
eas build --platform android
```

### Build local

```bash
# iOS (macOS uniquement)
pnpm ios --configuration Release

# Android
pnpm android --variant release
```

## 🚀 Déploiement

### TestFlight (iOS)

```bash
eas submit --platform ios
```

### Google Play (Android)

```bash
eas submit --platform android
```

## 📚 Documentation

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [NativeWind](https://www.nativewind.dev/)
- [React Query](https://tanstack.com/query/latest)
- [Orval](https://orval.dev/)

## 🆘 Problèmes courants

### "Unable to resolve module" ou "Unable to resolve expo-modules-core"

**Note importante sur la configuration monorepo:**

Ce projet utilise **pnpm** dans un monorepo. Pour que Metro bundler puisse résoudre correctement les dépendances React
Native et Expo, nous avons appliqué les configurations suivantes:

1. **expo-modules-core en dépendance directe** - Bien qu'expo-doctor recommande de ne pas l'installer directement, c'est
   nécessaire dans un monorepo pnpm pour que Metro puisse le résoudre. Le package est exclu des vérifications
   d'expo-doctor via `package.json > expo.install.exclude`.

2. **Configuration .npmrc à la racine** - Le fichier `/.npmrc` configure le hoisting public pour les packages Expo et
   React Native, permettant à Metro de les trouver facilement.

3. **Metro config simplifié** - Le `metro.config.js` utilise les valeurs par défaut d'Expo qui détectent automatiquement
   la structure du monorepo.

Si vous rencontrez des erreurs de résolution de modules:

```bash
# 1. Nettoyer complètement
cd /Users/enzo/DEV/Athlete_Flow/PlayerTracker
rm -rf node_modules apps/mobile/node_modules apps/mobile/.expo

# 2. Réinstaller avec la config .npmrc
pnpm install

# 3. Démarrer Expo avec cache vide
cd apps/mobile
pnpm start --clear
```

### "Metro bundler failed to start"

```bash
killall -9 node
pnpm start
```

### "Build failed" sur iOS

Vérifiez que Xcode est installé et à jour:

```bash
xcode-select --install
```

### L'app ne se connecte pas à l'API

1. Vérifiez que l'API tourne sur `http://localhost:3001`
2. Sur émulateur Android, utilisez `10.0.2.2:3001` au lieu de `localhost:3001`
3. Sur appareil physique, utilisez l'IP locale de votre machine

## 🔗 Liens utiles

- [API README](../api/README.md) - Documentation de l'API
- [Expo Status](https://status.expo.dev/) - Statut des services Expo
