# Accessibilité

## Référentiel choisi

**RGAA 4.1.2** (Référentiel Général d'Amélioration de l'Accessibilité), la déclinaison
française du WCAG 2.1 niveau AA.

Ce choix est justifié par :

- c'est le référentiel de référence pour les services numériques utilisés en France,
  qu'ils soient publics ou privés (PlayerTracker s'adresse à des clubs sportifs
  français) ;
- il est directement adossé au WCAG 2.1, standard international, ce qui rend la
  démarche transposable si le produit s'internationalise ;
- ses critères sont concrets et vérifiables techniquement (contrairement à OPQUAST,
  plus large mais moins ciblé spécifiquement sur le handicap), ce qui permet un audit
  et des corrections directement actionnables sur le code.

## Périmètre de la démarche

L'effort a porté en priorité sur **`apps/web`**, l'application principale utilisée au
quotidien par le staff des clubs (gestion des joueurs, équipes, questionnaires,
calendrier). C'est le produit où l'accessibilité a le plus d'impact réel : usage
prolongé, usage professionnel, obligation légale la plus probable pour ce type de
service.

`apps/landing` (site vitrine) a été vérifié plus légèrement. `apps/mobile` est encore
au stade de développement initial (voir README) et n'a pas encore fait l'objet d'un
audit — c'est un chantier identifié pour la suite plutôt qu'un oubli.

## Méthodologie

Il ne s'agit pas d'un audit RGAA complet et certifié (106 critères, grille complète) :
cela dépasse le cadre de ce projet. La démarche appliquée est :

1. **Revue de code ciblée** sur les points RGAA les plus fréquemment source de
   non-conformité et les plus impactants pour un utilisateur de lecteur d'écran ou de
   navigation clavier : langue de la page, texte alternatif des images, nom accessible
   des boutons et champs de formulaire.
2. **Correction directe** des écarts trouvés (voir ci-dessous).
3. **Recommandation d'outillage** pour la suite (voir section Suivi).

## Constats et corrections apportées

| # | Critère RGAA concerné | Constat | Correction |
|---|---|---|---|
| 1 | **8.3** — Langue par défaut de la page | `apps/landing` déclarait `<html lang="en">` alors que tout le contenu est en français | `lang="fr"` |
| 2 | **7.1** — Chaque bouton a un intitulé | 8 boutons icône-seule (retour, édition, suppression, navigation calendrier) sans nom accessible : un lecteur d'écran les annonçait comme un bouton vide | Ajout de `aria-label` explicite (« Retour », « Modifier le joueur », « Période précédente »...) et `aria-hidden="true"` sur les icônes décoratives associées |
| 3 | **11.1 / 11.2** — Chaque champ de formulaire a une étiquette | Le champ de recherche joueurs n'avait qu'un `placeholder` (non fiable : disparaît à la saisie, mal supporté par certains lecteurs d'écran) | Ajout de `aria-label="Rechercher un joueur par nom ou surnom"` |
| 4 | **1.1** — Chaque image porteuse d'information a une alternative textuelle | Vérifié sur l'ensemble des `<img>` de `apps/web` | Déjà conforme : toutes les images (photos joueurs, logos clubs, icônes de sport/poste) ont un `alt` pertinent |

Les boutons d'action des listes (édition/suppression de questionnaires, menu contextuel)
utilisaient déjà le bon pattern (`<span className="sr-only">`) et n'ont pas nécessité de
correction.

## Ce que ça signifie concrètement

- Un utilisateur de lecteur d'écran (NVDA, VoiceOver...) qui navigue sur `apps/web`
  entend maintenant correctement la langue de la page, et chaque bouton/champ annonce
  clairement son rôle plutôt qu'un « bouton » ou un « champ de saisie » muet.
- Un utilisateur en navigation clavier seule peut identifier chaque contrôle
  interactif par son intitulé au fur et à mesure de la tabulation.

## Limites connues et suivi

Cette démarche couvre les non-conformités les plus visibles, pas l'intégralité de la
grille RGAA. Restent notamment à vérifier/traiter dans un prochain cycle :

- **Contraste des couleurs** (RGAA thème 3) : non vérifié systématiquement, à contrôler
  avec un outil dédié (ex. axe DevTools, contrast checker) sur la charte de couleurs de
  `packages/theme`.
- **Navigation clavier complète** (RGAA thème 12) : focus visible et ordre de
  tabulation à tester manuellement sur les parcours principaux (création de joueur,
  questionnaire).
- **Icônes décoratives restantes** : de nombreuses icônes `lucide-react` hors des
  composants corrigés ici ne portent pas encore `aria-hidden="true"` ; sans impact
  bloquant (elles sont à côté d'un texte), mais à généraliser par convention.
- **`apps/mobile`** : aucun audit accessibilité (`accessibilityLabel`,
  `accessibilityRole`) n'a encore été fait, l'application étant encore au stade initial.

**Outillage recommandé pour la suite** : intégrer `@axe-core/react` en développement
et/ou une passe Lighthouse accessibilité dans la CI, pour détecter automatiquement les
régressions plutôt que de dépendre uniquement de revues manuelles ponctuelles comme
celle-ci.
