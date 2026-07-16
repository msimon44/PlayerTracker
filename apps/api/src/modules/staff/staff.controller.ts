import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { type AuthenticatedRequest } from '../auth/types/auth-request.types';
import { CreateStaffDto } from './dto/create-staff.dto';
import { StaffListItemDto, StaffResponseDto } from './dto/staff-response.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { StaffService } from './staff.service';

@Controller('staff')
@UseGuards(JwtAuthGuard)
export class StaffController {
    constructor(private readonly staffService: StaffService) {}
    @Get('me')
    findCurrentStaff(@Request() req: AuthenticatedRequest): Promise<StaffResponseDto> {
        if (!req.user || !req.user.userId) {
            throw new Error('User not authenticated or user ID missing');
        }

        return this.staffService.findByUserId(req.user.userId);
    }

    @Get()
    findAll(@Query('clubId') clubId?: string): Promise<StaffListItemDto[]> {
        return this.staffService.findAll(clubId ? Number(clubId) : undefined);
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<StaffResponseDto> {
        return this.staffService.findOne(Number(id));
    }

    @Post()
    create(@Body() createStaffDto: CreateStaffDto): Promise<StaffResponseDto> {
        return this.staffService.create(createStaffDto);
    }

    @Patch(':id')
    update(@Param('id') id: number, @Body() updateStaffDto: UpdateStaffDto): Promise<StaffResponseDto> {
        return this.staffService.update(Number(id), updateStaffDto);
    }

    @Delete(':id')
    remove(@Param('id') id: number): Promise<StaffResponseDto> {
        return this.staffService.remove(Number(id));
    }
}
