import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateSensitivePlayerDataDto } from './dto/create-sensitive-player-data.dto';
import { UpdateSensitivePlayerDataDto } from './dto/update-sensitive-player-data.dto';
import {
    SensitivePlayerDataResponseDto,
    SensitivePlayerDataListItemDto,
} from './dto/sensitive-player-data-response.dto';
import { SensitivePlayerDataService } from './sensitive-player-data.service';

@ApiTags('sensitive-player-data')
@Controller('sensitive-player-data')
@UseGuards(JwtAuthGuard)
export class SensitivePlayerDataController {
    constructor(private readonly service: SensitivePlayerDataService) {}

    @Get()
    @ApiOperation({ summary: 'Get all sensitive player data' })
    @ApiResponse({ status: 200, description: 'List of sensitive player data', type: [SensitivePlayerDataListItemDto] })
    findAll(): Promise<SensitivePlayerDataListItemDto[]> {
        return this.service.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get sensitive player data by ID' })
    @ApiResponse({ status: 200, description: 'Sensitive player data details', type: SensitivePlayerDataResponseDto })
    findOne(@Param('id') id: number): Promise<SensitivePlayerDataResponseDto> {
        return this.service.findOne(Number(id));
    }

    @Post()
    @ApiOperation({ summary: 'Create new sensitive player data' })
    @ApiResponse({ status: 201, description: 'Sensitive player data created', type: SensitivePlayerDataResponseDto })
    create(@Body() dto: CreateSensitivePlayerDataDto): Promise<SensitivePlayerDataResponseDto> {
        return this.service.create(dto);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update sensitive player data' })
    @ApiResponse({ status: 200, description: 'Sensitive player data updated', type: SensitivePlayerDataResponseDto })
    update(
        @Param('id') id: number,
        @Body() dto: UpdateSensitivePlayerDataDto,
    ): Promise<SensitivePlayerDataResponseDto> {
        return this.service.update(Number(id), dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete sensitive player data' })
    @ApiResponse({ status: 200, description: 'Sensitive player data deleted', type: SensitivePlayerDataResponseDto })
    remove(@Param('id') id: number): Promise<SensitivePlayerDataResponseDto> {
        return this.service.remove(Number(id));
    }
}
