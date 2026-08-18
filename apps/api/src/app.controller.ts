import { Controller } from '@nestjs/common';

/**
 * Contrôleur racine de l'API.
 *
 * Le point de contrôle /health est désormais exposé par le HealthModule
 * (voir apps/api/src/modules/health), qui s'appuie sur NestJS Terminus
 * pour vérifier la connectivité base de données et l'état mémoire.
 */
@Controller()
export class AppController {}
