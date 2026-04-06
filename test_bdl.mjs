async function testBallDontLie() {
  console.log('Testing BallDontLie with different headers...');
  const agents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'PostmanRuntime/7.36.1',
    ''
  ];

  for (const agent of agents) {
    try {
      console.log(`- Trying User-Agent: ${agent || 'None'}`);
      const res = await fetch('https://www.balldontlie.io/api/v1/stats?player_ids[]=237&per_page=5', {
        headers: agent ? { 'User-Agent': agent } : {}
      });
      console.log(`  Status: ${res.status}`);
      const text = await res.text();
      console.log(`  Sample: ${text.slice(0, 50)}`);
    } catch (e) {
      console.log(`  FAILED: ${e.message}`);
    }
  }
}

testBallDontLie();
