import { Injectable } from '@nestjs/common';
import {
    HealthIndicator,
    HealthIndicatorResult,
    HealthCheckError,
} from '@nestjs/terminus';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Sonde applicative vérifiant que la base PostgreSQL répond.
 * Exécute une requête minimale (SELECT 1) via Prisma et signale
 * une erreur si la base est injoignable ou en erreur.
 */
@Injectable()
export class PrismaHealthIndicator extends HealthIndicator {
    constructor(private readonly prisma: PrismaService) {
        super();
    }

    async isHealthy(key: string): Promise<HealthIndicatorResult> {
        try {
            await this.prisma.$queryRaw`SELECT 1`;
            return this.getStatus(key, true);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'unknown error';
            throw new HealthCheckError(
                'Prisma health check failed',
                this.getStatus(key, false, { message }),
            );
        }
    }
}
