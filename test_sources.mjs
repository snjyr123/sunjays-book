async function testApis() {
  const sources = [
    { name: 'BallDontLie', url: 'https://www.balldontlie.io/api/v1/players?search=LeBron' },
    { name: 'MLB Official', url: 'https://statsapi.mlb.com/api/v1/people/search?names=Judge' },
    { name: 'Sleeper', url: 'https://api.sleeper.app/v1/players/nba/trending/add' },
    { name: 'ESPN Scoreboard', url: 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard' }
  ];

  for (const s of sources) {
    console.log(`Testing ${s.name}...`);
    try {
      const res = await fetch(s.url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      console.log(`- Status: ${res.status}`);
      const text = await res.text();
      console.log(`- Response Sample: ${text.slice(0, 100)}`);
    } catch (e) {
      console.log(`- FAILED: ${e.message}`);
    }
  }
}
testApis();
