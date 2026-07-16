import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import session from 'express-session';
import helmet from 'helmet';
import passport from 'passport';
import { join } from 'path';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './filters/http-exception.filter';
import { LoggingInterceptor } from './interceptors/logging.interceptor';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        logger: ['error', 'warn', 'debug'],
    });
    const logger = new Logger('Bootstrap');

    // Serve static files from public directory
    // Use process.cwd() to get the root directory where the app is running from
    app.useStaticAssets(join(process.cwd(), 'public'), {
        prefix: '/public/',
    });

    app.use(helmet());
    app.use(compression());

    // Configure session for OAuth state management
    app.use(
        session({
            secret: process.env['SESSION_SECRET'] || process.env['JWT_SECRET'] || 'dev-secret-change-in-production',
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: true,
                secure: process.env['NODE_ENV'] === 'production',
                maxAge: 10 * 60 * 1000, // 10 minutes
            },
        }),
    );

    // Initialize Passport and enable session support
    app.use(passport.initialize());
    app.use(passport.session());

    // Configure Passport serializers (required for session support)
    // Import after passport initialization
    import('./modules/auth/passport-serializer');

    app.enableCors({
        origin: process.env['CORS_ORIGIN']?.split(',') || '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    });

    app.useGlobalInterceptors(new LoggingInterceptor());
    app.useGlobalFilters(new GlobalExceptionFilter());

    const swaggerConfig = new DocumentBuilder()
        .setTitle('BasketBoard API')
        .setDescription('The BasketBoard API documentation')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document);

    const port = process.env['PORT'] ?? 3001;
    await app.listen(port, '0.0.0.0');
    logger.log(`🚀 Application is running on: http://localhost:${port}`);
    logger.log(`🌐 Network access available at: http://192.168.1.70:${port}`);
    logger.log(`📚 API Documentation available at: http://localhost:${port}/docs`);
}

bootstrap();
