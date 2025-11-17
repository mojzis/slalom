# Detailed Implementation Plan for Word-Reading Downhill Game

## Current Architecture Analysis

**Current State:** This is a greenfield project. No code exists yet.

**Existing Files:**
- `/plans/slalom-plan.md` - High-level game design document
- `/plans/multi-agent-workflow-guide.md` - Workflow documentation
- `/logs/` - Empty directory for agent outputs
- `.claude/CLAUDE.md` - Project instructions

**Dependencies to Install:**
- Phaser 3.80+ (game framework)
- React 18+ (UI layer)
- TypeScript 5+ (type safety)
- Vite 5+ (build tool)

**Technology Stack:**
- Frontend Framework: React 18 with TypeScript
- Game Engine: Phaser 3 (WebGL/Canvas rendering)
- Build Tool: Vite 5
- State Management: React hooks + Phaser Registry
- Persistence: localStorage
- Styling: CSS modules or styled-components
- Fonts: Google Fonts (Quicksand or Nunito)

---

## Phase Breakdown

### Phase 1: Project Initialization & Scaffolding

**Goal:** Set up the foundational project structure with Vite, React, TypeScript, and Phaser 3. Create the basic file structure and ensure the development environment runs.

**Files to create:**
- `package.json` - Project manifest with dependencies
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Vite build configuration
- `index.html` - HTML entry point
- `src/main.tsx` - React entry point
- `src/App.tsx` - Root React component
- `src/vite-env.d.ts` - Vite type declarations
- `.gitignore` - Ignore node_modules, dist, etc.

**package.json structure:**
```json
{
  "name": "word-reader-downhill",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "phaser": "^3.80.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "typescript": "^5.5.0",
    "vite": "^5.4.0"
  }
}
```

**tsconfig.json key settings:**
- `"target": "ES2020"`
- `"module": "ESNext"`
- `"lib": ["ES2020", "DOM", "DOM.Iterable"]`
- `"jsx": "react-jsx"`
- `"strict": true`
- `"moduleResolution": "bundler"`

**vite.config.ts configuration:**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  }
})
```

**Dependencies:**
- None (first phase)

**Test strategy:**
- Run `npm install` successfully
- Run `npm run dev` and verify Vite dev server starts
- Access http://localhost:3000 and see React app render
- Verify TypeScript compilation works with no errors
- Check hot module replacement (HMR) works

**Potential risks:**
- Version conflicts between dependencies
- Node.js version compatibility (need Node 18+)
- Port 3000 already in use

---

### Phase 2: Phaser Game Container & Basic Scene

**Goal:** Integrate Phaser 3 with React and create a basic MainScene that renders a solid background. Establish the Phaser-React bridge pattern.

**Files to create:**
- `src/components/PhaserGame.tsx` - React component that hosts Phaser
- `src/game/config.ts` - Phaser game configuration
- `src/game/scenes/MainScene.ts` - Primary game scene
- `src/data/theme.ts` - Color palette constants

**src/components/PhaserGame.tsx:**
- Create a functional React component
- Use `useRef<HTMLDivElement>(null)` for game container
- Initialize Phaser.Game in `useEffect` with cleanup
- Return a `<div ref={gameRef} />` element
- Export game instance for event communication

**src/game/config.ts structure:**
```typescript
import Phaser from 'phaser';
import MainScene from './scenes/MainScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  backgroundColor: '#E1F5FE',
  scene: [MainScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  }
};

export default config;
```

**src/game/scenes/MainScene.ts:**
- Extend `Phaser.Scene`
- Implement `init()` - initialize scene data
- Implement `preload()` - load assets (empty for now)
- Implement `create()` - set up scene with background gradient
- Implement `update(time, delta)` - game loop (empty for now)
- Add basic text: "MainScene Running" at center

**src/data/theme.ts structure:**
```typescript
export const COLORS = {
  SKY_TOP: '#E1F5FE',
  SKY_BOTTOM: '#F7E6F2',
  SNOW: '#F5F5F0',
  TRACK_LINE: '#D4D4C8',
  PLAYER: '#8FA9B8',
  TREE: '#B8C4B8',
  ROCK: '#C9B8AD',
  WARNING_SIGN: '#F4C8B8',
  ACTION_SIGN: '#B8D4E8',
  TEXT_PRIMARY: '#4A5568',
  TEXT_SECONDARY: '#6B7280',
  HIGHLIGHT: '#E8C4A8'
};

export const FONTS = {
  PRIMARY: 'Quicksand, sans-serif',
  SIZES: {
    SIGN: '48px',
    HUD: '24px',
    MENU: '32px'
  }
};
```

**src/App.tsx modifications:**
- Import PhaserGame component
- Render `<PhaserGame />` in main App component
- Add basic CSS reset and container styling

**Functions/classes to add:**
- `PhaserGame` component in src/components/PhaserGame.tsx
- `MainScene` class extending `Phaser.Scene` in src/game/scenes/MainScene.ts
- `config` object in src/game/config.ts

**Dependencies:**
- Phase 1 must be complete (npm packages installed)

**Test strategy:**
- Verify Phaser game canvas renders inside React app
- Check canvas is 800x600px with sky blue background
- Verify "MainScene Running" text appears in center
- Open browser console, confirm no Phaser errors
- Check Phaser version logs correctly to console
- Test HMR still works with Phaser integration

**Potential risks:**
- Phaser Game instance not cleaning up properly on component unmount
- Multiple game instances created during React re-renders
- Canvas sizing issues on different screen sizes
- TypeScript errors with Phaser types

---

### Phase 3: Auto-Scroll & Lane System

**Goal:** Implement the core auto-scrolling mechanic and 3-lane positioning system. Add a basic player sprite that can be positioned in lanes.

**Files to create:**
- `src/game/objects/Player.ts` - Player game object
- `src/game/objects/Lane.ts` - Lane positioning utilities
- `src/game/config.ts` - Add lane configuration constants

**Files to modify:**
- `src/game/scenes/MainScene.ts` - Add auto-scroll, player, and lane rendering

**src/game/objects/Player.ts structure:**
```typescript
export default class Player extends Phaser.GameObjects.Graphics {
  currentLane: number;
  targetLane: number;
  isTransitioning: boolean;

