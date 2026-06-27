const keywords = {
  critical: ['burst', 'flood', 'collapse', 'electric', 'wire', 'shock', 'sewage', 'overflow', 'dangerous', 'accident', 'fire', 'emergency'],
  high: ['pothole', 'deep', 'large', 'broken', 'damage', 'leak', 'crack', 'blocked', 'unsafe'],
  medium: ['streetlight', 'garbage', 'waste', 'road', 'divider', 'pipe', 'missing', 'dark'],
  low: ['minor', 'small', 'faded', 'paint', 'bench', 'park', 'tile', 'flicker'],
};

const categoryKeywords = {
  pothole: ['pothole', 'hole', 'road', 'bump', 'crater'],
  streetlight: ['light', 'streetlight', 'lamp', 'dark', 'bulb'],
  water: ['water', 'pipe', 'leak', 'flood', 'sewage', 'drain'],
  waste: ['garbage', 'waste', 'trash', 'dump', 'smell', 'litter'],
  road: ['road', 'crack', 'divider', 'bridge', 'footpath', 'pavement'],
  park: ['park', 'bench', 'garden', 'tree', 'play', 'ground'],
};

// Auto-assign departments based on category
const departmentMap = {
  pothole: { name: 'Roads & Infrastructure Dept', contact: 'roads@chennaicorp.gov.in', sla: '48 hours' },
  streetlight: { name: 'Electricity Board', contact: 'lights@tneb.gov.in', sla: '24 hours' },
  water: { name: 'Water Supply Dept', contact: 'water@chennaimetrowater.gov.in', sla: '12 hours' },
  waste: { name: 'Sanitation Dept', contact: 'sanitation@chennaicorp.gov.in', sla: '24 hours' },
  road: { name: 'Roads & Infrastructure Dept', contact: 'roads@chennaicorp.gov.in', sla: '72 hours' },
  park: { name: 'Parks & Recreation Dept', contact: 'parks@chennaicorp.gov.in', sla: '72 hours' },
};

function tokenize(text) {
  return text.toLowerCase().split(/\s+/);
}

function countMatches(tokens, wordList) {
  return tokens.filter(t => wordList.includes(t)).length;
}

export function predictSeverity(text) {
  const tokens = tokenize(text);
  const scores = {
    critical: countMatches(tokens, keywords.critical) * 4,
    high: countMatches(tokens, keywords.high) * 3,
    medium: countMatches(tokens, keywords.medium) * 2,
    low: countMatches(tokens, keywords.low) * 1,
  };

  let severity = 'medium';
  let maxScore = 0;
  for (const [level, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      severity = level;
    }
  }

  const severityMap = { critical: 9, high: 7, medium: 5, low: 3 };
  const severityScore = severityMap[severity] + Math.min(maxScore, 1);

  return { severity, severityScore };
}

export function predictCategory(text) {
  const tokens = tokenize(text);
  let bestCategory = 'road';
  let maxScore = 0;

  for (const [cat, words] of Object.entries(categoryKeywords)) {
    const score = countMatches(tokens, words);
    if (score > maxScore) {
      maxScore = score;
      bestCategory = cat;
    }
  }

  return bestCategory;
}

export function assignDepartment(category) {
  return departmentMap[category] || departmentMap['road'];
}

export async function trainModel() {
  return true;
}