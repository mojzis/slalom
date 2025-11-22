import { describe, it, expect, vi, beforeEach } from 'vitest';
import Player from './Player';

// Mock Phaser
vi.mock('phaser', () => {
  class MockGraphics {
    scene: any;
    x = 0;
    y = 0;
    alpha = 1;

    constructor(scene: any) {
      this.scene = scene;
    }

    clear = vi.fn().mockReturnThis();
    lineStyle = vi.fn().mockReturnThis();
    fillStyle = vi.fn().mockReturnThis();
    strokeCircle = vi.fn().mockReturnThis();
    fillCircle = vi.fn().mockReturnThis();
    setPosition = vi.fn().mockImplementation((x: number, y: number) => {
      this.x = x;
      this.y = y;
      return this;
    });
    setY = vi.fn().mockImplementation((y: number) => {
      this.y = y;
      return this;
    });
    destroy = vi.fn();
  }

  return {
    default: {
      GameObjects: {
        Graphics: MockGraphics,
      },
    },
  };
});

describe('Player', () => {
  let mockScene: any;
  const lanePositions = [250, 400, 550];

  beforeEach(() => {
    mockScene = {
      add: {
        existing: vi.fn(),
      },
      tweens: {
        add: vi.fn().mockImplementation(({ onComplete }) => {
          // Simulate immediate completion for testing
          if (onComplete) {
            setTimeout(onComplete, 0);
          }
        }),
      },
    };
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('creates player with correct initial lane', () => {
      const player = new Player(mockScene, 1);

      expect(player.currentLane).toBe(1);
      expect(player.targetLane).toBe(1);
      expect(player.isTransitioning).toBe(false);
      expect(player.isCrashed).toBe(false);
    });

    it('adds player to scene', () => {
      const player = new Player(mockScene, 0);
      expect(mockScene.add.existing).toHaveBeenCalledWith(player);
    });

    it('draws player graphics', () => {
      const player = new Player(mockScene, 1);
      expect(player.clear).toHaveBeenCalled();
      expect(player.lineStyle).toHaveBeenCalled();
      expect(player.fillStyle).toHaveBeenCalled();
      expect(player.strokeCircle).toHaveBeenCalled();
      expect(player.fillCircle).toHaveBeenCalled();
    });
  });

  describe('moveToLane', () => {
    it('starts tween to move to new lane', () => {
      const player = new Player(mockScene, 1);
      player.moveToLane(2, lanePositions);

      expect(mockScene.tweens.add).toHaveBeenCalledWith(
        expect.objectContaining({
          targets: player,
          x: 550, // lanePositions[2]
          duration: 150,
        })
      );
    });

    it('does not move if already transitioning', () => {
      const player = new Player(mockScene, 1);
      player.isTransitioning = true;
      player.moveToLane(2, lanePositions);

      expect(mockScene.tweens.add).not.toHaveBeenCalled();
    });

    it('does not move if crashed', () => {
      const player = new Player(mockScene, 1);
      player.isCrashed = true;
      player.moveToLane(2, lanePositions);

      expect(mockScene.tweens.add).not.toHaveBeenCalled();
    });

    it('does not move to invalid lane (negative)', () => {
      const player = new Player(mockScene, 1);
      player.moveToLane(-1, lanePositions);

      expect(mockScene.tweens.add).not.toHaveBeenCalled();
    });

    it('does not move to invalid lane (too high)', () => {
      const player = new Player(mockScene, 1);
      player.moveToLane(5, lanePositions);

      expect(mockScene.tweens.add).not.toHaveBeenCalled();
    });

    it('sets isTransitioning to true when moving', () => {
      const player = new Player(mockScene, 1);
      player.moveToLane(2, lanePositions);

      expect(player.isTransitioning).toBe(true);
    });
  });

  describe('crash', () => {
    it('sets isCrashed to true', () => {
      const player = new Player(mockScene, 1);
      player.crash();

      expect(player.isCrashed).toBe(true);
    });

    it('redraws player with red color', () => {
      const player = new Player(mockScene, 1);
      vi.clearAllMocks();
      player.crash();

      expect(player.clear).toHaveBeenCalled();
      expect(player.lineStyle).toHaveBeenCalledWith(2, 0xFF6B6B);
      expect(player.fillStyle).toHaveBeenCalledWith(0xFF6B6B, 0.5);
    });

    it('triggers shake animation', () => {
      const player = new Player(mockScene, 1);
      player.crash();

      expect(mockScene.tweens.add).toHaveBeenCalledWith(
        expect.objectContaining({
          targets: player,
          yoyo: true,
          repeat: 5,
        })
      );
    });

    it('triggers fade out animation', () => {
      const player = new Player(mockScene, 1);
      player.crash();

      expect(mockScene.tweens.add).toHaveBeenCalledWith(
        expect.objectContaining({
          targets: player,
          alpha: 0,
          duration: 500,
          delay: 300,
        })
      );
    });
  });

  describe('drawPlayer', () => {
    it('draws player circle', () => {
      const player = new Player(mockScene, 1);
      vi.clearAllMocks();
      player.drawPlayer();

      expect(player.clear).toHaveBeenCalled();
      expect(player.strokeCircle).toHaveBeenCalledWith(0, 0, 20);
      expect(player.fillCircle).toHaveBeenCalledWith(0, 0, 20);
    });
  });
});
