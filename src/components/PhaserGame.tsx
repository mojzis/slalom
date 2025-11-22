import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import config from '../game/config';

// Export game instance for event communication
export let gameInstance: Phaser.Game | null = null;

export default function PhaserGame() {
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gameRef.current && !gameInstance) {
      // Create Phaser game with container reference
      const gameConfig = {
        ...config,
        parent: gameRef.current
      };

      gameInstance = new Phaser.Game(gameConfig);

      console.log('Phaser game initialized, version:', Phaser.VERSION);
    }

    // Cleanup on unmount
    return () => {
      if (gameInstance) {
        gameInstance.destroy(true);
        gameInstance = null;
        console.log('Phaser game destroyed');
      }
    };
  }, []);

  return <div ref={gameRef} id="game-container" />;
}
