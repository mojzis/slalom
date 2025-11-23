import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create(): void {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Background
    this.add.rectangle(0, 0, 800, 600, 0xE1F5FE).setOrigin(0, 0);

    // Title
    this.add.text(centerX, centerY - 120, 'Word Racer', {
      fontFamily: 'Quicksand, sans-serif',
      fontSize: '72px',
      color: '#4A5568',
      fontStyle: '600'
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(centerX, centerY - 50, 'Read the signs to survive!', {
      fontFamily: 'Quicksand, sans-serif',
      fontSize: '24px',
      color: '#6B7280'
    }).setOrigin(0.5);

    // Start button
    const startButton = this.add.text(centerX, centerY + 60, 'START GAME', {
      fontFamily: 'Quicksand, sans-serif',
      fontSize: '36px',
      color: '#8FA9B8',
      fontStyle: '600'
    }).setOrigin(0.5);

    startButton.setInteractive({ useHandCursor: true });
    startButton.on('pointerover', () => {
      startButton.setColor('#4A5568');
    });
    startButton.on('pointerout', () => {
      startButton.setColor('#8FA9B8');
    });
    startButton.on('pointerdown', () => {
      this.scene.start('MainScene');
    });

    // High score display
    const highScore = this.loadHighScore();
    this.add.text(centerX, centerY + 150, `Best Distance: ${highScore}m`, {
      fontFamily: 'Quicksand, sans-serif',
      fontSize: '20px',
      color: '#6B7280'
    }).setOrigin(0.5);

    // Instructions
    this.add.text(centerX, centerY + 200, 'Use LEFT/RIGHT arrows to switch lanes', {
      fontFamily: 'Quicksand, sans-serif',
      fontSize: '16px',
      color: '#8FA9B8'
    }).setOrigin(0.5);

    // Listen for spacebar to start
    this.input.keyboard?.once('keydown-SPACE', () => {
      this.scene.start('MainScene');
    });

    // Also allow Enter key
    this.input.keyboard?.once('keydown-ENTER', () => {
      this.scene.start('MainScene');
    });
  }

  private loadHighScore(): number {
    try {
      const saved = localStorage.getItem('highScore');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  }
}
