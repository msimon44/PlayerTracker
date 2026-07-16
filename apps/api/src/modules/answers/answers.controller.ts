import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AnswersService } from './answers.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { AnswerResponseDto, AnswerListItemDto } from './dto/answer-response.dto';

@Controller('answers')
@UseGuards(JwtAuthGuard)
export class AnswersController {
    constructor(private readonly answersService: AnswersService) {}

    @Get()
    findAll(): Promise<AnswerListItemDto[]> {
        return this.answersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<AnswerResponseDto> {
        return this.answersService.findOne(Number(id));
    }

    @Post()
    create(@Body() createAnswerDto: CreateAnswerDto): Promise<AnswerResponseDto> {
        return this.answersService.create(createAnswerDto);
    }

    @Patch(':id')
    update(@Param('id') id: number, @Body() updateAnswerDto: UpdateAnswerDto): Promise<AnswerResponseDto> {
        return this.answersService.update(Number(id), updateAnswerDto);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.answersService.remove(Number(id));
    }
}
