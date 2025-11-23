import Phaser from 'phaser';
import Obstacle, { ObstacleType } from '../objects/Obstacle';
import Player from '../objects/Player';
import Sign from '../objects/Sign';
import WordManager from './WordManager';
import { DifficultyTier } from './DifficultyManager';

export default class ObstacleManager {
  scene: Phaser.Scene;
  obstacles: Obstacle[];
  signs: Sign[];
  spawnDistance: number;
  lastSpawnY: number;
  lanePositions: number[];
  minSpawnInterval: number;
  wordManager: WordManager;
  private currentTier: DifficultyTier;

  constructor(scene: Phaser.Scene, lanePositions: number[]) {
    this.scene = scene;
    this.obstacles = [];
    this.signs = [];
    this.spawnDistance = 200; // Spawn 200px below viewport
    this.lastSpawnY = 0;
    this.lanePositions = lanePositions;
    this.minSpawnInterval = 200; // Minimum 200px between obstacles
    this.wordManager = new WordManager();
    this.currentTier = DifficultyTier.BEGINNER;
  }

  update(cameraY: number, playerY: number): void {
    // Spawn obstacles ahead of camera (below viewport, will scroll into view)
    const spawnY = cameraY + 600 + this.spawnDistance;

    // Spawn new obstacles if camera has scrolled far enough
    if (this.lastSpawnY === 0 || spawnY - this.lastSpawnY > this.minSpawnInterval) {
      this.spawnObstacle(spawnY);
      this.lastSpawnY = spawnY;
    }

    // Remove obstacles that have scrolled past (above camera viewport)
    this.obstacles = this.obstacles.filter(obstacle => {
      if (obstacle.yPosition < cameraY - 100) {
        obstacle.destroy();
        return false;
      }
      return true;
    });

    // Update sign visibility
    this.signs.forEach(sign => {
      sign.checkVisibility(cameraY, playerY);
    });

    // Remove signs that have scrolled past (above camera viewport)
    this.signs = this.signs.filter(sign => {
      if (sign.relatedObstacleY < cameraY - 100) {
        sign.destroy();
        return false;
      }
      return true;
    });
  }

  spawnObstacle(y: number): void {
    const lane = Phaser.Math.Between(0, this.lanePositions.length - 1);
    const x = this.lanePositions[lane];

    // Get obstacle types based on difficulty tier
    const types = this.getObstacleTypesForTier();
    const type = Phaser.Utils.Array.GetRandom(types);

    // Create obstacle
    const obstacle = new Obstacle(this.scene, lane, x, y, type);
    this.obstacles.push(obstacle);

    // Create paired sign
    const pair = this.wordManager.generatePair(type, lane, y);
    const sign = new Sign(this.scene, x, pair.signY, pair.word, y);
    this.signs.push(sign);
  }

  private getObstacleTypesForTier(): ObstacleType[] {
    switch (this.currentTier) {
      case DifficultyTier.BEGINNER:
        return ['rock', 'tree', 'gap'];
      case DifficultyTier.INTERMEDIATE:
        return ['rock', 'tree', 'gap', 'branch', 'ice'];
      case DifficultyTier.ADVANCED:
        return ['rock', 'tree', 'gap', 'branch', 'ice'];
      default:
        return ['rock', 'tree', 'gap'];
    }
  }

  checkCollisions(player: Player): boolean {
    for (const obstacle of this.obstacles) {
      if (obstacle.checkCollision(player)) {
        obstacle.hasCollided = true;
        return true;
      }
    }
    return false;
  }

  getActiveObstacles(): Obstacle[] {
    return this.obstacles;
  }

  reset(): void {
    this.obstacles.forEach(obstacle => obstacle.destroy());
    this.obstacles = [];
    this.signs.forEach(sign => sign.destroy());
    this.signs = [];
    this.lastSpawnY = 0;
    this.wordManager.reset();
  }

  getSigns(): Sign[] {
    return this.signs;
  }

  setLanePositions(lanePositions: number[]): void {
    this.lanePositions = lanePositions;
  }

  setDifficultyTier(tier: DifficultyTier): void {
    this.currentTier = tier;
    this.wordManager.setDifficulty(tier);
  }
}
