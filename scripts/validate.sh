#!/bin/bash

# Script de validation du setup PlayerTracker
# Vérifie que tout est correctement configuré

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔍 Validation de la configuration PlayerTracker${NC}"
echo ""

# Vérifier les fichiers de configuration
echo -e "${BLUE}📁 Vérification des fichiers...${NC}"

files=(
    ".env"
    "turbo.json"
    "package.json"
    "packages/config/package.json"
    "packages/types/dist/index.js"
    "packages/utils/dist/index.js"
    "packages/ui/dist/index.js"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file${NC}"
    else
        echo -e "${RED}❌ $file manquant${NC}"
    fi
done

echo ""

# Vérifier les packages buildés
echo -e "${BLUE}🔨 Vérification des builds...${NC}"

if [ -d "packages/types/dist" ] && [ -f "packages/types/dist/index.js" ]; then
    echo -e "${GREEN}✅ @playertracker/types buildé${NC}"
else
    echo -e "${RED}❌ @playertracker/types non buildé${NC}"
fi

if [ -d "packages/utils/dist" ] && [ -f "packages/utils/dist/index.js" ]; then
    echo -e "${GREEN}✅ @playertracker/utils buildé${NC}"
else
    echo -e "${RED}❌ @playertracker/utils non buildé${NC}"
fi

if [ -d "packages/ui/dist" ] && [ -f "packages/ui/dist/index.js" ]; then
    echo -e "${GREEN}✅ @playertracker/ui buildé${NC}"
else
    echo -e "${RED}❌ @playertracker/ui non buildé${NC}"
fi

echo ""

# Vérifier les configurations TypeScript
echo -e "${BLUE}🎯 Vérification des configurations TypeScript...${NC}"

ts_configs=(
    "packages/config/typescript/base.json"
    "packages/config/typescript/nextjs.json"
    "packages/config/typescript/nestjs.json"
    "packages/config/typescript/react.json"
    "packages/config/typescript/react-native.json"
)

for config in "${ts_configs[@]}"; do
    if [ -f "$config" ]; then
        echo -e "${GREEN}✅ $config${NC}"
    else
        echo -e "${RED}❌ $config manquant${NC}"
    fi
done

echo ""

# Vérifier les configurations ESLint
echo -e "${BLUE}📏 Vérification des configurations ESLint...${NC}"

eslint_configs=(
    "packages/config/eslint/base.js"
    "packages/config/eslint/nextjs.js"
    "packages/config/eslint/nestjs.js"
    "packages/config/eslint/react-native.js"
)

for config in "${eslint_configs[@]}"; do
    if [ -f "$config" ]; then
        echo -e "${GREEN}✅ $config${NC}"
    else
        echo -e "${RED}❌ $config manquant${NC}"
    fi
done

echo ""

# Vérifier les services Docker
echo -e "${BLUE}🐳 Vérification des services Docker...${NC}"

if docker ps --format "{{.Names}}" | grep -q "postgres"; then
    echo -e "${GREEN}✅ PostgreSQL en cours d'exécution${NC}"
else
    echo -e "${YELLOW}⚠️  PostgreSQL non démarré (normal si pas encore configuré)${NC}"
fi

echo ""

# Test rapide de build
echo -e "${BLUE}🧪 Test de build rapide...${NC}"

if pnpm build > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Build global réussi${NC}"
else
    echo -e "${RED}❌ Problème avec le build global${NC}"
fi

echo ""

# Résumé
echo -e "${BLUE}📊 Résumé de la validation${NC}"
echo ""

if [ -f ".env" ] && [ -d "packages/types/dist" ] && [ -d "packages/utils/dist" ] && [ -d "packages/ui/dist" ]; then
    echo -e "${GREEN}🎉 Configuration valide ! Le projet est prêt.${NC}"
    echo ""
    echo -e "${BLUE}🚀 Prochaines étapes :${NC}"
    echo "1. Configurez .env avec vos valeurs"
    echo "2. Lancez: pnpm dev"
    echo "3. Ouvrez: http://localhost:3000"
else
    echo -e "${RED}❌ Configuration incomplète${NC}"
    echo ""
    echo -e "${YELLOW}🔧 Actions recommandées :${NC}"
    echo "1. Exécutez: ./init.sh"
    echo "2. Ou manuellement: pnpm install && pnpm build"
fi

echo ""
