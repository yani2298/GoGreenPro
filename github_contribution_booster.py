#!/usr/bin/env python3
"""
GitHub Contribution Booster
Automates commits over a period of time to fill the contribution graph.
Uses GIT_AUTHOR_DATE and GIT_COMMITTER_DATE for backdating.
"""

import os
import sys
import subprocess
import random
from datetime import datetime, timedelta
import tempfile
import shutil

class GitHubContributionBooster:
    def __init__(self):
        self.repo_url = os.getenv('REPO_URL', "")
        self.user_name = os.getenv('USER_NAME', "")
        self.user_email = os.getenv('USER_EMAIL', "")
        self.github_token = os.getenv('GITHUB_TOKEN', "")
        self.working_dir = ""
        self.repo_name = ""

    def print_step(self, message):
        print(f"\033[34m[BOOST]\033[0m {message}")

    def print_success(self, message):
        print(f"\033[32m[SUCCÈS]\033[0m {message}")

    def print_error(self, message):
        print(f"\033[31m[ERREUR]\033[0m {message}")

    def run_command(self, command, cwd=None, env=None):
        try:
            current_env = os.environ.copy()
            if env:
                current_env.update(env)
            
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

    def setup(self):
        if not self.repo_url:
            self.repo_url = input("URL du dépôt GitHub: ").strip()
        if not self.user_name:
            self.user_name = input("Votre nom GitHub: ").strip()
        if not self.user_email:
            self.user_email = input("Votre email GitHub: ").strip()

        if 'github.com/' in self.repo_url:
            self.repo_name = self.repo_url.split('/')[-1].replace('.git', '')
        else:
            raise ValueError("URL de dépôt invalide")

    def prepare_repo(self):
        self.print_step(f"Préparation du dépôt {self.repo_name}...")
        self.working_dir = tempfile.mkdtemp(prefix="github_boost_")
        
        # Clone with token if available
        clone_url = self.repo_url
        if self.github_token and "https://" in clone_url:
            clone_url = clone_url.replace("https://", f"https://{self.github_token}@")
            
        success, _, err = self.run_command(f"git clone {clone_url} {self.repo_name}", self.working_dir)
        if not success:
            self.print_error(f"Échec du clonage: {err}")
            return False
            
        self.working_dir = os.path.join(self.working_dir, self.repo_name)
        return True

    def boost(self, start_date_str, end_date_str, frequency=3):
        start_date = datetime.strptime(start_date_str, "%Y-%m-%d")
        end_date = datetime.strptime(end_date_str, "%Y-%m-%d")
        
        current_date = start_date
        total_commits = 0
        
        self.print_step(f"Démarrage du boost de {start_date_str} à {end_date_str}...")
        
        # Configure local user
        self.run_command(f'git config user.name "{self.user_name}"')
        self.run_command(f'git config user.email "{self.user_email}"')

        while current_date <= end_date:
            # Number of commits for this day
            num_commits = random.randint(1, frequency)
            
            for i in range(num_commits):
                # Add variation to time
                commit_time = current_date + timedelta(hours=random.randint(9, 18), minutes=random.randint(0, 59))
                date_iso = commit_time.isoformat()
                
                # Update a data file
                data_file = os.path.join(self.working_dir, "contribution_data.txt")
                with open(data_file, "a") as f:
                    f.write(f"Contribution at {date_iso}\n")
                
                # Commit with backdating
                env = {
                    "GIT_AUTHOR_DATE": date_iso,
                    "GIT_COMMITTER_DATE": date_iso
                }
                
                self.run_command("git add contribution_data.txt")
                msg = f"chore: Contribution update {date_iso}"
                success, _, _ = self.run_command(f'git commit -m "{msg}"', env=env)
                if success:
                    total_commits += 1
            
            current_date += timedelta(days=1)
        
        self.print_success(f"{total_commits} commits créés avec succès!")
        
        self.print_step("Push des modifications vers GitHub...")
        success, _, err = self.run_command("git push origin main") # Assuming main branch
        if not success:
            self.print_warning(f"Échec du push (tentative avec --force): {err}")
            success, _, err = self.run_command("git push origin main --force")
            
        if success:
            self.print_success("Graphique de contribution mis à jour!")
        else:
            self.print_error(f"Erreur lors du push final: {err}")

    def cleanup(self):
        if self.working_dir and os.path.exists(self.working_dir):
            shutil.rmtree(os.path.dirname(self.working_dir))

    def run(self, start=None, end=None, freq=None):
        try:
            self.setup()
            if not self.prepare_repo():
                return
            
            if not start:
                print("\n--- Configuration du Boost ---")
                start = input("Date de début (AAAA-MM-JJ) [ex: 2025-08-01]: ") or "2025-08-01"
                end = input("Date de fin (AAAA-MM-JJ) [ex: 2026-02-09]: ") or datetime.now().strftime("%Y-%m-%d")
                freq = int(input("Nombre max de commits par jour [3]: ") or "3")
            
            self.boost(start, end, freq)
            
        except Exception as e:
            self.print_error(f"Une erreur est survenue: {str(e)}")
        finally:
            self.cleanup()

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="GitHub Contribution Booster")
    parser.add_argument("--start", help="Start date (YYYY-MM-DD)")
    parser.add_argument("--end", help="End date (YYYY-MM-DD)")
    parser.add_argument("--freq", type=int, help="Max commits per day")
    args = parser.parse_args()

    booster = GitHubContributionBooster()
    booster.run(start=args.start, end=args.end, freq=args.freq)
