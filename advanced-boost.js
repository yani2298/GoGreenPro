#!/usr/bin/env node

import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json";
const git = simpleGit();

// Advanced configuration for professional-looking contribution graph
const ADVANCED_CONFIG = {
  // Simulate different project phases
  phases: [
    { name: "Major Project", intensity: 'extreme', duration: 12, pattern: 'heavy-weekdays' },
    { name: "Feature Development", intensity: 'heavy', duration: 8, pattern: 'consistent' },
    { name: "Bug Fixes", intensity: 'medium', duration: 5, pattern: 'random' },
    { name: "Maintenance", intensity: 'light', duration: 4, pattern: 'weekend-work' },
    { name: "Learning Period", intensity: 'medium', duration: 6, pattern: 'evening' }
  ],
  
  // Realistic commit patterns
  commitPatterns: {
    'heavy-weekdays': { mon: 15, tue: 12, wed: 14, thu: 13, fri: 10, sat: 3, sun: 2 },
    'consistent': { mon: 8, tue: 9, wed: 8, thu: 7, fri: 6, sat: 4, sun: 3 },
    'random': { mon: 5, tue: 7, wed: 6, thu: 8, fri: 4, sat: 2, sun: 1 },
    'weekend-work': { mon: 2, tue: 3, wed: 2, thu: 3, fri: 2, sat: 8, sun: 6 },
    'evening': { mon: 4, tue: 5, wed: 4, thu: 6, fri: 3, sat: 7, sun: 5 }
  },
  
  // Varied commit messages for realism
  commitMessages: [
    "feat: implement new feature",
    "fix: resolve critical bug",
    "docs: update documentation",
    "refactor: improve code structure", 
    "test: add unit tests",
    "chore: update dependencies",
    "style: format code",
    "perf: optimize performance",
    "build: update build process",
    "ci: improve CI/CD pipeline"
  ],
  
  // Time distribution (simulate work hours)
  workHours: {
    morning: { start: 9, end: 12, weight: 0.3 },
    afternoon: { start: 14, end: 18, weight: 0.4 },
    evening: { start: 19, end: 23, weight: 0.3 }
  }
};

// Generate realistic commit time
const generateCommitTime = (baseDate, pattern) => {
  const dayOfWeek = moment(baseDate).format('ddd').toLowerCase();
  const maxCommits = ADVANCED_CONFIG.commitPatterns[pattern][dayOfWeek.substring(0,3)];
  
  if (maxCommits === 0) return null;
  
  // Choose time period based on weights
  const periods = Object.keys(ADVANCED_CONFIG.workHours);
  const weights = periods.map(p => ADVANCED_CONFIG.workHours[p].weight);
  const selectedPeriod = periods[weightedRandom(weights)];
  const period = ADVANCED_CONFIG.workHours[selectedPeriod];
  
  const hour = random.int(period.start, period.end);
  const minute = random.int(0, 59);
  
  return moment(baseDate).hour(hour).minute(minute).format();
};

// Weighted random selection
const weightedRandom = (weights) => {
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  let rand = Math.random() * total;
  
  for (let i = 0; i < weights.length; i++) {
    rand -= weights[i];
    if (rand <= 0) return i;
  }
  return weights.length - 1;
};

