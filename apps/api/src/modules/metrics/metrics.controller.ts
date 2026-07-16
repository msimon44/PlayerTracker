import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateMetricDto } from './dto/create-metric.dto';
import { MetricListItemDto, MetricResponseDto } from './dto/metric-response.dto';
import { UpdateMetricDto } from './dto/update-metric.dto';
import { MetricsService } from './metrics.service';

@ApiTags('metrics')
@Controller('metrics')
@UseGuards(JwtAuthGuard)
export class MetricsController {
    constructor(private readonly metricsService: MetricsService) {}

    @Get()
    @ApiOperation({ summary: 'Get all metrics' })
    @ApiResponse({ status: 200, description: 'List of metrics', type: [MetricListItemDto] })
    findAll(): Promise<MetricListItemDto[]> {
        return this.metricsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a metric by ID' })
    @ApiResponse({ status: 200, description: 'Metric details', type: MetricResponseDto })
    findOne(@Param('id') id: number): Promise<MetricResponseDto> {
        return this.metricsService.findOne(Number(id));
    }

    @Post()
    @ApiOperation({ summary: 'Create a metric' })
    @ApiResponse({ status: 201, description: 'Metric created', type: MetricResponseDto })
    create(@Body() createMetricDto: CreateMetricDto): Promise<MetricResponseDto> {
        return this.metricsService.create(createMetricDto);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a metric' })
    @ApiResponse({ status: 200, description: 'Metric updated', type: MetricResponseDto })
    update(@Param('id') id: number, @Body() updateMetricDto: UpdateMetricDto): Promise<MetricResponseDto> {
        return this.metricsService.update(Number(id), updateMetricDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a metric' })
    @ApiResponse({ status: 200, description: 'Metric deleted', type: MetricResponseDto })
    remove(@Param('id') id: number): Promise<MetricResponseDto> {
        return this.metricsService.remove(Number(id));
    }
}
