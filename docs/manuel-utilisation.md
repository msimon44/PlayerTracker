# Manuel d'utilisation

Ce manuel s'adresse aux utilisateurs de l'application web PlayerTracker (personnel encadrant d'un club sportif —
entraîneurs, dirigeants, staff médical). Il décrit les fonctionnalités disponibles depuis `https://app.<votre-domaine>`
(ou `http://localhost:3000` en environnement de développement).

> L'application mobile (joueurs) est encore en cours de développement et n'est pas couverte par ce manuel — voir
> `README.md` pour son état d'avancement.

## 1. Accès à l'application

PlayerTracker distingue deux plateformes avec des rôles dédiés :

- **Application web** (`app.<domaine>`) : réservée aux comptes **STAFF** (entraîneurs, dirigeants).
- **Application mobile** : réservée aux comptes **PLAYER** (joueurs).

Tenter de se connecter avec un compte PLAYER sur le web (ou inversement) est refusé : c'est une protection volontaire,
pas une erreur.

### 1.1 Créer un compte

1. Sur la page de connexion, cliquer sur "Créer un compte".
2. Renseigner email, mot de passe, prénom et nom.
3. Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial
   (ex. `!@#$%`), et ne pas être un mot de passe trop courant (ex. `Password1!` est refusé même s'il respecte les règles
   ci-dessus, car il dérive directement de "password").
4. En tant que STAFF, il faut ensuite rejoindre un club existant ou en créer un nouveau (nom du club).
5. Un email de vérification est envoyé à l'adresse fournie.

Alternative : connexion via Google (bouton "Continuer avec Google" sur la page de connexion), si cette option a été
configurée par l'administrateur de l'instance.

### 1.2 Mot de passe oublié

Depuis la page de connexion, "Mot de passe oublié ?" → renseigner l'email → un lien de réinitialisation valable 1 heure
est envoyé. Pour des raisons de sécurité, l'application ne révèle jamais si un email existe ou non dans la base : le
message de confirmation s'affiche dans tous les cas.

## 2. Tableau de bord

Page d'accueil après connexion : vue d'ensemble du club (effectifs, prochains événements, questionnaires en cours).

## 3. Gestion des joueurs

Menu "Joueurs" :

- **Liste et recherche** : recherche par nom ou surnom (champ de recherche en haut de la liste).
- **Fiche joueur** : informations générales, photo, position, équipe, et données sensibles (poids, taille, date de
  naissance, notes médicales — accès restreint).
- **Créer un joueur** : formulaire avec informations générales ; l'équipe et la position sont optionnelles à la création
  et peuvent être renseignées plus tard.
- **Modifier / Supprimer** : depuis la fiche joueur. La suppression d'un joueur ayant un compte utilisateur associé
  supprime également ce compte.

## 4. Gestion des équipes

Menu "Équipes" :

- Créer une équipe (nom, sport, description).
- Depuis la fiche d'une équipe, ajouter ou retirer des joueurs de l'effectif — un joueur ajouté à une équipe est
  automatiquement marqué "actif" ; un joueur retiré est marqué "inactif" (mais pas supprimé : il reste consultable dans
  la liste générale des joueurs du club).

## 5. Calendrier

Menu "Calendrier" : vue mensuelle/hebdomadaire des événements du club (matchs, entraînements). Navigation entre périodes
avec les flèches précédent/suivant.

## 6. Questionnaires

Menu "Questionnaires" — utilisé pour le suivi (bien-être, ressenti physique, etc.) :

1. **Créer un questionnaire** : titre, description, puis ajout de questions (texte libre, choix multiple, échelle...).
2. **Statuts** : un questionnaire est en brouillon tant qu'il n'est pas publié ; une fois publié, il devient accessible
   aux joueurs concernés (application mobile).
3. **Résultats** : consultables depuis la fiche du questionnaire une fois des réponses reçues.
4. **Modèles de questions/questionnaires** réutilisables pour ne pas tout recréer à chaque fois.

## 7. Métriques

Menu "Métriques" : indicateurs agrégés sur le club/l'équipe (à compléter au fur et à mesure de l'évolution du produit).

## 8. Gestion du compte

- **Changer de mot de passe** : depuis les paramètres du compte, en renseignant le mot de passe actuel puis le nouveau.
- **Déconnexion** : invalide immédiatement la session côté serveur (le token d'accès est révoqué, pas seulement supprimé
  côté navigateur).

## 9. Assistance

En cas de blocage technique (erreur inattendue, page qui ne charge pas), noter :

- l'URL de la page,
- l'action effectuée juste avant l'erreur,
- le message d'erreur affiché s'il y en a un,

et transmettre ces informations à l'équipe technique — voir le processus de signalement d'anomalie dans
`docs/plan-correction-bogues.md`.
