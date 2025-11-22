import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import config from '../game/config';

let gameInstance: Phaser.Game | null = null;

export function getGameInstance(): Phaser.Game | null {
  return gameInstance;
}

export default function PhaserGame() {
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gameRef.current && !gameInstance) {
      // Create Phaser game instance
      gameInstance = new Phaser.Game({
        ...config,
        parent: gameRef.current
      });
    }

    // Cleanup on unmount
    return () => {
      if (gameInstance) {
        gameInstance.destroy(true);
        gameInstance = null;
      }
    };
  }, []);

  return <div ref={gameRef} id="game-container" />;
}
