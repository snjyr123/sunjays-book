async function testTheSportsDbEvents() {
  const leagues = [
    { name: 'NBA', id: '4387' },
    { name: 'MLB', id: '4424' },
    { name: 'NFL', id: '4391' }
  ];

  for (const league of leagues) {
    console.log(`\nTesting ${league.name} (ID: ${league.id})...`);
    try {
      const url = `https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=${league.id}`;
      const res = await fetch(url);
      const data = await res.json();
      console.log(`- Found ${data.events?.length || 0} upcoming events`);
      if (data.events?.length > 0) {
        const e = data.events[0];
        console.log(`- Sample: ${e.strEvent} on ${e.dateEvent}`);
      }
    } catch (e) {
      console.log(`- FAILED: ${e.message}`);
    }
  }
}
testTheSportsDbEvents();
