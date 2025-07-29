# 🌱 GoGreen - Enhanced GitHub Contribution Graph Generator

![Version](https://img.shields.io/badge/version-2.0.0-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)

**GoGreen** helps you create an impressive GitHub contribution graph with custom patterns, configurable intensity, and smart automation. Make your profile look like you've been consistently coding, even during your off days!

## ✨ Features

- 🎲 **Random Commits**: Generate realistic commit patterns
- 🎨 **Custom Patterns**: Create hearts, waves, smiles, and more
- ⚙️ **Configurable Intensity**: Light, medium, heavy, or extreme activity
- 🖥️ **Interactive CLI**: User-friendly command-line interface
- 🔍 **Dry Run Mode**: Preview changes before applying them
- 🚀 **Quick Presets**: Pre-configured setups for common use cases
- 📊 **Progress Tracking**: Real-time progress indicators
- 🛡️ **Safe Operation**: Built-in safeguards and confirmations

## 🚀 Quick Start

### Installation

```bash
git clone https://github.com/fenrir2608/goGreen.git
cd goGreen
npm install
```

### Usage Options

#### 1. Interactive CLI (Recommended)
```bash
npm run cli
# or
node cli.js
```

#### 2. Direct Execution
```bash
npm start
# or 
node index.js
```

#### 3. Quick Commands
```bash
# Generate a heart pattern
npm run heart

# Generate wave pattern  
npm run wave

# Generate random commits
npm run random

# Preview mode (no actual commits)
npm run dry-run
```

## 🎨 Available Patterns

### Built-in Patterns
- ❤️ **Heart**: Classic heart shape
- 🌊 **Wave**: Flowing wave pattern
- 😊 **Smile**: Smiley face pattern

### Custom Patterns
You can create your own patterns in `config.js`:
```javascript
customPatterns: {
  myPattern: [
    [1,0,1,0,1],
    [0,1,1,1,0],
    [1,1,0,1,1]
  ]
}
```

## ⚙️ Configuration

### Basic Configuration
Edit the `CONFIG` object in `index.js` or use the CLI:

```javascript
const CONFIG = {
  totalCommits: 100,        // Number of commits
  usePattern: false,        // Enable pattern mode
  pattern: 'heart',         // Pattern to use
  intensity: 'medium',      // Commit intensity
  dryRun: false            // Preview mode
};
```

### Intensity Levels
- **Light**: 1-3 commits per day
- **Medium**: 1-8 commits per day
- **Heavy**: 5-15 commits per day
- **Extreme**: 10-25 commits per day

### Quick Presets
Use pre-configured setups:
- **Fill Graph**: 200 medium commits
- **Heart Pattern**: Heavy heart shape
- **Subtle**: 50 light commits
- **Impressive**: 300 heavy commits

## 🛠️ Advanced Usage

### Command Line Arguments
```bash
# Set specific configuration
node index.js --commits=200 --pattern=heart --intensity=heavy

# Dry run mode
node index.js --dry-run
```

### Custom Date Range
```javascript
CONFIG.startDate = '2023-01-01';  // Custom start date
CONFIG.endDate = '2023-12-31';    // Custom end date
```

### Pattern Creation Guide
Patterns are 2D arrays where:
- `1` = commit activity
- `0` = no activity

Example 5x3 pattern:
```javascript
[
  [1,0,1,0,1],  // Week 1
  [0,1,1,1,0],  // Week 2  
  [1,1,0,1,1]   // Week 3
]
```

## 📋 CLI Menu Options

```
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
```

## ⚠️ Important Notes

### Before You Start
1. **Dedicated Repository**: Use a separate repository for GoGreen
2. **Backup**: Always backup your important repositories
3. **Test First**: Use dry run mode to preview changes
4. **Remote Setup**: Ensure your repository has a remote origin

### Git Setup
```bash
# Initialize repository (if new)
git init
git remote add origin https://github.com/yourusername/your-repo.git

# Verify remote
git remote -v
```

### Safety Features
- ✅ Confirmation prompts before execution
- ✅ Dry run mode for safe testing
- ✅ Error handling and recovery
- ✅ Progress tracking and logging

## 🎯 Use Cases

### Scenario 1: Fill Empty Graph
```bash
npm run cli
# Choose option 6 (Quick presets)
# Select "Fill Graph" preset
```

### Scenario 2: Create Heart Pattern
```bash
npm run heart
# Or use CLI option 2
```

### Scenario 3: Subtle Activity
```javascript
CONFIG.totalCommits = 30;
CONFIG.intensity = 'light';
```

### Scenario 4: Impressive Display
```javascript
CONFIG.totalCommits = 500;
CONFIG.intensity = 'heavy';
```

## 🔧 Troubleshooting

### Common Issues

**Error: "not a git repository"**
```bash
git init
git remote add origin YOUR_REPO_URL
```

**Error: "failed to push"**
```bash
git remote -v  # Verify remote URL
git push -u origin main  # Set upstream
```

**Commits not showing on GitHub**
- Ensure the email in Git config matches your GitHub email
- Check that the repository is public or you have access
- Verify the remote URL is correct

### Debug Mode
```bash
# Enable verbose logging
CONFIG.verbose = true;
CONFIG.logToFile = true;
```

## 📊 Performance

- **Speed**: ~10-50 commits per second
- **Memory**: Minimal memory usage
- **Reliability**: Built-in error handling and retry logic

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Ideas for Contributions
- New pattern designs
- Performance improvements
- Additional CLI features
- Better error handling
- Documentation improvements

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Credits

- Original concept by [Akshay Saini](https://github.com/akshaymarch7)
- Enhanced with advanced features and CLI interface
- Built with ❤️ by the open source community

## 📞 Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/fenrir2608/goGreen/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/fenrir2608/goGreen/discussions)
- 📧 **Email**: Open an issue for direct contact

## 🚨 Disclaimer

This tool is for educational and personal use. Be mindful of your company's policies regarding commit manipulation. Use responsibly and ethically.

---

**Made with 🌱 by the GoGreen community**

*Happy coding and may your contribution graph always be green!* 🎉
