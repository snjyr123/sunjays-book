async function testNbaGamelog() {
  const playerId = '2544'; // LeBron James
  const season = '2023-24';
  const url = `https://stats.nba.com/stats/playergamelog?PlayerID=${playerId}&Season=${season}&SeasonType=Regular+Season`;
  
  console.log(`Testing Official NBA Stats Gamelog for ${playerId}...`);
  try {
    const res = await fetch(url, {
      headers: {
        'Referer': 'https://www.nba.com/',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
      }
    });
    console.log(`- Status: ${res.status}`);
    const data = await res.json();
    if (data.resultSets) {
      const rows = data.resultSets[0].rowSet;
      console.log(`- Found ${rows.length} games`);
      if (rows.length > 0) {
        console.log(`- Sample Game:`, JSON.stringify(rows[0]));
      }
    }
  } catch (e) {
    console.log(`- FAILED: ${e.message}`);
  }
}
testNbaGamelog();
