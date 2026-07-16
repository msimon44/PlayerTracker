# Gestion des Images dans Playertracker

## Vue d'ensemble

Le système d'images permet de stocker et afficher les logos d'équipes et les photos de joueurs.

## Stockage des images

### Côté API

Les images sont stockées dans le dossier `apps/api/public/images/`.

### Structure

```
apps/api/
  └── public/
      └── images/
          ├── kc.png
          ├── team-logo-1.png
          ├── player-photo-1.jpg
          └── ...
```

## Base de données

Dans la base de données, les champs `logoUrl` (pour les équipes) et `photoUrl` (pour les joueurs) contiennent uniquement
le **nom du fichier**, pas l'URL complète.

### Exemples de valeurs en BDD :

- `logoUrl`: `"kc.png"` ou `"/kc.png"`
- `photoUrl`: `"player-1.jpg"` ou `"/player-1.jpg"`

## Affichage des images (Frontend)

### Fonction utilitaire

Utilisez la fonction `getImageUrl()` du module `@/lib/utils` pour construire l'URL complète :

```typescript
import { getImageUrl } from '@/lib/utils';

// Exemple d'utilisation
const imageUrl = getImageUrl(team.logoUrl); // Retourne: "http://localhost:3001/public/images/kc.png"
const photoUrl = getImageUrl(player.photoUrl); // Retourne: "http://localhost:3001/public/images/player-1.jpg"
```

### Exemple dans un composant

```tsx
import { getImageUrl } from '@/lib/utils';

function TeamCard({ team }) {
    return (
        <div>
            {team.logoUrl ? (
                <img src={getImageUrl(team.logoUrl) || ''} alt={team.name} className='w-12 h-12 object-contain' />
            ) : (
                <div className='w-12 h-12 bg-gray-200 flex items-center justify-center'>
                    {team.name.substring(0, 2).toUpperCase()}
                </div>
            )}
        </div>
    );
}
```

## Endpoints API

### Accès direct aux fichiers

```
GET /public/images/{filename}
```

Exemple : `http://localhost:3001/public/images/kc.png`

### Endpoints de gestion

#### Lister toutes les images

```
GET /images
```

Retour :

```json
{
    "images": ["kc.png", "team-logo-1.png", "player-1.jpg"],
    "baseUrl": "/public/images"
}
```

#### Récupérer une image

```
GET /images/{filename}
```

## Ajouter une nouvelle image

1. Placez le fichier image dans `apps/api/public/images/`
2. Mettez à jour le champ `logoUrl` ou `photoUrl` dans la base de données avec le nom du fichier
3. L'image sera automatiquement accessible

### Exemple SQL

```sql
-- Pour une équipe
UPDATE "Team" SET "logoUrl" = 'kc.png' WHERE id = 1;

-- Pour un joueur
UPDATE "Player" SET "photoUrl" = 'player-1.jpg' WHERE id = 1;
```

## Formats supportés

- PNG (recommandé pour les logos avec transparence)
- JPEG/JPG
- GIF
- WEBP
- SVG

## Variables d'environnement

Assurez-vous que l'URL de l'API est correctement configurée :

```env
# apps/web/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Notes importantes

1. **Transparence** : Utilisez des PNG avec canal alpha pour les logos avec fond transparent
2. **Performance** : Optimisez vos images avant de les ajouter (compression, dimensions raisonnables)
3. **Nommage** : Utilisez des noms de fichiers clairs et uniques
4. **Sécurité** : Les images sont publiquement accessibles sans authentification

## Déploiement

Le dossier `public/` est automatiquement copié dans `dist/` lors du build grâce à la configuration dans `nest-cli.json`.

Assurez-vous que :

- Le dossier `public/images/` existe dans votre environnement de production
- Les permissions permettent la lecture des fichiers
- L'URL de l'API est correctement configurée dans les variables d'environnement de production
