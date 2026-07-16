import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePlayerDto } from './dto/create-player.dto';
import { PlayerListItemDto, PlayerResponseDto } from './dto/player-response.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { PlayersService } from './players.service';

@ApiTags('players')
@Controller('players')
@UseGuards(JwtAuthGuard)
export class PlayersController {
    constructor(private readonly playersService: PlayersService) {}

    @Get()
    @ApiOperation({ summary: 'Get all players' })
    @ApiResponse({ status: 200, description: 'List of players', type: [PlayerListItemDto] })
    findAll(@Query('clubId') clubId?: string): Promise<PlayerListItemDto[]> {
        return this.playersService.findAll(clubId ? Number(clubId) : undefined);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a player by ID' })
    @ApiResponse({ status: 200, description: 'Player details', type: PlayerResponseDto })
    findOne(@Param('id') id: number): Promise<PlayerResponseDto> {
        return this.playersService.findOne(Number(id));
    }

    @Post()
    @ApiOperation({ summary: 'Create a new player' })
    @ApiResponse({ status: 201, description: 'Player created', type: PlayerResponseDto })
    create(@Body() createPlayerDto: CreatePlayerDto): Promise<PlayerResponseDto> {
        return this.playersService.create(createPlayerDto);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a player' })
    @ApiResponse({ status: 200, description: 'Player updated', type: PlayerResponseDto })
    update(@Param('id') id: number, @Body() updatePlayerDto: UpdatePlayerDto): Promise<PlayerResponseDto> {
        return this.playersService.update(Number(id), updatePlayerDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a player' })
    @ApiResponse({ status: 200, description: 'Player deleted' })
    remove(@Param('id') id: number): Promise<void> {
        return this.playersService.remove(Number(id));
    }
}