// Generate commits for a specific phase
const generatePhaseCommits = async (phase, startDate, endDate) => {
  console.log(`🚀 Starting ${phase.name} phase (${phase.duration} weeks)`);
  
  const current = moment(startDate);
  const end = moment(endDate);
  let totalCommits = 0;
  
  while (current.isBefore(end)) {
    const commitTime = generateCommitTime(current.format('YYYY-MM-DD'), phase.pattern);
    
    if (commitTime) {
      const dayPattern = ADVANCED_CONFIG.commitPatterns[phase.pattern];
      const dayOfWeek = current.format('ddd').toLowerCase().substring(0, 3);
      const maxCommitsForDay = dayPattern[dayOfWeek];
      
      // Generate multiple commits for busy days
      const numCommits = random.int(1, Math.min(maxCommitsForDay, 3));
      
      for (let i = 0; i < numCommits; i++) {
        const commitMsg = ADVANCED_CONFIG.commitMessages[random.int(0, ADVANCED_CONFIG.commitMessages.length - 1)];
        const finalTime = moment(commitTime).add(i * 15, 'minutes').format();
        
        await createAdvancedCommit(finalTime, commitMsg, phase.name);
        totalCommits++;
        
        // Progress indicator
        if (totalCommits % 20 === 0) {
          process.stdout.write(`\r📊 ${phase.name}: ${totalCommits} commits created...`);
        }
        
        // Small delay to avoid overwhelming Git
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    }
    
    current.add(1, 'day');
  }
  
  console.log(`\n✅ ${phase.name} completed: ${totalCommits} commits`);
  return totalCommits;
};

// Create commit with advanced metadata
const createAdvancedCommit = async (date, message, phase) => {
  const data = {
    date: date,
    message: message,
    phase: phase,
    timestamp: Date.now()
  };

  try {
    await jsonfile.writeFile(path, data);
    await git.add([path]);
    await git.commit(`${message} [${phase}]`, { "--date": date });
  } catch (error) {
    console.error(`❌ Error creating commit: ${error.message}`);
  }
};

// Create sophisticated contribution pattern
const createAdvancedPattern = async () => {
  console.log("🌱 GoGreen Advanced Boost - Professional Contribution Pattern");
  console.log("=" * 60);
  
  const startDate = moment().subtract(52, 'weeks');
  let currentDate = startDate.clone();
  let totalCommits = 0;
  
  // Execute phases in sequence
  for (const phase of ADVANCED_CONFIG.phases) {
    const phaseEnd = currentDate.clone().add(phase.duration, 'weeks');
    const commits = await generatePhaseCommits(phase, currentDate, phaseEnd);
    totalCommits += commits;
    currentDate = phaseEnd;
    
    // Small break between phases
    currentDate.add(random.int(1, 3), 'days');
  }
  
  // Fill remaining weeks with light activity
  const yearEnd = moment().subtract(1, 'week');
  if (currentDate.isBefore(yearEnd)) {
    console.log("🔄 Filling remaining weeks with maintenance commits...");
    const remainingCommits = await generatePhaseCommits(
      { name: "Final Touches", pattern: 'random', duration: yearEnd.diff(currentDate, 'weeks') },
      currentDate,
      yearEnd
    );
    totalCommits += remainingCommits;
  }
  
  console.log(`\n🎉 Advanced pattern completed!`);
  console.log(`📊 Total commits generated: ${totalCommits}`);
  console.log(`📅 Period covered: ${startDate.format('YYYY-MM-DD')} to ${moment().format('YYYY-MM-DD')}`);
  
  return totalCommits;
};

// Add some strategic "green squares" for visual appeal
const addStrategicHighlights = async () => {
  console.log("✨ Adding strategic highlights for visual appeal...");
  
  const highlights = [
    { date: moment().subtract(6, 'months'), commits: 25, reason: "Major Release" },
    { date: moment().subtract(3, 'months'), commits: 30, reason: "Hackathon" },
    { date: moment().subtract(1, 'month'), commits: 20, reason: "Bug Fix Sprint" }
  ];
  
  for (const highlight of highlights) {
    console.log(`🎯 Creating ${highlight.reason} highlight...`);
    
    for (let i = 0; i < highlight.commits; i++) {
      const commitTime = highlight.date.clone()
        .add(random.int(0, 6), 'days')
        .add(random.int(9, 23), 'hours')
        .add(random.int(0, 59), 'minutes')
        .format();
      
      await createAdvancedCommit(
        commitTime, 
        `${highlight.reason.toLowerCase()}: intensive development session`,
        highlight.reason
      );
    }
  }
};

// Main execution
const executeAdvancedBoost = async () => {
  try {
    console.log("🚀 Initializing Advanced GitHub Contribution Boost...\n");
    
    // Create the sophisticated pattern
    await createAdvancedPattern();
    
    // Add strategic highlights
    await addStrategicHighlights();
    
    console.log("\n💫 Creating final artistic touches...");
    
    // Add some weekend commits for dedication appearance
    for (let i = 0; i < 15; i++) {
      const weekendDate = moment()
        .subtract(random.int(1, 52), 'weeks')
        .day(random.int(0, 1) === 0 ? 0 : 6) // Sunday or Saturday
        .hour(random.int(10, 22))
        .minute(random.int(0, 59))
        .format();
      
      await createAdvancedCommit(weekendDate, "feat: weekend innovation session", "Dedication");
      
      if (i % 5 === 0) {
        process.stdout.write(`\r✨ Weekend commits: ${i + 1}/15`);
      }
    }
    
    console.log("\n\n🎉 ADVANCED BOOST COMPLETED!");
    console.log("=" * 50);
    console.log("🌟 Your GitHub contribution graph is now enhanced with:");
    console.log("   • Professional development patterns");
    console.log("   • Realistic work-life balance");
    console.log("   • Strategic high-activity periods");
    console.log("   • Varied commit types and messages");
    console.log("   • Weekend dedication indicators");
    console.log("\n🚀 Ready to push to GitHub!");
    
  } catch (error) {
    console.error("❌ Advanced boost failed:", error.message);
  }
};

// Export for use
export { executeAdvancedBoost, createAdvancedPattern, addStrategicHighlights };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  executeAdvancedBoost();
} 