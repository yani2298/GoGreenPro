#!/bin/bash

# Quick Start Script pour GitHub Pair Extraordinaire Badge
# Usage: ./quick_start.sh

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║           GITHUB PAIR EXTRAORDINAIRE - QUICK START          ║"
echo "║               Automatisation complète du badge              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Vérifier si les scripts existent
if [ ! -f "github_pair_badge_automation.sh" ]; then
    echo "❌ Script bash non trouvé"
    exit 1
fi

if [ ! -f "github_pair_badge.py" ]; then
    echo "❌ Script Python non trouvé"
    exit 1
fi

echo "🔧 Vérification des prérequis..."

# Vérifier Git
if ! command -v git &> /dev/null; then
    echo "❌ Git n'est pas installé"
    exit 1
fi
echo "✅ Git installé"

# Vérifier Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 n'est pas installé"
    exit 1
fi
echo "✅ Python 3 installé"

# Vérifier requests
if ! python3 -c "import requests" 2>/dev/null; then
    echo "⚠️  Library 'requests' manquante. Installation..."
    pip3 install requests
fi
echo "✅ Library requests disponible"

echo ""
echo "📋 Choisissez votre méthode d'automatisation:"
echo "1. Script Bash (Simple, intervention minimale)"
echo "2. Script Python (Complet, zéro intervention avec token)"
echo "3. Configuration par variables d'environnement"
echo "4. Aide et documentation"
echo ""

read -p "Votre choix (1-5): " choice

case $choice in
    1)
        echo "🚀 Lancement du script Bash..."
        chmod +x github_pair_badge_automation.sh
        ./github_pair_badge_automation.sh
        ;;
    2)
        echo "🚀 Lancement du script Python..."
        python3 github_pair_badge.py
        ;;
    3)
        echo ""
        echo "📝 Configuration par variables d'environnement:"
        echo ""
        echo "export REPO_URL=\"https://github.com/username/repository.git\""
        echo "export USER_NAME=\"Votre Nom\""
        echo "export USER_EMAIL=\"votre-email@example.com\""
        echo "export GITHUB_TOKEN=\"ghp_votre_token_optionnel\""
        echo ""
        echo "Puis exécutez: python3 github_pair_badge.py"
        echo ""
        read -p "Voulez-vous configurer maintenant? (y/n): " configure
        
        if [ "$configure" = "y" ] || [ "$configure" = "Y" ]; then
            read -p "URL du dépôt: " repo_url
            read -p "Votre nom GitHub: " user_name
            read -p "Votre email: " user_email
            read -p "Token GitHub (optionnel): " github_token
            
            export REPO_URL="$repo_url"
            export USER_NAME="$user_name"
            export USER_EMAIL="$user_email"
            export GITHUB_TOKEN="$github_token"
            
            echo "✅ Variables configurées. Lancement du script..."
            python3 github_pair_badge.py
        fi
        ;;
    4)
        echo ""
        echo "📚 AIDE ET DOCUMENTATION"
        echo ""
        echo "=== PRÉREQUIS ==="
        echo "• Compte GitHub"
        echo "• Dépôt GitHub (profil README recommandé)"
        echo "• Git configuré avec vos credentials"
        echo "• Python 3.6+ et library requests"
        echo ""
        echo "=== PROCESSUS ==="
        echo "1. Le script clone votre dépôt"
        echo "2. Crée une nouvelle branche"
        echo "3. Ajoute/modifie des fichiers"
        echo "4. Fait un commit avec co-auteurs"
        echo "5. Pousse les changements"
        echo "6. Crée une Pull Request"
        echo "7. Merge la PR (si token fourni)"
        echo ""
        echo "=== TOKEN GITHUB ==="
        echo "Optionnel mais recommandé pour l'automatisation complète:"
        echo "GitHub → Settings → Developer settings → Personal access tokens"
        echo "Permissions: repo, public_repo, pull_request"
        echo ""
        echo "=== VÉRIFICATION DU SUCCÈS ==="
        echo "• Le commit montre 2 avatars"
        echo "• Badge visible sur votre profil GitHub"
        echo "• Section Achievements mise à jour"
        echo ""
        cat README.md
        ;;
    5)
        echo "🚀 Lancement du Contribution Booster..."
        python3 github_contribution_booster.py
        ;;
    *)
        echo "❌ Choix invalide"
        exit 1
        ;;
esac

echo ""
echo "🎉 Quick Start terminé!"
echo "📝 Consultez README.md pour plus d'informations" 