import { Controller, Get } from '@nestjs/common';
import {
    HealthCheck,
    HealthCheckService,
    MemoryHealthIndicator,
    PrismaHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from '../../prisma/prisma.service';
import { Public } from '../auth/decorators/public.decorator';

/**
 * Point de contrôle /health utilisé par la sonde externe
 * (workflow GitHub Actions healthcheck.yml) pour vérifier la disponibilité
 * du service et de sa base de données.
 *
 * Trois sondes sont exécutées :
 *  - liveness base PostgreSQL (via l'indicateur Prisma fourni par Terminus)
 *  - heap mémoire (seuil 300 Mo)
 *  - RSS mémoire (seuil 500 Mo)
 */
@Controller('health')
export class HealthController {
    constructor(
        private readonly health: HealthCheckService,
        private readonly memory: MemoryHealthIndicator,
        private readonly prismaIndicator: PrismaHealthIndicator,
        private readonly prisma: PrismaService,
    ) {}

    @Public()
    @Get()
    @HealthCheck()
    check() {
        return this.health.check([
            () => this.prismaIndicator.pingCheck('database', this.prisma),
            () => this.memory.checkHeap('memory_heap', 300 * 1024 * 1024),
            () => this.memory.checkRSS('memory_rss', 500 * 1024 * 1024),
        ]);
    }
}
