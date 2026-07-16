import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuditLogsService } from './audit-logs.service';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { UpdateAuditLogDto } from './dto/update-audit-log.dto';
import { AuditLogListItemDto, AuditLogResponseDto } from './dto/audit-log-response.dto';

@Controller('audit-logs')
@UseGuards(JwtAuthGuard)
export class AuditLogsController {
    constructor(private readonly service: AuditLogsService) {}

    @Get()
    findAll(): Promise<AuditLogListItemDto[]> {
        return this.service.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<AuditLogResponseDto> {
        return this.service.findOne(Number(id));
    }

    @Post()
    create(@Body() dto: CreateAuditLogDto): Promise<AuditLogResponseDto> {
        return this.service.create(dto);
    }

    @Patch(':id')
    update(@Param('id') id: number, @Body() dto: UpdateAuditLogDto): Promise<AuditLogResponseDto> {
        return this.service.update(Number(id), dto);
    }

    @Delete(':id')
    remove(@Param('id') id: number): Promise<AuditLogResponseDto> {
        return this.service.remove(Number(id));
    }
}
