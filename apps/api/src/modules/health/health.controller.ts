import { Controller, Get } from '@nestjs/common';
import {
    HealthCheck,
    HealthCheckService,
    MemoryHealthIndicator,
} from '@nestjs/terminus';
import { Public } from '../auth/decorators/public.decorator';
import { PrismaHealthIndicator } from './prisma.health';

/**
 * Exposition du point de contrôle /health utilisé par la sonde externe
 * (workflow GitHub Actions healthcheck.yml) pour vérifier la disponibilité
 * du service et de sa base de données.
 *
 * Trois sondes sont exécutées :
 *  - liveness base de données (requête SELECT 1 via Prisma)
 *  - heap mémoire (seuil 300 Mo)
 *  - RSS mémoire (seuil 500 Mo)
 *
 * La réponse suit le format standard NestJS Terminus, exploitable
 * par tout outil de supervision externe (UptimeRobot, GitHub Actions, k8s).
 */
@Controller('health')
export class HealthController {
    constructor(
        private readonly health: HealthCheckService,
        private readonly memory: MemoryHealthIndicator,
        private readonly prismaIndicator: PrismaHealthIndicator,
    ) {}

    @Public()
    @Get()
    @HealthCheck()
    check() {
        return this.health.check([
            () => this.prismaIndicator.isHealthy('database'),
            () => this.memory.checkHeap('memory_heap', 300 * 1024 * 1024),
            () => this.memory.checkRSS('memory_rss', 500 * 1024 * 1024),
        ]);
    }
}
