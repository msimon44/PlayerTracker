import { PartialType } from '@nestjs/swagger';
import { CreateSensitivePlayerDataDto } from './create-sensitive-player-data.dto';

export class UpdateSensitivePlayerDataDto extends PartialType(CreateSensitivePlayerDataDto) {}
