import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateTeamDto } from './dto/create-team.dto';
import { TeamListItemDto, TeamResponseDto } from './dto/team-response.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { TeamsService } from './teams.service';

@ApiTags('teams')
@Controller('teams')
@UseGuards(JwtAuthGuard)
export class TeamsController {
    constructor(private readonly teamsService: TeamsService) {}

    @Get()
    @ApiOperation({ summary: 'Get all teams' })
    @ApiResponse({ status: 200, description: 'List of teams', type: [TeamListItemDto] })
    findAll(@Query('clubId') clubId?: string): Promise<TeamListItemDto[]> {
        return this.teamsService.findAll(clubId ? Number(clubId) : undefined);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a team by ID' })
    @ApiResponse({ status: 200, description: 'Team details', type: TeamResponseDto })
    findOne(@Param('id') id: number): Promise<TeamResponseDto | null> {
        return this.teamsService.findOne(Number(id));
    }

    @Get('club/:clubId')
    @ApiOperation({ summary: 'Get teams by club ID' })
    @ApiResponse({ status: 200, description: 'List of teams for the club', type: [TeamListItemDto] })
    findTeamsByClubId(@Param('clubId') clubId: number): Promise<TeamListItemDto[]> {
        return this.teamsService.findTeamsByClubId(Number(clubId));
    }

    @Post()
    @ApiOperation({ summary: 'Create a new team' })
    @ApiResponse({ status: 201, description: 'Team created', type: TeamResponseDto })
    create(@Body() createTeamDto: CreateTeamDto): Promise<TeamResponseDto> {
        return this.teamsService.create(createTeamDto);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a team' })
    @ApiResponse({ status: 200, description: 'Team updated', type: TeamResponseDto })
    update(@Param('id') id: number, @Body() updateTeamDto: UpdateTeamDto): Promise<TeamResponseDto> {
        return this.teamsService.update(Number(id), updateTeamDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a team' })
    @ApiResponse({ status: 200, description: 'Team deleted' })
    remove(@Param('id') id: number): Promise<void> {
        return this.teamsService.remove(Number(id));
    }

    @Post(':teamId/assign-player/:playerId')
    @ApiOperation({ summary: 'Assign a player to a team' })
    @ApiResponse({ status: 200, description: 'Player assigned to team', type: TeamResponseDto })
    assignPlayerToTeam(@Param('teamId') teamId: number, @Param('playerId') playerId: number): Promise<TeamResponseDto> {
        return this.teamsService.assignPlayerToTeam(Number(teamId), Number(playerId));
    }

    @Delete(':teamId/remove-player/:playerId')
    @ApiOperation({ summary: 'Remove a player from a team' })
    @ApiResponse({ status: 200, description: 'Player removed from team', type: TeamResponseDto })
    removePlayerFromTeam(
        @Param('teamId') teamId: number,
        @Param('playerId') playerId: number,
    ): Promise<TeamResponseDto> {
        return this.teamsService.removePlayerFromTeam(Number(teamId), Number(playerId));
    }
}
