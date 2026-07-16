# Images Module

Module pour servir et gérer les images statiques de l'application.

## Utilisation

### Accès direct aux fichiers statiques

Les images sont accessibles directement via l'URL :

```
http://localhost:3001/public/images/{filename}
```

Exemple :

```
http://localhost:3001/public/images/kc.png
```

### Endpoints API

#### Lister toutes les images

```
GET /images
```

Retourne :

```json
{
    "images": ["kc.png", "logo.png"],
    "baseUrl": "/public/images"
}
```

#### Récupérer une image par nom

```
GET /images/{filename}
```

Exemple : `GET /images/kc.png`

## Structure des fichiers

```
apps/api/
  └── public/
      └── images/
          ├── kc.png
          └── ... (autres images)
```

## Configuration

### Ajouter une nouvelle image

1. Placez votre fichier image dans `apps/api/public/images/`
2. L'image sera automatiquement accessible via `/public/images/{filename}`

### Formats supportés

- PNG
- JPEG/JPG
- GIF
- WEBP
- SVG

## Utilisation dans le frontend

```typescript
// URL directe
const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/public/images/kc.png`;

// Ou avec l'API
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/images`);
const { images, baseUrl } = await response.json();
```

## Build et Déploiement

Le dossier `public/` est automatiquement copié dans le dossier `dist/` lors du build grâce à la configuration dans
`nest-cli.json`.
