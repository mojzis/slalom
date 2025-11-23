import Phaser from 'phaser';

export default class HelpScene extends Phaser.Scene {
  constructor() {
    super({ key: 'HelpScene' });
  }

  create(): void {
    const centerX = this.cameras.main.width / 2;

    // Background
    this.add.rectangle(0, 0, 800, 600, 0xE1F5FE).setOrigin(0, 0);

    // Title
    this.add.text(centerX, 40, 'How to Play', {
      fontFamily: 'Quicksand, sans-serif',
      fontSize: '48px',
      color: '#4A5568',
      fontStyle: '600'
    }).setOrigin(0.5);

    // Controls section
    this.add.text(centerX, 100, '🎮 Controls', {
      fontFamily: 'Quicksand, sans-serif',
      fontSize: '24px',
      color: '#4A5568',
      fontStyle: '600'
    }).setOrigin(0.5);

    this.add.text(centerX, 135, 'Use LEFT and RIGHT arrow keys to switch lanes', {
      fontFamily: 'Quicksand, sans-serif',
      fontSize: '18px',
      color: '#6B7280'
    }).setOrigin(0.5);

    // Signs section
    this.add.text(centerX, 185, '📋 Reading the Signs', {
      fontFamily: 'Quicksand, sans-serif',
      fontSize: '24px',
      color: '#4A5568',
      fontStyle: '600'
    }).setOrigin(0.5);

    const signExplanations = [
      { word: 'LEFT / RIGHT', meaning: 'Move in that direction to avoid the obstacle' },
      { word: 'TREE / ROCK / GAP', meaning: 'Names the obstacle ahead - dodge it!' },
      { word: 'DUCK / JUMP', meaning: 'Type of action needed (just move away!)' },
      { word: 'ICE / BRANCH', meaning: 'Hazard type - get out of that lane!' }
    ];

    let yPos = 225;
    signExplanations.forEach(item => {
      // Word
      this.add.text(centerX - 180, yPos, item.word, {
        fontFamily: 'Quicksand, sans-serif',
        fontSize: '18px',
        color: '#2D3748',
        fontStyle: '600'
      }).setOrigin(0, 0.5);

      // Arrow
      this.add.text(centerX + 20, yPos, '→', {
        fontFamily: 'Quicksand, sans-serif',
        fontSize: '18px',
        color: '#8FA9B8'
      }).setOrigin(0.5, 0.5);

      // Meaning
      this.add.text(centerX + 50, yPos, item.meaning, {
        fontFamily: 'Quicksand, sans-serif',
        fontSize: '16px',
        color: '#6B7280'
      }).setOrigin(0, 0.5);

      yPos += 40;
    });

    // Tips section
    this.add.text(centerX, 420, '💡 Tips', {
      fontFamily: 'Quicksand, sans-serif',
      fontSize: '24px',
      color: '#4A5568',
      fontStyle: '600'
    }).setOrigin(0.5);

    const tips = [
      'Signs appear BEFORE obstacles - read ahead!',
      'All signs mean: move away from that lane',
      'Speed increases as you travel further'
    ];

    yPos = 460;
    tips.forEach(tip => {
      this.add.text(centerX, yPos, `• ${tip}`, {
        fontFamily: 'Quicksand, sans-serif',
        fontSize: '16px',
        color: '#6B7280'
      }).setOrigin(0.5);
      yPos += 28;
    });

    // Back button
    const backButton = this.add.text(centerX, 560, '← Back to Menu', {
      fontFamily: 'Quicksand, sans-serif',
      fontSize: '24px',
      color: '#8FA9B8',
      fontStyle: '600'
    }).setOrigin(0.5);

    backButton.setInteractive({ useHandCursor: true });
    backButton.on('pointerover', () => backButton.setColor('#4A5568'));
    backButton.on('pointerout', () => backButton.setColor('#8FA9B8'));
    backButton.on('pointerdown', () => this.scene.start('MenuScene'));

    // Keyboard shortcuts
    this.input.keyboard?.once('keydown-SPACE', () => this.scene.start('MenuScene'));
    this.input.keyboard?.once('keydown-ENTER', () => this.scene.start('MenuScene'));
    this.input.keyboard?.once('keydown-ESC', () => this.scene.start('MenuScene'));
  }
}
