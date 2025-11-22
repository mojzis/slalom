import Phaser from 'phaser';

export default class GameOverScene extends Phaser.Scene {
  private finalDistance: number = 0;

  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data: { distance: number }): void {
    this.finalDistance = data.distance || 0;
  }

  create(): void {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Background
    this.add.rectangle(0, 0, 800, 600, 0xF5F5F0).setOrigin(0, 0);

    // Game Over text
    this.add.text(centerX, centerY - 100, 'Crashed!', {
      fontFamily: 'Quicksand, sans-serif',
      fontSize: '64px',
      color: '#4A5568'
    }).setOrigin(0.5);

    // Distance text
    this.add.text(centerX, centerY, `Distance: ${this.finalDistance.toFixed(0)}m`, {
      fontFamily: 'Quicksand, sans-serif',
      fontSize: '32px',
      color: '#6B7280'
    }).setOrigin(0.5);

    // Restart instruction
    const restartText = this.add.text(centerX, centerY + 100, 'Press ENTER to restart', {
      fontFamily: 'Quicksand, sans-serif',
      fontSize: '24px',
      color: '#8FA9B8'
    }).setOrigin(0.5);

    // Pulse animation
    this.tweens.add({
      targets: restartText,
      alpha: 0.5,
      duration: 800,
      yoyo: true,
      repeat: -1
    });

    // Listen for Enter key
    this.input.keyboard?.once('keydown-ENTER', () => {
      this.scene.start('MainScene');
    });

    // Also allow spacebar to restart
    this.input.keyboard?.once('keydown-SPACE', () => {
      this.scene.start('MainScene');
    });
  }
}
