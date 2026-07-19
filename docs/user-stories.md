# User stories

Ce document présente les user stories ayant guidé la conception de PlayerTracker. Elles ne sont pas rédigées a
posteriori pour les besoins de la documentation : elles sont directement issues de la démarche de découverte produit
menée par l'équipe (enquête terrain — 20 structures contactées, questionnaire à 20 questions, entretiens approfondis —
cf. présentation finale du projet), et de la problématique retenue à l'issue du pivot vers le marché de l'e-sport :

> _"Comment aider les structures e-sport à détecter et suivre les problèmes de bien-être de leurs joueurs·euses avant
> qu'il ne soit trop tard ?"_

## Contexte de la découverte utilisateur

L'enquête terrain menée auprès des structures a fait remonter, côté joueurs·euses :

- un suivi actuel **informel** (échanges WhatsApp/Discord avec le staff, à la demande du coach, sans outil dédié) ;
- une **volonté réelle** d'être suivis sur leur bien-être mental, pas seulement sur leur performance ;
- une **frustration identifiée** : la perte de temps à remplir des informations de suivi de façon répétitive ;
- un **besoin de visualisation** de leur propre progression dans le temps.

Ces constats ont directement dimensionné les contraintes du produit : un questionnaire quotidien volontairement très
court (2-3 minutes), et une interface qui donne au joueur un retour visuel sur son historique plutôt qu'une simple
collecte à sens unique.

## User stories — joueurs·euses

| #    | User story                                                                                                                                                                                                    | Fonctionnalité implémentée                                                                                                                                    |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| US-1 | En tant que joueur·euse, je veux remplir un questionnaire quotidien rapide (sommeil, stress, douleurs, humeur, motivation) afin que mon staff puisse détecter un signal de mal-être avant qu'il ne s'aggrave. | Modules `questionnaires` / `questions` / `answers`, avec complétion automatique du questionnaire une fois tous les joueurs actifs répondus (`AnswersService`) |
| US-2 | En tant que joueur·euse, je veux consulter l'historique de mes réponses, afin de suivre ma propre progression dans le temps.                                                                                  | `QuestionnairesService.findResults` / `findRespondents`                                                                                                       |
| US-3 | En tant que joueur·euse, je veux me connecter simplement (email/mot de passe ou Google), afin que le suivi quotidien ne devienne pas lui-même une source de friction.                                         | `AuthService` (inscription/connexion + OAuth Google)                                                                                                          |
| US-4 | En tant que joueur·euse, je veux que mes données médicales/personnelles sensibles restent séparées de mon profil général, afin qu'elles ne soient pas exposées par défaut à l'ensemble du staff.              | Entité `SensitivePlayerData` distincte du profil `Player`, avec contrôle d'accès dédié                                                                        |

## User stories — staff (coachs, managers, préparateurs)

| #     | User story                                                                                                                                                                                              | Fonctionnalité implémentée                                                                              |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| US-5  | En tant que coach, je veux voir en un coup d'œil l'ensemble de mon effectif et son statut (actif/inactif), afin de repérer rapidement qui nécessite mon attention.                                      | `TeamsService` (liste avec compteurs, affectation/retrait de joueur avec bascule automatique du statut) |
| US-6  | En tant que coach, je veux consulter la fiche détaillée d'un joueur sans accéder systématiquement à ses données médicales, afin de respecter la confidentialité tout en gardant un suivi individualisé. | `PlayersService` + `SensitivePlayerDataService`                                                         |
| US-7  | En tant que manager, je veux créer un questionnaire personnalisé ou réutiliser un modèle existant, afin de ne pas reconstruire un questionnaire similaire à chaque suivi.                               | `QuestionnaireTemplatesService` / `QuestionTemplatesService`                                            |
| US-8  | En tant que coach, je veux planifier les événements de mon équipe (matchs, entraînements) dans un calendrier partagé, afin de coordonner le suivi bien-être avec le calendrier sportif réel.            | `CalendarEventsService`                                                                                 |
| US-9  | En tant que coach, je veux noter mon ressenti sur un·e joueur·euse après un match, afin de croiser cette observation qualitative avec les données de bien-être qu'il/elle a déclarées.                  | `MatchPlayerNotesService` (une note par match et par joueur)                                            |
| US-10 | En tant que manager d'une structure gérant plusieurs équipes, je veux superviser plusieurs clubs/équipes depuis un tableau de bord centralisé, afin de ne pas changer d'outil selon l'équipe suivie.    | `ClubsService` + filtrage par `clubId` sur `TeamsService`/`PlayersService`/`QuestionnairesService`      |

## User story — conformité (transverse)

| #     | User story                                                                                                                                                                                          | Fonctionnalité implémentée                |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| US-11 | En tant que responsable de la structure, je veux que les actions sensibles (accès et modification des données de suivi) soient tracées, afin de pouvoir démontrer la conformité en cas de contrôle. | `AuditLogsService` + `LoggingInterceptor` |

## Traçabilité

Chaque user story listée ci-dessus est directement rattachée à un module réellement implémenté (voir section
correspondante du code source) et, pour les plus critiques, à un scénario du cahier de recettes
(`docs/cahier-de-recettes.md`). Cette traçabilité besoin → user story → code → test est ce qui permet d'affirmer que le
prototype "met en œuvre un ensemble cohérent de fonctionnalités principales du logiciel et les user stories", comme
l'exige le critère C2.2.1 du référentiel.
