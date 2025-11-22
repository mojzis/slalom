import Phaser from 'phaser';

export interface LaneConfig {
  totalLanes: number;
  laneWidth: number;
  lanePositions: number[];
}

export function calculateLanePositions(
  gameWidth: number,
  numLanes: number
): number[] {
  const centerX = gameWidth / 2;
  if (numLanes === 3) {
    return [centerX - 150, centerX, centerX + 150];
  } else if (numLanes === 5) {
    return [centerX - 300, centerX - 150, centerX, centerX + 150, centerX + 300];
  }
  return [centerX];
}

export function drawLaneGuides(
  _scene: Phaser.Scene,
  lanePositions: number[],
  graphics: Phaser.GameObjects.Graphics,
  scrollY: number,
  viewHeight: number
): void {
  graphics.clear();
  graphics.lineStyle(1, 0xD4D4C8, 0.5);

  lanePositions.forEach(x => {
    graphics.lineBetween(x, scrollY, x, scrollY + viewHeight);
  });
}
