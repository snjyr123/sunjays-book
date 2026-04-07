import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Popular NBA Player IDs (Official NBA.com IDs)
const NBA_ID_MAP: { [key: string]: string } = {
  'lebronjames': '2544',
  'stephencurry': '201939',
  'kevindurant': '201142',
  'giannisantetokounmpo': '203507',
  'nikolajokic': '203999',
  'lukadoncic': '1629029',
  'shai-gilgeous-alexander': '1628983',
  'shaigilgeousalexander': '1628983',
  'jaysontatum': '1628369',
  'joelembiid': '203954',
  'anthony_davis': '203076',
  'anthonydavis': '203076',
  'devin_booker': '1626164',
  'devinbooker': '1626164',
  'donovan_mitchell': '1628378',
  'donovanmitchell': '1628378',
  'kawhi_leonard': '202695',
  'kawhileonard': '202695',
  'damian_lillard': '203081',
  'damianlillard': '203081',
  'kyrie_irving': '202681',
  'kyrieirving': '202681',
  'tyrese_haliburton': '1630169',
  'tyresehaliburton': '1630169',
  'anthony_edwards': '1630162',
  'anthonyedwards': '1630162',
  'victor_wembanyama': '1641705',
  'victorwembanyama': '1641705',
  'jaylen_brown': '1627759',
  'jaylenbrown': '1627759',
  'jimmy_butler': '202710',
  'jimmybutler': '202710',
  'bam_adebayo': '1628389',
  'bamadebayo': '1628389',
  'jalen_brunson': '1628973',
  'jalenbrunson': '1628973',
  'domantas_sabonis': '1627734',
  'domantassabonis': '1627734',
  'dearron_fox': '1628368',
  'dearronfox': '1628368',
  'lauri_markkanen': '1628374',
  'laurimarkkanen': '1628374',
  'trae_young': '1629027',
  'traeyoung': '1629027',
  'jamal_murray': '1627750',
  'jamalmurray': '1627750',
};

const sleeperPlayersCache: { [key: string]: Record<string, any> | null } = {
  nfl: null,
  nba: null
};

const normalizeName = (name: string) => {
  return name.toLowerCase()
    .normalize("NFD").replace(/[\u0300._\-\/]/g, "")
    .replace(/\./g, '')
    .replace(/ jr$/g, '')
    .replace(/ sr$/g, '')
    .replace(/ iii$/g, '')
    .replace(/ ii$/g, '')
    .replace(/ iv$/g, '')
    .replace(/ v$/g, '')
    .trim()
    .replace(/\s+/g, '');
};

async function getSleeperPlayerId(name: string, sport: string) {
  const s = sport.toLowerCase();
  if (s !== 'nfl' && s !== 'nba') return null;

  if (!sleeperPlayersCache[s]) {
    try {
      const res = await fetch(`https://api.sleeper.app/v1/players/${s}`);
      const data = await res.json();
      sleeperPlayersCache[s] = data;
    } catch (_e) {
      return null;
    }
  }

  const normalizedTarget = normalizeName(name);
  const players = sleeperPlayersCache[s];
  if (!players) return null;
  
  for (const id in players) {
    const p = players[id];
    const pName = normalizeName(p.full_name || `${p.first_name} ${p.last_name}`);
    if (pName === normalizedTarget) {
      return id;
    }
  }
  return null;
}

async function getNbaGamelog(name: string) {
  const normalized = normalizeName(name);
  const nbaId = NBA_ID_MAP[normalized];
  if (!nbaId) return null;

  try {
    const season = '2025-26'; // April 2026 context
    const url = `https://stats.nba.com/stats/playergamelog?PlayerID=${nbaId}&Season=${season}&SeasonType=Regular+Season`;
    
    const res = await fetch(url, {
      headers: {
        'Referer': 'https://www.nba.com/',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
      }
    });

    if (!res.ok) return null;
    const data = await res.json();
    if (!data.resultSets || !data.resultSets[0]) return null;
    
    const rows = data.resultSets[0].rowSet;
    const headers = data.resultSets[0].headers;
    const findIdx = (h: string) => headers.indexOf(h);
    
    return rows.slice(0, 5).map((row: any[]) => ({
      date: row[findIdx('GAME_DATE')],
      opponent: row[findIdx('MATCHUP')].split(' ').pop(),
      pts_nba: row[findIdx('PTS')],
      reb: row[findIdx('REB')],
      ast: row[findIdx('AST')],
      stl: row[findIdx('STL')],
      blk: row[findIdx('BLK')],
      tov: row[findIdx('TOV')],
      pra: row[findIdx('PTS')] + row[findIdx('REB')] + row[findIdx('AST')]
    }));
  } catch (_e) {
    return null;
  }
}

