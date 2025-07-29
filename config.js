// GoGreen Configuration File
// Customize your GitHub contribution graph generation

export const CONFIG = {
  // Basic settings
  totalCommits: 100,        // Number of random commits to generate
  usePattern: false,        // Set to true to use a specific pattern
  pattern: 'heart',         // Available: 'heart', 'wave', 'smile', 'random'
  intensity: 'medium',      // Commit intensity: 'light', 'medium', 'heavy'
  
  // Date settings
  startDate: null,          // null for auto (1 year ago), or specific date like '2023-01-01'
  endDate: null,            // null for auto (today), or specific date
  
  // Git settings
  dryRun: false,           // Set to true to preview without actually committing
  pushToRemote: true,       // Set to false to commit locally only
  
  // Advanced settings
  commitMessage: {
    template: 'Update data {date} ({current}/{total})',
    includeEmoji: true
  },
  
  // Custom patterns (you can add your own!)
  customPatterns: {
    // Example: small heart
    smallHeart: [
      [0,1,0,1,0],
      [1,1,1,1,1],
      [0,1,1,1,0],
      [0,0,1,0,0]
    ],
    
    // Example: initials (replace with your own)
    initials: [
      [1,1,1,0,1,1,1],
      [1,0,0,0,1,0,1],
      [1,1,0,0,1,1,1],
      [1,0,0,0,1,0,1],
      [1,0,0,0,1,0,1]
    ]
  },
  
  // Intensity levels customization
  intensityLevels: {
    light: { min: 1, max: 3 },
    medium: { min: 1, max: 8 },
    heavy: { min: 5, max: 15 },
    extreme: { min: 10, max: 25 }
  },
  
  // Output settings
  verbose: true,            // Show detailed output
  showProgress: true,       // Show progress indicators
  logToFile: false         // Save logs to file
};

// Quick presets for common use cases
export const PRESETS = {
  // Fill your graph with moderate activity
  fillGraph: {
    ...CONFIG,
    totalCommits: 200,
    intensity: 'medium',
    usePattern: false
  },
  
  // Create a heart pattern
  heartPattern: {
    ...CONFIG,
    usePattern: true,
    pattern: 'heart',
    intensity: 'heavy'
  },
  
  // Light random activity
  subtle: {
    ...CONFIG,
    totalCommits: 50,
    intensity: 'light',
    usePattern: false
  },
  
  // Heavy activity for impressive graph
  impressive: {
    ...CONFIG,
    totalCommits: 300,
    intensity: 'heavy',
    usePattern: false
  }
};

// Validate configuration
export const validateConfig = (config) => {
  const errors = [];
  
  if (config.totalCommits < 1) {
    errors.push('totalCommits must be at least 1');
  }
  
  if (!['light', 'medium', 'heavy', 'extreme'].includes(config.intensity)) {
    errors.push('intensity must be one of: light, medium, heavy, extreme');
  }
  
  if (config.startDate && !moment(config.startDate).isValid()) {
    errors.push('startDate must be a valid date');
  }
  
  return errors;
}; 