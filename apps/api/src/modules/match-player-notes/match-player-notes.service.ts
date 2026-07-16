import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMatchPlayerNoteDto } from './dto/create-match-player-note.dto';
import { MatchPlayerNoteResponseDto } from './dto/match-player-note-response.dto';
import { UpdateMatchPlayerNoteDto } from './dto/update-match-player-note.dto';

@Injectable()
export class MatchPlayerNotesService {
    constructor(private readonly prisma: PrismaService) {}

    private readonly select = {
        id: true,
        eventId: true,
        playerId: true,
        staffId: true,
        rating: true,
        comment: true,
        player: { select: { id: true, firstName: true, lastName: true, nickName: true } },
        event: { select: { id: true, title: true, type: true, startsAt: true } },
    };

    async findAll(eventId?: number, playerId?: number): Promise<MatchPlayerNoteResponseDto[]> {
        return this.prisma.matchPlayerNote.findMany({
            where: {
                ...(eventId ? { eventId } : {}),
                ...(playerId ? { playerId } : {}),
            },
            orderBy: { createdAt: 'desc' },
            select: this.select,
        });
    }

    async create(createDto: CreateMatchPlayerNoteDto): Promise<MatchPlayerNoteResponseDto> {
        return this.prisma.matchPlayerNote.upsert({
            where: {
                eventId_playerId: {
                    eventId: createDto.eventId,
                    playerId: createDto.playerId,
                },
            },
            create: createDto,
            update: {
                staffId: createDto.staffId,
                rating: createDto.rating,
                comment: createDto.comment,
            },
            select: this.select,
        });
    }

    async update(id: number, updateDto: UpdateMatchPlayerNoteDto): Promise<MatchPlayerNoteResponseDto> {
        const existing = await this.prisma.matchPlayerNote.findUnique({ where: { id } });
        if (!existing) throw new NotFoundException('Match player note not found');

        return this.prisma.matchPlayerNote.update({
            where: { id },
            data: updateDto,
            select: this.select,
        });
    }
}