  constructor(scene: Phaser.Scene, lane: number) {
    super(scene);
    this.currentLane = lane;
    this.targetLane = lane;
    this.isTransitioning = false;
    this.drawPlayer();
  }

  drawPlayer(): void {
    // Draw simple circle or triangle shape (thin lines)
    this.clear();
    this.lineStyle(2, 0x8FA9B8);
    this.fillStyle(0x8FA9B8, 0.3);
    this.strokeCircle(0, 0, 20);
    this.fillCircle(0, 0, 20);
  }

  moveToLane(lane: number, lanePositions: number[]): void {
    // Set up tween to smoothly move to target lane
  }
}
```

**src/game/objects/Lane.ts structure:**
```typescript
export interface LaneConfig {
  totalLanes: number;
  laneWidth: number;
  lanePositions: number[];
}

export function calculateLanePositions(
  gameWidth: number,
  numLanes: number
): number[] {
  const centerX = gameWidth / 2;
  if (numLanes === 3) {
    return [centerX - 150, centerX, centerX + 150];
  } else if (numLanes === 5) {
    return [centerX - 300, centerX - 150, centerX, centerX + 150, centerX + 300];
  }
  return [centerX];
}

export function drawLaneGuides(
  scene: Phaser.Scene,
  lanePositions: number[],
  graphics: Phaser.GameObjects.Graphics
): void {
  graphics.clear();
  graphics.lineStyle(1, 0xD4D4C8, 0.5);

  lanePositions.forEach(x => {
    graphics.lineBetween(x, 0, x, 600);
  });
}
```

**Modifications to src/game/scenes/MainScene.ts:**
- Add `scrollSpeed: number` property (start at 2)
- Add `lanePositions: number[]` property
- Add `player: Player` property
- Add `laneGraphics: Phaser.GameObjects.Graphics` property
- In `create()`:
  - Calculate lane positions using `calculateLanePositions(800, 3)`
  - Create lane guide graphics
  - Create Player instance at middle lane
  - Position player at `y = 500` (near bottom of screen)
- In `update(time, delta)`:
  - Increment `this.cameras.main.scrollY` by `scrollSpeed`
  - Update player y position to follow camera (keep at screen bottom)

**Functions/classes to add:**
- `Player` class in src/game/objects/Player.ts
- `calculateLanePositions()` function in src/game/objects/Lane.ts
- `drawLaneGuides()` function in src/game/objects/Lane.ts
- Add `scrollSpeed`, `lanePositions`, `player` properties to MainScene

**Dependencies:**
- Phase 2 complete (MainScene exists and renders)

**Test strategy:**
- Verify camera scrolls upward continuously
- Check 3 vertical lane lines appear on screen
- Verify player circle/shape renders at bottom center lane
- Player should stay at fixed y position relative to viewport
- Lane lines should scroll with camera
- Check scrollSpeed = 2 pixels per frame (monitor with console.log)

**Potential risks:**
- Camera scroll might be choppy (need RAF sync)
- Lane positions might not center correctly on different screen sizes
- Player sprite might not follow camera properly
- Graphics object performance with continuous redrawing

---

### Phase 4: Keyboard Input & Lane Switching

**Goal:** Add arrow key input handling and implement smooth lane-switching animations using Phaser tweens.

**Files to modify:**
- `src/game/scenes/MainScene.ts` - Add keyboard input handling
- `src/game/objects/Player.ts` - Implement lane switching with tweens

**Modifications to src/game/scenes/MainScene.ts:**
- Add `cursors: Phaser.Types.Input.Keyboard.CursorKeys` property
- In `create()`:
  - Initialize `this.cursors = this.input.keyboard.createCursorKeys()`
- In `update(time, delta)`:
  - Check `Phaser.Input.Keyboard.JustDown(this.cursors.left)`
  - Check `Phaser.Input.Keyboard.JustDown(this.cursors.right)`
  - Call `player.moveToLane()` with new lane index
  - Prevent input if player is already transitioning

**Modifications to src/game/objects/Player.ts:**
- Implement `moveToLane(lane: number, lanePositions: number[])`:
  ```typescript
  moveToLane(lane: number, lanePositions: number[]): void {
    if (this.isTransitioning) return;

    // Clamp lane to valid range
    const clampedLane = Phaser.Math.Clamp(lane, 0, lanePositions.length - 1);
    if (clampedLane === this.currentLane) return;

    this.isTransitioning = true;
    this.targetLane = clampedLane;

    this.scene.tweens.add({
      targets: this,
      x: lanePositions[clampedLane],
      duration: 200,
      ease: 'Power2',
      onComplete: () => {
        this.currentLane = this.targetLane;
        this.isTransitioning = false;
      }
    });
  }
  ```

**Functions/classes to add:**
- `cursors` property in MainScene
- Input handling logic in MainScene `update()`
- Complete `moveToLane()` implementation in Player class

**Dependencies:**
- Phase 3 complete (lanes and player exist)

**Test strategy:**
- Press left arrow key, verify player moves to left lane smoothly
- Press right arrow key, verify player moves to right lane smoothly
- Press arrow key at leftmost lane, verify player doesn't move off-screen
- Press arrow key at rightmost lane, verify player doesn't move off-screen
- Spam arrow keys rapidly, verify transitions don't overlap (isTransitioning check)
- Verify transition takes ~200ms (smooth but responsive)
- Check easing function makes motion feel natural (not linear)

**Potential risks:**
- Input lag if checking key state instead of JustDown
- Player could get stuck mid-transition
- Tween might not complete if scene changes
- Multiple simultaneous tweens causing position conflicts

---

### Phase 5: Obstacle System & Collision Detection

**Goal:** Create obstacle game objects (rock, tree, gap) that spawn ahead of the player, scroll downward, and detect collisions based on lane position.

**Files to create:**
- `src/game/objects/Obstacle.ts` - Obstacle game object class
- `src/game/managers/ObstacleManager.ts` - Obstacle spawning logic

**Files to modify:**
- `src/game/scenes/MainScene.ts` - Add obstacle spawning and collision checks

**src/game/objects/Obstacle.ts structure:**
```typescript
export type ObstacleType = 'rock' | 'tree' | 'gap' | 'branch' | 'ice';

