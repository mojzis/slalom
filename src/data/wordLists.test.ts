import { describe, it, expect } from 'vitest';
import {
  WORD_LISTS,
  OBSTACLE_WORDS,
  BEGINNER_WORDS,
  WORD_LISTS_BY_TIER
} from './wordLists';

describe('wordLists', () => {
  describe('WORD_LISTS', () => {
    it('contains directional words', () => {
      expect(WORD_LISTS.directional).toContain('LEFT');
      expect(WORD_LISTS.directional).toContain('RIGHT');
      expect(WORD_LISTS.directional).toContain('CENTER');
    });

    it('contains hazard words', () => {
      expect(WORD_LISTS.hazards).toContain('ROCK');
      expect(WORD_LISTS.hazards).toContain('TREE');
      expect(WORD_LISTS.hazards).toContain('GAP');
    });

    it('contains action words', () => {
      expect(WORD_LISTS.actions).toContain('SLOW');
      expect(WORD_LISTS.actions).toContain('FAST');
    });
  });

  describe('OBSTACLE_WORDS', () => {
    it('has words for rock obstacle', () => {
      expect(OBSTACLE_WORDS.rock).toBeDefined();
      expect(OBSTACLE_WORDS.rock.length).toBeGreaterThan(0);
      expect(OBSTACLE_WORDS.rock).toContain('ROCK');
    });

    it('has words for tree obstacle', () => {
      expect(OBSTACLE_WORDS.tree).toBeDefined();
      expect(OBSTACLE_WORDS.tree).toContain('TREE');
    });

    it('has words for gap obstacle', () => {
      expect(OBSTACLE_WORDS.gap).toBeDefined();
      expect(OBSTACLE_WORDS.gap).toContain('GAP');
    });

    it('has words for branch obstacle', () => {
      expect(OBSTACLE_WORDS.branch).toBeDefined();
      expect(OBSTACLE_WORDS.branch).toContain('BRANCH');
    });

    it('has words for ice obstacle', () => {
      expect(OBSTACLE_WORDS.ice).toBeDefined();
      expect(OBSTACLE_WORDS.ice).toContain('ICE');
    });
  });

  describe('BEGINNER_WORDS', () => {
    it('contains simple words', () => {
      expect(BEGINNER_WORDS).toContain('LEFT');
      expect(BEGINNER_WORDS).toContain('RIGHT');
      expect(BEGINNER_WORDS).toContain('TREE');
      expect(BEGINNER_WORDS).toContain('ROCK');
    });

    it('has appropriate number of words for beginners', () => {
      expect(BEGINNER_WORDS.length).toBeGreaterThanOrEqual(8);
    });
  });

  describe('WORD_LISTS_BY_TIER', () => {
    it('has beginner tier', () => {
      expect(WORD_LISTS_BY_TIER.beginner).toBeDefined();
      expect(WORD_LISTS_BY_TIER.beginner.directional).toBeDefined();
      expect(WORD_LISTS_BY_TIER.beginner.hazards).toBeDefined();
    });

    it('has intermediate tier with more words', () => {
      expect(WORD_LISTS_BY_TIER.intermediate).toBeDefined();
      expect(WORD_LISTS_BY_TIER.intermediate.actions.length)
        .toBeGreaterThan(WORD_LISTS_BY_TIER.beginner.actions.length);
    });

    it('has advanced tier with most words', () => {
      expect(WORD_LISTS_BY_TIER.advanced).toBeDefined();
      expect(WORD_LISTS_BY_TIER.advanced.hazards.length)
        .toBeGreaterThan(WORD_LISTS_BY_TIER.intermediate.hazards.length);
    });

    it('advanced tier has modifiers', () => {
      expect(WORD_LISTS_BY_TIER.advanced.modifiers).toBeDefined();
      expect(WORD_LISTS_BY_TIER.advanced.modifiers!.length).toBeGreaterThan(0);
    });
  });
});
