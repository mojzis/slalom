import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import config from '../game/config';

let gameInstance: Phaser.Game | null = null;

export function getGameInstance(): Phaser.Game | null {
  return gameInstance;
}

interface Props {
  onGameReady?: (game: Phaser.Game) => void;
}

export default function PhaserGame({ onGameReady }: Props) {
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gameRef.current && !gameInstance) {
      // Create Phaser game instance
      gameInstance = new Phaser.Game({
        ...config,
        parent: gameRef.current
      });

      // Notify parent that game is ready
      if (onGameReady) {
        onGameReady(gameInstance);
      }
    }

    // Cleanup on unmount
    return () => {
      if (gameInstance) {
        gameInstance.destroy(true);
        gameInstance = null;
      }
    };
  }, [onGameReady]);

  return <div ref={gameRef} id="game-container" />;
}
