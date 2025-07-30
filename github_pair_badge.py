#!/usr/bin/env python3
"""
Script automatisé pour obtenir le badge "Pair Extraordinaire" sur GitHub
Utilise l'API GitHub pour une automatisation complète
"""

import os
import sys
import subprocess
import json
import requests
from datetime import datetime
import tempfile
import shutil

class GitHubPairBadgeAutomator:
    def __init__(self):
        self.repo_url = ""
        self.user_name = ""
        self.user_email = ""
        self.github_token = ""
        self.collaborator_name = "GitHub Assistant"
        self.collaborator_email = "assistant@github.example"
        self.branch_name = f"feature/pair-badge-{int(datetime.now().timestamp())}"
        self.repo_name = ""
        self.repo_owner = ""
        self.working_dir = ""
        
    def print_step(self, message):
        print(f"\033[34m[ÉTAPE]\033[0m {message}")
        
    def print_success(self, message):
        print(f"\033[32m[SUCCÈS]\033[0m {message}")
        
    def print_warning(self, message):
        print(f"\033[33m[ATTENTION]\033[0m {message}")
        
    def print_error(self, message):
        print(f"\033[31m[ERREUR]\033[0m {message}")
    
    def setup_config(self):
        """Configuration initiale interactive ou par variables d'environnement"""
        self.print_step("Configuration initiale...")
        
        # Récupérer les informations
        self.github_token = os.getenv('GITHUB_TOKEN') or input("Token GitHub (optionnel pour repos publics): ").strip()
        self.repo_url = os.getenv('REPO_URL') or input("URL du dépôt GitHub: ").strip()
        self.user_name = os.getenv('USER_NAME') or input("Votre nom GitHub: ").strip()
        self.user_email = os.getenv('USER_EMAIL') or input("Votre email GitHub: ").strip()
        
        # Extraire owner et repo name de l'URL
        if 'github.com/' in self.repo_url:
            parts = self.repo_url.split('github.com/')[-1].replace('.git', '').split('/')
            self.repo_owner = parts[0]
            self.repo_name = parts[1]
        else:
            raise ValueError("URL de dépôt GitHub invalide")
            
        self.print_success("Configuration terminée")
    
    def run_command(self, command, cwd=None):
        """Exécuter une commande shell"""
        try:
            result = subprocess.run(
                command, 
                shell=True, 
                capture_output=True, 
                text=True, 
                cwd=cwd or self.working_dir
            )
            if result.returncode != 0:
                self.print_error(f"Erreur commande: {result.stderr}")
                return False, result.stderr
            return True, result.stdout
        except Exception as e:
            self.print_error(f"Exception: {str(e)}")
            return False, str(e)
    
    def prepare_repo(self):
        """Cloner ou préparer le dépôt"""
        self.print_step("Préparation du dépôt...")
        
        # Créer un répertoire temporaire
        self.working_dir = tempfile.mkdtemp(prefix="github_pair_")
        repo_path = os.path.join(self.working_dir, self.repo_name)
        
        # Cloner le dépôt
        clone_cmd = f"git clone {self.repo_url} {repo_path}"
        success, output = self.run_command(clone_cmd, self.working_dir)
        
        if not success:
            self.print_error("Échec du clonage")
            return False
            
        self.working_dir = repo_path
        
        # Mettre à jour
        success, _ = self.run_command("git pull")
        self.print_success("Dépôt préparé")
        return True
    
    def create_branch(self):
        """Créer une nouvelle branche"""
        self.print_step(f"Création de la branche {self.branch_name}...")
        
        success, _ = self.run_command(f"git checkout -b {self.branch_name}")
        if success:
            self.print_success("Branche créée")
            return True
        return False
    
    def make_changes(self):
        """Effectuer des modifications dans le dépôt"""
        self.print_step("Modification des fichiers...")
        
        # Créer ou modifier un fichier
        readme_path = os.path.join(self.working_dir, "README.md")
        collab_file = os.path.join(self.working_dir, "COLLABORATION.md")
        
        if os.path.exists(readme_path):
            # Ajouter à README existant
            with open(readme_path, 'a', encoding='utf-8') as f:
                f.write(f"\n\n<!-- Collaboration update {datetime.now().isoformat()} -->\n")
                f.write("🤝 **Pair Programming**: Contributing to open source with collaboration\n")
            self.print_success("README.md modifié")
        else:
            # Créer un nouveau fichier de collaboration
            content = f"""# Collaboration Update

Date: {datetime.now().isoformat()}
Auteurs: {self.user_name} et {self.collaborator_name}

## Objectif
Démonstration de collaboration pour le badge Pair Extraordinaire

## Modifications
- Ajout de documentation collaborative
- Mise à jour des métadonnées du projet
- Démonstration des pratiques de pair programming

## Métadonnées
- Repository: {self.repo_owner}/{self.repo_name}
- Branch: {self.branch_name}
- Automation: Python Script

---
*Généré automatiquement par le script d'automatisation GitHub Pair Badge*
"""
            with open(collab_file, 'w', encoding='utf-8') as f:
                f.write(content)
            self.print_success("Fichier COLLABORATION.md créé")
        
        return True
    
    def create_collaborative_commit(self):
        """Créer un commit avec co-auteurs"""
        self.print_step("Création du commit collaboratif...")
        
        # Ajouter les fichiers
        success, _ = self.run_command("git add .")
        if not success:
            return False
        
        # Créer le commit avec co-auteurs
        commit_message = f"""feat: Add collaborative documentation for Pair Extraordinaire

This commit demonstrates pair programming practices and collaborative 
development workflows for the GitHub Pair Extraordinaire achievement.

Features:
- Collaborative documentation
- Pair programming demonstration
- Multi-author contribution

Co-authored-by: {self.collaborator_name} <{self.collaborator_email}>
Co-authored-by: {self.user_name} <{self.user_email}>"""

        success, _ = self.run_command(f'git commit -m "{commit_message}"')
        if success:
            self.print_success("Commit collaboratif créé")
            return True
        return False
    
    def push_changes(self):
        """Pousser les modifications"""
        self.print_step("Push des modifications...")
        
        success, _ = self.run_command(f"git push origin {self.branch_name}")
        if success:
            self.print_success("Modifications poussées")
            return True
        return False
    
    def create_pull_request_api(self):
        """Créer une pull request via l'API GitHub"""
        if not self.github_token:
            self.print_warning("Token GitHub manquant, création manuelle nécessaire")
            return self.create_pull_request_manual()
        
        self.print_step("Création de la Pull Request via API...")
        
        url = f"https://api.github.com/repos/{self.repo_owner}/{self.repo_name}/pulls"
        headers = {
            "Authorization": f"token {self.github_token}",
            "Accept": "application/vnd.github.v3+json"
        }
        
        data = {
            "title": "feat: Add collaborative documentation for Pair Extraordinaire badge",
            "head": self.branch_name,
            "base": "main",
            "body": f"""# Collaborative Development Demonstration

This PR showcases collaborative development practices for the GitHub Pair Extraordinaire achievement.

## Changes
- Added collaborative documentation
- Updated project metadata
- Demonstrated pair programming workflows

## Co-authors
- {self.collaborator_name}
- {self.user_name}

## Automation
This PR was created automatically using the GitHub Pair Badge automation script.

## Achievement Goal
This commit demonstrates multi-author collaboration for the **Pair Extraordinaire** badge.

---
*Generated automatically on {datetime.now().isoformat()}*
"""
        }
        
        try:
            response = requests.post(url, headers=headers, json=data)
            if response.status_code == 201:
                pr_data = response.json()
                pr_number = pr_data['number']
                pr_url = pr_data['html_url']
                self.print_success(f"Pull Request créée: #{pr_number}")
                print(f"URL: {pr_url}")
                
                # Optionnel: merger automatiquement
                if input("Merger automatiquement la PR? (y/n): ").lower() == 'y':
                    self.merge_pull_request_api(pr_number)
                
                return True
            else:
                self.print_error(f"Échec création PR: {response.status_code}")
                return False
        except Exception as e:
            self.print_error(f"Erreur API: {str(e)}")
            return False
    
    def merge_pull_request_api(self, pr_number):
        """Merger une pull request via l'API"""
        self.print_step(f"Merge de la PR #{pr_number}...")
        
        url = f"https://api.github.com/repos/{self.repo_owner}/{self.repo_name}/pulls/{pr_number}/merge"
        headers = {
            "Authorization": f"token {self.github_token}",
            "Accept": "application/vnd.github.v3+json"
        }
        
        data = {
            "commit_title": "feat: Add collaborative documentation",
            "commit_message": "Merge collaborative development demonstration",
            "merge_method": "squash"
        }
        
        try:
            response = requests.put(url, headers=headers, json=data)
            if response.status_code == 200:
                self.print_success("Pull Request mergée avec succès")
                
                # Supprimer la branche
                self.delete_branch_api()
                return True
            else:
                self.print_error(f"Échec merge: {response.status_code}")
                return False
        except Exception as e:
            self.print_error(f"Erreur merge: {str(e)}")
            return False
    
    def delete_branch_api(self):
        """Supprimer la branche via l'API"""
        url = f"https://api.github.com/repos/{self.repo_owner}/{self.repo_name}/git/refs/heads/{self.branch_name}"
        headers = {
            "Authorization": f"token {self.github_token}",
            "Accept": "application/vnd.github.v3+json"
        }
        
        try:
            response = requests.delete(url, headers=headers)
            if response.status_code == 204:
                self.print_success("Branche supprimée")
            else:
                self.print_warning("Impossible de supprimer la branche automatiquement")
        except Exception as e:
            self.print_warning(f"Erreur suppression branche: {str(e)}")
    
    def create_pull_request_manual(self):
        """Instructions pour création manuelle de PR"""
        self.print_step("Instructions pour création manuelle...")
        
        print("\n=== CRÉATION MANUELLE DE PULL REQUEST ===")
        print(f"1. Allez sur: https://github.com/{self.repo_owner}/{self.repo_name}")
        print("2. Cliquez sur 'Compare & pull request'")
        print("3. Titre: 'feat: Add collaborative documentation for Pair Extraordinaire badge'")
        print("4. Description: Mentionnez la collaboration et les co-auteurs")
        print("5. Créez la pull request")
        print("6. Mergez avec 'Squash and merge'")
        print("7. Supprimez la branche après merge")
        print()
        
        return True
    
    def cleanup(self):
        """Nettoyer les fichiers temporaires"""
        if hasattr(self, 'working_dir') and os.path.exists(self.working_dir):
            shutil.rmtree(os.path.dirname(self.working_dir))
            self.print_success("Nettoyage terminé")
    
    def final_check(self):
        """Vérification finale et instructions"""
        self.print_step("Vérification finale...")
        
        print("\n=== RÉSUMÉ ===")
        print(f"✅ Dépôt: {self.repo_owner}/{self.repo_name}")
        print(f"✅ Branche: {self.branch_name}")
        print("✅ Commit collaboratif créé")
        print("✅ Modifications poussées")
        print()
        
        self.print_success("Processus terminé!")
        self.print_warning("Le badge peut prendre quelques minutes à apparaître.")
        
        print("\n=== VÉRIFICATION ===")
        print("1. Vérifiez que votre commit montre 2 avatars d'utilisateurs")
        print("2. Allez sur votre profil GitHub pour voir le badge")
        print("3. Le badge 'Pair Extraordinaire' devrait apparaître dans vos achievements")
        print(f"4. Lien direct: https://github.com/{self.user_name}")
    
    def run(self):
        """Exécuter le processus complet"""
        print("\033[32m")
        print("╔══════════════════════════════════════════════════════════════╗")
        print("║             GITHUB PAIR EXTRAORDINAIRE AUTOMATION           ║")
        print("║                Script Python automatisé                     ║")
        print("╚══════════════════════════════════════════════════════════════╝")
        print("\033[0m\n")
        
        try:
            self.setup_config()
            
            if not self.prepare_repo():
                return False
                
            if not self.create_branch():
                return False
                
            if not self.make_changes():
                return False
                
            if not self.create_collaborative_commit():
                return False
                
            if not self.push_changes():
                return False
                
            self.create_pull_request_api()
            self.final_check()
            
            self.print_success("🎉 Automatisation terminée avec succès!")
            return True
            
        except KeyboardInterrupt:
            self.print_error("Script interrompu par l'utilisateur")
            return False
        except Exception as e:
            self.print_error(f"Erreur inattendue: {str(e)}")
            return False
        finally:
            self.cleanup()

def main():
    """Point d'entrée principal"""
    automator = GitHubPairBadgeAutomator()
    success = automator.run()
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main() 