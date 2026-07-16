import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateQuestionnaireTemplateDto } from './dto/create-questionnaire-template.dto';
import { UpdateQuestionnaireTemplateDto } from './dto/update-questionnaire-template.dto';
import { QuestionnaireTemplatesService } from './questionnaire-templates.service';
import {
    QuestionnaireTemplateListItemDto,
    QuestionnaireTemplateResponseDto,
} from './dto/questionnaire-template-response.dto';

@Controller('questionnaire-templates')
@UseGuards(JwtAuthGuard)
export class QuestionnaireTemplatesController {
    constructor(private readonly service: QuestionnaireTemplatesService) {}

    @Get()
    findAll(): Promise<QuestionnaireTemplateListItemDto[]> {
        return this.service.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<QuestionnaireTemplateResponseDto> {
        return this.service.findOne(Number(id));
    }

    @Post()
    create(@Body() dto: CreateQuestionnaireTemplateDto): Promise<QuestionnaireTemplateResponseDto> {
        return this.service.create(dto);
    }

    @Patch(':id')
    update(
        @Param('id') id: number,
        @Body() dto: UpdateQuestionnaireTemplateDto,
    ): Promise<QuestionnaireTemplateResponseDto> {
        return this.service.update(Number(id), dto);
    }

    @Delete(':id')
    remove(@Param('id') id: number): Promise<QuestionnaireTemplateResponseDto> {
        return this.service.remove(Number(id));
    }
}
