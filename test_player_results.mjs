async function testPlayerResults() {
  const players = [
    { name: 'Patrick Mahomes', id: '34165220' },
    { name: 'Aaron Judge', id: '34164069' },
    { name: 'Lionel Messi', id: '34146370' }
  ];

  for (const p of players) {
    console.log(`\nTesting Player Results for ${p.name} (ID: ${p.id})...`);
    try {
      const url = `https://www.thesportsdb.com/api/v1/json/3/playerresults.php?id=${p.id}`;
      const res = await fetch(url);
      const data = await res.json();
      console.log(`- Status: ${res.status}`);
      if (data.results) {
        console.log(`- Found ${data.results.length} results`);
        const r = data.results[0];
        console.log(`- Sample: ${r.strEvent} (${r.dateEvent}) - ${r.strResult}`);
      } else {
        console.log('- No results found in playerresults.php');
      }
    } catch (e) {
      console.log(`- FAILED: ${e.message}`);
    }
  }
}
testPlayerResults();
