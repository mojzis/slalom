### Phase 12: Content Expansion & Balancing

**Goal:** Expand word lists to 100+ words, test and balance difficulty progression, and fine-tune gameplay parameters.

**Files to modify:**
- `src/data/wordLists.ts` - Expand all word categories
- `src/game/managers/DifficultyManager.ts` - Tune difficulty parameters
- `src/game/managers/ObstacleManager.ts` - Balance spawn rates

**Modifications to src/data/wordLists.ts:**
- Expand directional words: add AROUND, PAST, THROUGH, BETWEEN, etc.
- Expand hazards: add PUDDLE, STUMP, BOULDER, RAVINE, CREVICE, etc.
- Expand actions: add SWERVE, BRAKE, COAST, GLIDE, HURRY, etc.
- Expand modifiers: add SUDDEN, GRADUAL, SHARP, GENTLE, STEEP, etc.
- Add compound phrases for advanced tier: "BIG TREE", "FAST LEFT", "DUCK LOW"
- Total word count target: 100-120 unique words

**Example expansion:**
```typescript
export const EXPANDED_WORD_LISTS = {
  directional: [
    // Basic (1 syllable)
    'LEFT', 'RIGHT', 'STAY', 'TURN',
    // Intermediate (2 syllables)
    'CENTER', 'MIDDLE', 'AROUND', 'BETWEEN',
    // Advanced (2-3 syllables)
    'DIAGONAL', 'FORWARD', 'BACKWARD', 'SIDEWAYS'
  ],
  hazards: [
    // Basic
    'TREE', 'ROCK', 'GAP', 'HOLE',
    // Intermediate
    'BRANCH', 'LOG', 'STUMP', 'ICE', 'MUD',
    // Advanced
    'BOULDER', 'RAVINE', 'CREVICE', 'AVALANCHE', 'PUDDLE'
  ],
  actions: [
    // Basic
    'GO', 'STOP', 'JUMP', 'DUCK',
    // Intermediate
    'DODGE', 'AVOID', 'SLOW', 'FAST',
    // Advanced
    'SWERVE', 'BRAKE', 'COAST', 'GLIDE', 'HURRY', 'WEAVE'
  ],
  modifiers: [
    // Basic
    'BIG', 'SMALL',
    // Intermediate
    'WIDE', 'NARROW', 'QUICK', 'CAREFUL',
    // Advanced
    'SUDDEN', 'GRADUAL', 'SHARP', 'GENTLE', 'STEEP', 'SLIPPERY'
  ]
};

export const COMPOUND_PHRASES = [
  'BIG TREE', 'SMALL GAP', 'FAST LEFT', 'SLOW RIGHT',
  'DUCK LOW', 'JUMP HIGH', 'TURN SHARP', 'GO STRAIGHT',
  'BIG ROCK', 'ICY ROAD', 'NARROW PATH', 'WIDE TURN'
];
```

**Modifications to src/game/managers/DifficultyManager.ts:**
- Fine-tune tier thresholds (test with playtesters)
- Adjust spawn intervals for better pacing
- Calibrate speed increases (not too fast)
- Balance reading time with scroll speed
- Add optional "adaptive difficulty" based on player performance

**Balancing parameters to test:**
```typescript
// Beginner tier (0-500m)
{
  spawnInterval: 300,  // More time between obstacles
  baseSpeed: 1.8,      // Slower initial speed
  readingTime: 6000,   // 6 seconds to read sign
  maxObstaclesVisible: 2
}

// Intermediate tier (500-1500m)
{
  spawnInterval: 220,
  baseSpeed: 2.5,
  readingTime: 4500,
  maxObstaclesVisible: 3
}

// Advanced tier (1500m+)
{
  spawnInterval: 160,
  baseSpeed: 3.2,
  readingTime: 3500,
  maxObstaclesVisible: 4
}
```

**Modifications to src/game/managers/ObstacleManager.ts:**
- Add logic to prevent impossible patterns (e.g., obstacles in all lanes)
- Implement minimum safe distance between obstacles
- Add variety in obstacle types (don't repeat same type)
- Ensure at least one lane is always clear

**Functions/classes to add:**
- Expanded word arrays in wordLists.ts
- Compound phrase support in WordManager
- Pattern validation in ObstacleManager
- Difficulty tuning constants

**Dependencies:**
- Phase 11 complete (menu and UI flow working)

**Test strategy:**
- Playtest with target age group (grades 1-3)
- Track which words cause most failures (analytics)
- Measure average survival distance across 20+ runs
- Test that difficulty curve feels gradual, not sudden
- Verify no impossible patterns spawn (all lanes blocked)
- Check word variety (no excessive repetition)
- Confirm 100+ unique words accessible across full game
- Balance so advanced players can reach 2000m+

**Potential risks:**
- Some words might be too difficult for target age
- Difficulty progression might be too steep/shallow
- Impossible patterns might still slip through
- Word pool might feel repetitive even with 100+ words
- Compound phrases might be too hard to read quickly
