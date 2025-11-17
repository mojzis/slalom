# Word-Reading Downhill Game Prototype

## Game Concept

An endless-runner style downhill skiing/sledding game where the player must read and respond to single-word signs to avoid obstacles and hazards. Reading comprehension under time pressure is the core mechanic - miss a sign and you crash. The game features a distinctive visual style with gentle, thin-line aesthetics and subdued pastel tones.

Think: Tux Racer meets Duolingo, but for early readers practicing sight words and action verbs under pressure.

## Core Mechanics

### Movement
- Auto-scroll downhill (constant forward momentum)
- Left/Right lane switching (3-5 lanes)
- Speed increases gradually as player progresses
- No jumping - pure lateral movement decisions

### Word Signs
- Appear 3-5 seconds before obstacle/hazard
- Single word commands or warnings
- Must be read and acted upon to survive
- Signs fade/disappear after passing decision point

### Sign Types & Actions

**Directional Commands:**
- "LEFT" - move to left lane(s)
- "RIGHT" - move to right lane(s)
- "CENTER" - move to middle lane
- "STAY" - don't move from current position

**Hazard Warnings:**
- "ROCKS" - rocks appear in certain lanes
- "TREE" - tree obstacle ahead
- "ICE" - slippery patch (harder to control)
- "GAP" - missing track section
- "BRANCH" - low-hanging branch

**Action Modifiers:**
- "SLOW" - speed bump ahead (auto-slows)
- "FAST" - speed boost zone
- "JUMP" - launch ramp (automatic)
- "DUCK" - tunnel/low clearance

### Failure States
- Hit obstacle = crash and restart
- Wrong lane after sign = crash
- Ignore directional sign = crash
- 3 strikes system for warnings vs instant failure

### Progression
- Endless mode: see how far you can go
- Score based on distance traveled
- Speed increases every 500m
- Sign complexity increases (compound words later)
- More signs appear simultaneously at higher levels

## Technical Architecture

### Modern Tech Stack (2025)

**Core Framework:**
- **Phaser 3** - Battle-tested HTML5 game framework with WebGL/Canvas rendering
- **React 18+** - UI layer (menus, HUD, settings)
- **TypeScript** - Type safety and better developer experience
- **Vite** - Lightning-fast build tool and dev server

**Why Phaser 3?**
- Complete game framework (physics, scenes, sprites, collision built-in)
- Official React + TypeScript template available
- Excellent performance with WebGL acceleration
- Large community (37.8k+ GitHub stars)
- Perfect for 2D games like ours
- Built-in text rendering, tweens, and particle effects

### Project Structure
```
word-reader-downhill/
├── src/
│   ├── App.tsx                       # React root component
│   ├── components/
│   │   ├── PhaserGame.tsx            # Phaser container component
│   │   ├── MainMenu.tsx              # Start screen UI (React)
│   │   ├── GameOverlay.tsx           # HUD overlay (React)
│   │   └── Settings.tsx              # Difficulty/speed settings
│   ├── game/
│   │   ├── scenes/
│   │   │   ├── MainScene.ts          # Primary game scene
│   │   │   ├── MenuScene.ts          # Menu scene
│   │   │   └── GameOverScene.ts      # Results scene
│   │   ├── objects/
│   │   │   ├── Player.ts             # Phaser Sprite - skier character
│   │   │   ├── Sign.ts               # Phaser Text - word signs
│   │   │   ├── Obstacle.ts           # Phaser Sprite - hazards
│   │   │   └── Lane.ts               # Lane positioning logic
│   │   ├── managers/
│   │   │   ├── WordManager.ts        # Sign generation & logic
│   │   │   ├── ScoreManager.ts       # Distance/score tracking
│   │   │   └── DifficultyManager.ts  # Scaling logic
│   │   └── config.ts                 # Phaser game configuration
│   ├── data/
│   │   ├── wordLists.ts              # Categorized word lists
│   │   └── theme.ts                  # Color palette & styles
│   └── main.tsx                      # App entry point
├── public/
│   └── assets/                       # Optional: images, fonts
├── package.json
├── vite.config.ts
└── tsconfig.json
```

### Phaser Scene System (MainScene.ts)

**Scene Lifecycle:**
- `init()` - Initialize scene data
- `preload()` - Load assets (fonts, textures if needed)
- `create()` - Set up game objects, physics, input
- `update(time, delta)` - Game loop (called ~60fps)

