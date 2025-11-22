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
    this.drawObstacle();
    scene.add.existing(this);
  }

  drawObstacle(): void {
    this.clear();

    switch (this.obstacleType) {
      case 'rock':
        this.lineStyle(2, 0xC9B8AD);
        this.fillStyle(0xC9B8AD, 0.3);
        this.strokeCircle(0, 0, 25);
        this.fillCircle(0, 0, 25);
        break;

      case 'tree':
        this.lineStyle(2, 0xB8C4B8);
        this.fillStyle(0xB8C4B8, 0.3);
        this.beginPath();
        this.moveTo(0, -30);
        this.lineTo(-20, 30);
        this.lineTo(20, 30);
        this.closePath();
        this.strokePath();
        this.fillPath();
        break;

      case 'gap':
        this.fillStyle(0x000000, 0.3);
        this.fillRect(-30, -10, 60, 20);
        break;

      case 'branch':
        this.lineStyle(2, 0xB8C4B8);
        this.strokeRect(-35, -5, 70, 10);
        break;

      case 'ice':
        this.lineStyle(2, 0xB8D4E8);
        this.fillStyle(0xB8D4E8, 0.2);
        this.strokeCircle(0, 0, 30);
        this.fillCircle(0, 0, 30);
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
