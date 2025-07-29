#!/usr/bin/env node

import { createInterface } from 'readline';
import simpleGit from 'simple-git';
import { execSync } from 'child_process';
import fs from 'fs';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

const git = simpleGit();

// Helper function for user input
const askQuestion = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
};

// ASCII Art Logo
const logo = `
╔══════════════════════════════════════════╗
║  🌱 GoGreen Setup - Let's Get Started!   ║
║  Setting up your GitHub contribution     ║
║  graph enhancement tool                  ║
╚══════════════════════════════════════════╝
`;

// Check if current directory is a git repository
const checkGitRepo = async () => {
  try {
    await git.status();
    return true;
  } catch (error) {
    return false;
  }
};

// Check if remote origin exists
const checkRemoteOrigin = async () => {
  try {
    const remotes = await git.getRemotes(true);
    return remotes.some(remote => remote.name === 'origin');
  } catch (error) {
    return false;
  }
};

// Initialize git repository
const initGitRepo = async () => {
  try {
    await git.init();
    console.log("✅ Git repository initialized!");
    return true;
  } catch (error) {
    console.error("❌ Failed to initialize git repository:", error.message);
    return false;
  }
};

// Add remote origin
const addRemoteOrigin = async (url) => {
  try {
    await git.addRemote('origin', url);
    console.log("✅ Remote origin added successfully!");
    return true;
  } catch (error) {
    console.error("❌ Failed to add remote origin:", error.message);
    return false;
  }
};

// Create initial commit
const createInitialCommit = async () => {
  try {
    // Create a simple README if it doesn't exist
    if (!fs.existsSync('README.md')) {
      const readmeContent = `# GoGreen Repository

This repository is used with GoGreen to enhance my GitHub contribution graph.

Generated with 🌱 GoGreen - GitHub Contribution Graph Generator
`;
      fs.writeFileSync('README.md', readmeContent);
    }

    await git.add('.');
    await git.commit('Initial commit for GoGreen');
    console.log("✅ Initial commit created!");
    return true;
  } catch (error) {
    console.error("❌ Failed to create initial commit:", error.message);
    return false;
  }
};

// Setup git user configuration
const setupGitUser = async () => {
  console.log("\n🔧 Git User Configuration");
  console.log("Make sure your Git user configuration matches your GitHub account:");
  
  try {
    const currentName = await git.raw(['config', 'user.name']);
    const currentEmail = await git.raw(['config', 'user.email']);
    
    console.log(`Current name: ${currentName.trim()}`);
    console.log(`Current email: ${currentEmail.trim()}`);
    
    const changeName = await askQuestion("Do you want to change the name? (y/n): ");
    if (changeName.toLowerCase() === 'y') {
      const newName = await askQuestion("Enter your name: ");
      await git.raw(['config', 'user.name', newName]);
      console.log("✅ Name updated!");
    }
    
    const changeEmail = await askQuestion("Do you want to change the email? (y/n): ");
    if (changeEmail.toLowerCase() === 'y') {
      const newEmail = await askQuestion("Enter your email: ");
      await git.raw(['config', 'user.email', newEmail]);
      console.log("✅ Email updated!");
    }
    
    return true;
  } catch (error) {
    console.log("⚠️  Git user not configured. Let's set it up:");
    
    const name = await askQuestion("Enter your name: ");
    const email = await askQuestion("Enter your email: ");
    
    try {
      await git.raw(['config', 'user.name', name]);
      await git.raw(['config', 'user.email', email]);
      console.log("✅ Git user configured!");
      return true;
    } catch (configError) {
      console.error("❌ Failed to configure git user:", configError.message);
      return false;
    }
  }
};

// Main setup function
const runSetup = async () => {
  console.log(logo);
  console.log("Welcome to GoGreen Setup! This will help you configure everything properly.\n");
  
  // Step 1: Check if we're in a git repository
  console.log("🔍 Step 1: Checking Git repository...");
  const isGitRepo = await checkGitRepo();
  
  if (!isGitRepo) {
    console.log("📁 No git repository found in current directory.");
    const initRepo = await askQuestion("Initialize a new git repository? (y/n): ");
    
    if (initRepo.toLowerCase() === 'y') {
      const success = await initGitRepo();
      if (!success) {
        console.log("❌ Setup failed. Please initialize git repository manually.");
        rl.close();
        return;
      }
    } else {
      console.log("⚠️  Please run GoGreen in a git repository directory.");
      rl.close();
      return;
    }
  } else {
    console.log("✅ Git repository found!");
  }
  
  // Step 2: Check remote origin
  console.log("\n🔍 Step 2: Checking remote origin...");
  const hasRemote = await checkRemoteOrigin();
  
  if (!hasRemote) {
    console.log("🌐 No remote origin found.");
    const addRemote = await askQuestion("Add remote origin? (y/n): ");
    
    if (addRemote.toLowerCase() === 'y') {
      const repoUrl = await askQuestion("Enter your GitHub repository URL: ");
      const success = await addRemoteOrigin(repoUrl);
      if (!success) {
        console.log("⚠️  You can add remote origin later with: git remote add origin YOUR_REPO_URL");
      }
    }
  } else {
    console.log("✅ Remote origin configured!");
  }
  
  // Step 3: Setup git user
  console.log("\n🔍 Step 3: Checking Git user configuration...");
  await setupGitUser();
  
  // Step 4: Create initial commit if repository is empty
  console.log("\n🔍 Step 4: Checking repository status...");
  try {
    const status = await git.status();
    if (status.files.length === 0) {
      const commits = await git.log();
      if (commits.total === 0) {
        console.log("📝 Repository is empty. Creating initial commit...");
        await createInitialCommit();
      }
    }
  } catch (error) {
    console.log("⚠️  Could not check repository status.");
  }
  
  // Step 5: Final instructions
  console.log("\n🎉 Setup Complete!");
  console.log("=" * 50);
  console.log(`
✅ Your repository is ready for GoGreen!

Next steps:
1. Run the interactive CLI: npm run cli
2. Or use quick commands: npm run heart, npm run wave, etc.
3. Always test with dry run first: npm run dry-run

Important reminders:
- Use this tool in a dedicated repository
- Your commits will appear with the configured Git user
- Make sure your repository is pushed to GitHub to see the results

Happy green-ing! 🌱
`);
  
  const startNow = await askQuestion("Would you like to start GoGreen now? (y/n): ");
  if (startNow.toLowerCase() === 'y') {
    rl.close();
    console.log("\n🚀 Starting GoGreen CLI...\n");
    
    // Import and run the CLI
    const { runCLI } = await import('./cli.js');
    await runCLI();
  } else {
    console.log("\n👋 Run 'npm run cli' when you're ready to start!");
    rl.close();
  }
};

// Handle errors gracefully
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Setup failed:', reason);
  rl.close();
  process.exit(1);
});

// Run setup if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runSetup().catch(console.error);
}

export { runSetup }; 