async function testSleeper() {
  const sport = 'nfl';
  const season = '2023'; // Using 2023 as 2024 might not have stats yet depending on current date in simulation
  const week = '1';

  console.log(`Testing Sleeper Stats for ${sport} ${season} Week ${week}...`);
  try {
    const url = `https://api.sleeper.app/v1/stats/${sport}/regular/${season}/${week}`;
    const res = await fetch(url);
    const data = await res.json();
    
    const keys = Object.keys(data);
    console.log(`- Found ${keys.length} player stats entries`);
    if (keys.length > 0) {
      const firstId = keys[0];
      console.log(`- Sample Stat (ID ${firstId}):`, JSON.stringify(data[firstId], null, 2).slice(0, 500));
    }
  } catch (e) {
    console.log(`- FAILED: ${e.message}`);
  }
}

async function testSleeperTrending() {
  console.log('\nTesting Sleeper Trending (to see if it has player info)...');
  try {
    const url = 'https://api.sleeper.app/v1/players/nfl/trending/add';
    const res = await fetch(url);
    const data = await res.json();
    console.log(`- Found ${data.length} trending players`);
    if (data.length > 0) {
      console.log(`- Sample:`, JSON.stringify(data[0], null, 2));
    }
  } catch (e) {
    console.log(`- FAILED: ${e.message}`);
  }
}

testSleeper().then(testSleeperTrending);
