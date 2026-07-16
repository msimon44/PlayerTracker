import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module';
import { MetricsModule } from './modules/metrics/metrics.module';
import { PositionsModule } from './modules/positions/positions.module';
import { SensitivePlayerDataModule } from './modules/sensitive-player-data/sensitive-player-data.module';
import { SportsModule } from './modules/sports/sports.module';
import { ZodValidationPipe } from 'nestjs-zod';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/config.module';
import { AnswersModule } from './modules/answers/answers.module';
import { AuthModule } from './modules/auth/auth.module';
import { CalendarEventsModule } from './modules/calendar-events/calendar-events.module';
import { ClubsModule } from './modules/clubs/clubs.module';
import { ImagesModule } from './modules/images/images.module';
import { MatchPlayerNotesModule } from './modules/match-player-notes/match-player-notes.module';
import { PlayersModule } from './modules/players/players.module';
import { QuestionTemplatesModule } from './modules/question-templates/question-templates.module';
import { QuestionnaireTemplatesModule } from './modules/questionnaire-templates/questionnaire-templates.module';
import { QuestionnairesModule } from './modules/questionnaires/questionnaires.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { StaffModule } from './modules/staff/staff.module';
import { TeamsModule } from './modules/teams/teams.module';
import { UsersModule } from './modules/users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
    imports: [
        AppConfigModule,
        PrismaModule,
        AnswersModule,
        AuditLogsModule,
        AuthModule,
        CalendarEventsModule,
        ClubsModule,
        ImagesModule,
        MatchPlayerNotesModule,
        MetricsModule,
        PlayersModule,
        PositionsModule,
        QuestionnaireTemplatesModule,
        QuestionTemplatesModule,
        QuestionnairesModule,
        QuestionsModule,
        SensitivePlayerDataModule,
        SportsModule,
        StaffModule,
        TeamsModule,
        UsersModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        PrismaService,
        {
            provide: APP_PIPE,
            useClass: ZodValidationPipe,
        },
    ],
})
export class AppModule {}
