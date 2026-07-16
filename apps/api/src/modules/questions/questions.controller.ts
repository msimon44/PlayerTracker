import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QuestionsService } from './questions.service';
import { QuestionResponseDto, QuestionListItemDto } from './dto/question-response.dto';

@Controller('questions')
@UseGuards(JwtAuthGuard)
export class QuestionsController {
    constructor(private readonly questionsService: QuestionsService) {}

    @Get()
    findAll(): Promise<QuestionListItemDto[]> {
        return this.questionsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<QuestionResponseDto> {
        return this.questionsService.findOne(Number(id));
    }

    @Post()
    create(@Body() createQuestionDto: CreateQuestionDto): Promise<QuestionResponseDto> {
        return this.questionsService.create(createQuestionDto);
    }

    @Patch(':id')
    update(@Param('id') id: number, @Body() updateQuestionDto: UpdateQuestionDto): Promise<QuestionResponseDto> {
        return this.questionsService.update(Number(id), updateQuestionDto);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.questionsService.remove(Number(id));
    }
}
