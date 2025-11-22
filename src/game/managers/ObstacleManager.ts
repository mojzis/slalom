import Phaser from 'phaser';
import Obstacle, { ObstacleType } from '../objects/Obstacle';
import Player from '../objects/Player';
import Sign from '../objects/Sign';
import WordManager from './WordManager';

export default class ObstacleManager {
  scene: Phaser.Scene;
  obstacles: Obstacle[];
  signs: Sign[];
  spawnDistance: number;
  lastSpawnY: number;
  lanePositions: number[];
  minSpawnInterval: number;
  wordManager: WordManager;

  constructor(scene: Phaser.Scene, lanePositions: number[]) {
    this.scene = scene;
    this.obstacles = [];
    this.signs = [];
    this.spawnDistance = 400; // Spawn 400px ahead of camera
    this.lastSpawnY = 0;
    this.lanePositions = lanePositions;
    this.minSpawnInterval = 200; // Minimum 200px between obstacles
    this.wordManager = new WordManager();
  }

  update(cameraY: number, playerY: number): void {
    const spawnY = cameraY - this.spawnDistance;

    // Spawn new obstacles if camera has scrolled far enough
    // As camera scrolls (cameraY increases), spawnY increases, so we check spawnY - lastSpawnY
    if (spawnY - this.lastSpawnY > this.minSpawnInterval || this.lastSpawnY === 0) {
      this.spawnObstacle(spawnY);
      this.lastSpawnY = spawnY;
    }

    // Remove obstacles that are off-screen (behind camera)
    this.obstacles = this.obstacles.filter(obstacle => {
      if (obstacle.yPosition > cameraY + 700) {
        obstacle.destroy();
        return false;
      }
      return true;
    });

    // Update sign visibility
    this.signs.forEach(sign => {
      sign.checkVisibility(cameraY, playerY);
    });

    // Remove signs that are off-screen
    this.signs = this.signs.filter(sign => {
      if (sign.relatedObstacleY > cameraY + 700) {
        sign.destroy();
        return false;
      }
      return true;
    });
  }

  spawnObstacle(y: number): void {
    const lane = Phaser.Math.Between(0, this.lanePositions.length - 1);
    const x = this.lanePositions[lane];
    const types: ObstacleType[] = ['rock', 'tree', 'gap'];
    const type = Phaser.Utils.Array.GetRandom(types);

    // Create obstacle
    const obstacle = new Obstacle(this.scene, lane, x, y, type);
    this.obstacles.push(obstacle);

    // Create paired sign
    const pair = this.wordManager.generatePair(type, lane, y);
    const sign = new Sign(this.scene, x, pair.signY, pair.word, y);
    this.signs.push(sign);
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
}
