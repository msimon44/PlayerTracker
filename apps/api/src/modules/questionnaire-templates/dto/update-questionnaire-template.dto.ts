import { PartialType } from '@nestjs/swagger';
import { CreateQuestionnaireTemplateDto } from './create-questionnaire-template.dto';

export class UpdateQuestionnaireTemplateDto extends PartialType(CreateQuestionnaireTemplateDto) {}