export default class Obstacle extends Phaser.GameObjects.Graphics {
  lane: number;
  obstacleType: ObstacleType;
  yPosition: number;
  hasCollided: boolean;

  constructor(
    scene: Phaser.Scene,
    lane: number,
    x: number,
    y: number,
    type: ObstacleType
  ) {
    super(scene);
    this.lane = lane;
    this.obstacleType = type;
    this.yPosition = y;
    this.hasCollided = false;

    this.setPosition(x, y);
    this.drawObstacle();
    scene.add.existing(this);
  }

  drawObstacle(): void {
    this.clear();
    this.lineStyle(2, 0xC9B8AD);

    switch(this.obstacleType) {
      case 'rock':
        // Draw irregular polygon for rock
        this.strokeCircle(0, 0, 25);
        break;
      case 'tree':
        // Draw triangle for tree
        this.strokeTriangle(-20, 30, 0, -30, 20, 30);
        break;
      case 'gap':
        // Draw missing track section
        this.fillStyle(0x000000, 0.3);
        this.fillRect(-30, -10, 60, 20);
        break;
      // ... other types
    }
  }

  checkCollision(player: Player): boolean {
    if (this.hasCollided) return false;

    const verticalDistance = Math.abs(this.yPosition - player.y);
    const inSameLane = this.lane === player.currentLane;

    return inSameLane && verticalDistance < 40;
  }

  destroy(): void {
    super.destroy();
  }
}
```

**src/game/managers/ObstacleManager.ts structure:**
```typescript
import Obstacle, { ObstacleType } from '../objects/Obstacle';

export default class ObstacleManager {
  scene: Phaser.Scene;
  obstacles: Obstacle[];
  spawnDistance: number;
  lastSpawnY: number;
  lanePositions: number[];

  constructor(scene: Phaser.Scene, lanePositions: number[]) {
    this.scene = scene;
    this.obstacles = [];
    this.spawnDistance = 400; // Spawn 400px ahead
    this.lastSpawnY = 0;
    this.lanePositions = lanePositions;
  }

  update(cameraY: number): void {
    // Spawn new obstacles if camera has scrolled far enough
    if (cameraY - this.lastSpawnY > 200) {
      this.spawnObstacle(cameraY - this.spawnDistance);
      this.lastSpawnY = cameraY;
    }

    // Remove obstacles that are off-screen (behind camera)
    this.obstacles = this.obstacles.filter(obstacle => {
      if (obstacle.yPosition > cameraY + 700) {
        obstacle.destroy();
        return false;
      }
      return true;
    });
  }

  spawnObstacle(y: number): void {
    const lane = Phaser.Math.Between(0, this.lanePositions.length - 1);
    const x = this.lanePositions[lane];
    const type: ObstacleType = Phaser.Utils.Array.GetRandom([
      'rock', 'tree', 'gap'
    ]);

    const obstacle = new Obstacle(this.scene, lane, x, y, type);
    this.obstacles.push(obstacle);
  }

  checkCollisions(player: Player): boolean {
    for (const obstacle of this.obstacles) {
      if (obstacle.checkCollision(player)) {
        obstacle.hasCollided = true;
        return true;
      }
    }
    return false;
  }

