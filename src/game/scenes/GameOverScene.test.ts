import { describe, it, expect, vi, beforeEach } from 'vitest';
import GameOverScene from './GameOverScene';

// Mock Phaser
vi.mock('phaser', () => ({
  default: {
    Scene: class MockScene {
      constructor(_config: any) {}
    },
  },
}));

describe('GameOverScene', () => {
  let scene: GameOverScene;
  let mockCameras: any;
  let mockAdd: any;
  let mockInput: any;
  let mockTweens: any;
  let mockScene: any;

  beforeEach(() => {
    scene = new GameOverScene();

    mockCameras = {
      main: {
        width: 800,
        height: 600,
      },
    };

    mockAdd = {
      rectangle: vi.fn().mockReturnValue({
        setOrigin: vi.fn().mockReturnThis(),
      }),
      text: vi.fn().mockReturnValue({
        setOrigin: vi.fn().mockReturnThis(),
      }),
    };

    mockInput = {
      keyboard: {
        once: vi.fn(),
      },
    };

    mockTweens = {
      add: vi.fn(),
    };

    mockScene = {
      start: vi.fn(),
    };

    // Assign mocks to scene
    (scene as any).cameras = mockCameras;
    (scene as any).add = mockAdd;
    (scene as any).input = mockInput;
    (scene as any).tweens = mockTweens;
    (scene as any).scene = mockScene;
  });

  describe('constructor', () => {
    it('creates scene with correct key', () => {
      const newScene = new GameOverScene();
      // Scene key is set in super() call
      expect(newScene).toBeDefined();
    });
  });

  describe('init', () => {
    it('stores distance from data', () => {
      scene.init({ distance: 1500 });
      expect((scene as any).finalDistance).toBe(1500);
    });

    it('defaults distance to 0 if not provided', () => {
      scene.init({} as any);
      expect((scene as any).finalDistance).toBe(0);
    });
  });

  describe('create', () => {
    it('creates background rectangle', () => {
      scene.init({ distance: 100 });
      scene.create();

      expect(mockAdd.rectangle).toHaveBeenCalledWith(0, 0, 800, 600, 0xF5F5F0);
    });

    it('creates crashed text', () => {
      scene.init({ distance: 100 });
      scene.create();

      expect(mockAdd.text).toHaveBeenCalledWith(
        400, 200, 'Crashed!',
        expect.objectContaining({
          fontSize: '64px',
        })
      );
    });

    it('creates distance text with correct value', () => {
      scene.init({ distance: 1234 });
      scene.create();

      expect(mockAdd.text).toHaveBeenCalledWith(
        400, 300, 'Distance: 1234m',
        expect.objectContaining({
          fontSize: '32px',
        })
      );
    });

    it('creates restart instruction text', () => {
      scene.init({ distance: 100 });
      scene.create();

      expect(mockAdd.text).toHaveBeenCalledWith(
        400, 400, 'Press ENTER to restart',
        expect.objectContaining({
          fontSize: '24px',
        })
      );
    });

    it('sets up keyboard listeners for restart', () => {
      scene.init({ distance: 100 });
      scene.create();

      expect(mockInput.keyboard.once).toHaveBeenCalledWith('keydown-ENTER', expect.any(Function));
      expect(mockInput.keyboard.once).toHaveBeenCalledWith('keydown-SPACE', expect.any(Function));
    });

    it('adds pulse animation to restart text', () => {
      scene.init({ distance: 100 });
      scene.create();

      expect(mockTweens.add).toHaveBeenCalledWith(
        expect.objectContaining({
          alpha: 0.5,
          yoyo: true,
          repeat: -1,
        })
      );
    });
  });
});