**Main Scene Responsibilities:**
- Auto-scroll management (vertical camera movement)
- Player sprite and lane-switching logic
- Sign spawning based on upcoming obstacles
- Obstacle generation and pooling
- Collision detection (overlap between player and obstacles)
- Score/distance tracking

**Key Phaser Features Used:**
- `this.add.text()` - For word signs with custom styling
- `this.add.sprite()` or `this.add.graphics()` - For player/obstacles
- `this.physics.add.overlap()` - Collision detection
- `this.tweens.add()` - Smooth lane transitions and sign animations
- `this.cameras.main.scrollY` - Auto-scroll effect
- `this.input.keyboard` - Arrow key handling

### Game Objects (Phaser-based)

**Player (extends Phaser.GameObjects.Sprite):**
```typescript
class Player extends Phaser.GameObjects.Sprite {
  currentLane: number;      // 0-4 index
  targetLane: number;       // For smooth transitions
  isTransitioning: boolean; // Lane change in progress

  moveToLane(lane: number) {
    // Uses Phaser tweens for smooth movement
  }

  crash() {
    // Trigger crash animation and game over
  }
}
```

**Sign (extends Phaser.GameObjects.Text):**
```typescript
class Sign extends Phaser.GameObjects.Text {
  word: string;              // The word to display
  relatedObstacle: Obstacle; // Linked obstacle
  spawnDistance: number;     // When to appear

  fadeIn() {
    // Phaser tween for fade animation
  }

  checkVisibility(playerY: number) {
    // Show/hide based on player position
  }
}
```

**Obstacle (extends Phaser.GameObjects.Sprite):**
```typescript
class Obstacle extends Phaser.GameObjects.Sprite {
  lane: number;              // Which lane (0-4)
  type: string;              // 'rock', 'tree', 'gap', etc.
  yPosition: number;         // Distance down track

  checkCollision(player: Player): boolean {
    // Lane-based collision (simple)
  }
}
```

### Lane System

**Implementation:**
- Static lane x-positions calculated on scene creation
- 3 lanes initially: [centerX - 150, centerX, centerX + 150]
- 5 lanes at higher speeds: [x - 300, x - 150, x, x + 150, x + 300]
- Phaser tweens handle smooth transitions (200ms duration, ease 'Power2')

**Lane Highlighting:**
- Draw subtle rectangles under lanes when sign appears
- Fade in/out using Phaser alpha tweens

### Word Manager (TypeScript class)

**Responsibilities:**
- Maintains word pools by difficulty tier
- Generates sign-obstacle pairs
- Anti-repeat logic (last 5 words tracked)
- Contextual pairing rules
- Difficulty progression

**Interface:**
```typescript
interface SignObstaclePair {
  word: string;
  obstacleType: string;
  lane: number;
  distance: number;
}

class WordManager {
  getNextPair(currentDistance: number): SignObstaclePair;
  getCurrentDifficulty(): DifficultyTier;
  markWordSeen(word: string): void;
  markWordMissed(word: string): void;
}
```

## Visual Design

### Color Palette

**Primary Palette (Subdued Pastels):**
- Sky gradient: `#E1F5FE` → `#F7E6F2` (light blue to soft lavender)
- Snow/ground: `#F5F5F0` (warm off-white)
- Track lines: `#D4D4C8` (soft gray-beige)

**Character & Objects (Gentle Accents):**
- Player outline: `#8FA9B8` (dusty blue-gray)
- Tree obstacles: `#B8C4B8` (sage green)
- Rock obstacles: `#C9B8AD` (soft taupe)
- Warning signs: `#F4C8B8` (pale coral)
- Action signs: `#B8D4E8` (powder blue)

**Text & UI:**
- Sign text: `#4A5568` (charcoal gray)
- Score/distance: `#6B7280` (medium gray)
- Highlights: `#E8C4A8` (warm cream)

### Visual Style Guidelines

**Line Work:**
- 1-2px stroke width maximum
- Hand-drawn quality (subtle wobble)
- No thick outlines or bold strokes
- Minimal detail

**Shapes:**
- Simplified geometric forms
- Rounded corners everywhere
- No harsh angles
- Organic, gentle curves

**Typography:**
- Sans-serif, rounded (like Quicksand or Nunito)
- Generous letter spacing
- Minimum 48px for signs (readability at speed)
- Maximum 3-4 font weights (light, regular, semibold)

**Animation:**
- Smooth easing (no linear)
- Gentle fades (300-500ms)
- Subtle floating/bobbing on signs
- Minimal particle effects (small dots, not explosions)

**Background Elements:**
- Parallax layers (distant hills, trees)
- Muted colors (50% opacity max)
- Blurred/soft focus
- Thin line silhouettes only

