import '@testing-library/jest-dom'
import { vi } from 'vitest'
import { createElement } from 'react'

// Mock PhaserGame component to avoid canvas/WebGL issues in jsdom
vi.mock('../components/PhaserGame', () => ({
  default: () => createElement('div', { 'data-testid': 'phaser-game-mock' }, 'Game Canvas'),
  getGameInstance: () => null,
}))
