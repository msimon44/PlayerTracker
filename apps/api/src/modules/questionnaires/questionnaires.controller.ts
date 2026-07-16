import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateQuestionnaireDto } from './dto/create-questionnaire.dto';
import { QuestionnaireListItemDto, QuestionnaireResponseDto } from './dto/questionnaire-response.dto';
import { UpdateQuestionnaireDto } from './dto/update-questionnaire.dto';
import { QuestionnairesService } from './questionnaires.service';

@ApiTags('questionnaires')
@Controller('questionnaires')
@UseGuards(JwtAuthGuard)
export class QuestionnairesController {
    constructor(private readonly questionnairesService: QuestionnairesService) {}

    @Get()
    @ApiOperation({ summary: 'Get all questionnaires' })
    @ApiResponse({ status: 200, description: 'List of questionnaires', type: [QuestionnaireListItemDto] })
    findAll(@Query('clubId') clubId?: string): Promise<QuestionnaireListItemDto[]> {
        return this.questionnairesService.findAll(clubId ? Number(clubId) : undefined);
    }

    @Get(':id/results')
    @ApiOperation({ summary: 'Get closed questionnaire results' })
    @ApiResponse({ status: 200, description: 'Questionnaire results' })
    findResults(@Param('id') id: number) {
        return this.questionnairesService.findResults(Number(id));
    }

    @Get(':id/respondents')
    @ApiOperation({ summary: 'Get questionnaire respondents' })
    @ApiResponse({ status: 200, description: 'Questionnaire respondents' })
    findRespondents(@Param('id') id: number) {
        return this.questionnairesService.findRespondents(Number(id));
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a questionnaire by ID' })
    @ApiResponse({ status: 200, description: 'Questionnaire details', type: QuestionnaireResponseDto })
    findOne(@Param('id') id: number): Promise<QuestionnaireResponseDto> {
        return this.questionnairesService.findOne(Number(id));
    }

    @Post()
    @ApiOperation({ summary: 'Create a new questionnaire' })
    @ApiResponse({ status: 201, description: 'Questionnaire created', type: QuestionnaireResponseDto })
    create(@Body() createQuestionnaireDto: CreateQuestionnaireDto): Promise<QuestionnaireResponseDto> {
        return this.questionnairesService.create(createQuestionnaireDto);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a questionnaire' })
    @ApiResponse({ status: 200, description: 'Questionnaire updated', type: QuestionnaireResponseDto })
    update(
        @Param('id') id: number,
        @Body() updateQuestionnaireDto: UpdateQuestionnaireDto,
    ): Promise<QuestionnaireResponseDto> {
        return this.questionnairesService.update(Number(id), updateQuestionnaireDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a questionnaire' })
    @ApiResponse({ status: 200, description: 'Questionnaire deleted' })
    remove(@Param('id') id: number) {
        return this.questionnairesService.remove(Number(id));
    }
}
