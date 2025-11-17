# Detailed Implementation Plan: Phase 1

## Phase Goal

Set up the foundational project structure with Vite, React, TypeScript, and Phaser 3. Create the basic file structure and ensure the development environment runs successfully.

## Context from Previous Phase

**NOTE:** This is Phase 1 - no previous phase exists. This is a greenfield project with no existing source code.

## Context for Next Phase

**What Phase 2 needs from us:**

Phase 2 will integrate Phaser 3 with React and create the first game scene. They need:
- A working React application running on Vite dev server (port 3000)
- All npm packages installed (react, react-dom, phaser, TypeScript, vite)
- Hot Module Replacement (HMR) functioning correctly
- TypeScript compilation working with no errors
- Basic React app structure (src/main.tsx, src/App.tsx) ready for Phaser component integration

**Outputs we must provide:**
- `src/App.tsx` - Root React component that Phase 2 will modify to import PhaserGame
- `src/main.tsx` - React entry point with proper DOM mounting
- `index.html` - HTML entry with proper div#root for React mounting
- Working `npm run dev` command that starts development server
- TypeScript environment configured for React JSX and ES2020

## Current Codebase State

**Existing files:**
- `.claude/` - Project instructions and configuration (already present)
- `plans/` - Phase plans directory (already present)
- `logs/` - Agent output directory (already present)
- `.git/` - Git repository initialized (already present)

**No source files exist yet** - completely greenfield implementation.

**Environment verified:**
- Node.js: v22.21.1 ✅ (exceeds required v18+)
- npm: v10.9.4 ✅
- Git: Repository initialized on branch `claude/slalom-multi-agent-workflow-01BCKJswt6zGhxj2W7XBVmTj`

**Dependencies:**
- None (this is the foundational phase)

**Architecture patterns:**
- Standard Vite + React + TypeScript structure
- ES modules (type: "module" in package.json)
- Bundler module resolution for optimal Vite compatibility

## Implementation Steps

### Step 1: Create package.json with all dependencies

**Goal:** Define project manifest with all required dependencies and scripts

**Files to create:**
- `/home/user/slalom/package.json` - New file

**Specific changes:**

#### /home/user/slalom/package.json (new file)
Create complete package.json with:
- **name**: "word-reader-downhill"
- **version**: "0.1.0"
- **type**: "module" (critical for Vite ES modules)
- **scripts**:
  - `dev`: "vite" (starts dev server)
  - `build`: "tsc && vite build" (type-check then build)
  - `preview`: "vite preview" (preview production build)
- **dependencies**:
  - react: ^18.3.0
  - react-dom: ^18.3.0
  - phaser: ^3.80.0
- **devDependencies**:
  - @types/react: ^18.3.0
  - @types/react-dom: ^18.3.0
  - @vitejs/plugin-react: ^4.3.0
  - typescript: ^5.5.0
  - vite: ^5.4.0

Use exact structure from phase-1.md lines 16-38.

**Dependencies:**
- None

**Test strategy:**
- File must be valid JSON (no syntax errors)
- Run `npm install` to verify package.json is valid
- Check that node_modules/ directory is created
- Verify package-lock.json is generated

### Step 2: Create TypeScript configuration

**Goal:** Configure TypeScript for React JSX compilation with strict type checking

**Files to create:**
- `/home/user/slalom/tsconfig.json` - New file

**Specific changes:**

#### /home/user/slalom/tsconfig.json (new file)
Create TypeScript configuration with:
- **compilerOptions**:
  - `target`: "ES2020" (modern JavaScript)
  - `useDefineForClassFields`: true
  - `lib`: ["ES2020", "DOM", "DOM.Iterable"]
  - `module`: "ESNext"
  - `skipLibCheck`: true
  - **Bundler mode:**
    - `moduleResolution`: "bundler"
    - `allowImportingTsExtensions`: true
    - `isolatedModules`: true
    - `moduleDetection`: "force"
    - `noEmit`: true (Vite handles compilation)
  - **JSX:**
    - `jsx`: "react-jsx" (React 18+ automatic JSX)
  - **Linting:**
    - `strict`: true
    - `noUnusedLocals`: true
    - `noUnusedParameters`: true
    - `noFallthroughCasesInSwitch`: true
