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
