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
