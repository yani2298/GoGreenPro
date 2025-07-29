import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json";
const git = simpleGit();

// Configuration options
const CONFIG = {
  totalCommits: 100,
  usePattern: false,
  pattern: 'random', // 'random', 'word', 'heart', 'wave'
  intensity: 'medium', // 'light', 'medium', 'heavy'
  startDate: null, // null for auto (1 year ago)
  dryRun: false // Set to true to see what would happen without actually committing
};

// Patterns for contribution graph (52 weeks x 7 days)
const PATTERNS = {
  heart: [
    [0,0,1,0,1,0,0],
    [0,1,1,1,1,1,0],
    [1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1],
    [0,1,1,1,1,1,0],
    [0,0,1,1,1,0,0],
    [0,0,0,1,0,0,0]
  ],
  wave: [
    [0,0,0,1,0,0,0],
    [0,0,1,1,1,0,0],
    [0,1,1,0,1,1,0],
    [1,1,0,0,0,1,1],
    [1,0,0,0,0,0,1]
  ],
  smile: [
    [0,1,1,1,1,1,0],
    [1,0,0,0,0,0,1],
    [1,0,1,0,1,0,1],
    [1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1],
    [0,1,1,1,1,1,0]
  ]
};

// Get commit intensity based on configuration
const getCommitCount = () => {
  const intensities = {
    light: { min: 1, max: 3 },
    medium: { min: 1, max: 8 },
    heavy: { min: 5, max: 15 }
  };
  
  const range = intensities[CONFIG.intensity];
  return random.int(range.min, range.max);
};

// Create commit for specific date and position
const createCommit = async (date, commitCount = 1) => {
  if (CONFIG.dryRun) {
    console.log(`[DRY RUN] Would create ${commitCount} commit(s) for ${date}`);
    return;
  }

  for (let i = 0; i < commitCount; i++) {
    const data = {
      date: date,
      commit: i + 1,
      total: commitCount
    };

    try {
      await jsonfile.writeFile(path, data);
      await git.add([path]);
      await git.commit(`Update data ${date} (${i + 1}/${commitCount})`, { "--date": date });
      console.log(`✅ Commit ${i + 1}/${commitCount} created for ${date}`);
    } catch (error) {
      console.error(`❌ Error creating commit for ${date}:`, error.message);
    }
  }
};

// Generate commits based on pattern
const generatePatternCommits = async (pattern) => {
  console.log(`🎨 Generating commits with pattern: ${pattern}`);
  
  const patternData = PATTERNS[pattern];
  if (!patternData) {
    console.error(`❌ Pattern '${pattern}' not found. Available patterns:`, Object.keys(PATTERNS));
    return;
  }

  const startDate = CONFIG.startDate ? moment(CONFIG.startDate) : moment().subtract(1, "year").add(1, "day");
  
  // Center the pattern in the contribution graph
  const startWeek = Math.floor((52 - patternData[0].length) / 2);
  const startDay = Math.floor((7 - patternData.length) / 2);

  for (let week = 0; week < patternData[0].length; week++) {
    for (let day = 0; day < patternData.length; day++) {
      if (patternData[day][week] === 1) {
        const commitDate = startDate
          .clone()
          .add(startWeek + week, "weeks")
          .add(startDay + day, "days")
          .format();
        
        const commitCount = getCommitCount();
        await createCommit(commitDate, commitCount);
        
        // Small delay to avoid overwhelming Git
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  }
};

// Generate random commits
const generateRandomCommits = async (totalCommits) => {
  console.log(`🎲 Generating ${totalCommits} random commits`);
  
  const startDate = CONFIG.startDate ? moment(CONFIG.startDate) : moment().subtract(1, "year").add(1, "day");
  
  for (let i = 0; i < totalCommits; i++) {
    const weeksBack = random.int(0, 51);
    const dayOfWeek = random.int(0, 6);
    
    const commitDate = startDate
      .clone()
      .add(weeksBack, "weeks")
      .add(dayOfWeek, "days")
      .format();
    
    const commitCount = getCommitCount();
    await createCommit(commitDate, commitCount);
    
    // Progress indicator
    if ((i + 1) % 10 === 0) {
      console.log(`📊 Progress: ${i + 1}/${totalCommits} commits created`);
    }
    
    // Small delay to avoid overwhelming Git
    await new Promise(resolve => setTimeout(resolve, 50));
  }
};

// Main execution function
const main = async () => {
  console.log("🌱 GoGreen - GitHub Contribution Graph Generator");
  console.log("================================================");
  console.log(`Configuration:
  - Total commits: ${CONFIG.totalCommits}
  - Use pattern: ${CONFIG.usePattern}
  - Pattern: ${CONFIG.pattern}
  - Intensity: ${CONFIG.intensity}
  - Dry run: ${CONFIG.dryRun}
  `);

  try {
    if (CONFIG.usePattern && PATTERNS[CONFIG.pattern]) {
      await generatePatternCommits(CONFIG.pattern);
    } else {
      await generateRandomCommits(CONFIG.totalCommits);
    }
    
    if (!CONFIG.dryRun) {
      console.log("🚀 Pushing commits to remote repository...");
      await git.push();
      console.log("✅ All commits pushed successfully!");
    }
    
    console.log("🎉 GoGreen completed successfully!");
  } catch (error) {
    console.error("❌ Error during execution:", error.message);
  }
};

// Export functions for potential module use
export { main, generateRandomCommits, generatePatternCommits, CONFIG };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
