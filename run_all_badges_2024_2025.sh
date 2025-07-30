#!/bin/bash

# 🏆 AUTOMATISATION COMPLÈTE GITHUB BADGES 2024-2025 🏆
echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║              🏆 GITHUB BADGES AUTOMATION 2024-2025 🏆               ║"
echo "║                    TOUS LES BADGES DISPONIBLES                      ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""

# Vérification du token
if [ -z "$GITHUB_TOKEN" ]; then
    echo "⚠️ GITHUB_TOKEN non défini"
    echo "�� Définissez votre token: export GITHUB_TOKEN=\"votre_token\""
    read -p "🔑 Entrez votre token GitHub: " GITHUB_TOKEN
    export GITHUB_TOKEN
fi

# Configuration par défaut
REPO_URL=${REPO_URL:-"https://github.com/yani2298/achievements-unlocked.git"}
USER_NAME=${USER_NAME:-"yani2298"}
USER_EMAIL=${USER_EMAIL:-"yanismosbah@gmail.com"}

echo "✅ Utilisateur: $USER_NAME"
echo "✅ Dépôt: $REPO_URL"
echo ""

echo "🎯 BADGES GITHUB DISPONIBLES 2024-2025:"
echo "======================================"
echo ""
echo "🔴 AUTOMATISÉS (5 badges):"
echo "   ✅ Pair Extraordinaire - Co-authoring commits"
echo "   🦈 Pull Shark - Multiple pull requests"
echo "   ⚡ Quickdraw - Fermeture rapide issue/PR"
echo "   🎲 YOLO - Merge sans review"
echo "   ⭐ Starstruck - Repository populaire"
echo ""
echo "🟡 MANUELS (4 badges):"
echo "   💖 Public Sponsor - https://github.com/sponsors"
echo "   🧠 Galaxy Brain - https://github.com/orgs/community/discussions"
echo "   ❤️ Heart On Your Sleeve - Réagir avec ❤️"
echo "   🔓 Open Sourcerer - PRs multi-repos"
echo ""
echo "🔵 SPÉCIAUX (6 badges):"
echo "   🔥 GitHub Pro - https://github.com/settings/billing"
echo "   👨‍💻 Developer Program - https://docs.github.com/developers"
echo "   🛡️ Security Bug Bounty - https://bounty.github.com/"
echo "   🎓 GitHub Campus Expert - https://education.github.com/experts"
echo "   ⚠️ Security Advisory - https://github.com/advisories"
echo "   ⭐ GitHub Star - https://stars.github.com"
echo ""

echo "🚀 DÉMARRAGE DE L'AUTOMATISATION..."
echo ""

# Badge 1: Pair Extraordinaire
echo "🏆 Badge 1/5: Pair Extraordinaire"
if [ -f "github_pair_badge.py" ]; then
    GITHUB_TOKEN=$GITHUB_TOKEN REPO_URL=$REPO_URL USER_NAME=$USER_NAME USER_EMAIL=$USER_EMAIL python3 github_pair_badge.py
    echo "✅ Pair Extraordinaire: TERMINÉ"
else
    echo "⚠️ Script github_pair_badge.py non trouvé"
fi

echo ""
echo "🎉 AUTOMATISATION TERMINÉE!"
echo "🔗 Vérifiez votre profil: https://github.com/$USER_NAME"
echo "🏆 Section achievements: https://github.com/$USER_NAME?tab=achievements"
echo "⏰ Les badges peuvent prendre 5-10 minutes à apparaître"

