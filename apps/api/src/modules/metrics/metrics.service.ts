import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMetricDto } from './dto/create-metric.dto';
import { MetricListItemDto, MetricResponseDto } from './dto/metric-response.dto';
import { UpdateMetricDto } from './dto/update-metric.dto';

@Injectable()
export class MetricsService {
    constructor(private readonly prisma: PrismaService) {}

    private visibleMetricWhere(): Prisma.MetricWhereInput {
        return {
            questionnaire: { status: 'COMPLETED' },
        };
    }

    private readonly select = {
        id: true,
        playerId: true,
        questionnaireId: true,
        type: true,
        value: true,
        unit: true,
        capturedAt: true,
        player: { select: { id: true, firstName: true, lastName: true, clubId: true } },
    };

    async findAll(): Promise<MetricListItemDto[]> {
        const metrics = await this.prisma.metric.findMany({
            where: this.visibleMetricWhere(),
            select: this.select,
        });
        return metrics.map((metric) => ({
            ...metric,
            recordedAt: metric.capturedAt,
        }));
    }

    async findOne(id: number): Promise<MetricResponseDto> {
        const metric = await this.prisma.metric.findFirst({
            where: { id, AND: [this.visibleMetricWhere()] },
            select: this.select,
        });
        if (!metric) throw new NotFoundException('Metric not found');
        return {
            ...metric,
            recordedAt: metric.capturedAt,
        };
    }

    async create(createMetricDto: CreateMetricDto): Promise<MetricResponseDto> {
        const metric = await this.prisma.metric.create({
            data: createMetricDto,
            select: this.select,
        });
        return {
            ...metric,
            recordedAt: metric.capturedAt,
        };
    }

    async update(id: number, updateMetricDto: UpdateMetricDto): Promise<MetricResponseDto> {
        const metric = await this.prisma.metric.update({
            where: { id },
            data: updateMetricDto,
            select: this.select,
        });
        return {
            ...metric,
            recordedAt: metric.capturedAt,
        };
    }

    async remove(id: number): Promise<MetricResponseDto> {
        const metric = await this.prisma.metric.delete({
            where: { id },
            select: this.select,
        });
        return {
            ...metric,
            recordedAt: metric.capturedAt,
        };
    }
}
