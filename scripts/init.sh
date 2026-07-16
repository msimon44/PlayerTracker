#!/bin/bash

# PlayerTracker - Script d'initialisation
# Ce script configure automatiquement l'environnement de développement
#
# Usage:
#   ./init.sh                 # Mode interactif
#   ./init.sh --auto          # Mode automatique (démarre PostgreSQL automatiquement)
#   ./init.sh --reset-env     # Réinitialise tous les fichiers .env (écrase les existants)
#   ./init.sh --help          # Affiche cette aide

# Note: Pas de 'set -e' pour éviter que le script s'arrête sur des erreurs non-critiques

# Vérifier les arguments
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "PlayerTracker - Script d'initialisation"
    echo ""
    echo "Usage:"
    echo "  ./init.sh                 Mode interactif (défaut)"
    echo "  ./init.sh --auto          Mode automatique (démarre PostgreSQL automatiquement)"
    echo "  ./init.sh --non-interactive  Alias pour --auto"
    echo "  ./init.sh --reset-env     Réinitialise tous les fichiers .env (écrase les existants)"
    echo "  ./init.sh --help          Affiche cette aide"
    echo ""
    echo "Le script configure automatiquement:"
    echo "  • Vérification des prérequis (Node.js, pnpm, Docker)"
    echo "  • Installation des dépendances"
    echo "  • Configuration de l'environnement (.env)"
    echo "  • Build des packages partagés"
    echo "  • Configuration optionnelle de PostgreSQL"
    echo ""
    exit 0
fi

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Fonction pour vérifier si une commande existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Banner
echo "
╔══════════════════════════════════════════════════════════╗
║                    🏃‍♂️ PlayerTracker                         ║
║                Script d'initialisation                   ║
╚══════════════════════════════════════════════════════════╝
"

# Vérification des prérequis
log_info "Vérification des prérequis..."

# Node.js
if command_exists node; then
    NODE_VERSION=$(node --version)
    log_success "Node.js $NODE_VERSION installé"
else
    log_error "Node.js n'est pas installé. Veuillez installer Node.js 18+ depuis https://nodejs.org"
    exit 1
fi

# pnpm
if command_exists pnpm; then
    PNPM_VERSION=$(pnpm --version)
    log_success "pnpm $PNPM_VERSION installé"
else
    log_warning "pnpm n'est pas installé. Installation en cours..."
    npm install -g pnpm
    log_success "pnpm installé"
fi

# Docker
if command_exists docker; then
    DOCKER_VERSION=$(docker --version | cut -d' ' -f3 | cut -d',' -f1)
    log_success "Docker $DOCKER_VERSION installé"
else
    log_warning "Docker n'est pas installé. Veuillez installer Docker depuis https://docker.com"
fi

# Docker Compose
if docker compose version >/dev/null 2>&1 || command_exists docker-compose; then
    log_success "Docker Compose installé"
else
    log_warning "Docker Compose n'est pas installé"
fi

echo ""

# Détecter le mode reset-env
RESET_ENV=false
for arg in "$@"; do
    if [ "$arg" = "--reset-env" ]; then
        RESET_ENV=true
        break
    fi
done

# Configuration de l'environnement
log_info "Configuration de l'environnement..."

# Si mode --reset-env n'est pas activé, demander à l'utilisateur
if [ "$RESET_ENV" = false ]; then
    # Vérifier si des fichiers .env existent déjà
    ENV_EXISTS=false
    if [ -f ".env" ] || [ -f "apps/api/.env" ] || [ -f "apps/web/.env" ] || [ -f "apps/mobile/.env" ] || [ -f "apps/landing/.env" ]; then
        ENV_EXISTS=true
    fi

    if [ "$ENV_EXISTS" = true ]; then
        echo ""
        log_warning "Des fichiers .env existent déjà."
        echo "Voulez-vous les réinitialiser depuis les .env.example ? (y/N)"
        echo -n "Réponse (appuyez sur Entrée pour N par défaut): "

        # Lecture avec timeout de 30 secondes
        read -t 30 RESET_CHOICE || RESET_CHOICE="n"

        # Si l'utilisateur n'a rien entré (juste Entrée), utiliser "n" par défaut
        if [ -z "$RESET_CHOICE" ]; then
            RESET_CHOICE="n"
        fi

        if [[ $RESET_CHOICE =~ ^[Yy]$ ]]; then
            RESET_ENV=true
            log_warning "Les fichiers .env existants seront réinitialisés"
        else
            log_info "Les fichiers .env existants seront conservés"
        fi
        echo ""
    fi
fi

if [ "$RESET_ENV" = true ]; then
    log_warning "Mode réinitialisation activé : tous les fichiers .env seront écrasés"
fi

