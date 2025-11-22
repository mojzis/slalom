import Phaser from 'phaser';
import { COLORS, FONTS } from '../../data/theme';

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  init(): void {
    // Initialize scene data
    console.log('MainScene: init');
  }

  preload(): void {
    // Load assets (empty for now)
    console.log('MainScene: preload');
  }

  create(): void {
    console.log('MainScene: create');

    // Create gradient background using graphics
    const graphics = this.add.graphics();

    // Draw gradient from SKY_TOP to SKY_BOTTOM
    const height = this.cameras.main.height;
    const width = this.cameras.main.width;

    // Parse hex colors to RGB
    const topColor = Phaser.Display.Color.HexStringToColor(COLORS.SKY_TOP);
    const bottomColor = Phaser.Display.Color.HexStringToColor(COLORS.SKY_BOTTOM);

    // Create gradient by drawing horizontal lines
    for (let y = 0; y < height; y++) {
      const ratio = y / height;
      const r = Math.floor(topColor.red + (bottomColor.red - topColor.red) * ratio);
      const g = Math.floor(topColor.green + (bottomColor.green - topColor.green) * ratio);
      const b = Math.floor(topColor.blue + (bottomColor.blue - topColor.blue) * ratio);

      graphics.lineStyle(1, Phaser.Display.Color.GetColor(r, g, b));
      graphics.lineBetween(0, y, width, y);
    }

    // Add centered text
    this.add.text(width / 2, height / 2, 'MainScene Running', {
      fontFamily: FONTS.PRIMARY,
      fontSize: FONTS.SIZES.MENU,
      color: COLORS.TEXT_PRIMARY
    }).setOrigin(0.5);
  }

  update(_time: number, _delta: number): void {
    // Game loop (empty for now)
  }
}
