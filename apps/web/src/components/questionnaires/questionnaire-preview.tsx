'use client';

import { Eye } from 'lucide-react';

import type { QuestionnaireResponseDto } from '@/lib/generated/models';
import { CreateQuestionDtoType as QuestionType } from '@/lib/generated/models';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

interface QuestionnairePreviewProps {
    questionnaire: QuestionnaireResponseDto;
}

const questionTypeLabels: Record<string, string> = {
    [QuestionType.TEXT]: 'Texte libre',
    [QuestionType.NUMBER]: 'Nombre',
    [QuestionType.BOOLEAN]: 'Oui/Non',
    [QuestionType.SINGLE_CHOICE]: 'Choix unique',
    [QuestionType.MULTIPLE_CHOICE]: 'Choix multiples',
    [QuestionType.SCALE]: 'Échelle (1-10)',
};

export function QuestionnairePreview({ questionnaire }: QuestionnairePreviewProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant='outline' size='sm'>
                    <Eye className='mr-2 h-4 w-4' />
                    Aperçu
                </Button>
            </DialogTrigger>
            <DialogContent className='max-h-[80vh] max-w-2xl overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>{questionnaire.title}</DialogTitle>
                    <DialogDescription>Aperçu du questionnaire tel que les joueurs le verront</DialogDescription>
                </DialogHeader>

                <div className='space-y-8 py-4'>
                    {/* En-tête */}
                    {questionnaire.description && (
                        <div className='space-y-2'>
                            <p className='text-muted-foreground'>{String(questionnaire.description)}</p>
                        </div>
                    )}

                    {/* Équipe cible */}
                    {questionnaire.team && (
                        <div className='flex items-center gap-2'>
                            <span className='text-sm font-medium'>Équipe :</span>
                            <Badge variant='secondary'>{questionnaire.team.name}</Badge>
                        </div>
                    )}

                    {/* Questions */}
                    <div className='space-y-6'>
                        {questionnaire.questions.length === 0 ? (
                            <p className='text-center text-muted-foreground'>Aucune question pour le moment</p>
                        ) : (
                            questionnaire.questions.map((question, index) => (
                                <Card key={question.id}>
                                    <CardHeader className='pb-3'>
                                        <div className='flex items-start justify-between'>
                                            <div className='flex-1 space-y-1'>
                                                <div className='flex items-center gap-2'>
                                                    <span className='text-sm font-medium text-muted-foreground'>
                                                        Question {index + 1}
                                                    </span>
                                                    <Badge variant='outline' className='text-xs'>
                                                        {questionTypeLabels[question.type] || question.type}
                                                    </Badge>
                                                    {question.isRequired && (
                                                        <Badge variant='destructive' className='text-xs'>
                                                            Obligatoire
                                                        </Badge>
                                                    )}
                                                </div>
                                                <CardTitle className='text-base'>{question.title}</CardTitle>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {/* Rendu selon le type */}
                                        {question.type === QuestionType.TEXT && (
                                            <input
                                                type='text'
                                                placeholder='Votre réponse...'
                                                className='w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50'
                                                disabled
                                            />
                                        )}

                                        {question.type === QuestionType.NUMBER && (
                                            <input
                                                type='number'
                                                placeholder='0'
                                                className='w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50'
                                                disabled
                                            />
                                        )}

                                        {question.type === QuestionType.BOOLEAN && (
                                            <div className='flex gap-4'>
                                                <label className='flex items-center gap-2'>
                                                    <input type='radio' name={`q${question.id}`} value='yes' disabled />
                                                    <span>Oui</span>
                                                </label>
                                                <label className='flex items-center gap-2'>
                                                    <input type='radio' name={`q${question.id}`} value='no' disabled />
                                                    <span>Non</span>
                                                </label>
                                            </div>
                                        )}

                                        {(question.type === QuestionType.SINGLE_CHOICE ||
                                            question.type === QuestionType.MULTIPLE_CHOICE) && (
                                            <div className='space-y-2'>
                                                {/* TODO: Afficher options quand elles seront dans QuestionNestedDto */}
                                                <p className='text-sm text-muted-foreground'>
                                                    Les options s&apos;afficheront une fois le backend mis à jour
                                                </p>
                                            </div>
                                        )}

                                        {question.type === QuestionType.SCALE && (
                                            <div className='flex items-center gap-4'>
                                                <span className='text-sm'>1</span>
                                                <input type='range' min='1' max='10' className='flex-1' disabled />
                                                <span className='text-sm'>10</span>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>

                    {questionnaire.questions.length > 0 && (
                        <div className='pt-4'>
                            <Button disabled className='w-full'>
                                Soumettre
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
