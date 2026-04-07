async function testEspnScoreboard() {
  const url = 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard';
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log('Got ESPN data');
    if (data.events) {
      data.events.forEach(event => {
        const comp = event.competitions[0];
        console.log(`Event: ${event.name}`);
        if (comp.odds) {
          console.log(`- Odds: ${JSON.stringify(comp.odds[0])}`);
        } else {
          console.log('- No odds found for this event');
        }
      });
    }
  } catch (e) {
    console.log('Error:', e.message);
  }
}
testEspnScoreboard();
