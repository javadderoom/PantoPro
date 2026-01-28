export enum Difficulty {
  LEVEL1 = 1,
  LEVEL3 = 3,
  PROVERB = 10
}

export type CategoryId = 
  | 'objects' 
  | 'jobs' 
  | 'places' 
  | 'celebrities' 
  | 'animals' 
  | 'food' 
  | 'proverbs' 
  | 'movies' 
  | 'actions' 
  | 'nostalgia' 
  | 'literature' 
  | 'technology' 
  | 'sports' 
  | 'abstract' 
  | 'music' 
  | 'events' 
  | 'no_hands' 
  | 'history' 
  | 'political' 
  | 'nature' 
  | 'health';

export interface Word {
  text: string;
  difficulty: Difficulty;
  category: CategoryId;
  isAdult?: boolean;
}

export interface Team {
  id: string;
  name: string;
  score: number;
  comboStreak: number;
  history: string[]; // IDs of categories played
}

export interface GameSettings {
  maxRounds: number;
  adultMode: boolean;
}

export interface TurnState {
  active: boolean;
  teamId: string;
  word: Word | null;
  timeLeft: number;
  totalTime: number;
  swapsUsed: number;
  fouls: number;
  isPaused: boolean;
}

export interface GameState {
  status: 'HOME' | 'SETUP' | 'CATEGORY_SELECT' | 'DIFFICULTY_SELECT' | 'PLAYING' | 'SUMMARY' | 'GAME_OVER';
  teams: Team[];
  currentTeamIndex: number;
  currentRound: number;
  settings: GameSettings;
  turn: TurnState;
  usedWords: string[];
}

export interface CategoryDef {
  id: CategoryId;
  name: string;
  icon: string;
  levels: Difficulty[];
  hasAdult: boolean;
}