# Copie du fichier .env racine (pour docker-compose)
if [ ! -f ".env" ] || [ "$RESET_ENV" = true ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        if [ "$RESET_ENV" = true ]; then
            log_success "Fichier .env racine réinitialisé depuis .env.example"
        else
            log_success "Fichier .env racine créé à partir de .env.example"
        fi
    else
        log_warning "Fichier .env.example racine introuvable"
    fi
else
    log_info "Fichier .env racine existe déjà"
fi

# Copie du fichier .env pour l'API (pour développement local)
if [ ! -f "apps/api/.env" ] || [ "$RESET_ENV" = true ]; then
    if [ -f "apps/api/.env.example" ]; then
        cp apps/api/.env.example apps/api/.env
        if [ "$RESET_ENV" = true ]; then
            log_success "Fichier .env API réinitialisé depuis apps/api/.env.example"
        else
            log_success "Fichier .env API créé à partir de apps/api/.env.example"
        fi
    else
        log_warning "Fichier apps/api/.env.example introuvable"
    fi
else
    log_info "Fichier apps/api/.env existe déjà"
fi

# Copie du fichier .env pour le Web (pour développement local)
if [ ! -f "apps/web/.env" ] || [ "$RESET_ENV" = true ]; then
    if [ -f "apps/web/.env.example" ]; then
        cp apps/web/.env.example apps/web/.env
        if [ "$RESET_ENV" = true ]; then
            log_success "Fichier .env Web réinitialisé depuis apps/web/.env.example"
        else
            log_success "Fichier .env Web créé à partir de apps/web/.env.example"
        fi
    else
        log_warning "Fichier apps/web/.env.example introuvable"
    fi
else
    log_info "Fichier apps/web/.env existe déjà"
fi

# Copie du fichier .env pour le Mobile (pour développement local)
if [ ! -f "apps/mobile/.env" ] || [ "$RESET_ENV" = true ]; then
    if [ -f "apps/mobile/.env.example" ]; then
        cp apps/mobile/.env.example apps/mobile/.env
        if [ "$RESET_ENV" = true ]; then
            log_success "Fichier .env Mobile réinitialisé depuis apps/mobile/.env.example"
        else
            log_success "Fichier .env Mobile créé à partir de apps/mobile/.env.example"
        fi
    else
        log_warning "Fichier apps/mobile/.env.example introuvable"
    fi
else
    log_info "Fichier apps/mobile/.env existe déjà"
fi

# Copie du fichier .env pour la Landing (pour développement local)
if [ ! -f "apps/landing/.env" ] || [ "$RESET_ENV" = true ]; then
    if [ -f "apps/landing/.env.example" ]; then
        cp apps/landing/.env.example apps/landing/.env
        if [ "$RESET_ENV" = true ]; then
            log_success "Fichier .env Landing réinitialisé depuis apps/landing/.env.example"
        else
            log_success "Fichier .env Landing créé à partir de apps/landing/.env.example"
        fi
    else
        log_warning "Fichier apps/landing/.env.example introuvable"
    fi
else
    log_info "Fichier apps/landing/.env existe déjà"
fi

if [ "$RESET_ENV" = true ]; then
    log_warning "⚠️  Tous les fichiers .env ont été réinitialisés - pensez à reconfigurer vos valeurs personnalisées"
else
    log_warning "N'oubliez pas de modifier les fichiers .env avec vos valeurs"
fi

echo ""

# Installation des dépendances
log_info "Installation des dépendances..."
if pnpm install; then
    log_success "Dépendances installées"
else
    log_error "Erreur lors de l'installation des dépendances"
    exit 1
fi

echo ""

# Build des packages partagés
log_info "Build des packages partagés..."
BUILD_SUCCESS=true

# Build uniquement @playertracker/utils qui a un script build
if pnpm --filter @playertracker/utils build ; then
    log_success "Package @playertracker/utils buildé"
else
    log_warning "Problème avec le build de @playertracker/utils - peut être ignoré pour le moment"
    BUILD_SUCCESS=false
fi

# Note: @playertracker/config et @playertracker/theme n'ont pas besoin de build (exports directs)

if [ "$BUILD_SUCCESS" = true ]; then
    log_success "Packages partagés buildés"
else
    log_warning "Certains packages n'ont pas pu être buildés - vous pouvez continuer"
fi

echo ""

# Configuration de la base de données
log_info "Configuration de la base de données..."

# Vérifier si on est en mode non-interactif
if [ "$1" = "--auto" ] || [ "$1" = "--non-interactive" ]; then
    AUTO_MODE=true
    log_info "Mode automatique détecté - PostgreSQL sera démarré automatiquement"
    START_POSTGRES="y"
else
    AUTO_MODE=false
    echo ""
    echo "Voulez-vous démarrer la base de données PostgreSQL avec Docker ? (y/N)"
    echo -n "Réponse (appuyez sur Entrée pour N par défaut): "

    # Lecture simple avec timeout de 30 secondes
    read -t 30 START_POSTGRES  || START_POSTGRES="n"

    # Si l'utilisateur n'a rien entré (juste Entrée), utiliser "n" par défaut
    if [ -z "$START_POSTGRES" ]; then
        START_POSTGRES="n"
    fi

    echo ""
fi

if [[ $START_POSTGRES =~ ^[Yy]$ ]]; then
    if command_exists docker; then
        log_info "Démarrage de PostgreSQL..."

        # Essayer docker compose d'abord (nouvelle syntaxe), puis docker-compose (fallback)
        if docker compose version >/dev/null 2>&1; then
            docker compose -f docker-compose.dev.yml up -d postgres
        elif command_exists docker-compose; then
            docker-compose -f docker-compose.dev.yml up -d postgres
        fi

        if [ $? -eq 0 ]; then
            log_success "Base de données PostgreSQL démarrée"

            # Attendre que PostgreSQL soit prêt avec vérification
            log_info "Attente que PostgreSQL soit prêt..."

            # Fonction pour tester la connexion PostgreSQL
            wait_for_postgres() {
                local max_attempts=30
                local attempt=1

                while [ $attempt -le $max_attempts ]; do
                    if docker exec $(docker ps --filter "name=postgres" --format "{{.Names}}" | head -n1) pg_isready -U postgres >/dev/null 2>&1; then
                        return 0
                    fi
                    echo -n "."
                    sleep 1
                    ((attempt++))
                done
                return 1
            }

            if wait_for_postgres; then
                echo ""
                log_success "PostgreSQL est prêt !"

                # Génération du client Prisma et migration
                log_info "Génération du client Prisma..."
                if pnpm --filter @playertracker/api prisma:generate >/dev/null 2>&1; then
                    log_success "Client Prisma généré"

                    log_info "Exécution des migrations..."
                    if pnpm --filter @playertracker/api prisma:migrate >/dev/null 2>&1; then
                        log_success "Migrations exécutées"
                    else
                        log_warning "Problème avec les migrations - vous pouvez les exécuter manuellement avec: pnpm --filter @playertracker/api prisma:migrate"
                    fi
                else
                    log_warning "Problème avec la génération Prisma - vous pouvez l'exécuter manuellement avec: pnpm --filter @playertracker/api prisma:generate"
                fi
            else
                echo ""
                log_warning "PostgreSQL met du temps à démarrer - vous pouvez réessayer plus tard"
            fi
        else
            log_error "Échec du démarrage de PostgreSQL avec Docker"
        fi
    else
        log_warning "Docker non disponible. Démarrez PostgreSQL manuellement et configurez DATABASE_URL dans .env"
    fi
else
    log_info "Configuration manuelle de la base de données requise"
    log_info "1. Assurez-vous que PostgreSQL est en cours d'exécution"
    log_info "2. Configurez DATABASE_URL dans apps/api/.env"
    log_info "3. Exécutez: pnpm --filter @playertracker/api prisma:generate"
    log_info "4. Exécutez: pnpm --filter @playertracker/api prisma:migrate"
fi

echo ""

# Vérification finale (non-bloquante)
log_info "Vérification finale..."

# Test build (non-bloquant)
log_info "Test de build des packages..."
if pnpm --filter @playertracker/utils build >/dev/null 2>&1; then
    log_success "Build des packages OK"
else
    log_warning "Le build des packages a rencontré des problèmes - vous pouvez les résoudre plus tard"
    log_info "Pour builder manuellement: pnpm build"
fi

echo ""

# Résumé
log_success "🎉 Initialisation terminée !"
echo ""
echo "📋 Prochaines étapes :"
echo ""
echo "1️⃣  Modifiez le fichier .env avec vos valeurs"
echo "2️⃣  Démarrez le développement :"
echo "    pnpm dev"
echo ""
echo "3️⃣  URLs de développement :"
echo "    🌐 Web App:    http://localhost:3000"
echo "    🏠 Landing:    http://localhost:3002"
echo "    📱 API:        http://localhost:3001"
echo "    📊 API Docs:   http://localhost:3001/docs"
echo ""
echo "4️⃣  Commandes utiles :"
echo "    pnpm dev           # Démarrer tous les services"
echo "    pnpm build         # Builder tous les packages"
echo "    pnpm lint          # Linter le code"
echo "    pnpm type-check    # Vérification TypeScript"
echo "    pnpm test          # Lancer les tests"
echo ""
echo "📚 Documentation complète dans README.md"
echo ""
log_success "Bon développement ! 🚀"
