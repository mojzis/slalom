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
