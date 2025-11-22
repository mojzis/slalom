import { describe, it, expect, vi, beforeEach } from 'vitest';
import ObstacleManager from './ObstacleManager';

// Mock Phaser Math and Utils
vi.mock('phaser', () => ({
  default: {
    Math: {
      Between: vi.fn().mockReturnValue(1),
    },
    Utils: {
      Array: {
        GetRandom: vi.fn().mockReturnValue('rock'),
      },
    },
    GameObjects: {
      Graphics: class MockGraphics {
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
      },
    },
  },
}));

describe('ObstacleManager', () => {
  let mockScene: { add: { existing: ReturnType<typeof vi.fn> } };
  const lanePositions = [250, 400, 550];

  beforeEach(() => {
    mockScene = {
      add: {
        existing: vi.fn(),
      },
    };
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('initializes with correct default values', () => {
      const manager = new ObstacleManager(mockScene as any, lanePositions);

      expect(manager.obstacles).toEqual([]);
      expect(manager.spawnDistance).toBe(400);
      expect(manager.lastSpawnY).toBe(0);
      expect(manager.lanePositions).toEqual(lanePositions);
    });
  });

  describe('update', () => {
    it('spawns obstacles when camera scrolls', () => {
      const manager = new ObstacleManager(mockScene as any, lanePositions);

      manager.update(0);

      expect(manager.obstacles.length).toBe(1);
    });

    it('does not spawn obstacles too frequently', () => {
      const manager = new ObstacleManager(mockScene as any, lanePositions);

      manager.update(0);
      manager.update(50); // Only 50px scroll, shouldn't spawn

      expect(manager.obstacles.length).toBe(1);
    });

    it('spawns new obstacle after scrolling minSpawnInterval', () => {
      const manager = new ObstacleManager(mockScene as any, lanePositions);

      manager.update(0);
      manager.update(300); // 300px scroll, should spawn

      expect(manager.obstacles.length).toBe(2);
    });
  });

  describe('checkCollisions', () => {
    it('returns true when collision detected', () => {
      const manager = new ObstacleManager(mockScene as any, lanePositions);

      // Spawn an obstacle
      manager.spawnObstacle(200);

      const obstacle = manager.obstacles[0];
      const mockPlayer = {
        currentLane: obstacle.lane,
        y: obstacle.yPosition,
      };

      expect(manager.checkCollisions(mockPlayer as any)).toBe(true);
    });

    it('returns false when no collision', () => {
      const manager = new ObstacleManager(mockScene as any, lanePositions);

      manager.spawnObstacle(200);

      const mockPlayer = {
        currentLane: 0, // Different lane
        y: 200,
      };

      // The mock returns lane 1 for obstacles
      expect(manager.checkCollisions(mockPlayer as any)).toBe(false);
    });
  });

  describe('reset', () => {
    it('clears all obstacles and resets state', () => {
      const manager = new ObstacleManager(mockScene as any, lanePositions);

      manager.update(0);
      manager.update(300);
      expect(manager.obstacles.length).toBe(2);

      manager.reset();

      expect(manager.obstacles.length).toBe(0);
      expect(manager.lastSpawnY).toBe(0);
    });
  });

  describe('getActiveObstacles', () => {
    it('returns all active obstacles', () => {
      const manager = new ObstacleManager(mockScene as any, lanePositions);

      manager.spawnObstacle(100);
      manager.spawnObstacle(200);

      const obstacles = manager.getActiveObstacles();
      expect(obstacles.length).toBe(2);
    });
  });
});
