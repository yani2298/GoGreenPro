#!/bin/bash

# Script automatisé pour obtenir le badge "Pair Extraordinaire" sur GitHub
# Usage: ./github_pair_badge_automation.sh

set -e

# Configuration
REPO_URL=""
USER_NAME=""
USER_EMAIL=""
COLLABORATOR_NAME="GitHub Assistant"
COLLABORATOR_EMAIL="assistant@github.example"
BRANCH_NAME="feature/pair-badge-$(date +%s)"

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction d'affichage
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

# Fonction de configuration
setup_config() {
    print_step "Configuration initiale..."
    
    if [ -z "$REPO_URL" ]; then
        echo -n "URL du dépôt GitHub (format: https://github.com/user/repo.git): "
        read REPO_URL
    fi
    
    if [ -z "$USER_NAME" ]; then
        echo -n "Votre nom GitHub: "
        read USER_NAME
    fi
    
    if [ -z "$USER_EMAIL" ]; then
        echo -n "Votre email GitHub: "
        read USER_EMAIL
    fi
    
    # Extraire le nom du dépôt
    REPO_NAME=$(basename "$REPO_URL" .git)
    
    print_success "Configuration terminée"
}

# Fonction de clonage/préparation du dépôt
prepare_repo() {
    print_step "Préparation du dépôt..."
    
    if [ -d "$REPO_NAME" ]; then
        print_warning "Le dépôt existe déjà, mise à jour..."
        cd "$REPO_NAME"
        git pull origin main 2>/dev/null || git pull origin master 2>/dev/null
    else
        print_step "Clonage du dépôt..."
        git clone "$REPO_URL"
        cd "$REPO_NAME"
    fi
    
    print_success "Dépôt prêt"
}

# Fonction de création de branche
create_branch() {
    print_step "Création de la branche $BRANCH_NAME..."
    
    git checkout -b "$BRANCH_NAME"
    
    print_success "Branche créée et basculée"
}

# Fonction de modification des fichiers
make_changes() {
    print_step "Modification des fichiers..."
    
    # Modifier le README s'il existe, sinon créer un fichier
    if [ -f "README.md" ]; then
        echo "" >> README.md
        echo "<!-- Collaboration update $(date) -->" >> README.md
        echo "🤝 **Pair Programming**: Contributing to open source with collaboration" >> README.md
        print_success "README.md modifié"
    else
        cat > collaboration_update.md << EOF
# Collaboration Update

Date: $(date)
Auteurs: $USER_NAME et $COLLABORATOR_NAME

## Objectif
Démonstration de collaboration pour le badge Pair Extraordinaire

## Modifications
- Ajout de documentation collaborative
- Mise à jour des métadonnées du projet

---
*Généré automatiquement par le script d'automatisation*
EOF
        print_success "Fichier collaboration_update.md créé"
    fi
}

# Fonction de commit collaboratif
create_collaborative_commit() {
    print_step "Création du commit collaboratif..."
    
    git add .
    
    # Créer le commit avec co-auteurs
    git commit -m "feat: Add collaborative documentation

This commit demonstrates pair programming practices
and collaborative development workflows.

Co-authored-by: $COLLABORATOR_NAME <$COLLABORATOR_EMAIL>
Co-authored-by: $USER_NAME <$USER_EMAIL>"
    
    print_success "Commit collaboratif créé"
}

# Fonction de push
push_changes() {
    print_step "Push des modifications..."
    
    git push origin "$BRANCH_NAME"
    
    print_success "Modifications poussées sur GitHub"
}

# Fonction de création de PR (optionnelle)
create_pull_request() {
    print_step "Instructions pour la Pull Request..."
    
    echo ""
    echo "=== ÉTAPES SUIVANTES ==="
    echo "1. Allez sur votre dépôt GitHub"
    echo "2. Cliquez sur 'Compare & pull request'"
    echo "3. Ajoutez un titre: 'Add collaborative documentation'"
    echo "4. Ajoutez une description mentionnant la collaboration"
    echo "5. Créez la pull request"
    echo "6. Mergez avec 'Squash and merge'"
    echo "7. Supprimez la branche après merge"
    echo ""
    
    # Si gh CLI est installé, proposer de créer la PR automatiquement
    if command -v gh &> /dev/null; then
        echo -n "Créer automatiquement la PR avec GitHub CLI? (y/n): "
        read create_pr
        
        if [ "$create_pr" = "y" ] || [ "$create_pr" = "Y" ]; then
            print_step "Création automatique de la PR..."
            gh pr create \
                --title "feat: Add collaborative documentation for Pair Extraordinaire badge" \
                --body "This PR demonstrates collaborative development practices.

## Changes
- Added collaborative documentation
- Updated project metadata

## Co-authors
- $COLLABORATOR_NAME
- $USER_NAME

This commit showcases pair programming methodologies for the GitHub Pair Extraordinaire achievement." \
                --head "$BRANCH_NAME" \
                --base main
            
            print_success "Pull Request créée automatiquement"
            
            echo -n "Merger automatiquement la PR? (y/n): "
            read merge_pr
            
            if [ "$merge_pr" = "y" ] || [ "$merge_pr" = "Y" ]; then
                print_step "Merge automatique de la PR..."
                gh pr merge --squash --delete-branch
                print_success "PR mergée et branche supprimée"
            fi
        fi
    else
        print_warning "GitHub CLI non installé. Veuillez créer la PR manuellement."
    fi
}

# Fonction de vérification finale
final_check() {
    print_step "Vérification finale..."
    
    echo ""
    echo "=== RÉSUMÉ ==="
    echo "✅ Dépôt: $REPO_NAME"
    echo "✅ Branche: $BRANCH_NAME"
    echo "✅ Commit collaboratif créé"
    echo "✅ Modifications poussées"
    echo ""
    
    print_success "Processus terminé!"
    print_warning "Le badge peut prendre quelques minutes à apparaître sur votre profil."
    
    echo ""
    echo "=== VÉRIFICATION ==="
    echo "1. Vérifiez que votre commit montre 2 avatars d'utilisateurs"
    echo "2. Allez sur votre profil GitHub pour voir le badge"
    echo "3. Le badge 'Pair Extraordinaire' devrait apparaître dans vos achievements"
}

# Fonction principale
main() {
    echo -e "${GREEN}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║             GITHUB PAIR EXTRAORDINAIRE AUTOMATION           ║"
    echo "║                Script automatisé pour badge                 ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo ""
    
    setup_config
    prepare_repo
    create_branch
    make_changes
    create_collaborative_commit
    push_changes
    create_pull_request
    final_check
    
    echo ""
    print_success "🎉 Script terminé avec succès!"
}

# Gestion des erreurs
trap 'print_error "Script interrompu"; exit 1' INT

# Exécution du script principal
main "$@" 