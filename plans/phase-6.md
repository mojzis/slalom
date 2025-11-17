### Phase 6: Sign System & Word-Obstacle Pairing

**Goal:** Create sign game objects that display words, spawn before obstacles, and establish the word-obstacle pairing logic.

**Files to create:**
- `src/game/objects/Sign.ts` - Sign game object class
- `src/game/managers/WordManager.ts` - Word list and pairing logic
- `src/data/wordLists.ts` - Word content data

**Files to modify:**
- `src/game/managers/ObstacleManager.ts` - Integrate sign spawning with obstacles

**src/data/wordLists.ts structure:**
```typescript
export const WORD_LISTS = {
  directional: ['LEFT', 'RIGHT', 'CENTER', 'STAY'],
  hazards: ['ROCK', 'TREE', 'GAP', 'BRANCH', 'ICE'],
  actions: ['SLOW', 'FAST', 'DUCK', 'JUMP'],
  modifiers: ['BIG', 'SMALL', 'CAREFUL', 'QUICK']
};

export const OBSTACLE_WORDS: Record<string, string[]> = {
  rock: ['ROCK', 'RIGHT', 'LEFT', 'AVOID'],
  tree: ['TREE', 'RIGHT', 'LEFT', 'DODGE'],
  gap: ['GAP', 'RIGHT', 'LEFT', 'JUMP'],
  branch: ['BRANCH', 'DUCK', 'LOW'],
  ice: ['ICE', 'CAREFUL', 'SLOW']
};

export const BEGINNER_WORDS = [
  'LEFT', 'RIGHT', 'TREE', 'ROCK', 'GAP', 'STAY', 'GO', 'STOP'
];
```

**src/game/objects/Sign.ts structure:**
```typescript
export default class Sign extends Phaser.GameObjects.Container {
  word: string;
  signBackground: Phaser.GameObjects.Graphics;
  signText: Phaser.GameObjects.Text;
  relatedObstacleY: number;
  hasBeenSeen: boolean;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    word: string,
    obstacleY: number
  ) {
    super(scene, x, y);

    this.word = word;
    this.relatedObstacleY = obstacleY;
    this.hasBeenSeen = false;

    // Create background
    this.signBackground = scene.add.graphics();
    this.signBackground.fillStyle(0xF4C8B8, 0.8);
    this.signBackground.fillRoundedRect(-80, -30, 160, 60, 10);
    this.signBackground.lineStyle(2, 0x4A5568, 1);
    this.signBackground.strokeRoundedRect(-80, -30, 160, 60, 10);

    // Create text
    this.signText = scene.add.text(0, 0, word, {
      fontFamily: 'Quicksand, sans-serif',
      fontSize: '32px',
      color: '#4A5568',
      fontStyle: 'bold'
    });
    this.signText.setOrigin(0.5, 0.5);

    this.add([this.signBackground, this.signText]);
    this.setAlpha(0);

    scene.add.existing(this);
  }

  fadeIn(): void {
    this.scene.tweens.add({
      targets: this,
      alpha: 1,
      duration: 300,
      ease: 'Power2'
    });
  }

  fadeOut(): void {
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      duration: 300,
      ease: 'Power2'
    });
  }

  checkVisibility(cameraY: number, playerY: number): void {
    const distanceToObstacle = this.relatedObstacleY - playerY;

    // Show sign 3-5 seconds before obstacle (distance-based)
    if (distanceToObstacle < 600 && distanceToObstacle > 100 && !this.hasBeenSeen) {
      this.fadeIn();
      this.hasBeenSeen = true;
    }

    // Hide sign after passing
    if (distanceToObstacle < 0) {
      this.fadeOut();
    }
  }
}
```

**src/game/managers/WordManager.ts structure:**
```typescript
import { WORD_LISTS, OBSTACLE_WORDS } from '../../data/wordLists';
import { ObstacleType } from '../objects/Obstacle';

export interface SignObstaclePair {
  word: string;
  obstacleType: ObstacleType;
  lane: number;
  obstacleY: number;
  signY: number;
}

export default class WordManager {
  recentWords: string[];
  maxRecentWords: number;

  constructor() {
    this.recentWords = [];
    this.maxRecentWords = 5;
  }

  getWordForObstacle(obstacleType: ObstacleType): string {
    const possibleWords = OBSTACLE_WORDS[obstacleType] || ['WATCH'];

    // Filter out recently used words
    const availableWords = possibleWords.filter(
      word => !this.recentWords.includes(word)
    );

    const selectedWord = availableWords.length > 0
      ? Phaser.Utils.Array.GetRandom(availableWords)
      : Phaser.Utils.Array.GetRandom(possibleWords);

    this.markWordUsed(selectedWord);
    return selectedWord;
  }

  markWordUsed(word: string): void {
    this.recentWords.push(word);
    if (this.recentWords.length > this.maxRecentWords) {
      this.recentWords.shift();
    }
  }

  generatePair(
    obstacleType: ObstacleType,
    lane: number,
    obstacleY: number
  ): SignObstaclePair {
    const word = this.getWordForObstacle(obstacleType);
    const signY = obstacleY - 300; // 300px before obstacle

    return {
      word,
      obstacleType,
      lane,
      obstacleY,
      signY
    };
  }
}
```

**Modifications to src/game/managers/ObstacleManager.ts:**
- Add `wordManager: WordManager` property
- Add `signs: Sign[]` array property
- In constructor: initialize `this.wordManager = new WordManager()`
- Modify `spawnObstacle()` to also spawn a sign:
  ```typescript
  spawnObstacle(y: number): void {
    const lane = Phaser.Math.Between(0, this.lanePositions.length - 1);
    const x = this.lanePositions[lane];
    const type: ObstacleType = Phaser.Utils.Array.GetRandom([
      'rock', 'tree', 'gap'
    ]);

    // Create obstacle
    const obstacle = new Obstacle(this.scene, lane, x, y, type);
    this.obstacles.push(obstacle);

    // Create paired sign
    const pair = this.wordManager.generatePair(type, lane, y);
    const sign = new Sign(this.scene, x, pair.signY, pair.word, y);
    this.signs.push(sign);
  }
  ```
- In `update()`: check sign visibility and cleanup old signs

**Functions/classes to add:**
- `Sign` class in src/game/objects/Sign.ts
- `WordManager` class in src/game/managers/WordManager.ts
- `WORD_LISTS` and `OBSTACLE_WORDS` in src/data/wordLists.ts
- Sign spawning logic in ObstacleManager

**Dependencies:**
- Phase 5 complete (obstacles spawn and collide)

**Test strategy:**
- Verify sign appears before obstacle (300px distance)
- Check sign displays correct word for obstacle type
- Verify sign fades in smoothly (300ms animation)
- Test sign positioning matches obstacle lane
- Verify recently used words are avoided (track last 5)
- Check sign text is readable (32px, high contrast)
- Test sign fades out after passing obstacle
- Verify signs are destroyed when off-screen

**Potential risks:**
- Sign-obstacle pairing might break sync
- Word repetition if pool too small
- Text rendering performance with many signs
- Sign visibility timing might be too short/long
- Font might not load before first sign appears
