import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Phaser to avoid canvas issues in jsdom
vi.mock('phaser', () => ({
  default: {},
  Game: vi.fn(),
  Scene: vi.fn(),
  AUTO: 'AUTO',
}))
