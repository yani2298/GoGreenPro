#!/usr/bin/env python3
"""
GitHub Achievement Automation Suite (GoGreenPro)
Automates Pull Shark, Quickdraw, YOLO, and Pair Extraordinaire badges.
Inspiré par la philosophie d'automatisation Clawdbot.
"""

import os
import sys
import subprocess
import json
import requests
import time
import random
import argparse
from datetime import datetime
import tempfile
import shutil

class Color:
    BLUE = "\033[94m"
    GREEN = "\033[92m"
    YELLOW = "\033[93m"
    RED = "\033[91m"
    BOLD = "\033[1m"
    END = "\033[0m"

class BadgeAutomator:
    def __init__(self):
        self.config = {
            "github_token": os.getenv("GITHUB_TOKEN"),
            "repo_url": os.getenv("REPO_URL"),
            "user_name": os.getenv("USER_NAME"),
            "user_email": os.getenv("USER_EMAIL"),
            "collaborator_name": os.getenv("COLLABORATOR_NAME", "GitHub Assistant"),
            "collaborator_email": os.getenv("COLLABORATOR_EMAIL", "assistant@github.example")
        }
        self.repo_owner = ""
        self.repo_name = ""
        self.working_dir = ""
        self.headers = {}
        
    def log(self, tag, message, color=Color.BLUE):
        print(f"{color}[{tag}]{Color.END} {message}")

    def setup(self):
        """Pre-run setup and configuration loading"""
        self.log("SETUP", "Chargement de la configuration...")
        
        # Interactive fallback if missing
        if not self.config["repo_url"]:
            self.config["repo_url"] = input("URL du dépôt GitHub: ").strip()
        if not self.config["user_name"]:
            self.config["user_name"] = input("Votre nom d'utilisateur GitHub: ").strip()
        if not self.config["user_email"]:
            self.config["user_email"] = input("Votre email GitHub: ").strip()
        if not self.config["github_token"]:
            self.log("WARN", "GITHUB_TOKEN manquant. Certaines fonctions API seront limitées.", Color.YELLOW)
        
        # Parse Repo Info
        if 'github.com/' in self.config["repo_url"]:
            parts = self.config["repo_url"].split('github.com/')[-1].replace('.git', '').split('/')
            self.repo_owner = parts[0]
            self.repo_name = parts[1]
        else:
            raise ValueError("URL de dépôt invalide. Utilisez le format: https://github.com/user/repo.git")

        if self.config["github_token"]:
            self.headers = {
                "Authorization": f"token {self.config['github_token']}",
                "Accept": "application/vnd.github.v3+json"
            }

    def run_git(self, command, cwd=None, env=None):
        """Execute git command and return success/output"""
        try:
            current_env = os.environ.copy()
            if env:
                current_env.update(env)
            
            # Ensure local git identity
            self.run_silent_git(f'git config user.name "{self.config["user_name"]}"', cwd)
            self.run_silent_git(f'git config user.email "{self.config["user_email"]}"', cwd)

            result = subprocess.run(
                command, 
                shell=True, 
                capture_output=True, 
                text=True, 
                cwd=cwd or self.working_dir,
                env=current_env
            )
            return result.returncode == 0, result.stdout, result.stderr
        except Exception as e:
            return False, "", str(e)

    def run_silent_git(self, command, cwd=None):
        subprocess.run(command, shell=True, capture_output=True, cwd=cwd or self.working_dir)

    def prepare_temp_repo(self):
        """Create a temporary clone for operations"""
        self.log("GIT", "Préparation d'un clone temporaire...")
        self.working_dir = tempfile.mkdtemp(prefix="gogreen_")
        
        clone_url = self.config["repo_url"]
        if self.config["github_token"] and "https://" in clone_url:
            clone_url = clone_url.replace("https://", f"https://{self.config['github_token']}@")

        success, _, err = self.run_git(f"git clone {clone_url} .", self.working_dir)
        if not success:
            self.log("ERROR", f"Échec du clonage: {err}", Color.RED)
            return False
        return True

    def api_post(self, endpoint, data):
        url = f"https://api.github.com/repos/{self.repo_owner}/{self.repo_name}/{endpoint}"
        response = requests.post(url, headers=self.headers, json=data)
        return response

    def api_put(self, endpoint, data):
        url = f"https://api.github.com/repos/{self.repo_owner}/{self.repo_name}/{endpoint}"
        response = requests.put(url, headers=self.headers, json=data)
        return response

    def api_delete(self, endpoint):
        url = f"https://api.github.com/repos/{self.repo_owner}/{self.repo_name}/{endpoint}"
        response = requests.delete(url, headers=self.headers)
        return response

    # --- BADGE STRATEGIES ---

    def badge_pair_extraordinaire(self):
        """Automate Pair Extraordinaire Achievement"""
        self.log("BADGE", "Exécution de la stratégie 'Pair Extraordinaire'...")
        branch = f"achievement/pair-{int(time.time())}"
        self.run_git(f"git checkout -b {branch}")
        
        # Make changes
        with open(os.path.join(self.working_dir, "ACHIEVEMENTS.md"), "a") as f:
            f.write(f"\n- Pair Extraordinaire Attempt: {datetime.now().isoformat()}")
        
        # Multi-author commit
        msg = f"feat: Collaborative advancement for Pair Extraordinaire\n\nCo-authored-by: {self.config['collaborator_name']} <{self.config['collaborator_email']}>\nCo-authored-by: {self.config['user_name']} <{self.config['user_email']}>"
        self.run_git("git add .")
        self.run_git(f'git commit -m "{msg}"')
        
        self.log("GIT", f"Pushing branch {branch}...")
        self.run_git(f"git push origin {branch}")
        
        if self.config["github_token"]:
            self.log("API", "Création de la Pull Request...")
            res = self.api_post("pulls", {
                "title": "Achievement: Pair Extraordinaire",
                "head": branch,
                "base": "main",
                "body": "Demonstrating collaborative development."
            })
            if res.status_code == 201:
                pr_data = res.json()
                pr_num = pr_data["number"]
                self.log("SUCCESS", f"PR #{pr_num} créée.")
                self.log("API", "Fusion de la PR...")
                self.api_put(f"pulls/{pr_num}/merge", {"merge_method": "squash"})
                self.api_delete(f"git/refs/heads/{branch}")
                self.log("SUCCESS", "Badge 'Pair Extraordinaire' débloqué (en théorie)!")
        else:
            self.log("INFO", "Créez une PR manuellement pour finaliser.", Color.YELLOW)

    def badge_pull_shark(self, count=2):
        """Automate Pull Shark Achievement (Multiple PRs)"""
        self.log("BADGE", f"Exécution de la stratégie 'Pull Shark' ({count} PRs)...")
        if not self.config["github_token"]:
            self.log("ERROR", "Token requis pour Pull Shark.", Color.RED)
            return

        for i in range(count):
            self.log("STEP", f"PR {i+1}/{count}...")
            branch = f"achievement/shark-{i}-{int(time.time())}"
            self.run_git(f"git checkout main")
            self.run_git(f"git checkout -b {branch}")
            
            filename = f"shark_{i}.txt"
            with open(os.path.join(self.working_dir, filename), "w") as f:
                f.write(f"Shark byte {i} at {time.time()}")
            
            self.run_git(f"git add {filename}")
            self.run_git(f'git commit -m "chore: add shark data {i}"')
            self.run_git(f"git push origin {branch}")
            
            res = self.api_post("pulls", {
                "title": f"Shark Contribution {i}",
                "head": branch,
                "base": "main",
                "body": f"Automated PR for Pull Shark achievement #{i}"
            })
            if res.status_code == 201:
                pr_data = res.json()
                pr_num = pr_data["number"]
                self.api_put(f"pulls/{pr_num}/merge", {"merge_method": "merge"})
                self.api_delete(f"git/refs/heads/{branch}")
                self.log("OK", f"PR #{pr_num} mergée.")
            
            time.sleep(1) # Small delay to avoid API rate limits

    def badge_quickdraw(self):
        """Automate Quickdraw Achievement (Close PR < 5m)"""
        self.log("BADGE", "Exécution de la stratégie 'Quickdraw'...")
        if not self.config["github_token"]:
            self.log("ERROR", "Token requis pour Quickdraw.", Color.RED)
            return

        # 1. Create Issue
        res_issue = self.api_post("issues", {"title": "Quickdraw Challenge", "body": "Need a fix fast!"})
        if res_issue.status_code != 201: return
        issue_data = res_issue.json()
        issue_num = issue_data["number"]
        self.log("API", f"Issue #{issue_num} ouverte.")

        # 2. Create PR
        branch = f"achievement/quick-{int(time.time())}"
        self.run_git(f"git checkout main")
        self.run_git(f"git checkout -b {branch}")
        with open(os.path.join(self.working_dir, "quick.txt"), "w") as f: f.write("fixed")
        self.run_git("git add quick.txt")
        self.run_git('git commit -m "fix: resolve quick issue"')
        self.run_git(f"git push origin {branch}")

        res_pr = self.api_post("pulls", {
            "title": f"Fix Quickdraw #{issue_num}",
            "head": branch, "base": "main",
            "body": f"Closes #{issue_num}"
        })
        if res_pr.status_code == 201:
            pr_data = res_pr.json()
            pr_num = pr_data["number"]
            self.log("API", f"PR #{pr_num} ouverte.")
            self.api_put(f"pulls/{pr_num}/merge", {"merge_method": "squash"})
            self.api_delete(f"git/refs/heads/{branch}")
            self.log("SUCCESS", f"PR #{pr_num} mergée instantanément. Badge Quickdraw visé!")

    def badge_yolo(self):
        """Automate YOLO Achievement (Merge without review)"""
        self.log("BADGE", "Exécution de la stratégie 'YOLO'...")
        # Actually any automated merge via API without prior review triggers YOLO
        self.badge_pair_extraordinaire() 

    def cleanup(self):
        if self.working_dir and os.path.exists(self.working_dir):
            shutil.rmtree(self.working_dir)
            self.log("CLEANUP", "Dossier temporaire supprimé.")

    def run(self, badge_type="pair", count=16):
        try:
            self.setup()
            if not self.prepare_temp_repo(): return
            
            if badge_type == "pair":
                self.badge_pair_extraordinaire()
            elif badge_type == "shark":
                self.badge_pull_shark(count)
            elif badge_type == "quick":
                self.badge_quickdraw()
            elif badge_type == "yolo":
                self.badge_yolo()
            elif badge_type == "all":
                self.badge_pair_extraordinaire()
                self.badge_quickdraw()
                self.badge_pull_shark(count)
            
            self.log("FINISH", "Processus terminé !", Color.GREEN)
        except KeyboardInterrupt:
            self.log("HALT", "Interrompu par l'utilisateur.", Color.YELLOW)
        except Exception as e:
            self.log("ERROR", str(e), Color.RED)
        finally:
            self.cleanup()

def main():
    parser = argparse.ArgumentParser(description="GoGreenPro Achievement Automation")
    parser.add_argument("--badge", choices=["pair", "shark", "quick", "yolo", "all"], default="pair", help="Type de badge à automatiser")
    parser.add_argument("--count", type=int, default=16, help="Nombre de PR pour Pull Shark (default: 16)")
    args = parser.parse_args()

    # Load environment variables from .env if it exists
    if os.path.exists(".env"):
        with open(".env") as f:
            for line in f:
                if "=" in line and not line.startswith("#"):
                    key, value = line.strip().split("=", 1)
                    os.environ[key] = value

    automator = BadgeAutomator()
    automator.run(badge_type=args.badge, count=args.count)

if __name__ == "__main__":
    main()