- **include**: ["src"]

This configuration follows Vite + React best practices for bundler-based module resolution.

**Dependencies:**
- typescript package (installed in Step 1)

**Test strategy:**
- File must be valid JSON
- TypeScript compiler should accept this configuration
- Later steps will verify compilation works with React code

### Step 3: Create Vite configuration with React plugin

**Goal:** Configure Vite build tool with React support and custom port

**Files to create:**
- `/home/user/slalom/vite.config.ts` - New file

**Specific changes:**

#### /home/user/slalom/vite.config.ts (new file)
Create Vite configuration:
- Import `defineConfig` from 'vite'
- Import `react` plugin from '@vitejs/plugin-react'
- Export default config with:
  - `plugins`: [react()] (enables React Fast Refresh)
  - `server.port`: 3000 (custom port for development)

Use exact structure from phase-1.md lines 49-60.

**Dependencies:**
- vite package (installed in Step 1)
- @vitejs/plugin-react package (installed in Step 1)

**Test strategy:**
- TypeScript should compile this file without errors
- Vite dev server should start using this configuration
- Port 3000 should be used (verified by server startup message)

### Step 4: Create HTML entry point

**Goal:** Create HTML file that loads Vite and provides React mounting point

**Files to create:**
- `/home/user/slalom/index.html` - New file

**Specific changes:**

#### /home/user/slalom/index.html (new file)
Create HTML5 document:
- **DOCTYPE**: HTML5
- **html lang**: "en"
- **head**:
  - `<meta charset="UTF-8">`
  - `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
  - `<title>Word Reader Downhill</title>`
- **body**:
  - `<div id="root"></div>` (React mounting point)
  - `<script type="module" src="/src/main.tsx"></script>` (Vite entry)

**Important:** The script tag must use `type="module"` for Vite to process it correctly.

**Dependencies:**
- None (standalone HTML file)

**Test strategy:**
- HTML should be valid HTML5
- Vite should recognize /src/main.tsx as entry point
- Browser should load page without HTML parse errors

### Step 5: Create Vite environment type declarations

**Goal:** Provide TypeScript declarations for Vite client APIs

**Files to create:**
- `/home/user/slalom/src/vite-env.d.ts` - New file

**Specific changes:**

#### /home/user/slalom/src/vite-env.d.ts (new file)
Create TypeScript declaration file with single line:
```typescript
/// <reference types="vite/client" />
```

This enables TypeScript IntelliSense for Vite-specific imports like `import.meta.env`.

**Dependencies:**
- vite package types (installed in Step 1)

**Test strategy:**
- TypeScript compiler should recognize Vite types
- No TypeScript errors when using `import.meta.env` in code

### Step 6: Create React entry point

**Goal:** Initialize React application and mount to DOM

**Files to create:**
- `/home/user/slalom/src/main.tsx` - New file

**Specific changes:**

#### /home/user/slalom/src/main.tsx (new file)
Create React initialization:
- Import React from 'react'
- Import ReactDOM from 'react-dom/client'
- Import App component from './App.tsx'
- Import './index.css' (optional, for global styles)
- Call `ReactDOM.createRoot(document.getElementById('root')!)`:
  - Use non-null assertion since we know root exists in index.html
  - Call `.render(<React.StrictMode><App /></React.StrictMode>)`
  - StrictMode enables development warnings

Standard React 18 initialization pattern with createRoot API.

**Dependencies:**
- react, react-dom packages (installed in Step 1)
- App component (created in Step 7)

**Test strategy:**
- TypeScript should compile without errors
- Browser console should show React is running
- No errors about missing root element
- React DevTools should show app in StrictMode

### Step 7: Create root App component

**Goal:** Create minimal React component that Phase 2 can extend

**Files to create:**
- `/home/user/slalom/src/App.tsx` - New file

**Specific changes:**

#### /home/user/slalom/src/App.tsx (new file)
Create functional component:
- Import React (implicit with jsx transform)
- Export default function `App()`
- Return JSX:
  - Container `<div>` with className="app-container"
  - `<h1>Word Reader Downhill</h1>`
  - `<p>Game initializing...</p>`
  - Placeholder comment: `{/* Phaser game will be mounted here in Phase 2 */}`

**Why this structure:**
- Simple enough to verify React is working
- Container div ready for Phase 2 to add PhaserGame component
- Clear visual feedback that app loaded

**What Phase 2 will do:**
- Import PhaserGame component
- Replace placeholder with `<PhaserGame />` inside container
- May add additional layout structure

**Dependencies:**
- React (installed in Step 1)

**Test strategy:**
- Component renders without errors
- H1 and paragraph text visible in browser
- React DevTools shows App component in tree

### Step 8: Create .gitignore file

**Goal:** Prevent committing build artifacts and dependencies

**Files to create:**
- `/home/user/slalom/.gitignore` - New file

**Specific changes:**

#### /home/user/slalom/.gitignore (new file)
Add standard Node.js and Vite ignore patterns:
```
# Dependencies
node_modules/

