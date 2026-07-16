#!/bin/bash

# Script pour créer les containers Docker avec une approche optimisée
# pour le monorepo PlayerTracker

echo "🚀 Construction des containers Docker PlayerTracker..."

# Nettoyage des images et containers existants
echo "🧹 Nettoyage des ressources Docker existantes..."
docker compose down --remove-orphans 2>/dev/null || true
docker system prune -f

# Build uniquement la base de données pour commencer
echo "📦 Construction de la base de données..."
docker compose up -d postgres

# Attendre que la base de données soit prête
echo "⏳ Attente de la base de données..."
sleep 10

# Build des packages en local d'abord
echo "📦 Build des packages localement..."
pnpm build:packages

# Ensuite build les applications
echo "🏗️ Construction des applications..."
docker compose build

echo "✅ Construction terminée!"
echo "🚀 Lancement des services..."
docker compose up -d

echo "🎉 PlayerTracker est maintenant accessible!"
echo "📱 Web App: http://localhost:3000"
echo "🌐 Landing: http://localhost:3002"
echo "🔧 API: http://localhost:3001"
echo "🗄️ Base de données: localhost:5432"
