async function testNewEndpoints() {
  const players = [
    { name: 'LeBron James', id: '1966', league: 'nba', sport: 'basketball' },
    { name: 'Shohei Ohtani', id: '33709', league: 'mlb', sport: 'baseball' }
  ];

  for (const p of players) {
    console.log(`\n--- Testing ${p.name} ---`);
    
    // Test Site API V2 (ESPN)
    const url1 = `https://site.api.espn.com/apis/site/v2/sports/${p.sport}/${p.league}/athletes/${p.id}/gamelog`;
    console.log(`Testing URL 1: ${url1}`);
    try {
      const res = await fetch(url1);
      const data = await res.json();
      const count = data.entries?.[0]?.events?.length || data.entries?.length || 0;
      console.log(`- Result: Found ${count} games`);
    } catch (e) {
      console.log(`- FAILED URL 1: ${e.message}`);
    }

    // Test Common V3 (ESPN)
    const url2 = `https://site.web.api.espn.com/apis/common/v3/sports/${p.sport}/${p.league}/athletes/${p.id}/gamelog`;
    console.log(`Testing URL 2: ${url2}`);
    try {
      const res = await fetch(url2);
      const data = await res.json();
      console.log(`- Result: Found ${data.entries?.length || 0} games`);
    } catch (e) {
      console.log(`- FAILED URL 2: ${e.message}`);
    }
  }
}

testNewEndpoints();
