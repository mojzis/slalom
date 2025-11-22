export const WORD_LISTS = {
  directional: ['LEFT', 'RIGHT', 'CENTER', 'STAY'],
  hazards: ['ROCK', 'TREE', 'GAP', 'BRANCH', 'ICE'],
  actions: ['SLOW', 'FAST', 'DUCK', 'JUMP'],
  modifiers: ['BIG', 'SMALL', 'CAREFUL', 'QUICK']
};

export const OBSTACLE_WORDS: Record<string, string[]> = {
  rock: ['ROCK', 'RIGHT', 'LEFT', 'AVOID'],
  tree: ['TREE', 'RIGHT', 'LEFT', 'DODGE'],
  gap: ['GAP', 'RIGHT', 'LEFT', 'JUMP'],
  branch: ['BRANCH', 'DUCK', 'LOW'],
  ice: ['ICE', 'CAREFUL', 'SLOW']
};

export const BEGINNER_WORDS = [
  'LEFT', 'RIGHT', 'TREE', 'ROCK', 'GAP', 'STAY', 'GO', 'STOP'
];

export const WORD_LISTS_BY_TIER = {
  beginner: {
    directional: ['LEFT', 'RIGHT', 'STAY'],
    hazards: ['TREE', 'ROCK', 'GAP'],
    actions: ['GO', 'STOP']
  },
  intermediate: {
    directional: ['LEFT', 'RIGHT', 'CENTER', 'TURN'],
    hazards: ['TREE', 'ROCK', 'GAP', 'BRANCH', 'ICE'],
    actions: ['DUCK', 'JUMP', 'SLOW', 'FAST', 'AVOID']
  },
  advanced: {
    directional: ['LEFT', 'RIGHT', 'CENTER', 'MIDDLE', 'CURVE', 'STRAIGHT'],
    hazards: ['TREE', 'ROCK', 'GAP', 'BRANCH', 'ICE', 'CLIFF', 'LOG', 'MUD', 'WATER'],
    actions: ['DUCK', 'JUMP', 'SLOW', 'FAST', 'AVOID', 'DODGE', 'WATCH'],
    modifiers: ['BIG', 'SMALL', 'CAREFUL', 'QUICK', 'WIDE', 'NARROW']
  }
};
