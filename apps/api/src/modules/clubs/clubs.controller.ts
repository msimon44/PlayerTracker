import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ClubsService } from './clubs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { ClubResponseDto, ClubListItemDto } from './dto/club-response.dto';

@Controller('clubs')
@UseGuards(JwtAuthGuard)
export class ClubsController {
    constructor(private readonly clubsService: ClubsService) {}

    @Get()
    findAll(): Promise<ClubListItemDto[]> {
        return this.clubsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<ClubResponseDto> {
        return this.clubsService.findOne(id);
    }

    @Post()
    create(@Body() createClubDto: CreateClubDto): Promise<ClubResponseDto> {
        return this.clubsService.create(createClubDto);
    }

    @Patch(':id')
    update(@Param('id') id: number, @Body() updateClubDto: UpdateClubDto): Promise<ClubResponseDto> {
        return this.clubsService.update(id, updateClubDto);
    }

    @Delete(':id')
    remove(@Param('id') id: number): Promise<void> {
        return this.clubsService.remove(id);
    }
}
