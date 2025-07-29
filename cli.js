#!/usr/bin/env node

import { createInterface } from 'readline';
import { main, generateRandomCommits, generatePatternCommits, CONFIG } from './index.js';
import { PRESETS } from './config.js';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

// ASCII Art Logo
const logo = `
┌─────────────────────────────────────────┐
│  🌱 GoGreen - GitHub Profile Enhancer  │
│  Make your contribution graph shine!    │
└─────────────────────────────────────────┘
`;

// Helper function for user input
const askQuestion = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
};

// Display available options
const showOptions = () => {
  console.log(`
📋 Available Options:
1. 🎲 Random commits (default)
2. ❤️  Heart pattern
3. 🌊 Wave pattern  
4. 😊 Smile pattern
5. 🔧 Custom configuration
6. 🚀 Quick presets
7. ℹ️  Show help
8. 🔍 Preview mode (dry run)
9. ❌ Exit

`);
};

// Show presets
const showPresets = () => {
  console.log(`
🚀 Quick Presets:
1. Fill Graph - 200 medium commits
2. Heart Pattern - Heavy heart shape
3. Subtle - 50 light commits
4. Impressive - 300 heavy commits

`);
};

// Main CLI function
const runCLI = async () => {
  console.log(logo);
  console.log("Welcome to GoGreen! Let's enhance your GitHub contribution graph.\n");
  
  while (true) {
    showOptions();
    const choice = await askQuestion("Enter your choice (1-9): ");
    
    switch (choice) {
      case '1':
        console.log("🎲 Generating random commits...");
        const commits = await askQuestion("How many commits? (default: 100): ");
        CONFIG.totalCommits = parseInt(commits) || 100;
        CONFIG.usePattern = false;
        await executeGoGreen();
        break;
        
      case '2':
        console.log("❤️ Creating heart pattern...");
        CONFIG.usePattern = true;
        CONFIG.pattern = 'heart';
        await executeGoGreen();
        break;
        
      case '3':
        console.log("🌊 Creating wave pattern...");
        CONFIG.usePattern = true;
        CONFIG.pattern = 'wave';
        await executeGoGreen();
        break;
        
      case '4':
        console.log("😊 Creating smile pattern...");
        CONFIG.usePattern = true;
        CONFIG.pattern = 'smile';
        await executeGoGreen();
        break;
        
      case '5':
        await customConfiguration();
        break;
        
      case '6':
        await handlePresets();
        break;
        
      case '7':
        showHelp();
        break;
        
      case '8':
        console.log("🔍 Preview mode enabled - no actual commits will be made");
        CONFIG.dryRun = true;
        await executeGoGreen();
        CONFIG.dryRun = false;
        break;
        
      case '9':
        console.log("👋 Thanks for using GoGreen! Happy coding!");
        rl.close();
        return;
        
      default:
        console.log("❌ Invalid choice. Please try again.");
    }
    
    const continueChoice = await askQuestion("\n🤔 Do you want to continue? (y/n): ");
    if (continueChoice.toLowerCase() !== 'y' && continueChoice.toLowerCase() !== 'yes') {
      console.log("👋 Thanks for using GoGreen! Happy coding!");
      rl.close();
      return;
    }
    
    console.log("\n" + "=".repeat(50) + "\n");
  }
};

// Handle presets
const handlePresets = async () => {
  showPresets();
  const presetChoice = await askQuestion("Choose a preset (1-4): ");
  
  switch (presetChoice) {
    case '1':
      Object.assign(CONFIG, PRESETS.fillGraph);
      console.log("🎯 Fill Graph preset loaded!");
      break;
    case '2':
      Object.assign(CONFIG, PRESETS.heartPattern);
      console.log("❤️ Heart Pattern preset loaded!");
      break;
    case '3':
      Object.assign(CONFIG, PRESETS.subtle);
      console.log("🌙 Subtle preset loaded!");
      break;
    case '4':
      Object.assign(CONFIG, PRESETS.impressive);
      console.log("💪 Impressive preset loaded!");
      break;
    default:
      console.log("❌ Invalid preset choice.");
      return;
  }
  
  await executeGoGreen();
};

// Custom configuration
const customConfiguration = async () => {
  console.log("\n🔧 Custom Configuration");
  console.log("=" * 30);
  
  const commits = await askQuestion("Number of commits (default: 100): ");
  if (commits) CONFIG.totalCommits = parseInt(commits);
  
  const intensity = await askQuestion("Intensity (light/medium/heavy, default: medium): ");
  if (intensity && ['light', 'medium', 'heavy'].includes(intensity.toLowerCase())) {
    CONFIG.intensity = intensity.toLowerCase();
  }
  
  const usePattern = await askQuestion("Use pattern? (y/n, default: n): ");
  if (usePattern.toLowerCase() === 'y' || usePattern.toLowerCase() === 'yes') {
    CONFIG.usePattern = true;
    const pattern = await askQuestion("Pattern (heart/wave/smile, default: heart): ");
    if (pattern && ['heart', 'wave', 'smile'].includes(pattern.toLowerCase())) {
      CONFIG.pattern = pattern.toLowerCase();
    }
  }
  
  const dryRun = await askQuestion("Dry run (preview only)? (y/n, default: n): ");
  if (dryRun.toLowerCase() === 'y' || dryRun.toLowerCase() === 'yes') {
    CONFIG.dryRun = true;
  }
  
  console.log("\n✅ Configuration updated!");
  await executeGoGreen();
};

// Execute GoGreen with current configuration
const executeGoGreen = async () => {
  console.log("\n🚀 Starting GoGreen...");
  console.log("Current configuration:", {
    totalCommits: CONFIG.totalCommits,
    usePattern: CONFIG.usePattern,
    pattern: CONFIG.pattern,
    intensity: CONFIG.intensity,
    dryRun: CONFIG.dryRun
  });
  
  const confirm = await askQuestion("\n⚠️  This will modify your Git history. Continue? (y/n): ");
  if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
    console.log("Operation cancelled.");
    return;
  }
  
  try {
    await main();
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
};

// Show help
const showHelp = () => {
  console.log(`
📖 GoGreen Help

GoGreen helps you create commits in your GitHub contribution graph to make it
look more active. You can:

🎲 Generate random commits across the past year
🎨 Create patterns like hearts, waves, or smiles
⚙️  Customize intensity and number of commits
🔍 Preview changes before applying them

⚠️  Important Notes:
- This tool modifies your Git history
- Make sure you're in a dedicated repository
- Always test with dry run first
- Your repository must have a remote origin set up

🔗 For more info, visit: https://github.com/fenrir2608/goGreen
`);
};

// Run CLI if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runCLI().catch(console.error);
}

export { runCLI }; 