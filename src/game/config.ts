import Phaser from 'phaser';
import MenuScene from './scenes/MenuScene';
import MainScene from './scenes/MainScene';
import GameOverScene from './scenes/GameOverScene';
import HelpScene from './scenes/HelpScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  backgroundColor: '#E1F5FE',
  scene: [MenuScene, MainScene, GameOverScene, HelpScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false
    }
  }
};

export default config;
