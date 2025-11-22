import Phaser from 'phaser';

export default class Sign extends Phaser.GameObjects.Container {
  word: string;
  signBackground: Phaser.GameObjects.Graphics;
  signText: Phaser.GameObjects.Text;
  relatedObstacleY: number;
  hasBeenSeen: boolean;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    word: string,
    obstacleY: number
  ) {
    super(scene, x, y);

    this.word = word;
    this.relatedObstacleY = obstacleY;
    this.hasBeenSeen = false;

    // Create background
    this.signBackground = scene.add.graphics();
    this.signBackground.fillStyle(0xF4C8B8, 0.8);
    this.signBackground.fillRoundedRect(-80, -30, 160, 60, 10);
    this.signBackground.lineStyle(2, 0x4A5568, 1);
    this.signBackground.strokeRoundedRect(-80, -30, 160, 60, 10);

    // Create text
    this.signText = scene.add.text(0, 0, word, {
      fontFamily: 'Quicksand, sans-serif',
      fontSize: '32px',
      color: '#4A5568',
      fontStyle: 'bold'
    });
    this.signText.setOrigin(0.5, 0.5);

    this.add([this.signBackground, this.signText]);
    this.setAlpha(0);

    scene.add.existing(this);
  }

  fadeIn(): void {
    if (this.scene) {
      this.scene.tweens.add({
        targets: this,
        alpha: 1,
        duration: 300,
        ease: 'Power2'
      });
    }
  }

  fadeOut(): void {
    if (this.scene) {
      this.scene.tweens.add({
        targets: this,
        alpha: 0,
        duration: 300,
        ease: 'Power2'
      });
    }
  }

  checkVisibility(cameraY: number, playerY: number): void {
    const distanceToObstacle = playerY - this.relatedObstacleY;

    // Show sign 600px before obstacle
    if (distanceToObstacle > -600 && distanceToObstacle < -100 && !this.hasBeenSeen) {
      this.fadeIn();
      this.hasBeenSeen = true;
    }

    // Hide sign after passing
    if (distanceToObstacle > 0 && this.alpha > 0) {
      this.fadeOut();
    }
  }

  destroy(): void {
    if (this.signBackground) {
      this.signBackground.destroy();
    }
    if (this.signText) {
      this.signText.destroy();
    }
    super.destroy();
  }
}
