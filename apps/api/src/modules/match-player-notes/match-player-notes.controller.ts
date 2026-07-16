import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateMatchPlayerNoteDto } from './dto/create-match-player-note.dto';
import { MatchPlayerNoteResponseDto } from './dto/match-player-note-response.dto';
import { UpdateMatchPlayerNoteDto } from './dto/update-match-player-note.dto';
import { MatchPlayerNotesService } from './match-player-notes.service';

@ApiTags('match-player-notes')
@Controller('match-player-notes')
@UseGuards(JwtAuthGuard)
export class MatchPlayerNotesController {
    constructor(private readonly matchPlayerNotesService: MatchPlayerNotesService) {}

    @Get()
    @ApiOperation({ summary: 'Get match player notes' })
    @ApiResponse({ status: 200, description: 'List of notes', type: [MatchPlayerNoteResponseDto] })
    findAll(@Query('eventId') eventId?: string, @Query('playerId') playerId?: string) {
        return this.matchPlayerNotesService.findAll(
            eventId ? Number(eventId) : undefined,
            playerId ? Number(playerId) : undefined,
        );
    }

    @Post()
    @ApiOperation({ summary: 'Create or update a staff note for a player match' })
    @ApiResponse({ status: 201, description: 'Note saved', type: MatchPlayerNoteResponseDto })
    create(@Body() createDto: CreateMatchPlayerNoteDto) {
        return this.matchPlayerNotesService.create(createDto);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a staff note' })
    @ApiResponse({ status: 200, description: 'Note updated', type: MatchPlayerNoteResponseDto })
    update(@Param('id') id: string, @Body() updateDto: UpdateMatchPlayerNoteDto) {
        return this.matchPlayerNotesService.update(Number(id), updateDto);
    }
}