## Word Lists & Content Strategy

### Word Categories

**Directional (Core Vocabulary):**
- LEFT, RIGHT, CENTER, MIDDLE, STAY
- UP, DOWN, OVER, UNDER
- TURN, STRAIGHT, CURVE

**Hazards (Nouns):**
- ROCK, TREE, BRANCH, LOG
- GAP, HOLE, CLIFF, DROP
- ICE, SNOW, MUD, WATER

**Actions (Verbs):**
- STOP, GO, SLOW, FAST
- JUMP, DUCK, DODGE, AVOID
- WAIT, WATCH, LOOK

**Modifiers (Adjectives/Adverbs):**
- BIG, SMALL, WIDE, NARROW
- CAREFUL, QUICK, SLOW
- SOON, NOW, NEXT

**Compound Phrases (Advanced):**
- "LEFT TREE" (tree on left, move right)
- "BIG GAP" (major obstacle ahead)
- "FAST RIGHT" (quick move to right)

### Word List Scaling

**Distance 0-500m (Beginner):**
- 8-10 unique words
- 1 syllable only
- High frequency sight words
- Single sign at a time
- 5-7 seconds reading time

**Distance 500-1500m (Intermediate):**
- 20-25 unique words
- 1-2 syllables
- Mix of nouns/verbs
- Occasional 2 signs (5+ seconds apart)
- 4-5 seconds reading time

**Distance 1500m+ (Advanced):**
- 40-50 unique words
- 1-3 syllables
- Compound phrases
- Multiple simultaneous signs
- 3-4 seconds reading time
- Unfamiliar words (vocabulary building)

### Word Variety Strategy

**Rotation System:**
- Pool of 100+ total words
- Active pool of 15-20 at current difficulty
- Swap out 3-5 words every 250m
- Track last 5 words shown, avoid repeating
- Prioritize words player struggled with (missed)

**Contextual Pairing:**
- Sign must match obstacle logically
- "TREE" sign → tree obstacle in lane
- "LEFT" sign → hazard in right lanes
- "DUCK" sign → low branch overhead
- "GAP" sign → missing track section

## Implementation Plan

### Phase 1: Project Setup
- Initialize Vite + React + TypeScript project
- Install Phaser 3 (`npm install phaser`)
- Set up basic React component structure
- Create Phaser game configuration (config.ts)
- Implement PhaserGame.tsx container component
- Set up basic MainScene with solid color background

### Phase 2: Core Game Loop
- Build MainScene with update() loop
- Implement auto-scroll (camera.scrollY increases over time)
- Create Lane positioning system (3 lanes initially)
- Build Player sprite with basic rendering (simple shapes via Graphics)
- Add keyboard input handling (arrow keys)
- Implement lane-switching with Phaser tweens

### Phase 3: Obstacle System
- Create Obstacle class (extends Sprite or Graphics)
- Implement basic obstacle types (rock, tree, gap)
- Build obstacle spawning system (spawn ahead of camera)
- Add lane-based collision detection (overlap checks)
- Implement crash state and game over
- Add obstacle pooling for performance

### Phase 4: Sign System
- Build Sign class (extends Text with custom styling)
- Implement sign spawning logic (before obstacles)
- Create sign-obstacle pairing system
- Add large text rendering with pastel backgrounds
- Implement fade-in/fade-out animations (tweens)
- Add sign timing based on scroll speed

### Phase 5: Word Management
- Create WordManager TypeScript class
- Build word list data structure (wordLists.ts)
- Implement difficulty tiers and scaling
- Add word rotation and anti-repeat logic
- Create contextual pairing rules
- Integrate with obstacle spawner

### Phase 6: Scoring & Progression
- Implement distance tracking (based on camera scroll)
- Add speed scaling (increases every 500m)
- Create DifficultyManager for tier transitions
- Build ScoreManager with localStorage persistence
- Create GameOverScene with results display
- Add React overlay for real-time HUD

### Phase 7: Visual Polish
- Refine color palette application (theme.ts)
- Add Phaser Graphics rendering for thin-line obstacles
- Implement parallax background layers (distant hills)
- Add particle effects for crashes (minimal, subtle)
- Create custom font loading (Google Fonts)
- Polish lane transition animations

### Phase 8: UI & Settings
- Build MainMenu React component
- Create Settings panel (speed, difficulty, sensitivity)
- Add pause functionality (spacebar)
- Implement tutorial overlay (first run)
- Add sound effects (optional, using Phaser.Sound)
- Create accessibility options

