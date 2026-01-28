import { CategoryDef, Difficulty, Word } from './types';

export const CATEGORIES: CategoryDef[] = [
  { 
    id: 'objects', 
    name: 'اشیاء', 
    icon: '📦', 
    levels: [Difficulty.LEVEL1, Difficulty.LEVEL3], 
    hasAdult: true 
  },
  { 
    id: 'jobs', 
    name: 'مشاغل', 
    icon: '💼', 
    levels: [Difficulty.LEVEL1, Difficulty.LEVEL3], 
    hasAdult: true 
  },
  { 
    id: 'places', 
    name: 'اماکن', 
    icon: '📍', 
    levels: [Difficulty.LEVEL1, Difficulty.LEVEL3], 
    hasAdult: true 
  },
  { 
    id: 'celebrities', 
    name: 'مشاهیر', 
    icon: '🌟', 
    levels: [Difficulty.LEVEL1, Difficulty.LEVEL3], 
    hasAdult: true 
  },
  { 
    id: 'animals', 
    name: 'حیوانات', 
    icon: '🦁', 
    levels: [Difficulty.LEVEL1, Difficulty.LEVEL3], 
    hasAdult: true 
  },
  { 
    id: 'food', 
    name: 'خوراکی‌ها', 
    icon: '🍕', 
    levels: [Difficulty.LEVEL1, Difficulty.LEVEL3], 
    hasAdult: true 
  },
  { 
    id: 'proverbs', 
    name: 'ضرب‌المثل', 
    icon: '📜', 
    levels: [Difficulty.PROVERB], 
    hasAdult: true 
  },
  { 
    id: 'movies', 
    name: 'فیلم و سریال', 
    icon: '🎬', 
    levels: [Difficulty.LEVEL1, Difficulty.LEVEL3], 
    hasAdult: true 
  },
  { 
    id: 'actions', 
    name: 'فعالیت‌ها', 
    icon: '🎭', 
    levels: [Difficulty.LEVEL1, Difficulty.LEVEL3], 
    hasAdult: true 
  },
  { 
    id: 'nostalgia', 
    name: 'نوستالژی', 
    icon: '📼', 
    levels: [Difficulty.LEVEL1, Difficulty.LEVEL3], 
    hasAdult: true 
  },
  { 
    id: 'literature', 
    name: 'ادبیات', 
    icon: '📚', 
    levels: [Difficulty.LEVEL1, Difficulty.LEVEL3], 
    hasAdult: true 
  },
  { 
    id: 'technology', 
    name: 'تکنولوژی', 
    icon: '💻', 
    levels: [Difficulty.LEVEL1, Difficulty.LEVEL3], 
    hasAdult: true 
  },
  { 
    id: 'sports', 
    name: 'ورزش', 
    icon: '⚽', 
    levels: [Difficulty.LEVEL1, Difficulty.LEVEL3], 
    hasAdult: true 
  },
  { 
    id: 'abstract', 
    name: 'مفاهیم', 
    icon: '💭', 
    levels: [Difficulty.LEVEL1, Difficulty.LEVEL3], 
    hasAdult: true 
  },
  { 
    id: 'music', 
    name: 'موسیقی', 
    icon: '🎵', 
    levels: [Difficulty.LEVEL1, Difficulty.LEVEL3], 
    hasAdult: true 
  },
  { 
    id: 'events', 
    name: 'حوادث', 
    icon: '📅', 
    levels: [Difficulty.LEVEL1, Difficulty.LEVEL3], 
    hasAdult: true 
  },
  { 
    id: 'no_hands', 
    name: 'بدون دست', 
    icon: '🤐', 
    levels: [Difficulty.LEVEL1, Difficulty.LEVEL3], 
    hasAdult: true 
  },
  { 
    id: 'history', 
    name: 'تاریخ', 
    icon: '🏛️', 
    levels: [Difficulty.LEVEL1, Difficulty.LEVEL3], 
    hasAdult: true 
  },
  { 
    id: 'political', 
    name: 'سیاسی', 
    icon: '🗳️', 
    levels: [Difficulty.LEVEL1, Difficulty.LEVEL3], 
    hasAdult: true 
  },
  { 
    id: 'nature', 
    name: 'طبیعت', 
    icon: '🌳', 
    levels: [Difficulty.LEVEL1, Difficulty.LEVEL3], 
    hasAdult: true 
  },
  { 
    id: 'health', 
    name: 'پزشکی', 
    icon: '🩺', 
    levels: [Difficulty.LEVEL1, Difficulty.LEVEL3], 
    hasAdult: true 
  },
];

export const SCORING = {
  SWAP_PENALTY: 1,
  FOUL_PENALTY: 0.5,
  COMBO_BONUS: 1,
  ADULT_BONUS: 1,
  TIME_BONUS_FAST: 2, // < 33% used
  TIME_BONUS_MED: 1,  // < 66% used
};

export const TIMER_CONFIG = {
  BASE: 40,
  PER_WORD: 10,
  BONUS_HARD: 20,
  BONUS_PROVERB: 40,
};