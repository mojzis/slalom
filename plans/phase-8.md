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
