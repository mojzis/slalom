import Phaser from 'phaser';
import Player from './Player';

export type ObstacleType = 'rock' | 'tree' | 'gap' | 'branch' | 'ice';

export default class Obstacle extends Phaser.GameObjects.Graphics {
  lane: number;
  obstacleType: ObstacleType;
  yPosition: number;
  hasCollided: boolean;

  constructor(
    scene: Phaser.Scene,
    lane: number,
    x: number,
    y: number,
    type: ObstacleType
  ) {
    super(scene);
    this.lane = lane;
    this.obstacleType = type;
    this.yPosition = y;
    this.hasCollided = false;

    this.setPosition(x, y);
    this.setDepth(10); // Obstacles above background, below signs and player
    this.drawObstacle();
    scene.add.existing(this);
  }

  drawObstacle(): void {
    this.clear();

    switch (this.obstacleType) {
      case 'rock':
        // Organic rock shape with thin lines
        this.lineStyle(1.5, 0xC9B8AD, 1);
        this.fillStyle(0xC9B8AD, 0.2);
        this.strokeCircle(0, 0, 28);
        this.fillCircle(0, 0, 28);
        break;

      case 'tree':
        // Simple triangle with thin lines
        this.lineStyle(1.5, 0xB8C4B8, 1);
        this.fillStyle(0xB8C4B8, 0.2);
        this.beginPath();
        this.moveTo(0, -35);
        this.lineTo(-25, 35);
        this.lineTo(25, 35);
        this.closePath();
        this.strokePath();
        this.fillPath();
        break;

      case 'gap':
        // Dark gap in ground
        this.lineStyle(1, 0x4A5568, 0.5);
        this.fillStyle(0x4A5568, 0.3);
        this.fillRect(-35, -8, 70, 16);
        this.strokeRect(-35, -8, 70, 16);
        break;

      case 'branch':
        // Horizontal branch
        this.lineStyle(1.5, 0xB8C4B8, 1);
        this.fillStyle(0xB8C4B8, 0.2);
        this.fillRect(-40, -4, 80, 8);
        this.strokeRect(-40, -4, 80, 8);
        break;

      case 'ice':
        // Icy patch with lighter color
        this.lineStyle(1.5, 0xB8D4E8, 1);
        this.fillStyle(0xB8D4E8, 0.15);
        this.strokeCircle(0, 0, 32);
        this.fillCircle(0, 0, 32);
        break;
    }
  }

  checkCollision(player: Player): boolean {
    if (this.hasCollided) return false;

    const verticalDistance = Math.abs(this.yPosition - player.y);
    const inSameLane = this.lane === player.currentLane;

    return inSameLane && verticalDistance < 40;
  }

  destroy(): void {
    super.destroy();
  }
}