  getActiveObstacles(): Obstacle[] {
    return this.obstacles;
  }
}
```

**Modifications to src/game/scenes/MainScene.ts:**
- Add `obstacleManager: ObstacleManager` property
- Add `isGameOver: boolean` property
- In `create()`:
  - Initialize `this.obstacleManager = new ObstacleManager(this, this.lanePositions)`
- In `update(time, delta)`:
  - Call `this.obstacleManager.update(this.cameras.main.scrollY)`
  - Call `if (this.obstacleManager.checkCollisions(this.player))` - trigger crash
  - If crash detected, set `isGameOver = true` and stop scrolling

**Functions/classes to add:**
- `Obstacle` class in src/game/objects/Obstacle.ts
- `ObstacleManager` class in src/game/managers/ObstacleManager.ts
- `obstacleManager` property and collision logic in MainScene

**Dependencies:**
- Phase 4 complete (player can move between lanes)

**Test strategy:**
- Verify obstacles spawn ahead of camera view
- Check obstacles appear in random lanes
- Verify different obstacle types render (rock, tree, gap)
- Test collision detection: move player into obstacle lane, confirm crash
- Test collision miss: stay in different lane, confirm no crash
- Verify old obstacles are destroyed when off-screen (check memory)
- Check obstacles scroll at same speed as camera
- Test spawn frequency (new obstacle every ~200px)

**Potential risks:**
- Memory leak if obstacles not properly destroyed
- Collision detection timing issues (frame-perfect bugs)
- Obstacles spawning too close together
- Lane randomization creating unplayable patterns
- Graphics rendering performance with many obstacles

---

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

---

### Phase 7: Crash Handling & Game Over

**Goal:** Implement crash animation, game over state, and basic restart functionality. Add visual feedback when player collides with obstacle.

**Files to create:**
- `src/game/scenes/GameOverScene.ts` - Game over scene

**Files to modify:**
- `src/game/scenes/MainScene.ts` - Add crash handling
- `src/game/objects/Player.ts` - Add crash animation
- `src/game/config.ts` - Register GameOverScene

**src/game/scenes/GameOverScene.ts structure:**
```typescript
export default class GameOverScene extends Phaser.Scene {
  finalDistance: number;

  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data: { distance: number }): void {
    this.finalDistance = data.distance || 0;
  }

  create(): void {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Background
    this.add.rectangle(0, 0, 800, 600, 0xF5F5F0).setOrigin(0, 0);

    // Game Over text
    this.add.text(centerX, centerY - 100, 'Crashed!', {
      fontFamily: 'Quicksand, sans-serif',
      fontSize: '64px',
      color: '#4A5568'
    }).setOrigin(0.5);

    // Distance text
    this.add.text(centerX, centerY, `Distance: ${this.finalDistance.toFixed(0)}m`, {
      fontFamily: 'Quicksand, sans-serif',
      fontSize: '32px',
      color: '#6B7280'
    }).setOrigin(0.5);

    // Restart instruction
    const restartText = this.add.text(centerX, centerY + 100, 'Press ENTER to restart', {
      fontFamily: 'Quicksand, sans-serif',
      fontSize: '24px',
      color: '#8FA9B8'
    }).setOrigin(0.5);

    // Pulse animation
    this.tweens.add({
      targets: restartText,
      alpha: 0.5,
      duration: 800,
      yoyo: true,
      repeat: -1
    });

    // Listen for Enter key
    this.input.keyboard.once('keydown-ENTER', () => {
      this.scene.start('MainScene');
    });
  }
}
```

**Modifications to src/game/objects/Player.ts:**
- Add `isCrashed: boolean` property
- Add `crash()` method:
  ```typescript
  crash(): void {
    this.isCrashed = true;

    // Change color to red
    this.clear();
    this.lineStyle(2, 0xFF0000);
    this.strokeCircle(0, 0, 20);

    // Shake animation
    this.scene.tweens.add({
      targets: this,
      x: this.x - 10,
      duration: 50,
      yoyo: true,
      repeat: 5
    });

    // Fade out
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      duration: 500,
      delay: 300
    });
  }
  ```

**Modifications to src/game/scenes/MainScene.ts:**
- Add `distance: number` property (calculated from scrollY)
- Modify collision handling in `update()`:
  ```typescript
  if (!this.isGameOver && this.obstacleManager.checkCollisions(this.player)) {
    this.handleCrash();
  }
  ```
- Add `handleCrash()` method:
  ```typescript
  handleCrash(): void {
    this.isGameOver = true;
    this.player.crash();

    // Calculate distance traveled (scrollY / pixels per meter)
    const distance = this.cameras.main.scrollY / 2;

    // Transition to game over scene after animation
    this.time.delayedCall(1000, () => {
      this.scene.start('GameOverScene', { distance });
    });
  }
  ```
- Stop scrolling when `isGameOver = true`

**Modifications to src/game/config.ts:**
- Import GameOverScene
- Add to scenes array: `scene: [MainScene, GameOverScene]`

**Functions/classes to add:**
- `GameOverScene` class in src/game/scenes/GameOverScene.ts
- `crash()` method in Player class
- `handleCrash()` method in MainScene
- `distance` tracking in MainScene

**Dependencies:**
- Phase 6 complete (signs and obstacles working)

**Test strategy:**
- Crash into obstacle, verify shake animation plays
- Check player fades out after crash
- Verify game over scene appears after 1 second
- Check distance is calculated correctly (scrollY / 2)
- Test restart: press Enter, verify MainScene restarts fresh
- Verify scrolling stops immediately on crash
- Check no new obstacles spawn after crash
- Test restart multiple times, ensure no memory leaks

**Potential risks:**
- Scene transition might happen too quickly/slowly
- Player animation might not complete before scene change
- Distance calculation might be inaccurate
- Restart might not fully reset game state
- Multiple crash events might fire simultaneously

---

### Phase 8: Score Tracking & HUD

**Goal:** Add distance/score tracking, speed increases over time, and a React-based HUD overlay displaying real-time stats.

**Files to create:**
- `src/game/managers/ScoreManager.ts` - Score and distance tracking
- `src/components/GameOverlay.tsx` - React HUD component

**Files to modify:**
- `src/game/scenes/MainScene.ts` - Integrate ScoreManager and events
- `src/components/PhaserGame.tsx` - Add GameOverlay component
- `src/App.tsx` - Update component structure

**src/game/managers/ScoreManager.ts structure:**
```typescript
export default class ScoreManager {
  scene: Phaser.Scene;
  distance: number;
  highScore: number;
  startTime: number;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.distance = 0;
    this.startTime = Date.now();
    this.highScore = this.loadHighScore();
  }

  update(scrollY: number): void {
    // Convert scrollY to meters (2 pixels = 1 meter)
    this.distance = Math.floor(scrollY / 2);

    // Emit event for React components
    this.scene.events.emit('scoreUpdate', {
      distance: this.distance,
      highScore: this.highScore
    });
  }

  calculateSpeed(distance: number): number {
    // Base speed: 2, increase by 0.5 every 500m
    const speedIncrements = Math.floor(distance / 500);
    return 2 + (speedIncrements * 0.5);
  }

  saveHighScore(): void {
    if (this.distance > this.highScore) {
      this.highScore = this.distance;
      localStorage.setItem('highScore', this.distance.toString());
    }
  }

  loadHighScore(): number {
    const saved = localStorage.getItem('highScore');
    return saved ? parseInt(saved, 10) : 0;
  }

  getElapsedTime(): number {
    return Math.floor((Date.now() - this.startTime) / 1000);
  }
}
```

**src/components/GameOverlay.tsx structure:**
```typescript
import React, { useState, useEffect } from 'react';

