import { NextResponse } from 'next/server';

async function fetchEspnMoneylines(sport: string, league: string, params: string = '') {
  try {
    const url = `https://site.api.espn.com/apis/site/v2/sports/${sport}/${league}/scoreboard${params}`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    const data = await res.json();
    
    return (data.events || []).map((event: any) => {
      const competition = event.competitions[0];
      const odds = competition.odds?.[0] || {};
      
      const homeTeam = competition.competitors.find((c: any) => c.homeAway === 'home');
      const awayTeam = competition.competitors.find((c: any) => c.homeAway === 'away');

      return {
        id: event.id,
        sport: league.toUpperCase() === 'MENS-COLLEGE-BASKETBALL' ? 'CBB' : league.toUpperCase(),
        homeTeam: homeTeam.team.abbreviation,
        awayTeam: awayTeam.team.abbreviation,
        homeMoneyline: odds.homeMoneyLine || 'N/A',
        awayMoneyline: odds.awayMoneyLine || 'N/A',
        startTime: event.date
      };
    });
  } catch (e) {
    return [];
  }
}

export async function GET() {
  try {
    // Parallel fetch with improved CBB and Soccer slugs
    const [nba, mlb, nfl, soccer, cbb] = await Promise.all([
      fetchEspnMoneylines('basketball', 'nba'),
      fetchEspnMoneylines('baseball', 'mlb'),
      fetchEspnMoneylines('football', 'nfl'),
      fetchEspnMoneylines('soccer', 'eng.1'), // English Premier League
      fetchEspnMoneylines('basketball', 'mens-college-basketball', '?groups=50') // All Div I
    ]);

    const allMarkets = [...nba, ...mlb, ...nfl, ...soccer, ...cbb];

    return NextResponse.json({
      teamMarkets: allMarkets
    });
  } catch (error) {
    return NextResponse.json({ teamMarkets: [] });
  }
}
