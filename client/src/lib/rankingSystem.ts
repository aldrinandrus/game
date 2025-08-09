export type Rank = 'bronze' | 'silver' | 'gold';

export interface PlayerStats {
  address: string;
  totalPoints: number;
  gamesPlayed: number;
  rank: Rank;
}

export interface LeaderboardEntry extends PlayerStats {
  position: number;
}

export const getRank = (points: number): Rank => {
  if (points >= 100) return 'gold';
  if (points >= 50) return 'silver';
  return 'bronze';
};

export const rankEmoji: Record<Rank, string> = {
  bronze: '🥉',
  silver: '🥈',
  gold: '🥇'
};

export const rankColors: Record<Rank, { bg: string; text: string; border: string }> = {
  bronze: {
    bg: 'bg-orange-100',
    text: 'text-orange-900',
    border: 'border-orange-200'
  },
  silver: {
    bg: 'bg-slate-100',
    text: 'text-slate-900',
    border: 'border-slate-200'
  },
  gold: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-900',
    border: 'border-yellow-200'
  }
};
