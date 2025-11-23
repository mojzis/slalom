import Phaser from 'phaser';

export default class Background {
  private scene: Phaser.Scene;
  private layers: Phaser.GameObjects.Graphics[];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.layers = [];
    this.createLayers();
  }

  private createLayers(): void {
    // Sky gradient background (static)
    const skyGradient = this.scene.add.graphics();
    skyGradient.fillGradientStyle(0xE1F5FE, 0xE1F5FE, 0xF7E6F2, 0xF7E6F2, 1);
    skyGradient.fillRect(0, -10000, 800, 20000);
    skyGradient.setDepth(-100);
    this.layers.push(skyGradient);

    // Distant hills (slow parallax)
    const hills = this.scene.add.graphics();
    hills.lineStyle(1, 0xB8C4B8, 0.3);
    hills.beginPath();
    hills.moveTo(0, 400);
    for (let x = 0; x < 800; x += 50) {
      const y = 400 + Math.sin(x / 100) * 30;
      hills.lineTo(x, y);
    }
    hills.strokePath();
    hills.setScrollFactor(0.3);
    hills.setDepth(-50);
    this.layers.push(hills);

    // Snow/ground texture (matches scroll)
    const ground = this.scene.add.graphics();
    ground.fillStyle(0xF5F5F0, 1);
    ground.fillRect(0, -10000, 800, 20000);
    ground.setDepth(-10);
    this.layers.push(ground);
  }

  update(): void {
    // Add subtle movement to distant layers if needed in future
  }

  destroy(): void {
    this.layers.forEach(layer => layer.destroy());
    this.layers = [];
  }
}
