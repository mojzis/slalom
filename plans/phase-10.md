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
