export type Platform = 'Underdog' | 'Prizepicks' | 'Onyx' | 'Sleeper' | 'Chalkboard' | 'Draftkings Pick 6';

export interface GameStat {
  date: string;
  value: number;
}

export interface Line {
  platform: Platform;
  value: number;
  type: string;
  isHigher?: boolean;
}

export interface PlayerProjection {
  id: string;
  name: string;
  imageUrl?: string;
  team: string;
  opponent: string;
  matchup?: string;
  sport: string;
  lines: Line[];
  lastFiveGames?: GameStat[];
  aiScore?: number;
  l5Avg?: number;
  diff?: number;
  odds?: string;
}

export interface TeamMarket {
  id: string;
  sport: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: string;
  awayScore?: string;
  homeMoneyline: string;
  awayMoneyline: string;
  status?: string;
  startTime: string;
}

export interface DfsData {
  projections: PlayerProjection[];
  teamMarkets: TeamMarket[];
  lastUpdated: string;
}