interface GameStats {
  distance: number;
  highScore: number;
}

interface Props {
  gameInstance: Phaser.Game | null;
}

export default function GameOverlay({ gameInstance }: Props) {
  const [stats, setStats] = useState<GameStats>({
    distance: 0,
    highScore: 0
  });

  useEffect(() => {
    if (!gameInstance) return;

    const scene = gameInstance.scene.getScene('MainScene');
    if (!scene) return;

    const handleScoreUpdate = (data: GameStats) => {
      setStats(data);
    };

    scene.events.on('scoreUpdate', handleScoreUpdate);

    return () => {
      scene.events.off('scoreUpdate', handleScoreUpdate);
    };
  }, [gameInstance]);

  return (
    <div style={{
      position: 'absolute',
      top: 20,
      left: 20,
      color: '#4A5568',
      fontFamily: 'Quicksand, sans-serif',
      fontSize: '24px',
      pointerEvents: 'none',
      zIndex: 10
    }}>
      <div>Distance: {stats.distance}m</div>
      <div style={{ fontSize: '18px', color: '#6B7280', marginTop: '8px' }}>
        Best: {stats.highScore}m
      </div>
    </div>
  );
}
```

**Modifications to src/game/scenes/MainScene.ts:**
- Add `scoreManager: ScoreManager` property
- In `create()`:
  - Initialize `this.scoreManager = new ScoreManager(this)`
- In `update()`:
  - Call `this.scoreManager.update(this.cameras.main.scrollY)`
  - Update `scrollSpeed` based on `scoreManager.calculateSpeed()`
  - Apply new speed: `this.cameras.main.scrollY += this.scrollSpeed`
- In `handleCrash()`:
  - Call `this.scoreManager.saveHighScore()`

**Modifications to src/components/PhaserGame.tsx:**
- Export game instance via ref or state
- Return game instance from component for parent access

**Modifications to src/App.tsx:**
- Add state for game instance: `const [game, setGame] = useState<Phaser.Game | null>(null)`
- Pass setter to PhaserGame component
- Render GameOverlay with game instance:
  ```tsx
  <div style={{ position: 'relative' }}>
    <PhaserGame onGameReady={setGame} />
    <GameOverlay gameInstance={game} />
  </div>
  ```

**Functions/classes to add:**
- `ScoreManager` class in src/game/managers/ScoreManager.ts
- `GameOverlay` component in src/components/GameOverlay.tsx
- Event emitter pattern for Phaser-React communication
- localStorage persistence for high score

**Dependencies:**
- Phase 7 complete (crash and game over working)

**Test strategy:**
- Verify distance counter increments as player scrolls
- Check speed increases at 500m intervals (2.0 → 2.5 → 3.0)
- Test high score saves to localStorage
- Verify high score persists after page reload
- Check GameOverlay displays correct real-time distance
- Test HUD doesn't interfere with game input
- Verify events clean up properly (no memory leaks)
- Test multiple game sessions update high score correctly

**Potential risks:**
- React re-renders might cause performance issues
- Event listeners might not clean up properly
- localStorage might be disabled in some browsers
- Speed increases might make game unplayable
- Phaser-React bridge might lose sync

---

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

---

### Phase 10: Visual Polish & Styling

**Goal:** Apply the subdued pastel color palette, add parallax backgrounds, refine animations, and load custom fonts.

**Files to create:**
- `src/game/objects/Background.ts` - Parallax background layers
- `src/styles/fonts.css` - Google Fonts import

**Files to modify:**
- `src/game/scenes/MainScene.ts` - Add background layers
- `src/data/theme.ts` - Refine color palette
- `src/game/objects/Player.ts` - Update visual style
- `src/game/objects/Obstacle.ts` - Update visual style
- `src/game/objects/Sign.ts` - Update visual style
- `index.html` - Add font preload

**src/styles/fonts.css:**
```css
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;600&display=swap');

body {
  margin: 0;
  padding: 0;
  font-family: 'Quicksand', sans-serif;
  background-color: #F5F5F0;
}

