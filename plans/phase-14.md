### Phase 14: Testing, Bug Fixes & Optimization

**Goal:** Comprehensive testing across browsers, fix bugs, optimize performance, and prepare for deployment.

**Files to modify:**
- All files (bug fixes)
- `vite.config.ts` - Production optimization settings

**Testing checklist:**

**Browser Testing:**
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (macOS/iOS)
- [ ] Mobile browsers (iOS Safari, Chrome Android)

**Functionality Testing:**
- [ ] Lane switching works in all scenarios
- [ ] Collisions detected accurately
- [ ] Signs appear at correct distance
- [ ] Difficulty tiers transition smoothly
- [ ] High score saves and loads
- [ ] Settings persist across sessions
- [ ] Game restart clears state properly
- [ ] No memory leaks over long sessions

**Performance Testing:**
- [ ] 60fps maintained on target hardware
- [ ] Memory usage stable over 10+ minutes
- [ ] No frame drops during difficulty transitions
- [ ] Object pooling prevents garbage collection spikes
- [ ] Canvas renders at consistent resolution

**Accessibility Testing:**
- [ ] Keyboard-only navigation works
- [ ] Text contrast meets WCAG AA standards
- [ ] Font size readable on mobile devices
- [ ] Color-blind friendly palette
- [ ] Settings include accessibility options

**Modifications to vite.config.ts:**
```typescript
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'phaser': ['phaser'],
          'react-vendor': ['react', 'react-dom']
        }
      }
    }
  },
  server: {
    port: 3000
  }
});
```

**Common bugs to check:**
- Player stuck between lanes
- Obstacles spawning inside player
- Signs not fading out
- Multiple game instances running
- Tweens not completing
- Scene transitions failing
- localStorage quota exceeded
- Event listeners not cleaning up

**Performance optimizations:**
- Use object pooling for obstacles and signs
- Implement efficient culling (destroy off-screen objects)
- Cache frequently used calculations (lane positions)
- Use `setScrollFactor()` for static backgrounds
- Minimize Graphics object recreation
- Batch draw calls where possible
- Use sprite sheets if adding visual assets

**Dependencies:**
- Phase 13 complete (audio implemented)

**Test strategy:**
- Run game for 30+ minutes, monitor memory/CPU
- Test on low-end devices (older smartphones)
- Use browser DevTools performance profiler
- Check network tab for unnecessary requests
- Verify build output size is reasonable (<2MB)
- Test offline functionality (PWA potential)

**Potential risks:**
- Browser-specific bugs might be hard to reproduce
- Performance issues might only appear on specific devices
- Memory leaks might be subtle and hard to detect
- Production build might behave differently than dev
