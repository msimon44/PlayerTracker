import { PartialType } from '@nestjs/swagger';
import { CreateMatchPlayerNoteDto } from './create-match-player-note.dto';

export class UpdateMatchPlayerNoteDto extends PartialType(CreateMatchPlayerNoteDto) {}
