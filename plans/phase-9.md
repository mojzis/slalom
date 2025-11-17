### Phase 9: Difficulty Scaling & Word Tiers

**Goal:** Implement difficulty tiers that introduce more complex words, additional lanes, and faster spawning as the player progresses.

**Files to create:**
- `src/game/managers/DifficultyManager.ts` - Difficulty scaling logic

**Files to modify:**
- `src/data/wordLists.ts` - Add intermediate and advanced word sets
- `src/game/managers/WordManager.ts` - Integrate difficulty tiers
- `src/game/scenes/MainScene.ts` - Apply difficulty changes

**src/game/managers/DifficultyManager.ts structure:**
```typescript
export enum DifficultyTier {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced'
}

export interface DifficultyConfig {
  tier: DifficultyTier;
  numLanes: number;
  spawnInterval: number;
  readingTime: number;
  wordPool: string[];
  maxSpeed: number;
}

export default class DifficultyManager {
  currentTier: DifficultyTier;

  constructor() {
    this.currentTier = DifficultyTier.BEGINNER;
  }

  getTierForDistance(distance: number): DifficultyTier {
    if (distance < 500) {
      return DifficultyTier.BEGINNER;
    } else if (distance < 1500) {
      return DifficultyTier.INTERMEDIATE;
    } else {
      return DifficultyTier.ADVANCED;
    }
  }

  getConfig(distance: number): DifficultyConfig {
    const tier = this.getTierForDistance(distance);

    switch(tier) {
      case DifficultyTier.BEGINNER:
        return {
          tier,
          numLanes: 3,
          spawnInterval: 250,
          readingTime: 5000,
          wordPool: ['LEFT', 'RIGHT', 'TREE', 'ROCK', 'GAP', 'STAY'],
          maxSpeed: 3.0
        };

      case DifficultyTier.INTERMEDIATE:
        return {
          tier,
          numLanes: 3,
          spawnInterval: 200,
          readingTime: 4000,
          wordPool: ['LEFT', 'RIGHT', 'CENTER', 'TREE', 'ROCK', 'GAP', 'BRANCH',
                     'ICE', 'DUCK', 'JUMP', 'SLOW', 'FAST', 'AVOID', 'DODGE'],
          maxSpeed: 4.5
        };

      case DifficultyTier.ADVANCED:
        return {
          tier,
          numLanes: 5,
          spawnInterval: 150,
          readingTime: 3000,
          wordPool: ['LEFT', 'RIGHT', 'CENTER', 'TREE', 'ROCK', 'GAP', 'BRANCH',
                     'ICE', 'CLIFF', 'LOG', 'MUD', 'DUCK', 'JUMP', 'SLOW', 'FAST',
                     'AVOID', 'DODGE', 'WATCH', 'CAREFUL', 'QUICK', 'BIG', 'SMALL'],
          maxSpeed: 6.0
        };
    }
  }

  update(distance: number): boolean {
    const newTier = this.getTierForDistance(distance);
    const tierChanged = newTier !== this.currentTier;

    if (tierChanged) {
      this.currentTier = newTier;
    }

    return tierChanged;
  }
}
```

**Modifications to src/data/wordLists.ts:**
- Add intermediate word arrays
- Add advanced word arrays
- Organize by difficulty tier:
```typescript
export const WORD_LISTS_BY_TIER = {
  beginner: {
    directional: ['LEFT', 'RIGHT', 'STAY'],
    hazards: ['TREE', 'ROCK', 'GAP'],
    actions: ['GO', 'STOP']
  },
  intermediate: {
    directional: ['LEFT', 'RIGHT', 'CENTER', 'TURN'],
    hazards: ['TREE', 'ROCK', 'GAP', 'BRANCH', 'ICE'],
    actions: ['DUCK', 'JUMP', 'SLOW', 'FAST', 'AVOID']
  },
  advanced: {
    directional: ['LEFT', 'RIGHT', 'CENTER', 'MIDDLE', 'CURVE', 'STRAIGHT'],
    hazards: ['TREE', 'ROCK', 'GAP', 'BRANCH', 'ICE', 'CLIFF', 'LOG', 'MUD', 'WATER'],
    actions: ['DUCK', 'JUMP', 'SLOW', 'FAST', 'AVOID', 'DODGE', 'WATCH'],
    modifiers: ['BIG', 'SMALL', 'CAREFUL', 'QUICK', 'WIDE', 'NARROW']
  }
};
```

**Modifications to src/game/managers/WordManager.ts:**
- Add `difficultyTier: DifficultyTier` property
- Add `setDifficulty(tier: DifficultyTier)` method
- Update `getWordForObstacle()` to use tier-specific word pools
- Filter words based on current tier

**Modifications to src/game/scenes/MainScene.ts:**
- Add `difficultyManager: DifficultyManager` property
- In `create()`:
  - Initialize `this.difficultyManager = new DifficultyManager()`
- In `update()`:
  - Check if tier changed: `difficultyManager.update(distance)`
  - If tier changed and new tier uses 5 lanes:
    - Recalculate lane positions: `this.lanePositions = calculateLanePositions(800, 5)`
    - Update lane graphics
    - Notify player of new lane count
  - Update spawn interval based on difficulty config
  - Cap speed at maxSpeed from config

**Functions/classes to add:**
- `DifficultyManager` class in src/game/managers/DifficultyManager.ts
- `DifficultyTier` enum and `DifficultyConfig` interface
- Tier-based word lists in wordLists.ts
- Difficulty update logic in MainScene

**Dependencies:**
- Phase 8 complete (scoring and HUD working)

**Test strategy:**
- Play to 500m, verify intermediate tier activates
- Check word pool changes at 500m (more complex words appear)
- Play to 1500m, verify advanced tier activates
- Check 5 lanes appear at 1500m (lane lines increase)
- Verify spawn interval decreases (obstacles closer together)
- Test speed cap prevents runaway acceleration
- Check HUD shows current tier (if added to overlay)
- Verify tier transitions are smooth (no glitches)

**Potential risks:**
- Lane transition might cause player to be in invalid lane
- Speed cap might not be enforced correctly
- Word pool change might show repeated words
- 5-lane mode might make game too difficult
- Tier transition might cause visual glitches
