import Phaser from 'phaser';

export default class Player extends Phaser.GameObjects.Graphics {
  currentLane: number;
  targetLane: number;
  isTransitioning: boolean;
  isCrashed: boolean;

  constructor(scene: Phaser.Scene, lane: number) {
    super(scene);
    this.currentLane = lane;
    this.targetLane = lane;
    this.isTransitioning = false;
    this.isCrashed = false;
    this.drawPlayer();
    scene.add.existing(this);
  }

  drawPlayer(): void {
    this.clear();
    this.lineStyle(2, 0x8FA9B8);
    this.fillStyle(0x8FA9B8, 0.3);
    this.strokeCircle(0, 0, 20);
    this.fillCircle(0, 0, 20);
  }

  moveToLane(lane: number, lanePositions: number[]): void {
    if (this.isTransitioning || this.isCrashed || lane < 0 || lane >= lanePositions.length) {
      return;
    }

    this.targetLane = lane;
    this.isTransitioning = true;

    this.scene.tweens.add({
      targets: this,
      x: lanePositions[lane],
      duration: 150,
      ease: 'Power2',
      onComplete: () => {
        this.currentLane = lane;
        this.isTransitioning = false;
      }
    });
  }

  crash(): void {
    this.isCrashed = true;

    // Change color to red
    this.clear();
    this.lineStyle(2, 0xFF6B6B);
    this.fillStyle(0xFF6B6B, 0.5);
    this.strokeCircle(0, 0, 20);
    this.fillCircle(0, 0, 20);

    // Shake animation
    const originalX = this.x;
    this.scene.tweens.add({
      targets: this,
      x: originalX - 10,
      duration: 50,
      yoyo: true,
      repeat: 5,
      onComplete: () => {
        this.x = originalX;
      }
    });

    // Fade out
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      duration: 500,
      delay: 300
    });
  }
}
