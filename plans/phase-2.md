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
