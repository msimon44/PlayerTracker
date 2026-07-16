import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';
import { AppModule } from './app.module';

/**
 * Script de génération du contrat OpenAPI
 *
 * Ce script :
 * 1. Crée une instance temporaire de l'application NestJS
 * 2. Génère le document OpenAPI à partir des décorateurs Swagger
 * 3. Sauvegarde le contrat dans specs/openapi.json
 *
 * Usage: pnpm generate:openapi
 */
async function generateOpenAPI() {
    const logger = new Logger('OpenAPIGenerator');

    try {
        // Crée une instance temporaire de l'app (sans démarrer le serveur)
        const app = await NestFactory.create(AppModule, {
            logger: false, // Désactive les logs pour une sortie propre
        });

        // Configure Swagger avec les mêmes paramètres que main.ts
        const config = new DocumentBuilder()
            .setTitle('PlayerTracker API')
            .setDescription('API pour la plateforme de suivi physique et mental des athlètes')
            .setVersion('1.0')
            .addBearerAuth()
            .addTag('auth', 'Authentification et autorisation')
            .addTag('users', 'Gestion des utilisateurs')
            .addTag('players', 'Gestion des joueurs')
            .addTag('clubs', 'Gestion des clubs')
            .addTag('teams', 'Gestion des équipes')
            .addTag('questionnaires', 'Gestion des questionnaires')
            .addTag('images', 'Gestion des images')
            .addTag('metrics', 'Métriques et statistiques')
            .build();

        // Génère le document OpenAPI à partir des décorateurs
        const document = SwaggerModule.createDocument(app, config);

        // Chemin de sortie : specs/openapi.json (à la racine du monorepo)
        const outputPath = path.join(__dirname, '../../../specs/openapi.json');

        // Crée le dossier specs/ s'il n'existe pas
        const specsDir = path.dirname(outputPath);
        if (!fs.existsSync(specsDir)) {
            fs.mkdirSync(specsDir, { recursive: true });
            logger.log(`📁 Dossier créé : ${specsDir}`);
        }

        // Sauvegarde le document avec un formatage lisible
        fs.writeFileSync(outputPath, JSON.stringify(document, null, 2));

        logger.log('✅ OpenAPI spec généré avec succès');
        logger.log(`📄 Fichier : ${outputPath}`);
        logger.log(`📊 Routes : ${Object.keys(document.paths || {}).length}`);
        logger.log(`📦 Schemas : ${Object.keys(document.components?.schemas || {}).length}`);

        await app.close();
        process.exit(0);
    } catch (error) {
        logger.error('❌ Erreur lors de la génération OpenAPI', error);
        process.exit(1);
    }
}

// Lance la génération
generateOpenAPI();