# Build outputs
dist/
dist-ssr/
*.local

# Environment files
.env
.env.local
.env.*.local

# Editor directories
.vscode/
.idea/
*.swp
*.swo
*~

# OS files
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*
```

**Dependencies:**
- None (Git configuration file)

**Test strategy:**
- Verify node_modules/ is not shown in `git status`
- Verify dist/ is not shown in `git status` after build
- File should prevent accidental commits of build artifacts

### Step 9: Create optional index.css for basic styling

**Goal:** Provide minimal CSS reset and container styling

**Files to create:**
- `/home/user/slalom/src/index.css` - New file

**Specific changes:**

#### /home/user/slalom/src/index.css (new file)
Create minimal CSS:
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(to bottom, #E1F5FE, #F7E6F2);
}

#root {
  width: 100%;
  min-height: 100vh;
}
```

**Why this matters:**
- CSS reset prevents browser inconsistencies
- Flexbox centering makes initial app look polished
- Background gradient matches theme from Phase 2's theme.ts
- Sets foundation for Phaser canvas container styling

**Dependencies:**
- None (CSS file)

**Test strategy:**
- Styles applied correctly in browser
- Content centered on page
- Gradient background visible

### Step 10: Run npm install and verify environment

**Goal:** Install all dependencies and verify everything works

**Commands to run:**
1. `npm install` - Install all packages
2. `npm run dev` - Start development server
3. Access http://localhost:3000 - Verify app loads

**Expected results:**
- npm install completes without errors
- node_modules/ contains ~200+ packages
- package-lock.json generated
- Dev server starts on port 3000
- Browser shows "Word Reader Downhill" heading
- No console errors
- HMR works (edit App.tsx, see changes without refresh)

**Verification checklist:**
- [ ] npm install succeeds
- [ ] No peer dependency warnings
- [ ] Dev server starts on correct port
- [ ] React app renders in browser
- [ ] TypeScript compilation has no errors
- [ ] HMR works when editing files
- [ ] Browser console shows no errors

**If errors occur:**
- Port 3000 in use: Change vite.config.ts port or kill existing process
- TypeScript errors: Review tsconfig.json settings
- Module resolution errors: Verify package.json "type": "module"
- React not rendering: Check index.html root div and script tag

**Dependencies:**
- All previous steps completed successfully

**Test strategy:**
- Manual verification by running commands
- Visual confirmation in browser
- Check browser console for errors
- Test HMR by editing App.tsx

## Potential Risks

### 1. Port 3000 Already in Use
**Risk:** Another process is using port 3000, preventing Vite dev server from starting.

**Mitigation:**
- Error message will clearly indicate port conflict
- Coder can change port in vite.config.ts (e.g., 3001, 5173)
- Or run `lsof -ti:3000 | xargs kill` to free the port

### 2. Node.js Version Compatibility
**Risk:** Despite checking v22.21.1 is available, there could be version-specific issues.

**Mitigation:**
- We verified Node v22 is available (exceeds v18+ requirement)
- All dependencies specify compatible version ranges
- Very unlikely to encounter issues

