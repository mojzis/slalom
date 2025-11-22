import Phaser from 'phaser';
import { OBSTACLE_WORDS } from '../../data/wordLists';
import { ObstacleType } from '../objects/Obstacle';

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

  constructor() {
    this.recentWords = [];
    this.maxRecentWords = 5;
  }

  getWordForObstacle(obstacleType: ObstacleType): string {
    const possibleWords = OBSTACLE_WORDS[obstacleType] || ['WATCH'];

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
