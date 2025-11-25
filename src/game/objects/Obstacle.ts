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
        // Organic rock shape - more visible
        this.lineStyle(2, 0x8B7355, 1);
        this.fillStyle(0xA89080, 0.8);
        this.strokeCircle(0, 0, 28);
        this.fillCircle(0, 0, 28);
        break;

      case 'tree':
        // Simple triangle - more visible
        this.lineStyle(2, 0x6B8E6B, 1);
        this.fillStyle(0x7FA07F, 0.8);
        this.beginPath();
        this.moveTo(0, -35);
        this.lineTo(-25, 35);
        this.lineTo(25, 35);
        this.closePath();
        this.strokePath();
        this.fillPath();
        break;

      case 'gap':
        // Dark gap in ground - more visible
        this.lineStyle(2, 0x2C3E50, 1);
        this.fillStyle(0x34495E, 0.9);
        this.fillRect(-35, -8, 70, 16);
        this.strokeRect(-35, -8, 70, 16);
        break;

      case 'branch':
        // Horizontal branch - more visible
        this.lineStyle(2, 0x6B8E6B, 1);
        this.fillStyle(0x7FA07F, 0.8);
        this.fillRect(-40, -4, 80, 8);
        this.strokeRect(-40, -4, 80, 8);
        break;

      case 'ice':
        // Icy patch - more visible with blue tint
        this.lineStyle(2, 0x5DADE2, 1);
        this.fillStyle(0x85C1E9, 0.7);
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
