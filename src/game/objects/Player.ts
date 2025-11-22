import Phaser from 'phaser';

export default class Player extends Phaser.GameObjects.Graphics {
  currentLane: number;
  targetLane: number;
  isTransitioning: boolean;

  constructor(scene: Phaser.Scene, lane: number) {
    super(scene);
    this.currentLane = lane;
    this.targetLane = lane;
    this.isTransitioning = false;
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
    if (this.isTransitioning || lane < 0 || lane >= lanePositions.length) {
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
}
