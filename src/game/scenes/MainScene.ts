import Phaser from 'phaser';
import Player from '../objects/Player';
import { calculateLanePositions, drawLaneGuides } from '../objects/Lane';
import ObstacleManager from '../managers/ObstacleManager';

export default class MainScene extends Phaser.Scene {
  private scrollSpeed: number = 2;
  private lanePositions: number[] = [];
  private player!: Player;
  private laneGraphics!: Phaser.GameObjects.Graphics;
  private playerScreenY: number = 500;
  private obstacleManager!: ObstacleManager;
  private isGameOver: boolean = false;

  constructor() {
    super({ key: 'MainScene' });
  }

  init(): void {
    this.scrollSpeed = 2;
    this.isGameOver = false;
  }

  preload(): void {
    // Assets will be loaded in future phases
  }

  create(): void {
    // Calculate lane positions for 3 lanes
    this.lanePositions = calculateLanePositions(800, 3);

    // Create lane guide graphics
    this.laneGraphics = this.add.graphics();
    drawLaneGuides(
      this,
      this.lanePositions,
      this.laneGraphics,
      0,
      600
    );

    // Create Player at middle lane (index 1)
    const middleLane = 1;
    this.player = new Player(this, middleLane);
    this.player.setPosition(this.lanePositions[middleLane], this.playerScreenY);

    // Add debug text
    this.add.text(400, 50, 'MainScene Running', {
      fontSize: '24px',
      color: '#4A5568'
    }).setOrigin(0.5).setScrollFactor(0);

    // Set up keyboard input for lane switching
    this.setupInput();

    // Initialize obstacle manager
    this.obstacleManager = new ObstacleManager(this, this.lanePositions);
  }

  private setupInput(): void {
    this.input.keyboard?.on('keydown-LEFT', () => {
      if (this.player.currentLane > 0) {
        this.player.moveToLane(this.player.currentLane - 1, this.lanePositions);
      }
    });

    this.input.keyboard?.on('keydown-RIGHT', () => {
      if (this.player.currentLane < this.lanePositions.length - 1) {
        this.player.moveToLane(this.player.currentLane + 1, this.lanePositions);
      }
    });
  }

  update(_time: number, _delta: number): void {
    // Don't update if game is over
    if (this.isGameOver) return;

    // Auto-scroll camera upward (increase scrollY)
    this.cameras.main.scrollY += this.scrollSpeed;

    // Update player y position to follow camera (stay at fixed screen position)
    this.player.setY(this.cameras.main.scrollY + this.playerScreenY);

    // Redraw lane guides to follow camera
    drawLaneGuides(
      this,
      this.lanePositions,
      this.laneGraphics,
      this.cameras.main.scrollY,
      600
    );

    // Update obstacle manager
    this.obstacleManager.update(this.cameras.main.scrollY, this.player.y);

    // Check for collisions
    if (this.obstacleManager.checkCollisions(this.player)) {
      this.handleCrash();
    }
  }

  private handleCrash(): void {
    this.isGameOver = true;
    // For now, just stop the game - full crash handling in Phase 7
    console.log('Crash! Game Over');
  }
}
