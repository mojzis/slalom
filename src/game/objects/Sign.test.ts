import { describe, it, expect, vi, beforeEach } from 'vitest';
import Sign from './Sign';

// Mock Phaser
vi.mock('phaser', () => {
  class MockGraphics {
    fillStyle = vi.fn().mockReturnThis();
    fillRoundedRect = vi.fn().mockReturnThis();
    lineStyle = vi.fn().mockReturnThis();
    strokeRoundedRect = vi.fn().mockReturnThis();
    destroy = vi.fn();
  }

  class MockText {
    setOrigin = vi.fn().mockReturnThis();
    destroy = vi.fn();
  }

  class MockContainer {
    x = 0;
    y = 0;
    alpha = 0;
    scene: any;

    constructor(scene: any, x: number, y: number) {
      this.scene = scene;
      this.x = x;
      this.y = y;
    }

    add = vi.fn().mockReturnThis();
    setAlpha = vi.fn().mockImplementation((alpha: number) => {
      this.alpha = alpha;
      return this;
    });
    destroy = vi.fn();
  }

  return {
    default: {
      GameObjects: {
        Container: MockContainer,
        Graphics: MockGraphics,
        Text: MockText,
      },
    },
  };
});

describe('Sign', () => {
  let mockScene: any;

  beforeEach(() => {
    mockScene = {
      add: {
        graphics: vi.fn().mockReturnValue({
          fillStyle: vi.fn().mockReturnThis(),
          fillRoundedRect: vi.fn().mockReturnThis(),
          lineStyle: vi.fn().mockReturnThis(),
          strokeRoundedRect: vi.fn().mockReturnThis(),
          destroy: vi.fn(),
        }),
        text: vi.fn().mockReturnValue({
          setOrigin: vi.fn().mockReturnThis(),
          destroy: vi.fn(),
        }),
        existing: vi.fn(),
      },
      tweens: {
        add: vi.fn(),
      },
    };
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('creates a sign with correct properties', () => {
      const sign = new Sign(mockScene, 400, 200, 'TEST', 500);

      expect(sign.word).toBe('TEST');
      expect(sign.relatedObstacleY).toBe(500);
      expect(sign.hasBeenSeen).toBe(false);
    });

    it('creates background and text elements', () => {
      new Sign(mockScene, 400, 200, 'ROCK', 500);

      expect(mockScene.add.graphics).toHaveBeenCalled();
      expect(mockScene.add.text).toHaveBeenCalledWith(
        0, 0, 'ROCK',
        expect.objectContaining({
          fontFamily: 'Quicksand, sans-serif',
          fontSize: '32px',
        })
      );
    });

    it('adds sign to scene', () => {
      new Sign(mockScene, 400, 200, 'LEFT', 500);
      expect(mockScene.add.existing).toHaveBeenCalled();
    });
  });

  describe('fadeIn', () => {
    it('triggers fade in tween', () => {
      const sign = new Sign(mockScene, 400, 200, 'RIGHT', 500);
      sign.fadeIn();

      expect(mockScene.tweens.add).toHaveBeenCalledWith(
        expect.objectContaining({
          targets: sign,
          alpha: 1,
          duration: 300,
        })
      );
    });
  });

  describe('fadeOut', () => {
    it('triggers fade out tween', () => {
      const sign = new Sign(mockScene, 400, 200, 'TREE', 500);
      sign.fadeOut();

      expect(mockScene.tweens.add).toHaveBeenCalledWith(
        expect.objectContaining({
          targets: sign,
          alpha: 0,
          duration: 300,
        })
      );
    });
  });

  describe('checkVisibility', () => {
    it('triggers fadeIn when player approaches obstacle', () => {
      const sign = new Sign(mockScene, 400, 200, 'GAP', 500);
      const fadeInSpy = vi.spyOn(sign, 'fadeIn');

      // Player at y=100, obstacle at y=500, distance = -400 (within -600 to -100 range)
      sign.checkVisibility(0, 100);

      expect(fadeInSpy).toHaveBeenCalled();
      expect(sign.hasBeenSeen).toBe(true);
    });

    it('does not fadeIn if already seen', () => {
      const sign = new Sign(mockScene, 400, 200, 'ICE', 500);
      sign.hasBeenSeen = true;
      const fadeInSpy = vi.spyOn(sign, 'fadeIn');

      sign.checkVisibility(0, 100);

      expect(fadeInSpy).not.toHaveBeenCalled();
    });

    it('triggers fadeOut after passing obstacle', () => {
      const sign = new Sign(mockScene, 400, 200, 'DUCK', 500);
      sign.alpha = 1;
      const fadeOutSpy = vi.spyOn(sign, 'fadeOut');

      // Player past obstacle (playerY > obstacleY)
      sign.checkVisibility(0, 600);

      expect(fadeOutSpy).toHaveBeenCalled();
    });
  });
});
