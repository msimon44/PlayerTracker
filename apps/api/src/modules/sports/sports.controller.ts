import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateSportDto } from './dto/create-sport.dto';
import { SportListItemDto, SportResponseDto } from './dto/sport-response.dto';
import { UpdateSportDto } from './dto/update-sport.dto';
import { SportsService } from './sports.service';

@ApiTags('sports')
@Controller('sports')
@UseGuards(JwtAuthGuard)
export class SportsController {
    constructor(private readonly sportsService: SportsService) {}

    @Get()
    @ApiOperation({ summary: 'Get all sports' })
    @ApiResponse({ status: 200, description: 'List of sports', type: [SportListItemDto] })
    findAll(): Promise<SportListItemDto[]> {
        return this.sportsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a sport by ID' })
    @ApiResponse({ status: 200, description: 'Sport details', type: SportResponseDto })
    findOne(@Param('id') id: number): Promise<SportResponseDto> {
        return this.sportsService.findOne(Number(id));
    }

    @Post()
    @ApiOperation({ summary: 'Create a new sport' })
    @ApiResponse({ status: 201, description: 'Sport created', type: SportResponseDto })
    create(@Body() createSportDto: CreateSportDto): Promise<SportResponseDto> {
        return this.sportsService.create(createSportDto);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a sport' })
    @ApiResponse({ status: 200, description: 'Sport updated', type: SportResponseDto })
    update(@Param('id') id: number, @Body() updateSportDto: UpdateSportDto): Promise<SportResponseDto> {
        return this.sportsService.update(Number(id), updateSportDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a sport' })
    @ApiResponse({ status: 200, description: 'Sport deleted', type: SportResponseDto })
    remove(@Param('id') id: number): Promise<SportResponseDto> {
        return this.sportsService.remove(Number(id));
    }
}