async function getSleeperStats(name: string, sport: string) {
  try {
    const s = sport.toLowerCase();
    
    // For NBA, try Official Gamelog first for REAL L5 games
    if (s === 'nba') {
      const gamelog = await getNbaGamelog(name);
      if (gamelog) return gamelog;
    }

    const playerId = await getSleeperPlayerId(name, s);
    if (!playerId) return null;

    const stateRes = await fetch(`https://api.sleeper.app/v1/state/${s}`);
    const state = await stateRes.json();
    const currentSeason = state.season;
    const currentWeek = state.week || (s === 'nba' ? 25 : 18); // Fallback to end of season
    
    const weeks = [];
    for (let i = 1; i <= 5; i++) {
      const w = currentWeek - i;
      if (w > 0) weeks.push(w);
    }
    
    if (weeks.length === 0) return null;

    const statsPromises = weeks.map(w => 
      fetch(`https://api.sleeper.app/v1/stats/${s}/regular/${currentSeason}/${w}`).then(r => r.json())
    );
    const projPromises = weeks.map(w => 
      fetch(`https://api.sleeper.app/projections/${s}/${currentSeason}/${w}?season_type=regular`).then(r => r.json())
    );
    
    const allWeeksStats = await Promise.all(statsPromises);
    const allWeeksProjs = await Promise.all(projPromises);
    
    const gamelog = [];
    for (let i = 0; i < weeks.length; i++) {
      const weekStats = allWeeksStats[i][playerId];
      const weekProj = allWeeksProjs[i][playerId];
      if (weekStats) {
        gamelog.push({
          date: s === 'nfl' ? `Week ${weeks[i]}` : `W${weeks[i]}`,
          opponent: weekProj?.opponent || 'TBD',
          pts: weekStats.pts_ppr || weekStats.pts_std || 0,
          passingYards: weekStats.pass_yd || 0,
          rushingYards: weekStats.rush_yd || 0,
          receivingYards: weekStats.rec_yd || 0,
          goals: weekStats.goals || 0,
          ast: weekStats.ast || 0,
          reb: weekStats.reb || 0,
          pts_nba: weekStats.pts || 0
        });
      }
    }
    return gamelog;
  } catch (_e) { return null; }
}

async function getMlbStats(name: string) {
  try {
    const searchUrl = `https://statsapi.mlb.com/api/v1/people/search?names=${encodeURIComponent(name)}`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();
    const player = searchData.people?.[0];
    if (!player) return null;

    const season = '2026'; // April 2026 context
    const statsUrl = `https://statsapi.mlb.com/api/v1/people/${player.id}/stats?stats=gameLog&season=${season}&group=hitting`;
    const statsRes = await fetch(statsUrl);
    const statsData = await statsRes.json();
    const games = statsData.stats?.[0]?.splits || [];

    return games.slice(0, 5).map((g: { date: string, opponent: { name: string }, stat: Record<string, number> }) => ({
      date: new Date(g.date).toLocaleDateString([], { month: 'numeric', day: 'numeric' }),
      opponent: g.opponent?.name || 'TBD',
      pts: g.stat.totalBases || 0,
      totalBases: g.stat.totalBases || 0,
      strikeouts: g.stat.strikeOuts || 0,
      hits: g.stat.hits || 0,
      runs: g.stat.runs || 0,
      rbi: g.stat.rbi || 0
    }));
  } catch (_e) { return null; }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name') || '';
  const sport = (searchParams.get('sport') || '').toUpperCase();

  if (!name) return NextResponse.json({ stats: [] });

  let stats = null;
  if (sport === 'MLB') {
    stats = await getMlbStats(name);
  } else if (sport === 'NFL' || sport === 'NBA') {
    stats = await getSleeperStats(name, sport);
  }

  return NextResponse.json({ stats: stats || [] });
}
