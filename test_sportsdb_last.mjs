async function testSportsDbLastEvents() {
  const players = [
    { name: 'Aaron Judge', id: '34164069' },
    { name: 'Patrick Mahomes', id: '34165220' },
    { name: 'Lionel Messi', id: '34146370' }
  ];

  for (const p of players) {
    console.log(`\nTesting Last Events for ${p.name} (ID: ${p.id})...`);
    try {
      const url = `https://www.thesportsdb.com/api/v1/json/3/eventslast.php?id=${p.id}`;
      const res = await fetch(url);
      const data = await res.json();
      console.log(`- Status: ${res.status}`);
      if (data.results) {
        console.log(`- Found ${data.results.length} events`);
        const e = data.results[0];
        console.log(`- Sample Event: ${e.strEvent} (${e.dateEvent})`);
        console.log(`- Stats: ${e.strResult || 'No direct stats in this endpoint'}`);
      } else {
        console.log('- No results found for this player ID in eventslast.php');
      }
    } catch (e) {
      console.log(`- FAILED: ${e.message}`);
    }
  }
}
testSportsDbLastEvents();
