import Phaser from 'phaser';
import { OBSTACLE_WORDS, WORD_LISTS_BY_TIER } from '../../data/wordLists';
import { ObstacleType } from '../objects/Obstacle';
import { DifficultyTier } from './DifficultyManager';

export interface SignObstaclePair {
  word: string;
  obstacleType: ObstacleType;
  lane: number;
  obstacleY: number;
  signY: number;
}

export default class WordManager {
  recentWords: string[];
  maxRecentWords: number;
  private currentTier: DifficultyTier;

  constructor() {
    this.recentWords = [];
    this.maxRecentWords = 5;
    this.currentTier = DifficultyTier.BEGINNER;
  }

  setDifficulty(tier: DifficultyTier): void {
    this.currentTier = tier;
  }

  getWordForObstacle(obstacleType: ObstacleType): string {
    // Get base words for obstacle type
    let possibleWords = OBSTACLE_WORDS[obstacleType] || ['WATCH'];

    // Filter by current tier's word pool
    const tierWordList = WORD_LISTS_BY_TIER[this.currentTier];
    if (tierWordList) {
      const allTierWords = [
        ...(tierWordList.directional || []),
        ...(tierWordList.hazards || []),
        ...(tierWordList.actions || []),
        ...((tierWordList as Record<string, string[]>).modifiers || [])
      ];

      // Filter possible words to only include those in current tier
      const filteredWords = possibleWords.filter(word =>
        allTierWords.includes(word)
      );

      if (filteredWords.length > 0) {
        possibleWords = filteredWords;
      }
    }

    // Filter out recently used words
    const availableWords = possibleWords.filter(
      word => !this.recentWords.includes(word)
    );

    const selectedWord = availableWords.length > 0
      ? Phaser.Utils.Array.GetRandom(availableWords)
      : Phaser.Utils.Array.GetRandom(possibleWords);

    this.markWordUsed(selectedWord);
    return selectedWord;
  }

  markWordUsed(word: string): void {
    this.recentWords.push(word);
    if (this.recentWords.length > this.maxRecentWords) {
      this.recentWords.shift();
    }
  }

  generatePair(
    obstacleType: ObstacleType,
    lane: number,
    obstacleY: number
  ): SignObstaclePair {
    const word = this.getWordForObstacle(obstacleType);
    const signY = obstacleY + 300; // 300px before obstacle (since y increases downward relative to camera)

    return {
      word,
      obstacleType,
      lane,
      obstacleY,
      signY
    };
  }

  reset(): void {
    this.recentWords = [];
  }
}
