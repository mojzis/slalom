import { useState, useEffect } from 'react';
import Phaser from 'phaser';
import { ScoreData } from '../game/managers/ScoreManager';

interface Props {
  gameInstance: Phaser.Game | null;
}

export default function GameOverlay({ gameInstance }: Props) {
  const [stats, setStats] = useState<ScoreData>({
    distance: 0,
    highScore: 0,
    speed: 2
  });
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!gameInstance) return;

    const checkScene = () => {
      const scene = gameInstance.scene.getScene('MainScene');
      if (scene && scene.scene.isActive()) {
        setIsPlaying(true);

        const handleScoreUpdate = (data: ScoreData) => {
          setStats(data);
        };

        scene.events.on('scoreUpdate', handleScoreUpdate);

        return () => {
          scene.events.off('scoreUpdate', handleScoreUpdate);
        };
      } else {
        setIsPlaying(false);
      }
      return undefined;
    };

    // Check immediately
    const cleanup = checkScene();

    // Also listen for scene changes
    const handleSceneStart = (sys: Phaser.Scenes.Systems) => {
      if (sys.settings.key === 'MainScene') {
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }
    };

    gameInstance.events.on('scenestart', handleSceneStart);

    return () => {
      if (cleanup) cleanup();
      gameInstance.events.off('scenestart', handleSceneStart);
    };
  }, [gameInstance]);

  // Don't render if not playing
  if (!isPlaying) return null;

  return (
    <div style={{
      position: 'absolute',
      top: 20,
      left: 20,
      color: '#4A5568',
      fontFamily: 'Quicksand, sans-serif',
      fontSize: '24px',
      pointerEvents: 'none',
      zIndex: 10
    }}>
      <div>Distance: {stats.distance}m</div>
      <div style={{ fontSize: '18px', color: '#6B7280', marginTop: '8px' }}>
        Best: {stats.highScore}m
      </div>
      <div style={{ fontSize: '14px', color: '#8FA9B8', marginTop: '4px' }}>
        Speed: {stats.speed.toFixed(1)}x
      </div>
    </div>
  );
}
