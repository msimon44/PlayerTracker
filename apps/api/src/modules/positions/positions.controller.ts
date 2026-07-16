import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePositionDto } from './dto/create-position.dto';
import { PositionListItemDto, PositionResponseDto } from './dto/position-response.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { PositionsService } from './positions.service';

@ApiTags('positions')
@Controller('positions')
@UseGuards(JwtAuthGuard)
export class PositionsController {
    constructor(private readonly positionsService: PositionsService) {}

    @Get()
    @ApiOperation({ summary: 'Get all positions' })
    @ApiResponse({ status: 200, description: 'List of positions', type: [PositionListItemDto] })
    findAll(): Promise<PositionListItemDto[]> {
        return this.positionsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a position by ID' })
    @ApiResponse({ status: 200, description: 'Position details', type: PositionResponseDto })
    findOne(@Param('id') id: number): Promise<PositionResponseDto> {
        return this.positionsService.findOne(Number(id));
    }

    @Post()
    @ApiOperation({ summary: 'Create a new position' })
    @ApiResponse({ status: 201, description: 'Position created', type: PositionResponseDto })
    create(@Body() createPositionDto: CreatePositionDto): Promise<PositionResponseDto> {
        return this.positionsService.create(createPositionDto);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a position' })
    @ApiResponse({ status: 200, description: 'Position updated', type: PositionResponseDto })
    update(@Param('id') id: number, @Body() updatePositionDto: UpdatePositionDto): Promise<PositionResponseDto> {
        return this.positionsService.update(Number(id), updatePositionDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a position' })
    @ApiResponse({ status: 200, description: 'Position deleted', type: PositionResponseDto })
    remove(@Param('id') id: number): Promise<PositionResponseDto> {
        return this.positionsService.remove(Number(id));
    }
}