#root {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
```

**src/game/objects/Background.ts structure:**
```typescript
export default class Background {
  scene: Phaser.Scene;
  layers: Phaser.GameObjects.Graphics[];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.layers = [];
    this.createLayers();
  }

  createLayers(): void {
    // Sky gradient background (static)
    const skyGradient = this.scene.add.graphics();
    skyGradient.fillGradientStyle(0xE1F5FE, 0xE1F5FE, 0xF7E6F2, 0xF7E6F2, 1);
    skyGradient.fillRect(0, -10000, 800, 20000);
    skyGradient.setDepth(-100);
    this.layers.push(skyGradient);

    // Distant hills (slow parallax)
    const hills = this.scene.add.graphics();
    hills.lineStyle(1, 0xB8C4B8, 0.3);
    hills.beginPath();
    hills.moveTo(0, 400);
    for (let x = 0; x < 800; x += 50) {
      const y = 400 + Math.sin(x / 100) * 30;
      hills.lineTo(x, y);
    }
    hills.strokePath();
    hills.setScrollFactor(0.3);
    hills.setDepth(-50);
    this.layers.push(hills);

    // Snow/ground texture (matches scroll)
    const ground = this.scene.add.graphics();
    ground.fillStyle(0xF5F5F0, 1);
    ground.fillRect(0, 0, 800, 600);
    ground.setDepth(-10);
    this.layers.push(ground);
  }

  update(): void {
    // Add subtle movement to distant layers if needed
  }
}
```

**Modifications to src/game/scenes/MainScene.ts:**
- Add `background: Background` property
- In `create()`:
  - Initialize `this.background = new Background(this)` before other objects
- Set proper depth values:
  - Background: -100 to -10
  - Lane lines: 0
  - Obstacles: 10
  - Signs: 20
  - Player: 30

**Modifications to src/game/objects/Player.ts:**
- Update `drawPlayer()` with refined style:
  ```typescript
  drawPlayer(): void {
    this.clear();

    // Thin outline
    this.lineStyle(1.5, 0x8FA9B8, 1);
    this.fillStyle(0x8FA9B8, 0.2);

    // Simple circle shape
    this.strokeCircle(0, 0, 22);
    this.fillCircle(0, 0, 22);

    // Add small center dot
    this.fillStyle(0x8FA9B8, 0.6);
    this.fillCircle(0, 0, 6);
  }
  ```

**Modifications to src/game/objects/Obstacle.ts:**
- Refine `drawObstacle()` with thin lines and pastel colors:
  ```typescript
  drawObstacle(): void {
    this.clear();

    switch(this.obstacleType) {
      case 'rock':
        this.lineStyle(1.5, 0xC9B8AD, 1);
        this.fillStyle(0xC9B8AD, 0.2);
        // Organic rock shape
        this.strokeCircle(0, 0, 28);
        this.fillCircle(0, 0, 28);
        break;

      case 'tree':
        this.lineStyle(1.5, 0xB8C4B8, 1);
        this.fillStyle(0xB8C4B8, 0.2);
        // Simple triangle
        this.beginPath();
        this.moveTo(0, -35);
        this.lineTo(-25, 35);
        this.lineTo(25, 35);
        this.closePath();
        this.strokePath();
        this.fillPath();
        break;

      // ... other obstacle types
    }
  }
  ```

**Modifications to src/game/objects/Sign.ts:**
- Update background colors to match theme:
  ```typescript
  // For hazard signs
  this.signBackground.fillStyle(0xF4C8B8, 0.9);

  // For action signs
  this.signBackground.fillStyle(0xB8D4E8, 0.9);

  // Thin border
  this.signBackground.lineStyle(1.5, 0x4A5568, 1);

  // Larger, more readable text
  this.signText = scene.add.text(0, 0, word, {
    fontFamily: 'Quicksand',
    fontSize: '40px',
    color: '#4A5568',
    fontStyle: '600'
  });
  ```

**Modifications to index.html:**
- Add font preload in `<head>`:
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;600&display=swap" rel="stylesheet">
  ```

**Functions/classes to add:**
- `Background` class in src/game/objects/Background.ts
- fonts.css stylesheet
- Depth ordering system across all game objects
- Refined visual styling for all game objects

**Dependencies:**
- Phase 9 complete (difficulty scaling working)

**Test strategy:**
- Verify sky gradient appears (light blue to lavender)
- Check distant hills have parallax effect (scroll slower)
- Verify all objects have correct depth ordering
- Test font loads correctly (Quicksand appears, not fallback)
- Check thin lines (1-2px) on all objects
- Verify pastel colors match design spec (use color picker)
- Test animations are smooth (300-500ms durations)
- Check sign backgrounds have proper transparency

**Potential risks:**
- Font might not load before game starts (FOUT)
- Parallax might cause performance issues
- Depth ordering might cause visual glitches
- Colors might not match on different monitors
- Graphics rendering might be slower with complex shapes

---

### Phase 11: Main Menu & UI Flow

**Goal:** Create a main menu screen, settings panel, and proper scene transitions. Implement game state management across scenes.

**Files to create:**
- `src/game/scenes/MenuScene.ts` - Main menu scene
- `src/components/MainMenu.tsx` - React main menu UI
- `src/components/Settings.tsx` - Settings panel component

**Files to modify:**
- `src/game/config.ts` - Add MenuScene, set as initial scene
- `src/components/PhaserGame.tsx` - Handle scene-based UI switching
- `src/App.tsx` - Add menu state management

**src/game/scenes/MenuScene.ts structure:**
```typescript
export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create(): void {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Background
    this.add.rectangle(0, 0, 800, 600, 0xE1F5FE).setOrigin(0, 0);

    // Title
    const title = this.add.text(centerX, centerY - 120, 'Word Racer', {
      fontFamily: 'Quicksand',
      fontSize: '72px',
      color: '#4A5568',
      fontStyle: '600'
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(centerX, centerY - 50, 'Read the signs to survive!', {
      fontFamily: 'Quicksand',
      fontSize: '24px',
      color: '#6B7280'
    }).setOrigin(0.5);

    // Start button
    const startButton = this.add.text(centerX, centerY + 60, 'START GAME', {
      fontFamily: 'Quicksand',
      fontSize: '36px',
      color: '#8FA9B8',
      fontStyle: '600'
    }).setOrigin(0.5);

    startButton.setInteractive({ useHandCursor: true });
    startButton.on('pointerover', () => {
      startButton.setColor('#4A5568');
    });
    startButton.on('pointerout', () => {
      startButton.setColor('#8FA9B8');
    });
    startButton.on('pointerdown', () => {
      this.scene.start('MainScene');
    });

    // High score display
    const highScore = localStorage.getItem('highScore') || '0';
    this.add.text(centerX, centerY + 150, `Best Distance: ${highScore}m`, {
      fontFamily: 'Quicksand',
      fontSize: '20px',
      color: '#6B7280'
    }).setOrigin(0.5);

    // Listen for spacebar to start
    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start('MainScene');
    });
  }
}
```

