import { TeamMarket } from '@/types/dfs';

export async function fetchEspnMoneylines(sport: string, league: string, params: string = '') {
  try {
    const url = `https://site.api.espn.com/apis/site/v2/sports/${sport}/${league}/scoreboard${params}`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    const data = await res.json();
    
    return (data.events || []).map((event: any) => {
      const competition = event.competitions[0];
      const odds = competition.odds?.[0] || {};
      
      const homeTeam = competition.competitors.find((c: any) => c.homeAway === 'home');
      const awayTeam = competition.competitors.find((c: any) => c.homeAway === 'away');

      // Enhanced with Live Scores and Status
      return {
        id: event.id,
        sport: league.toUpperCase() === 'MENS-COLLEGE-BASKETBALL' ? 'CBB' : league.toUpperCase(),
        homeTeam: homeTeam.team.abbreviation,
        awayTeam: awayTeam.team.abbreviation,
        homeScore: homeTeam.score || '0',
        awayScore: awayTeam.score || '0',
        homeMoneyline: odds.homeMoneyLine || 'N/A',
        awayMoneyline: odds.awayMoneyLine || 'N/A',
        status: event.status.type.shortDetail, // e.g. "Final", "Q4", "LIVE"
        startTime: event.date
      };
    });
  } catch (e) {
    return [];
  }
}

export async function fetchAllTeamMarkets() {
  try {
    const [nba, mlb, nfl, soccer, cbb] = await Promise.all([
      fetchEspnMoneylines('basketball', 'nba'),
      fetchEspnMoneylines('baseball', 'mlb'),
      fetchEspnMoneylines('football', 'nfl'),
      fetchEspnMoneylines('soccer', 'eng.1'),
      fetchEspnMoneylines('basketball', 'mens-college-basketball', '?groups=50')
    ]);

    return [...nba, ...mlb, ...nfl, ...soccer, ...cbb];
  } catch (error) {
    return [];
  }
}
