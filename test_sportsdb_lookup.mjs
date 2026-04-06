async function testSportsDb() {
  const players = ['Aaron Judge'];
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
      console.log(`Found ID: ${player.idPlayer}`);
      
      const lookupUrl = `https://www.thesportsdb.com/api/v1/json/3/lookupplayer.php?id=${player.idPlayer}`;
      const lookupRes = await fetch(lookupUrl);
      const lookupData = await lookupRes.json();
      console.log('Lookup Data Sample:', JSON.stringify(lookupData.players?.[0], null, 2).slice(0, 500));
    } catch (e) {
      console.log('FAILED:', e.message);
    }
  }
}
testSportsDb();
