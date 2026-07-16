import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateQuestionTemplateDto } from './dto/create-question-template.dto';
import { UpdateQuestionTemplateDto } from './dto/update-question-template.dto';
import { QuestionTemplatesService } from './question-templates.service';
import { QuestionTemplateListItemDto, QuestionTemplateResponseDto } from './dto/question-template-response.dto';

@Controller('question-templates')
@UseGuards(JwtAuthGuard)
export class QuestionTemplatesController {
    constructor(private readonly service: QuestionTemplatesService) {}

    @Get()
    findAll(): Promise<QuestionTemplateListItemDto[]> {
        return this.service.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<QuestionTemplateResponseDto> {
        return this.service.findOne(Number(id));
    }

    @Post()
    create(@Body() dto: CreateQuestionTemplateDto): Promise<QuestionTemplateResponseDto> {
        return this.service.create(dto);
    }

    @Patch(':id')
    update(@Param('id') id: number, @Body() dto: UpdateQuestionTemplateDto): Promise<QuestionTemplateResponseDto> {
        return this.service.update(Number(id), dto);
    }

    @Delete(':id')
    remove(@Param('id') id: number): Promise<QuestionTemplateResponseDto> {
        return this.service.remove(Number(id));
    }
}
