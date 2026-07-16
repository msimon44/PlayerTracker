# PlayerTracker Landing

Site marketing public pour PlayerTracker - Page d'accueil avec présentation du produit et pricing.

## Stack

- **Next.js 16** (App Router) + **React 19**
- **shadcn/ui** (Radix UI + Tailwind CSS)
- **Framer Motion** - Animations fluides
- **MagicUI** - Composants animés custom
- **next-themes** - Mode clair/sombre
- **@playertracker/theme** - Système de thème partagé

## Démarrage rapide

```bash
# Depuis apps/landing
pnpm dev        # Port 3002
```

## Sections du site

1. **Hero Section** - Titre principal + CTA "Testez gratuitement"
2. **Problem Section** - 3 problèmes identifiés (suivi dispersé, réactions tardives, manque d'engagement)
3. **Solution Section** - Bento grid avec 4 features clés
4. **How It Works** - Process en 3 étapes
5. **Testimonials** - 6 témoignages animés en marquee
6. **Pricing** - 3 offres (Découverte, Performance, Excellence)
7. **CTA Section** - Appel final à l'action

## Structure du projet

```txt
apps/landing/
├── src/
│   ├── app/
│   │   ├── (marketing)/      # Pages marketing
│   │   │   ├── page.tsx      # Page d'accueil
│   │   │   └── layout.tsx    # Layout avec header/footer
│   │   ├── layout.tsx        # Layout racine
│   │   └── globals.css       # Styles globaux
│   ├── components/
│   │   ├── landing/          # Sections landing page
│   │   ├── magicui/          # Composants animés (11 composants)
│   │   ├── ui/               # shadcn/ui components
│   │   ├── site-header.tsx   # Header avec navigation
│   │   └── site-footer.tsx   # Footer
│   └── lib/
│       └── config.tsx        # Configuration du site
├── public/                   # Assets (images)
└── tailwind.config.ts        # Config Tailwind + animations
```

## Commandes

```bash
# Développement
pnpm dev                    # Démarre sur :3002

# Build
pnpm build                  # Build pour production
pnpm start                  # Démarre en production

# Code quality
pnpm lint                   # ESLint
pnpm format                 # Prettier
```

## Variables d'environnement

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Composants animés (MagicUI)

11 composants custom pour effets visuels :

- **particles** - Fond de particules animées
- **marquee** - Défilement infini
- **flickering-grid** - Grille animée
- **ripple** - Effet d'onde
- **border-beam** - Bordure animée
- **bento-grid** - Layout en grille
- **magic-card** - Cartes 3D hover
- **shine-border** - Bordure brillante
- **text-shimmer** - Texte scintillant
- **sphere-mask** - Masque sphérique

## Pricing

3 offres tarifaires :

- **Découverte** : 50€/mois (40€/an) - 30 utilisateurs, 1 équipe
- **Performance** : 100€/mois (90€/an) - 60 utilisateurs, 2 équipes (Populaire)
- **Excellence** : 200€/mois (190€/an) - Illimité + analyse IA

## Thème

- **Mode clair/sombre** avec persistance
- **Athletic Balance** palette (Orange, Teal, Violet)
- **15+ animations** custom (fade-in, fade-up, shimmer, marquee, etc.)
