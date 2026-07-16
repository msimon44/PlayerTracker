#!/bin/bash

# Script de création et initialisation de la base de données PlayerTracker
# Usage: ./setup-database.sh [--reset] [--seed]

set -e  # Arrêter le script en cas d'erreur

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration par défaut
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_NAME=${POSTGRES_DB:-playertracker}
DB_USER=${POSTGRES_USER:-postgres}
DB_PASSWORD=${POSTGRES_PASSWORD:-postgres}

RESET_DB=false
RUN_SEED=false

# Parsing des arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --reset)
            RESET_DB=true
            shift
            ;;
        --seed)
            RUN_SEED=true
            shift
            ;;
        -h|--help)
            echo "Usage: $0 [--reset] [--seed]"
            echo "  --reset: Supprime et recrée complètement la base de données"
            echo "  --seed:  Execute le seeding après les migrations"
            exit 0
            ;;
        *)
            echo "Option inconnue: $1"
            exit 1
            ;;
    esac
done

# Fonctions utilitaires
print_step() {
    echo -e "${BLUE}[ÉTAPE]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCÈS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[ATTENTION]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERREUR]${NC} $1"
}

# Vérification des prérequis
check_prerequisites() {
    print_step "Vérification des prérequis..."

    # Vérifier si Docker est installé et en cours d'exécution
    if ! command -v docker &> /dev/null; then
        print_error "Docker n'est pas installé. Veuillez l'installer d'abord."
        exit 1
    fi

    if ! docker info &> /dev/null; then
        print_error "Docker n'est pas en cours d'exécution. Veuillez le démarrer."
        exit 1
    fi

    # Vérifier si pnpm est installé
    if ! command -v pnpm &> /dev/null; then
        print_error "pnpm n'est pas installé. Veuillez l'installer avec: npm install -g pnpm"
        exit 1
    fi

    # Vérifier la structure du projet
    if [ ! -f "apps/api/prisma/schema.prisma" ]; then
        print_error "Schema Prisma introuvable. Assurez-vous d'être dans le bon répertoire."
        exit 1
    fi

    print_success "Tous les prérequis sont satisfaits"
}

# Démarrage des services Docker
start_docker_services() {
    print_step "Démarrage des services Docker..."

    # Arrêter les services existants s'ils sont en cours d'exécution
    docker compose down > /dev/null 2>&1 || true

    # Démarrer uniquement PostgreSQL
    docker compose up -d postgres

    # Attendre que PostgreSQL soit prêt
    print_step "Attente du démarrage de PostgreSQL..."
    local max_attempts=30
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        if docker compose exec -T postgres pg_isready -U $DB_USER > /dev/null 2>&1; then
            print_success "PostgreSQL est prêt"
            break
        fi

        if [ $attempt -eq $max_attempts ]; then
            print_error "PostgreSQL n'a pas démarré dans les temps"
            exit 1
        fi

        echo -n "."
        sleep 2
        ((attempt++))
    done
}

# Installation des dépendances
install_dependencies() {
    print_step "Installation des dépendances..."

    # Installation des dépendances root
    pnpm install

    # Installation des dépendances API
    cd apps/api
    pnpm install
    cd ../..

    print_success "Dépendances installées"
}

# Configuration de l'environnement
setup_environment() {
    print_step "Configuration de l'environnement..."

    # Créer le fichier .env s'il n'existe pas
    if [ ! -f "apps/api/.env" ]; then
        print_step "Création du fichier .env pour l'API..."
        cat > apps/api/.env << EOF
# Base de données
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="24h"

# CORS
CORS_ORIGIN="http://localhost:3000"

# Upload
MAX_FILE_SIZE=5242880

# Email (configurez selon vos besoins)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER=""
SMTP_PASS=""
SMTP_FROM=""

# OAuth (configurez selon vos besoins)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
APPLE_CLIENT_ID=""
APPLE_TEAM_ID=""
APPLE_KEY_ID=""
APPLE_PRIVATE_KEY_PATH=""

# URLs Frontend
WEB_URL="http://localhost:3000"
MOBILE_URL=""
EOF
        print_success "Fichier .env créé pour l'API"
    else
        print_warning "Le fichier .env existe déjà"
    fi
}

# Gestion de la base de données
manage_database() {
    cd apps/api

    if [ "$RESET_DB" = true ]; then
        print_step "Reset complet de la base de données..."

        # Utiliser Prisma pour reset
        pnpm prisma migrate reset --force
        print_success "Base de données resetée"
    else
        print_step "Application des migrations Prisma..."

        # Générer le client Prisma
        pnpm prisma generate

        # Appliquer les migrations
        pnpm prisma migrate deploy
        print_success "Migrations appliquées"
    fi

    cd ../..
}

# Seeding de la base de données
seed_database() {
    if [ "$RUN_SEED" = true ]; then
        print_step "Seeding de la base de données..."
        cd apps/api
        # Vérifier si un script de seed existe
        if grep -q '"seed"' package.json; then        if pnpm run seed; then
            print_success "Seeding terminé"
        else
            print_error "Le script de seed a échoué. Vérifiez le fichier prisma/seed.ts :\n- Les champs utilisés existent-ils bien dans votre schéma Prisma ?\n- Les types passés aux propriétés sont-ils corrects ?\n- Consultez la documentation Prisma sur le seeding : https://www.prisma.io/docs/guides/database/seed-database\n\nRésumé de l'erreur ci-dessus :\n$(tail -n 20 prisma/seed.ts 2>/dev/null)"
            exit 1
        fi
        else
            print_warning "Aucun script de seed trouvé dans package.json"
        fi
        cd ../..
    fi
}

# Vérification finale
verify_setup() {
    print_step "Vérification de l'installation..."

    cd apps/api

    # Tester la connexion à la base de données
    if pnpm prisma db pull > /dev/null 2>&1; then
        print_success "Connexion à la base de données OK"
    else
        print_error "Impossible de se connecter à la base de données"
        exit 1
    fi

    # Afficher les informations de la base de données
    echo ""
    echo -e "${BLUE}=== INFORMATIONS DE LA BASE DE DONNÉES ===${NC}"
    echo "Host: $DB_HOST"
    echo "Port: $DB_PORT"
    echo "Database: $DB_NAME"
    echo "User: $DB_USER"
    echo ""

    cd ../..
}

# Fonction principale
main() {
    echo -e "${GREEN}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    PLAYERTRACKER DATABASE SETUP                ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"

    check_prerequisites
    start_docker_services
    install_dependencies
    setup_environment
    manage_database
    seed_database
    verify_setup

    echo ""
    echo -e "${GREEN}🎉 Base de données PlayerTracker configurée avec succès !${NC}"
    echo ""
    echo "Prochaines étapes :"
    echo "1. Configurez vos variables d'environnement dans apps/api/.env"
    echo "2. Démarrez l'API avec: cd apps/api && pnpm run start:dev"
    echo "3. Accédez à Prisma Studio avec: cd apps/api && pnpm prisma studio"
    echo ""

    if [ "$RESET_DB" = false ] && [ "$RUN_SEED" = false ]; then
        echo "Options disponibles :"
        echo "- Pour reset la DB : ./setup-database.sh --reset"
        echo "- Pour seeder la DB : ./setup-database.sh --seed"
        echo "- Pour les deux : ./setup-database.sh --reset --seed"
    fi
}

# Exécution du script principal
main "$@"
