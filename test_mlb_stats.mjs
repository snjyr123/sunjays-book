async function testMlbStats() {
  const name = 'Aaron Judge';
  console.log(`Testing MLB Stats for ${name}...`);
  try {
    const searchUrl = `https://statsapi.mlb.com/api/v1/people/search?names=${encodeURIComponent(name)}`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();
    const player = searchData.people?.[0];
    if (!player) {
      console.log('Player not found');
      return;
    }
    const id = player.id;
    console.log(`Found ID: ${id}`);

    const statsUrl = `https://statsapi.mlb.com/api/v1/people/${id}/stats?stats=gameLog&season=2024&group=hitting`;
    const statsRes = await fetch(statsUrl);
    const statsData = await statsRes.json();
    const games = statsData.stats?.[0]?.splits || [];
    console.log(`Found ${games.length} games`);
    if (games.length > 0) {
      const g = games[0];
      console.log('Sample game stats:', JSON.stringify(g.stat, null, 2));
      console.log('Sample game date:', g.date);
    }
  } catch (e) {
    console.log('FAILED:', e.message);
  }
}

testMlbStats();
