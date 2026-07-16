#!/usr/bin/env bash

# Script de test de la configuration Docker
# Usage: ./scripts/test-docker.sh

set -e

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧪 Test de la configuration Docker pour PlayerTracker${NC}"
echo ""

# 1. Vérifier que Docker est installé
echo -e "${YELLOW}1. Vérification de Docker...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker n'est pas installé${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Docker est installé ($(docker --version))${NC}"

# 2. Vérifier Docker Compose
echo -e "${YELLOW}2. Vérification de Docker Compose...${NC}"
if ! docker compose version &> /dev/null; then
    echo -e "${RED}❌ Docker Compose n'est pas installé${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Docker Compose est installé ($(docker compose version))${NC}"

# 3. Valider docker-compose.dev.yml
echo -e "${YELLOW}3. Validation de docker-compose.dev.yml...${NC}"
if ! docker compose -f docker-compose.dev.yml config --quiet; then
    echo -e "${RED}❌ docker-compose.dev.yml est invalide${NC}"
    exit 1
fi
echo -e "${GREEN}✅ docker-compose.dev.yml est valide${NC}"

# 4. Vérifier que les Dockerfiles existent
echo -e "${YELLOW}4. Vérification des Dockerfiles...${NC}"
if [ ! -f "apps/api/Dockerfile.dev" ]; then
    echo -e "${RED}❌ apps/api/Dockerfile.dev manquant${NC}"
    exit 1
fi
if [ ! -f "apps/web/Dockerfile.dev" ]; then
    echo -e "${RED}❌ apps/web/Dockerfile.dev manquant${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Tous les Dockerfiles sont présents${NC}"

# 5. Vérifier que les .env.example existent
echo -e "${YELLOW}5. Vérification des fichiers .env.example...${NC}"
if [ ! -f ".env.example" ]; then
    echo -e "${RED}❌ .env.example manquant à la racine${NC}"
    exit 1
fi
if [ ! -f "apps/api/.env.example" ]; then
    echo -e "${RED}❌ apps/api/.env.example manquant${NC}"
    exit 1
fi
if [ ! -f "apps/web/.env.example" ]; then
    echo -e "${RED}❌ apps/web/.env.example manquant${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Tous les fichiers .env.example sont présents${NC}"

# 6. Test de build (optionnel - peut être long)
if [ "$1" == "--build" ]; then
    echo -e "${YELLOW}6. Test de build des images Docker...${NC}"
    echo -e "${BLUE}⏳ Ceci peut prendre plusieurs minutes...${NC}"

    if docker compose -f docker-compose.dev.yml build --no-cache; then
        echo -e "${GREEN}✅ Build des images réussi${NC}"
    else
        echo -e "${RED}❌ Échec du build des images${NC}"
        exit 1
    fi

    # 7. Test de démarrage (optionnel)
    if [ "$2" == "--start" ]; then
        echo -e "${YELLOW}7. Test de démarrage des services...${NC}"

        # Nettoyer d'abord
        docker compose -f docker-compose.dev.yml down -v

        # Démarrer
        if docker compose -f docker-compose.dev.yml up -d; then
            echo -e "${GREEN}✅ Services démarrés avec succès${NC}"

            # Attendre que les services soient prêts
            echo -e "${BLUE}⏳ Attente que les services soient prêts (30s)...${NC}"
            sleep 30

            # Vérifier le statut
            docker compose -f docker-compose.dev.yml ps

            # Nettoyer
            echo -e "${YELLOW}🧹 Nettoyage...${NC}"
            docker compose -f docker-compose.dev.yml down -v
        else
            echo -e "${RED}❌ Échec du démarrage des services${NC}"
            docker compose -f docker-compose.dev.yml down -v
            exit 1
        fi
    fi
fi

echo ""
echo -e "${GREEN}🎉 Tous les tests sont passés avec succès !${NC}"
echo ""
echo -e "${BLUE}Pour démarrer l'environnement Docker :${NC}"
echo -e "  make docker-dev"
echo ""
echo -e "${BLUE}Pour voir tous les logs :${NC}"
echo -e "  make docker-dev-logs"
echo ""
echo -e "${BLUE}Pour arrêter l'environnement :${NC}"
echo -e "  make docker-dev-down"
echo ""
