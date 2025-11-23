import Phaser from 'phaser';
import Player from '../objects/Player';
import { calculateLanePositions, drawLaneGuides } from '../objects/Lane';
import ObstacleManager from '../managers/ObstacleManager';
import ScoreManager from '../managers/ScoreManager';
import DifficultyManager from '../managers/DifficultyManager';
import Background from '../objects/Background';

export default class MainScene extends Phaser.Scene {
  private scrollSpeed: number = 2;
  private lanePositions: number[] = [];
  private player!: Player;
  private laneGraphics!: Phaser.GameObjects.Graphics;
  private playerScreenY: number = 500;
  private obstacleManager!: ObstacleManager;
  private scoreManager!: ScoreManager;
  private difficultyManager!: DifficultyManager;
  private _background!: Background;
  private isGameOver: boolean = false;
  private currentNumLanes: number = 3;

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
    // Create background first (lowest depth)
    this._background = new Background(this);

    // Calculate lane positions for 3 lanes
    this.lanePositions = calculateLanePositions(800, 3);

    // Create lane guide graphics with depth ordering
    this.laneGraphics = this.add.graphics();
    this.laneGraphics.setDepth(0);
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
    this.player.setDepth(30); // Player on top

    // Set up keyboard input for lane switching
    this.setupInput();

    // Initialize obstacle manager
    this.obstacleManager = new ObstacleManager(this, this.lanePositions);

    // Initialize score manager
    this.scoreManager = new ScoreManager(this);

    // Initialize difficulty manager
    this.difficultyManager = new DifficultyManager();
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

    // Update score manager
    this.scoreManager.update(this.cameras.main.scrollY);
    const distance = this.scoreManager.distance;

    // Check for difficulty tier changes
    const tierChanged = this.difficultyManager.update(distance);
    const config = this.difficultyManager.getConfig(distance);

    if (tierChanged) {
      this.handleTierChange(config.numLanes);
      // Update obstacle manager with new difficulty
      this.obstacleManager.setDifficultyTier(this.difficultyManager.currentTier);
    }

    // Calculate speed with max speed cap from difficulty config
    const baseSpeed = this.scoreManager.calculateSpeed(distance);
    this.scrollSpeed = Math.min(baseSpeed, config.maxSpeed);

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

    // Update background (for any parallax effects)
    this._background.update();

    // Update obstacle manager
    this.obstacleManager.update(this.cameras.main.scrollY, this.player.y);

    // Check for collisions
    if (this.obstacleManager.checkCollisions(this.player)) {
      this.handleCrash();
    }
  }

  private handleTierChange(newNumLanes: number): void {
    if (newNumLanes === this.currentNumLanes) return;

    // Recalculate lane positions
    this.lanePositions = calculateLanePositions(800, newNumLanes);
    this.currentNumLanes = newNumLanes;

    // Update obstacle manager with new lane positions
    this.obstacleManager.setLanePositions(this.lanePositions);

    // Ensure player is in a valid lane
    if (this.player.currentLane >= newNumLanes) {
      // Move player to the closest valid lane (center)
      const newLane = Math.floor(newNumLanes / 2);
      this.player.setLane(newLane, this.lanePositions);
    } else {
      // Update player position to new lane x position
      this.player.updateLanePosition(this.lanePositions);
    }
  }

  private handleCrash(): void {
    this.isGameOver = true;
    this.player.crash();

    // Save high score
    this.scoreManager.saveHighScore();

    // Get distance from score manager
    const distance = this.scoreManager.distance;

    // Transition to game over scene after animation
    this.time.delayedCall(1000, () => {
      this.scene.start('GameOverScene', { distance });
    });
  }
}
