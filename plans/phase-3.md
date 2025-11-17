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
