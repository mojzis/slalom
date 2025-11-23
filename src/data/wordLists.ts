export const WORD_LISTS = {
  directional: ['LEFT', 'RIGHT', 'CENTER', 'STAY', 'TURN', 'VEER', 'SHIFT'],
  hazards: ['ROCK', 'TREE', 'GAP', 'BRANCH', 'ICE', 'BUMP', 'HOLE', 'DRIFT'],
  actions: ['SLOW', 'FAST', 'DUCK', 'JUMP', 'LEAN', 'GLIDE', 'BRAKE'],
  modifiers: ['BIG', 'SMALL', 'CAREFUL', 'QUICK', 'STEEP', 'FLAT']
};

export const OBSTACLE_WORDS: Record<string, string[]> = {
  rock: ['ROCK', 'RIGHT', 'LEFT', 'AVOID', 'STONE', 'VEER', 'MISS', 'PASS'],
  tree: ['TREE', 'RIGHT', 'LEFT', 'DODGE', 'PINE', 'TRUNK', 'LIMB', 'MISS'],
  gap: ['GAP', 'RIGHT', 'LEFT', 'JUMP', 'HOLE', 'LEAP', 'SPAN', 'SKIP'],
  branch: ['BRANCH', 'DUCK', 'LOW', 'LIMB', 'BEND', 'CROUCH', 'DIP', 'BOW'],
  ice: ['ICE', 'CAREFUL', 'SLOW', 'SLICK', 'SLIDE', 'GRIP', 'GLIDE', 'EASE']
};

export const BEGINNER_WORDS = [
  'LEFT', 'RIGHT', 'TREE', 'ROCK', 'GAP', 'STAY', 'GO', 'STOP',
  'LOOK', 'WAIT', 'MISS', 'PASS', 'MOVE', 'SKIP', 'TURN'
];

export const WORD_LISTS_BY_TIER = {
  beginner: {
    directional: ['LEFT', 'RIGHT', 'STAY', 'TURN', 'MOVE', 'PASS'],
    hazards: ['TREE', 'ROCK', 'GAP', 'BUMP', 'HOLE'],
    actions: ['GO', 'STOP', 'LOOK', 'WAIT', 'MISS', 'SKIP']
  },
  intermediate: {
    directional: ['LEFT', 'RIGHT', 'CENTER', 'TURN', 'VEER', 'SHIFT', 'SWING', 'SLIDE'],
    hazards: ['TREE', 'ROCK', 'GAP', 'BRANCH', 'ICE', 'BUMP', 'DRIFT', 'SLOPE', 'RIDGE'],
    actions: ['DUCK', 'JUMP', 'SLOW', 'FAST', 'AVOID', 'LEAN', 'CROUCH', 'GLIDE', 'BRAKE', 'EASE']
  },
  advanced: {
    directional: ['LEFT', 'RIGHT', 'CENTER', 'MIDDLE', 'CURVE', 'STRAIGHT', 'VEER', 'ANGLE', 'SWEEP', 'ARC', 'BANK', 'CARVE'],
    hazards: ['TREE', 'ROCK', 'GAP', 'BRANCH', 'ICE', 'CLIFF', 'LOG', 'MUD', 'WATER', 'PINE', 'STUMP', 'DRIFT', 'RIDGE', 'LEDGE', 'CRACK'],
    actions: ['DUCK', 'JUMP', 'SLOW', 'FAST', 'AVOID', 'DODGE', 'WATCH', 'LEAN', 'TUCK', 'BRAKE', 'CROUCH', 'SPRING', 'WEAVE', 'SWERVE'],
    modifiers: ['BIG', 'SMALL', 'CAREFUL', 'QUICK', 'WIDE', 'NARROW', 'STEEP', 'SHARP', 'DEEP', 'THIN', 'THICK', 'DENSE']
  }
};