**src/components/Settings.tsx structure:**
```typescript
import React, { useState } from 'react';

interface SettingsProps {
  onClose: () => void;
}

export default function Settings({ onClose }: SettingsProps) {
  const [difficulty, setDifficulty] = useState('normal');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleSave = () => {
    localStorage.setItem('difficulty', difficulty);
    localStorage.setItem('soundEnabled', soundEnabled.toString());
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 100
    }}>
      <div style={{
        backgroundColor: '#F5F5F0',
        padding: '40px',
        borderRadius: '20px',
        fontFamily: 'Quicksand',
        color: '#4A5568'
      }}>
        <h2>Settings</h2>

        <div style={{ marginBottom: '20px' }}>
          <label>
            Difficulty:
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              style={{ marginLeft: '10px' }}
            >
              <option value="easy">Easy</option>
              <option value="normal">Normal</option>
              <option value="hard">Hard</option>
            </select>
          </label>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label>
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
            />
            Enable Sound
          </label>
        </div>

        <button onClick={handleSave} style={{
          padding: '10px 20px',
          marginRight: '10px',
          cursor: 'pointer'
        }}>
          Save
        </button>
        <button onClick={onClose} style={{
          padding: '10px 20px',
          cursor: 'pointer'
        }}>
          Cancel
        </button>
      </div>
    </div>
  );
}
```

**Modifications to src/game/config.ts:**
- Import MenuScene
- Update scenes array: `scene: [MenuScene, MainScene, GameOverScene]`
- MenuScene runs first by default

**Modifications to src/components/PhaserGame.tsx:**
- Add scene change event listeners
- Emit events to React when scene changes
- Handle pause state

**Modifications to src/App.tsx:**
- Add state for current scene: `const [currentScene, setCurrentScene] = useState('MenuScene')`
- Show/hide GameOverlay based on scene (only show in MainScene)
- Add settings button in menu
- Handle settings modal open/close

**Functions/classes to add:**
- `MenuScene` class in src/game/scenes/MenuScene.ts
- `Settings` component in src/components/Settings.tsx
- Scene transition event system
- Settings persistence in localStorage

**Dependencies:**
- Phase 10 complete (visual polish done)

**Test strategy:**
- Verify menu appears on game load
- Click "START GAME", verify MainScene starts
- Press spacebar in menu, verify game starts
- Check high score displays correctly in menu
- Test settings modal opens and closes
- Verify settings persist after page reload
- Test scene transitions are smooth (no flicker)
- Check GameOverlay only appears during gameplay

**Potential risks:**
- Scene transitions might not clean up properly
- Settings might not apply to running game
- Modal might interfere with game input
- Multiple menu instances might spawn
- localStorage settings might conflict with game logic

---

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

---

### Phase 13: Sound Effects & Audio (Optional)

**Goal:** Add optional sound effects for collisions, lane switches, and background music. Use Phaser.Sound system.

**Files to create:**
- `src/game/managers/AudioManager.ts` - Audio playback and management
- `public/assets/sounds/` - Directory for audio files

**Files to modify:**
- `src/game/scenes/MainScene.ts` - Integrate audio triggers
- `src/components/Settings.tsx` - Add volume controls

**src/game/managers/AudioManager.ts structure:**
```typescript
export default class AudioManager {
  scene: Phaser.Scene;
  soundEnabled: boolean;
  volume: number;

  sounds: {
    crash?: Phaser.Sound.BaseSound;
    laneSwitch?: Phaser.Sound.BaseSound;
    signAppear?: Phaser.Sound.BaseSound;
  };

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.soundEnabled = this.loadSoundSetting();
    this.volume = 0.5;
    this.sounds = {};
  }

  preload(): void {
    // Load sound files (if using audio files)
    // For MVP, we can use Phaser's built-in tone generation
  }

  create(): void {
    // Create sound instances (empty for now - can add later)
  }

  playLaneSwitch(): void {
    if (!this.soundEnabled) return;

    // Simple beep using WebAudio (no file needed)
    this.scene.sound.add('beep', { volume: this.volume * 0.3 });
  }

  playCrash(): void {
    if (!this.soundEnabled) return;

    // Crash sound (lower pitch)
  }

  playSignAppear(): void {
    if (!this.soundEnabled) return;

    // Subtle notification sound
  }

  loadSoundSetting(): boolean {
    const setting = localStorage.getItem('soundEnabled');
    return setting ? setting === 'true' : true;
  }

  setSoundEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
    localStorage.setItem('soundEnabled', enabled.toString());
  }
}
```

**Modifications to src/game/scenes/MainScene.ts:**
- Add `audioManager: AudioManager` property
- In `create()`: initialize AudioManager
- In player lane switch: call `audioManager.playLaneSwitch()`
- In crash: call `audioManager.playCrash()`
- In sign fade-in: call `audioManager.playSignAppear()`

**Modifications to src/components/Settings.tsx:**
- Add volume slider
- Add sound effect test buttons
- Save volume to localStorage
- Pass settings to AudioManager via Phaser events

**Functions/classes to add:**
- `AudioManager` class in src/game/managers/AudioManager.ts
- Sound effect triggers throughout game
- Volume controls in settings

**Dependencies:**
- Phase 12 complete (content balanced)

**Test strategy:**
- Verify sounds play at correct times (lane switch, crash)
- Test volume control actually changes volume
- Check mute setting persists across sessions
- Verify sounds don't overlap/clip
- Test performance with sounds enabled
- Check sounds work across browsers (WebAudio support)

**Potential risks:**
- Audio files might not load in time
- WebAudio might not be supported in all browsers
- Sounds might be annoying/distracting
- Audio playback might cause performance issues
- Volume levels might be inconsistent

---

### Phase 14: Testing, Bug Fixes & Optimization

**Goal:** Comprehensive testing across browsers, fix bugs, optimize performance, and prepare for deployment.

**Files to modify:**
- All files (bug fixes)
- `vite.config.ts` - Production optimization settings

**Testing checklist:**

**Browser Testing:**
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (macOS/iOS)
- [ ] Mobile browsers (iOS Safari, Chrome Android)

**Functionality Testing:**
- [ ] Lane switching works in all scenarios
- [ ] Collisions detected accurately
- [ ] Signs appear at correct distance
- [ ] Difficulty tiers transition smoothly
- [ ] High score saves and loads
- [ ] Settings persist across sessions
- [ ] Game restart clears state properly
- [ ] No memory leaks over long sessions

