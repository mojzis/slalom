# Slalom Game Development

This is a browser-based game project.

## Development Workflow

### For Large Implementations

When implementing major features or doing initial project setup, use the multi-agent workflow to prevent context exhaustion:

**Option 1: Use the skill (recommended)**
```
User: "Implement the plan in plans/[feature].md using the multi-agent workflow"
```

**Option 2: Reference the guide**
Follow the detailed instructions in `plans/multi-agent-workflow-guide.md`

### For Normal Development

Standard conversation-based development is fine for:
- Bug fixes
- Small feature additions
- Code exploration
- Questions about the codebase

## Project Structure

- `plans/` - High-level feature plans and detailed implementation plans (optional)
- `logs/` - Agent outputs (test results, reviews, summaries) (optional)
- `src/` - Source code
  - `src/game/` - Phaser game code
    - `src/game/scenes/` - Game scenes (MainScene, MenuScene, GameOverScene, HelpScene)
    - `src/game/objects/` - Game objects (Player, Obstacle, Sign, Background, Lane)
    - `src/game/managers/` - Game managers (ObstacleManager, ScoreManager, DifficultyManager, WordManager)
    - `src/game/config.ts` - Game configuration
  - `src/components/` - React components (PhaserGame, GameOverlay)
  - `src/data/` - Data files (wordLists, theme)
  - `src/test/` - Test setup files
  - `src/main.tsx` - React entry point
  - `src/App.tsx` - Main React app component

## Quick Start for New Features

1. Create a high-level plan in `plans/feature-name-plan.md`
2. Invoke the multi-agent workflow
3. The planner agent will create `plans/detailed-plan.md`
4. Coder/tester/reviewer agents will implement iteratively
5. Check `logs/` for test results and reviews
6. Final summary in `logs/completion-summary.md`

## Testing Requirements

- All new features **must** have tests
- Tests **must** pass before the feature is considered complete
- If you're at risk of losing work, it's acceptable to push first with failing tests, but then immediately fix the tests and push again with green tests

## Technology Stack

- **Frontend Framework**: React 19 + TypeScript
- **Game Engine**: Phaser 3.90
- **Build Tool**: Vite 7
- **Testing**: Vitest + React Testing Library
- **Package Manager**: npm

### Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production (runs TypeScript compiler + Vite build)
- `npm run preview` - Preview production build
- `npm test` - Run tests once
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

## Game Architecture

This is a word-reading skiing game where the player:
1. Controls a skier moving down slopes in lanes
2. Reads word signs that appear before obstacles
3. Avoids obstacles (rocks, trees, gaps, branches, ice)
4. Progresses through difficulty tiers with increasing speed and more lanes

### Key Classes

- **MainScene** (`src/game/scenes/MainScene.ts`) - Main game loop and scene management
- **Player** (`src/game/objects/Player.ts`) - Skier character with lane movement
- **Obstacle** (`src/game/objects/Obstacle.ts`) - Game obstacles with collision detection
- **Sign** (`src/game/objects/Sign.ts`) - Word signs that appear before obstacles
- **ObstacleManager** (`src/game/managers/ObstacleManager.ts`) - Spawns and manages obstacles
- **DifficultyManager** (`src/game/managers/DifficultyManager.ts`) - Handles difficulty progression
- **WordManager** (`src/game/managers/WordManager.ts`) - Manages word selection for signs
