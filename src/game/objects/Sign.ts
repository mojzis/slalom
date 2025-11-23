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

    // Use unified sign color - no color coding to ensure players read the text
    const bgColor = 0xF5F0E8; // Warm cream/off-white for all signs

    // Create background with refined styling
    this.signBackground = scene.add.graphics();
    this.signBackground.fillStyle(bgColor, 0.92);
    this.signBackground.fillRoundedRect(-90, -32, 180, 64, 12);
    this.signBackground.lineStyle(1.5, 0x4A5568, 1);
    this.signBackground.strokeRoundedRect(-90, -32, 180, 64, 12);

    // Create text with larger, more readable font
    this.signText = scene.add.text(0, 0, word, {
      fontFamily: 'Quicksand, sans-serif',
      fontSize: '40px',
      color: '#4A5568',
      fontStyle: '600'
    });
    this.signText.setOrigin(0.5, 0.5);

    this.add([this.signBackground, this.signText]);
    this.setAlpha(0);
    this.setDepth(20); // Signs above obstacles, below player

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

  checkVisibility(_cameraY: number, playerY: number): void {
    // Distance is positive when obstacle is above player (ahead)
    const distanceToObstacle = playerY - this.relatedObstacleY;

    // Show sign when obstacle is 100-800px above player (approaching)
    // Note: obstacles spawn ~680px ahead of player (spawnDistance=200 + playerScreenY=480)
    if (distanceToObstacle > 100 && distanceToObstacle < 800 && !this.hasBeenSeen) {
      this.fadeIn();
      this.hasBeenSeen = true;
    }

    // Hide sign after obstacle has passed below player
    if (distanceToObstacle < 0 && this.alpha > 0) {
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