### Phase 9: Content Expansion
- Expand word lists to 100+ words
- Test and balance word-obstacle pairings
- Fine-tune difficulty curve progression
- Add compound phrases for advanced tier
- Create word introduction system
- Playtest with target age group

## Technical Considerations

### Performance
- **WebGL Rendering**: Phaser uses WebGL by default (fallback to Canvas)
- **Object Pooling**: Reuse obstacle/sign objects (Phaser Groups)
- **Efficient Culling**: Phaser automatically culls off-screen objects
- **Lazy Spawning**: Only spawn objects when entering camera view range
- **Asset Management**: Minimal assets (vector graphics via Phaser.Graphics)
- **Update Optimization**: Only check collisions for active obstacles

### Phaser-Specific Optimizations
- Use `Phaser.GameObjects.Group` for object pooling
- Enable `skipUpdate: true` for static background elements
- Use `setScrollFactor(0)` for fixed HUD elements
- Leverage `this.physics.world.collide()` instead of manual checks
- Cache frequently used calculations (lane positions)

### Accessibility
- High contrast text on signs (WCAG AA compliance)
- Minimum 48px font size for readability
- Color-blind friendly palette (tested with simulators)
- Keyboard-only controls (arrow keys, spacebar, enter)
- Adjustable speed settings (slow, normal, fast modes)
- Optional text-to-speech for signs (Web Speech API)

### State Management
- **React State**: UI layer (menu visibility, settings, high scores)
- **Phaser Registry**: Game state shared across scenes
- **Scene Data**: Pass data between scenes (score, distance)
- **localStorage**: Persistent high scores and settings
- **Event Emitters**: Communication between Phaser and React

**React-Phaser Bridge:**
```typescript
// Emit events from Phaser to React
this.events.emit('scoreUpdate', score);

// Listen in React component
useEffect(() => {
  const game = phaserRef.current;
  game.events.on('scoreUpdate', setScore);
  return () => game.events.off('scoreUpdate', setScore);
}, []);
```

### Input Handling
- **Phaser Input Plugin**: `this.input.keyboard.createCursorKeys()`
- **Arrow Keys**: Left/Right for lane switching
- **Spacebar**: Pause/unpause game
- **Enter**: Restart after game over
- **Touch Support**: Future - swipe gestures via Phaser touch input
- **Keyboard State Polling**: Check in update() loop for responsiveness

### Collision Detection
- **Lane-Based Logic**: Simple integer comparison (playerLane === obstacleLane)
- **Phaser Overlap**: `this.physics.add.overlap(player, obstacleGroup, crashHandler)`
- **Distance Check**: Only check obstacles within 50px of player Y position
- **Early Exit**: Stop checking after first collision detected
- **No Pixel-Perfect**: Unnecessary for our lane-based gameplay

**Collision Pseudo-code:**
```typescript
update() {
  this.obstacles.children.each((obstacle: Obstacle) => {
    if (Math.abs(obstacle.y - this.player.y) < 50) {
      if (obstacle.lane === this.player.currentLane) {
        this.handleCrash();
      }
    }
  });
}
```

## Content Design Notes

### Word Selection Criteria
- Age-appropriate (grades 1-3 target)
- High utility (useful across contexts)
- Clear visual pairing (tree → picture of tree)
- Phonetically regular (for decoding practice)
- Mix of familiar and stretch words

### Difficulty Balancing
- Start easy (build confidence)
- Gradual introduction of new words
- Repeat words in different contexts
- Increase speed before adding complexity
- Provide recovery time after difficult sections

### Educational Value
- Sight word recognition
- Rapid decoding practice
- Context clues (sign + visual obstacle)
- Vocabulary expansion
- Reading under time pressure (real-world skill)

## Future Expansion Ideas

**Advanced Features:**
- Multiple characters (unlockable)
- Different environments (forest, mountain, tundra)
- Weather effects (fog reduces visibility)
- Power-ups (slow time, shield)
- Reading comprehension questions at checkpoints

**Word Complexity:**
- Sentences ("Turn left now")
- Negation ("Don't go right")
- Comparatives ("Bigger gap ahead")
- Multiple steps ("Duck then jump")

**Multiplayer:**
- Two-player split screen
- Same obstacle course, who survives longer
- Cooperative (both must read different signs)

**Analytics:**
- Track which words cause most failures
- Measure reading speed improvement
- Generate practice word lists
- Parent/teacher dashboard

## Key Differences from Wild Wings