**Performance Testing:**
- [ ] 60fps maintained on target hardware
- [ ] Memory usage stable over 10+ minutes
- [ ] No frame drops during difficulty transitions
- [ ] Object pooling prevents garbage collection spikes
- [ ] Canvas renders at consistent resolution

**Accessibility Testing:**
- [ ] Keyboard-only navigation works
- [ ] Text contrast meets WCAG AA standards
- [ ] Font size readable on mobile devices
- [ ] Color-blind friendly palette
- [ ] Settings include accessibility options

**Modifications to vite.config.ts:**
```typescript
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'phaser': ['phaser'],
          'react-vendor': ['react', 'react-dom']
        }
      }
    }
  },
  server: {
    port: 3000
  }
});
```

**Common bugs to check:**
- Player stuck between lanes
- Obstacles spawning inside player
- Signs not fading out
- Multiple game instances running
- Tweens not completing
- Scene transitions failing
- localStorage quota exceeded
- Event listeners not cleaning up

**Performance optimizations:**
- Use object pooling for obstacles and signs
- Implement efficient culling (destroy off-screen objects)
- Cache frequently used calculations (lane positions)
- Use `setScrollFactor()` for static backgrounds
- Minimize Graphics object recreation
- Batch draw calls where possible
- Use sprite sheets if adding visual assets

**Dependencies:**
- Phase 13 complete (audio implemented)

**Test strategy:**
- Run game for 30+ minutes, monitor memory/CPU
- Test on low-end devices (older smartphones)
- Use browser DevTools performance profiler
- Check network tab for unnecessary requests
- Verify build output size is reasonable (<2MB)
- Test offline functionality (PWA potential)

**Potential risks:**
- Browser-specific bugs might be hard to reproduce
- Performance issues might only appear on specific devices
- Memory leaks might be subtle and hard to detect
- Production build might behave differently than dev

---

## Implementation Order

**Sequential dependencies:**
1. Phase 1 → Phase 2 (need project setup before Phaser integration)
2. Phase 2 → Phase 3 (need scene before adding objects)
3. Phase 3 → Phase 4 (need lanes before input)
4. Phase 4 → Phase 5 (need player movement before obstacles)
5. Phase 5 → Phase 6 (need obstacles before signs)
6. Phase 6 → Phase 7 (need collision before crash handling)
7. Phase 7 → Phase 8 (need game over before scoring)
8. Phase 8 → Phase 9 (need scoring before difficulty scaling)

**Phases that can be done in parallel (after their dependencies):**
- Phase 10 (visual polish) can happen alongside Phase 9
- Phase 11 (menu) can happen after Phase 8 is complete
- Phase 12 (content expansion) can happen alongside Phase 10-11
- Phase 13 (audio) can happen after Phase 11
- Phase 14 (testing) should be done after all other phases

**Critical path:**
Phases 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 form the critical path for a playable MVP.

**Recommended order for multi-agent workflow:**
1. Phase 1 (setup) - Critical foundation
2. Phase 2 (Phaser integration) - Establish game engine
3. Phase 3 (auto-scroll & lanes) - Core mechanic #1
4. Phase 4 (input) - Core mechanic #2
5. Phase 5 (obstacles) - Core mechanic #3
6. Phase 6 (signs) - Core mechanic #4
7. Phase 7 (crash) - Complete game loop
8. Phase 8 (scoring) - Add progression
9. Phase 9 (difficulty) - Add depth
10. Phase 10 (polish) - Improve visuals
11. Phase 11 (menu) - Complete UI
12. Phase 12 (content) - Add variety
13. Phase 13 (audio) - Optional enhancement
14. Phase 14 (testing) - Quality assurance

**Milestone deliverables:**
- **After Phase 7:** Minimum viable game (playable, crashes work, basic loop complete)
- **After Phase 9:** Feature-complete core (all mechanics implemented)
- **After Phase 12:** Content-complete (ready for playtesting)
- **After Phase 14:** Production-ready (polished, tested, optimized)

---

## Notes for Coder Agents

**Key Architecture Decisions:**
- Phaser handles game logic, React handles UI
- Communication via Phaser events (scene.events.emit/on)
- localStorage for persistence (high scores, settings)
- Scene-based architecture (Menu, Main, GameOver)
- Manager classes separate concerns (Word, Obstacle, Score, Difficulty, Audio)
- Graphics objects for simple visuals (no asset loading needed)

**Common Pitfalls to Avoid:**
- Not cleaning up tweens/timers when scenes change
- Creating multiple Phaser.Game instances
- Forgetting to destroy objects when off-screen
- Not clamping player lane index
- Skipping JustDown check (causes key repeat issues)
- Not handling React component unmounting properly

**Code Style Guidelines:**
- Use TypeScript strict mode
- Prefer readonly properties where possible
- Document public methods with JSDoc
- Keep game objects focused (single responsibility)
- Extract magic numbers to constants
- Use Phaser's built-in math utilities (Clamp, Between, etc.)

**Testing Approach:**
- Manual playtesting for each phase
- Browser console for errors/warnings
- Chrome DevTools Performance tab for profiling
- React DevTools for component hierarchy
- localStorage inspection for persistence

---

## Summary

This plan provides a complete roadmap from empty repository to fully functional game. Each phase builds on the previous, with clear files to create/modify, specific functions to implement, and concrete test strategies. The plan prioritizes getting a playable MVP quickly (Phases 1-7), then adding polish and content (Phases 8-12), and finally optional enhancements (Phases 13-14).

The architecture leverages modern tools (Vite, React 18, TypeScript, Phaser 3) and follows best practices for game development, state management, and performance optimization. The subdued pastel visual style and educational word-reading mechanic differentiate this from typical endless runners.

Total estimated implementation time: 40-60 hours for full completion, with playable MVP achievable in 15-20 hours (Phases 1-7).
