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
