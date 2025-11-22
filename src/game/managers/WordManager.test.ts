import { describe, it, expect, vi, beforeEach } from 'vitest';
import WordManager from './WordManager';

// Mock Phaser
vi.mock('phaser', () => ({
  default: {
    Utils: {
      Array: {
        GetRandom: vi.fn((arr) => arr[0]),
      },
    },
  },
}));

describe('WordManager', () => {
  let wordManager: WordManager;

  beforeEach(() => {
    wordManager = new WordManager();
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('initializes with empty recent words', () => {
      expect(wordManager.recentWords).toEqual([]);
      expect(wordManager.maxRecentWords).toBe(5);
    });
  });

  describe('getWordForObstacle', () => {
    it('returns a word for rock obstacle', () => {
      const word = wordManager.getWordForObstacle('rock');
      expect(word).toBeDefined();
      expect(typeof word).toBe('string');
    });

    it('returns a word for tree obstacle', () => {
      const word = wordManager.getWordForObstacle('tree');
      expect(word).toBeDefined();
    });

    it('returns a word for gap obstacle', () => {
      const word = wordManager.getWordForObstacle('gap');
      expect(word).toBeDefined();
    });

    it('returns fallback word for unknown obstacle type', () => {
      const word = wordManager.getWordForObstacle('unknown' as any);
      expect(word).toBe('WATCH');
    });
  });

  describe('markWordUsed', () => {
    it('adds word to recent words', () => {
      wordManager.markWordUsed('TEST');
      expect(wordManager.recentWords).toContain('TEST');
    });

    it('limits recent words to maxRecentWords', () => {
      for (let i = 0; i < 7; i++) {
        wordManager.markWordUsed(`WORD${i}`);
      }
      expect(wordManager.recentWords.length).toBe(5);
      expect(wordManager.recentWords).not.toContain('WORD0');
      expect(wordManager.recentWords).not.toContain('WORD1');
    });
  });

  describe('generatePair', () => {
    it('generates a sign-obstacle pair', () => {
      const pair = wordManager.generatePair('rock', 1, 200);

      expect(pair).toHaveProperty('word');
      expect(pair.obstacleType).toBe('rock');
      expect(pair.lane).toBe(1);
      expect(pair.obstacleY).toBe(200);
      expect(pair.signY).toBe(500); // 200 + 300
    });

    it('calculates correct signY position', () => {
      const pair = wordManager.generatePair('tree', 0, 500);
      expect(pair.signY).toBe(800); // 500 + 300
    });
  });

  describe('reset', () => {
    it('clears recent words', () => {
      wordManager.markWordUsed('TEST1');
      wordManager.markWordUsed('TEST2');
      expect(wordManager.recentWords.length).toBe(2);

      wordManager.reset();
      expect(wordManager.recentWords).toEqual([]);
    });
  });
});
