import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MatchPlayerNotesController } from './match-player-notes.controller';
import { MatchPlayerNotesService } from './match-player-notes.service';

@Module({
    controllers: [MatchPlayerNotesController],
    providers: [MatchPlayerNotesService, PrismaService],
})
export class MatchPlayerNotesModule {}
