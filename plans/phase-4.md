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