- **Perspective:** Top-down/isometric vs side-scrolling
- **Movement:** Lane-based vs free flight
- **Reading task:** Action-critical vs educational enrichment
- **Pacing:** Speed increases vs player-controlled
- **Failure:** Immediate crash vs gradual health loss
- **Art style:** Thin lines/pastels vs medium-weight/saturated
- **Word count:** 100+ words vs 3-5 bird facts
- **Complexity:** Simple mechanics/hard reading vs complex mechanics/easy reading

---

## Modern Tech Stack (2025)

### Core Dependencies
```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "phaser": "^3.80.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.0",
    "typescript": "^5.5.0",
    "vite": "^5.4.0"
  }
}
```

### Project Initialization
```bash
# Create new Vite + React + TypeScript project
npm create vite@latest word-reader-downhill -- --template react-ts
cd word-reader-downhill

# Install Phaser 3
npm install phaser

# Install dev dependencies (if not included)
npm install -D typescript @types/node

# Start development server
npm run dev
```

### Key Libraries & Tools
- **Phaser 3.80+** - Game framework (WebGL/Canvas rendering, physics, scenes)
- **React 18+** - UI layer (menus, overlays, settings)
- **TypeScript 5+** - Type safety and IntelliSense
- **Vite 5+** - Fast build tool with HMR (Hot Module Replacement)
- **localStorage** - Persistence (high scores, settings)
- **Google Fonts** - Typography (Quicksand or Nunito for rounded sans-serif)

### Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- WebGL 2.0 required (Canvas fallback available)

## Content Requirements

- **Words**: 100+ single words across 4 categories (directional, hazards, actions, modifiers)
- **Obstacle Types**: 10+ (rock, tree, gap, branch, ice, log, cliff, etc.)
- **Sign Styles**: 5+ visual variations (warning, action, directional, etc.)
- **Difficulty Tiers**: 3 (beginner, intermediate, advanced)
- **Color Palette**: 10-12 subdued pastel colors
- **Fonts**: 1-2 rounded sans-serif families (light, regular, semibold)

## Development Workflow

### Setup Phase
1. Initialize Vite + React + TypeScript
2. Install Phaser 3
3. Create basic project structure (scenes, objects, managers)
4. Set up Phaser config with pastels palette

### Core Loop Phase
5. Build MainScene with auto-scroll
6. Implement lane system and player movement
7. Add obstacles with collision detection
8. Create sign system with word pairing

### Content Phase
9. Build word lists (100+ words)
10. Implement difficulty scaling
11. Add scoring and progression
12. Create React UI (menu, game over, settings)

### Polish Phase
13. Refine visuals (thin lines, gentle animations)
14. Add parallax backgrounds
15. Implement sound effects (optional)
16. Playtest and balance difficulty

---

## Why This Stack?

**Phaser 3 vs Custom Canvas:**
- ✅ Built-in physics, collision, tweens, particles
- ✅ Scene management (no manual state routing)
- ✅ Massive community and documentation
- ✅ Performance optimized (WebGL acceleration)
- ✅ Official React integration examples

**TypeScript vs JavaScript:**
- ✅ Catch bugs at compile time
- ✅ Better IntelliSense and autocomplete
- ✅ Self-documenting code (interfaces, types)
- ✅ Easier refactoring as project grows

**Vite vs Create React App:**
- ✅ 10-100x faster dev server startup
- ✅ Instant HMR (Hot Module Replacement)
- ✅ Better tree-shaking and build optimization
- ✅ Modern tooling (ESBuild, Rollup)
- ✅ CRA is deprecated/unmaintained

---

## Quick Reference

**Start Development:**
```bash
npm run dev
```

**Build for Production:**
```bash
npm run build
```

**Preview Production Build:**
```bash
npm run preview
```

**Project Structure:**
- `src/game/scenes/` - Phaser scenes (MainScene, MenuScene, etc.)
- `src/game/objects/` - Game entities (Player, Obstacle, Sign)
- `src/game/managers/` - Logic systems (WordManager, ScoreManager)
- `src/components/` - React UI components
- `src/data/` - Static content (word lists, theme)

**Key Files:**
- `src/game/config.ts` - Phaser configuration
- `src/components/PhaserGame.tsx` - Phaser container component
- `src/game/scenes/MainScene.ts` - Primary game logic
- `src/data/wordLists.ts` - Word content
- `src/data/theme.ts` - Color palette

---

*Plan ready for modern prototyping - Phaser 3 handles the heavy lifting, allowing focus on word mechanics and gentle aesthetics.*
