import { Body, Controller, Delete, Get, HttpException, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDetailDto, UserListItemDto, UserWithRelationsDto } from './dto/user-response.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, description: 'List of users', type: [UserListItemDto] })
    findAll(): Promise<UserListItemDto[]> {
        return this.usersService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a user by ID' })
    @ApiResponse({ status: 200, description: 'User details', type: UserWithRelationsDto })
    findOne(@Param('id') id: number): Promise<UserWithRelationsDto> {
        return this.usersService.findOne(id);
    }

    @Get('email/:email')
    @ApiOperation({ summary: 'Get a user by email' })
    @ApiResponse({ status: 200, description: 'User details', type: UserWithRelationsDto })
    @ApiResponse({ status: 404, description: 'User not found' })
    async findByEmail(@Param('email') email: string): Promise<UserWithRelationsDto> {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new HttpException('User not found', 404);
        }
        // Return the user without password (via findOne which uses proper response schema)
        return this.usersService.findOne(user.id);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new user' })
    @ApiResponse({ status: 201, description: 'User created', type: UserDetailDto })
    create(@Body() createUserDto: CreateUserDto): Promise<UserDetailDto> {
        return this.usersService.create(createUserDto);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a user' })
    @ApiResponse({ status: 200, description: 'User updated', type: UserDetailDto })
    update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto): Promise<UserDetailDto> {
        return this.usersService.update(id, updateUserDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a user' })
    @ApiResponse({ status: 200, description: 'User deleted', type: UserDetailDto })
    remove(@Param('id') id: number): Promise<UserDetailDto> {
        return this.usersService.remove(id);
    }
}
