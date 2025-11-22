import Phaser from 'phaser';
import Obstacle, { ObstacleType } from '../objects/Obstacle';
import Player from '../objects/Player';

export default class ObstacleManager {
  scene: Phaser.Scene;
  obstacles: Obstacle[];
  spawnDistance: number;
  lastSpawnY: number;
  lanePositions: number[];
  minSpawnInterval: number;

  constructor(scene: Phaser.Scene, lanePositions: number[]) {
    this.scene = scene;
    this.obstacles = [];
    this.spawnDistance = 400; // Spawn 400px ahead of camera
    this.lastSpawnY = 0;
    this.lanePositions = lanePositions;
    this.minSpawnInterval = 200; // Minimum 200px between obstacles
  }

  update(cameraY: number): void {
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
  }

  spawnObstacle(y: number): void {
    const lane = Phaser.Math.Between(0, this.lanePositions.length - 1);
    const x = this.lanePositions[lane];
    const types: ObstacleType[] = ['rock', 'tree', 'gap'];
    const type = Phaser.Utils.Array.GetRandom(types);

    const obstacle = new Obstacle(this.scene, lane, x, y, type);
    this.obstacles.push(obstacle);
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
    this.lastSpawnY = 0;
  }
}
