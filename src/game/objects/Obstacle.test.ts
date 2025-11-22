import { describe, it, expect, vi, beforeEach } from 'vitest';
import Obstacle from './Obstacle';

// Mock Phaser
vi.mock('phaser', () => {
  class MockGraphics {
    clear = vi.fn().mockReturnThis();
    lineStyle = vi.fn().mockReturnThis();
    fillStyle = vi.fn().mockReturnThis();
    strokeCircle = vi.fn().mockReturnThis();
    fillCircle = vi.fn().mockReturnThis();
    beginPath = vi.fn().mockReturnThis();
    moveTo = vi.fn().mockReturnThis();
    lineTo = vi.fn().mockReturnThis();
    closePath = vi.fn().mockReturnThis();
    strokePath = vi.fn().mockReturnThis();
    fillPath = vi.fn().mockReturnThis();
    fillRect = vi.fn().mockReturnThis();
    strokeRect = vi.fn().mockReturnThis();
    destroy = vi.fn();
    x = 0;
    y = 0;

    setPosition(x: number, y: number) {
      this.x = x;
      this.y = y;
      return this;
    }
  }

  return {
    default: {
      GameObjects: {
        Graphics: MockGraphics,
      },
    },
  };
});

describe('Obstacle', () => {
  let mockScene: { add: { existing: ReturnType<typeof vi.fn> } };

  beforeEach(() => {
    mockScene = {
      add: {
        existing: vi.fn(),
      },
    };
  });

  describe('constructor', () => {
    it('creates a rock obstacle with correct properties', () => {
      const obstacle = new Obstacle(mockScene as any, 1, 400, 200, 'rock');

      expect(obstacle.lane).toBe(1);
      expect(obstacle.obstacleType).toBe('rock');
      expect(obstacle.yPosition).toBe(200);
      expect(obstacle.hasCollided).toBe(false);
      expect(mockScene.add.existing).toHaveBeenCalledWith(obstacle);
    });

    it('creates a tree obstacle', () => {
      const obstacle = new Obstacle(mockScene as any, 0, 250, 300, 'tree');

      expect(obstacle.lane).toBe(0);
      expect(obstacle.obstacleType).toBe('tree');
      expect(obstacle.yPosition).toBe(300);
    });

    it('creates a gap obstacle', () => {
      const obstacle = new Obstacle(mockScene as any, 2, 550, 400, 'gap');

      expect(obstacle.obstacleType).toBe('gap');
    });
  });

  describe('checkCollision', () => {
    it('returns true when player is in same lane and close vertically', () => {
      const obstacle = new Obstacle(mockScene as any, 1, 400, 200, 'rock');

      const mockPlayer = {
        currentLane: 1,
        y: 180, // Within 40px of obstacle
      };

      expect(obstacle.checkCollision(mockPlayer as any)).toBe(true);
    });

    it('returns false when player is in different lane', () => {
      const obstacle = new Obstacle(mockScene as any, 1, 400, 200, 'rock');

      const mockPlayer = {
        currentLane: 0, // Different lane
        y: 200,
      };

      expect(obstacle.checkCollision(mockPlayer as any)).toBe(false);
    });

    it('returns false when player is too far vertically', () => {
      const obstacle = new Obstacle(mockScene as any, 1, 400, 200, 'rock');

      const mockPlayer = {
        currentLane: 1,
        y: 300, // More than 40px away
      };

      expect(obstacle.checkCollision(mockPlayer as any)).toBe(false);
    });

    it('returns false if already collided', () => {
      const obstacle = new Obstacle(mockScene as any, 1, 400, 200, 'rock');
      obstacle.hasCollided = true;

      const mockPlayer = {
        currentLane: 1,
        y: 200,
      };

      expect(obstacle.checkCollision(mockPlayer as any)).toBe(false);
    });
  });

  describe('drawObstacle', () => {
    it('draws different shapes for different obstacle types', () => {
      const rockObstacle = new Obstacle(mockScene as any, 1, 400, 200, 'rock');
      expect(rockObstacle.strokeCircle).toHaveBeenCalled();

      const treeObstacle = new Obstacle(mockScene as any, 1, 400, 200, 'tree');
      expect(treeObstacle.beginPath).toHaveBeenCalled();

      const gapObstacle = new Obstacle(mockScene as any, 1, 400, 200, 'gap');
      expect(gapObstacle.fillRect).toHaveBeenCalled();
    });
  });
});
