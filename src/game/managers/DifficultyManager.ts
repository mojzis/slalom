export enum DifficultyTier {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced'
}

export interface DifficultyConfig {
  tier: DifficultyTier;
  numLanes: number;
  spawnInterval: number;
  readingTime: number;
  wordPool: string[];
  maxSpeed: number;
}

export default class DifficultyManager {
  private _currentTier: DifficultyTier;

  constructor() {
    this._currentTier = DifficultyTier.BEGINNER;
  }

  get currentTier(): DifficultyTier {
    return this._currentTier;
  }

  getTierForDistance(distance: number): DifficultyTier {
    if (distance < 500) {
      return DifficultyTier.BEGINNER;
    } else if (distance < 1500) {
      return DifficultyTier.INTERMEDIATE;
    } else {
      return DifficultyTier.ADVANCED;
    }
  }

  getConfig(distance: number): DifficultyConfig {
    const tier = this.getTierForDistance(distance);

    switch (tier) {
      case DifficultyTier.BEGINNER:
        return {
          tier,
          numLanes: 3,
          spawnInterval: 250,
          readingTime: 5000,
          wordPool: ['LEFT', 'RIGHT', 'TREE', 'ROCK', 'GAP', 'STAY'],
          maxSpeed: 3.0
        };

      case DifficultyTier.INTERMEDIATE:
        return {
          tier,
          numLanes: 3,
          spawnInterval: 200,
          readingTime: 4000,
          wordPool: [
            'LEFT', 'RIGHT', 'CENTER', 'TREE', 'ROCK', 'GAP', 'BRANCH',
            'ICE', 'DUCK', 'JUMP', 'SLOW', 'FAST', 'AVOID', 'DODGE'
          ],
          maxSpeed: 4.5
        };

      case DifficultyTier.ADVANCED:
        return {
          tier,
          numLanes: 5,
          spawnInterval: 150,
          readingTime: 3000,
          wordPool: [
            'LEFT', 'RIGHT', 'CENTER', 'TREE', 'ROCK', 'GAP', 'BRANCH',
            'ICE', 'CLIFF', 'LOG', 'MUD', 'DUCK', 'JUMP', 'SLOW', 'FAST',
            'AVOID', 'DODGE', 'WATCH', 'CAREFUL', 'QUICK', 'BIG', 'SMALL'
          ],
          maxSpeed: 6.0
        };
    }
  }

  update(distance: number): boolean {
    const newTier = this.getTierForDistance(distance);
    const tierChanged = newTier !== this._currentTier;

    if (tierChanged) {
      this._currentTier = newTier;
    }

    return tierChanged;
  }

  reset(): void {
    this._currentTier = DifficultyTier.BEGINNER;
  }
}