### 3. Dependency Version Conflicts
**Risk:** npm might install incompatible versions or show peer dependency warnings.

**Mitigation:**
- Using caret ranges (^) allows patch and minor updates
- Versions specified are tested and compatible
- If warnings occur, they're typically non-blocking

### 4. TypeScript Compilation Errors
**Risk:** tsconfig.json settings might cause unexpected errors with React/Vite.

**Mitigation:**
- Configuration follows official Vite + React template
- Bundler mode is correct for Vite 5
- `noEmit: true` prevents conflicts with Vite's compiler

### 5. React StrictMode Development Warnings
**Risk:** StrictMode may cause double-rendering warnings in console.

**Impact:** This is expected behavior in development, not a blocker.

**Note:** Phase 2 will need to handle Phaser cleanup properly due to StrictMode.

### 6. Missing src Directory
**Risk:** Coder might create files before creating src/ directory.

**Mitigation:**
- Explicit step ordering (src/vite-env.d.ts is Step 5)
- Directory will be created automatically when first file is written

## Success Criteria

Phase 1 is complete when all checkboxes are verified:

### Files Created
- [ ] `/home/user/slalom/package.json` exists with correct dependencies
- [ ] `/home/user/slalom/tsconfig.json` exists with bundler config
- [ ] `/home/user/slalom/vite.config.ts` exists with React plugin
- [ ] `/home/user/slalom/index.html` exists with root div
- [ ] `/home/user/slalom/.gitignore` exists with node_modules
- [ ] `/home/user/slalom/src/vite-env.d.ts` exists with Vite types
- [ ] `/home/user/slalom/src/main.tsx` exists with React initialization
- [ ] `/home/user/slalom/src/App.tsx` exists with placeholder component
- [ ] `/home/user/slalom/src/index.css` exists with basic styles

### Installation Success
- [ ] `npm install` completes without errors
- [ ] `node_modules/` directory created (not committed)
- [ ] `package-lock.json` generated

### Development Server
- [ ] `npm run dev` starts Vite dev server
- [ ] Server runs on http://localhost:3000
- [ ] No compilation errors in terminal
- [ ] TypeScript compilation succeeds

### Browser Verification
- [ ] Accessing http://localhost:3000 shows React app
- [ ] Page displays "Word Reader Downhill" heading
- [ ] Page displays "Game initializing..." text
- [ ] Gradient background visible (light blue to light pink)
- [ ] Browser console has no errors
- [ ] React DevTools shows App component in StrictMode

### Hot Module Replacement
- [ ] Edit src/App.tsx (change heading text)
- [ ] Browser updates WITHOUT full page refresh
- [ ] Changes appear within 1-2 seconds
- [ ] HMR indicator briefly appears in browser

### Build Test (Optional but Recommended)
- [ ] `npm run build` completes successfully
- [ ] `dist/` directory created with production build
- [ ] `dist/index.html` exists
- [ ] `dist/assets/` contains bundled JS and CSS

### Ready for Phase 2
- [ ] All above criteria met
- [ ] No blocking errors or warnings
- [ ] Codebase ready for Phaser integration
- [ ] src/App.tsx ready to import and render PhaserGame component

## Notes for Implementation

**File creation order matters:**
1. Create package.json first (needed for npm install)
2. Create tsconfig.json and vite.config.ts (config files)
3. Create index.html (HTML entry)
4. Create src/ files (vite-env.d.ts, main.tsx, App.tsx, index.css)
5. Create .gitignore last (after node_modules exists)

**For coder agent:**
- You can create multiple files in parallel if using Write tool multiple times
- Run `npm install` only after package.json exists
- Don't run `npm run dev` until all files are created
- Check terminal output carefully for errors

**For tester agent:**
- Manual verification is required (dev server, browser)
- Automated tests not applicable for this phase
- Visual confirmation is the primary test strategy
- HMR test requires editing a file and observing browser

**For reviewer agent:**
- Verify exact file structure matches plan
- Check all files have correct content
- Ensure no extra files were created unnecessarily
- Validate package.json dependencies match specification
