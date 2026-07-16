#!/bin/bash

# Script pour démarrer uniquement la base de données PostgreSQL
# Usage: ./start-database.sh

set -e

# Couleurs pour les messages
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Démarrage de la base de données PostgreSQL...${NC}"

# Vérifier si Docker est en cours d'exécution
if ! docker info &> /dev/null; then
    echo -e "${YELLOW}⚠️  Docker n'est pas en cours d'exécution. Veuillez le démarrer.${NC}"
    exit 1
fi

# Démarrer PostgreSQL
docker compose up -d postgres

# Attendre que PostgreSQL soit prêt
echo -e "${BLUE}⏳ Attente du démarrage de PostgreSQL...${NC}"
max_attempts=30
attempt=1

while [ $attempt -le $max_attempts ]; do
    if docker compose exec -T postgres pg_isready -U ${POSTGRES_USER:-postgres} > /dev/null 2>&1; then
        echo -e "${GREEN}✅ PostgreSQL est prêt et accessible !${NC}"
        echo ""
        echo "📊 Informations de connexion :"
        echo "Host: localhost"
        echo "Port: 5432"
        echo "Database: ${POSTGRES_DB:-playertracker}"
        echo "User: ${POSTGRES_USER:-postgres}"
        echo ""
        break
    fi
    
    if [ $attempt -eq $max_attempts ]; then
        echo -e "${RED}❌ PostgreSQL n'a pas démarré dans les temps${NC}"
        exit 1
    fi
    
    echo -n "."
    sleep 2
    ((attempt++))
done
