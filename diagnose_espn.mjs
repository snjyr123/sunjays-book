async function testEspn() {
  const players = [
    { name: 'LeBron James', sport: 'basketball/nba', league: 'nba' },
    { name: 'Shohei Ohtani', sport: 'baseball/mlb', league: 'mlb' },
    { name: 'Patrick Mahomes', sport: 'football/nfl', league: 'nfl' }
  ];

  for (const p of players) {
    console.log(`\n--- Testing ${p.name} ---`);
    try {
      // 1. Search
      const searchUrl = `https://site.web.api.espn.com/apis/search/v2?query=${encodeURIComponent(p.name)}&limit=5&type=player&league=${p.league}`;
      console.log(`Searching: ${searchUrl}`);
      const searchRes = await fetch(searchUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const searchData = await searchRes.json();
      
      const contents = searchData.results?.[0]?.contents || [];
      const athlete = contents.find(c => c.type === 'player');
      
      if (!athlete) {
        console.log(`FAILED: No athlete found in search results for ${p.name}`);
        continue;
      }

      // Sometimes the ID is in 'athlete.id' or 'athlete.uid'
      // Numeric IDs are usually part of the URL or a specific field
      console.log(`DEBUG: Content ID is ${athlete.id}`);
      console.log(`DEBUG: Object Keys: ${Object.keys(athlete)}`);
      
      // Let's try to extract the numeric ID from the UID if possible
      const numericId = athlete.id.split(':').pop() || athlete.id;
      console.log(`SUCCESS: Using Numeric ID ${numericId}`);

      // 2. Gamelog
      const statsUrl = `https://site.web.api.espn.com/apis/common/v3/sports/${p.sport}/athletes/${numericId}/gamelog`;
      console.log(`Fetching Gamelog: ${statsUrl}`);
      const statsRes = await fetch(statsUrl);
      const statsData = await statsRes.json();
      
      const entries = statsData.entries || [];
      console.log(`SUCCESS: Found ${entries.length} gamelog entries.`);
      if (entries.length > 0) {
        console.log('Sample Stat Labels:', statsData.labels);
        console.log('Sample Entry Stats:', entries[0].stats);
      }
    } catch (e) {
      console.log(`ERROR for ${p.name}:`, e.message);
    }
  }
}

testEspn();
