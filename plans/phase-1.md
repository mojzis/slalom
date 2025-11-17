### Phase 1: Project Initialization & Scaffolding

**Goal:** Set up the foundational project structure with Vite, React, TypeScript, and Phaser 3. Create the basic file structure and ensure the development environment runs.

**Files to create:**
- `package.json` - Project manifest with dependencies
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Vite build configuration
- `index.html` - HTML entry point
- `src/main.tsx` - React entry point
- `src/App.tsx` - Root React component
- `src/vite-env.d.ts` - Vite type declarations
- `.gitignore` - Ignore node_modules, dist, etc.

**package.json structure:**
```json
{
  "name": "word-reader-downhill",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "phaser": "^3.80.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "typescript": "^5.5.0",
    "vite": "^5.4.0"
  }
}
```

**tsconfig.json key settings:**
- `"target": "ES2020"`
- `"module": "ESNext"`
- `"lib": ["ES2020", "DOM", "DOM.Iterable"]`
- `"jsx": "react-jsx"`
- `"strict": true`
- `"moduleResolution": "bundler"`

**vite.config.ts configuration:**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  }
})
```

**Dependencies:**
- None (first phase)

**Test strategy:**
- Run `npm install` successfully
- Run `npm run dev` and verify Vite dev server starts
- Access http://localhost:3000 and see React app render
- Verify TypeScript compilation works with no errors
- Check hot module replacement (HMR) works

**Potential risks:**
- Version conflicts between dependencies
- Node.js version compatibility (need Node 18+)
- Port 3000 already in use
