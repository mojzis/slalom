import Phaser from 'phaser';

export interface ScoreData {
  distance: number;
  highScore: number;
  speed: number;
}

export default class ScoreManager {
  private scene: Phaser.Scene;
  private _distance: number;
  private _highScore: number;
  private startTime: number;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this._distance = 0;
    this.startTime = Date.now();
    this._highScore = this.loadHighScore();
  }

  get distance(): number {
    return this._distance;
  }

  get highScore(): number {
    return this._highScore;
  }

  update(scrollY: number): void {
    // Convert scrollY to meters (2 pixels = 1 meter)
    this._distance = Math.floor(scrollY / 2);

    // Emit event for React components
    this.scene.events.emit('scoreUpdate', {
      distance: this._distance,
      highScore: this._highScore,
      speed: this.calculateSpeed(this._distance)
    } as ScoreData);
  }

  calculateSpeed(distance: number): number {
    // Base speed: 2, increase by 0.5 every 500m
    const speedIncrements = Math.floor(distance / 500);
    return 2 + (speedIncrements * 0.5);
  }

  saveHighScore(): void {
    if (this._distance > this._highScore) {
      this._highScore = this._distance;
      try {
        localStorage.setItem('highScore', this._distance.toString());
      } catch (e) {
        // localStorage might be disabled
        console.warn('Could not save high score:', e);
      }
    }
  }

  loadHighScore(): number {
    try {
      const saved = localStorage.getItem('highScore');
      return saved ? parseInt(saved, 10) : 0;
    } catch (e) {
      // localStorage might be disabled
      return 0;
    }
  }

  getElapsedTime(): number {
    return Math.floor((Date.now() - this.startTime) / 1000);
  }

  reset(): void {
    this._distance = 0;
    this.startTime = Date.now();
  }
}
