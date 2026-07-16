#!/bin/bash

# =============================================================================
# IMPORT DEPENDENCY CHECKER
# Détecte les imports croisés et les violations d'architecture
# =============================================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

echo "🔍 Checking import dependencies..."

VIOLATIONS_FOUND=false

# Rule 1: packages/types should not import from apps
echo "📦 Checking packages/types imports..."
if find packages/types/src -name "*.ts" -exec grep -l "from.*apps/" {} \; 2>/dev/null; then
    log_error "packages/types imports from apps (circular dependency)"
    VIOLATIONS_FOUND=true
else
    log_success "packages/types: no invalid imports"
fi

# Rule 2: packages/utils should not import from apps
echo "📦 Checking packages/utils imports..."
if find packages/utils/src -name "*.ts" -exec grep -l "from.*apps/" {} \; 2>/dev/null; then
    log_error "packages/utils imports from apps (circular dependency)"
    VIOLATIONS_FOUND=true
else
    log_success "packages/utils: no invalid imports"
fi

# Rule 3: packages/ui should not import from apps
echo "📦 Checking packages/ui imports..."
if find packages/ui/src -name "*.ts" -exec grep -l "from.*apps/" {} \; 2>/dev/null; then
    log_error "packages/ui imports from apps (circular dependency)"
    VIOLATIONS_FOUND=true
else
    log_success "packages/ui: no invalid imports"
fi

# Rule 4: Check for relative imports outside of package boundaries
echo "🔗 Checking for boundary violations..."
find apps packages -name "*.ts" -exec grep -l "\.\./\.\./\.\." {} \; 2>/dev/null | while read file; do
    log_warning "Deep relative import in: $file"
    grep -n "\.\./\.\./\.\." "$file" || true
done

# Rule 5: Verify workspace imports use correct package names
echo "📋 Checking workspace imports..."
find apps -name "*.ts" -exec grep -l "@playertracker/" {} \; 2>/dev/null | while read file; do
    # Check if imports match declared dependencies
    PACKAGE_DIR=$(dirname "$file" | sed 's|/src.*||')
    if [ -f "$PACKAGE_DIR/package.json" ]; then
        DEPS=$(cat "$PACKAGE_DIR/package.json" | grep -A 20 '"dependencies"' | grep '@playertracker/' || true)
        grep '@playertracker/' "$file" | while read -r line; do
            IMPORT=$(echo "$line" | sed -n "s/.*from ['\"]\\(@playertracker\/[^'\"]*\\)['\"].*/\\1/p")
            if [ -n "$IMPORT" ] && ! echo "$DEPS" | grep -q "$IMPORT"; then
                log_warning "Undeclared dependency '$IMPORT' in $file"
            fi
        done
    fi
done

# Summary
if [ "$VIOLATIONS_FOUND" = true ]; then
    log_error "Import dependency violations found!"
    exit 1
else
    log_success "All import dependencies are valid!"
fi
