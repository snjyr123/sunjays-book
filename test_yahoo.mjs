async function testYahooGamelog() {
  const players = [
    { name: 'Patrick Mahomes', id: 'nfl.p.30123' },
    { name: 'Aaron Judge', id: 'mlb.p.9566' },
    { name: 'Lionel Messi', id: 'soc.p.20123' } // Guessing soccer id
  ];

  for (const p of players) {
    console.log(`\nTesting Yahoo Gamelog for ${p.name} (ID: ${p.id})...`);
    try {
      const url = `https://sports.yahoo.com/site/api/resource/sports.player.gamelog;id=${p.id}`;
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36' }
      });
      console.log(`- Status: ${res.status}`);
      const data = await res.json();
      if (data && !data.error) {
        console.log(`- Success! Data keys: ${Object.keys(data)}`);
        // Log a bit of the gamelog if found
        const gamelog = data.gamelog || data.player_gamelog;
        if (gamelog) {
          console.log('- Gamelog found');
        } else {
          console.log('- No gamelog key in response');
          console.log('- Sample response:', JSON.stringify(data).slice(0, 200));
        }
      } else {
        console.log(`- Error in response: ${JSON.stringify(data?.error || 'Unknown error')}`);
      }
    } catch (e) {
      console.log(`- FAILED: ${e.message}`);
    }
  }
}
testYahooGamelog();
