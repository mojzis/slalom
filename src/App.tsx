import { useState } from 'react';
import Phaser from 'phaser';
import PhaserGame from './components/PhaserGame';
import GameOverlay from './components/GameOverlay';

function App() {
  const [game, setGame] = useState<Phaser.Game | null>(null);

  return (
    <div className="app-container">
      <h1>Word Reader Downhill</h1>
      <div style={{ position: 'relative' }}>
        <PhaserGame onGameReady={setGame} />
        <GameOverlay gameInstance={game} />
      </div>
    </div>
  );
}

export default App;
