async function testSportsDb() {
  const players = ['Aaron Judge', 'Patrick Mahomes', 'Lionel Messi'];
  for (const name of players) {
    console.log(`\nTesting SportsDB for ${name}...`);
    try {
      const searchUrl = `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(name)}`;
      const searchRes = await fetch(searchUrl);
      const searchData = await searchRes.json();
      const player = searchData.player?.[0];
      if (!player) {
        console.log('Player not found');
        continue;
      }
      console.log(`Found ID: ${player.idPlayer}, Sport: ${player.strSport}, Team: ${player.strTeam}`);
      
      // Look up results?
      // TheSportsDB doesn't have a direct "gamelog" for players in the free API usually.
      // But let's check what endpoints are available.
    } catch (e) {
      console.log('FAILED:', e.message);
    }
  }
}
testSportsDb();
