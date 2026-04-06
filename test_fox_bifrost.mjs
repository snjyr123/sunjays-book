async function testFoxBifrost() {
  const playerSlug = 'lebron-james-player';
  const apikey = 'jE7yBJVRNAwdDesMgTzTXUUSx1It41Fq';
  console.log(`Testing Fox Bifrost Gamelog for ${playerSlug}...`);
  try {
    const url = `https://api.foxsports.com/bifrost/v1/nba/player/${playerSlug}/gamelogs?apikey=${apikey}`;
    const res = await fetch(url);
    console.log(`- Status: ${res.status}`);
    const data = await res.json();
    console.log(`- Data Sample Keys:`, Object.keys(data));
    if (data.gamelogs) {
      console.log(`- Found ${data.gamelogs.length} games`);
      console.log(`- Sample Game:`, JSON.stringify(data.gamelogs[0], null, 2));
    }
  } catch (e) {
    console.log(`- FAILED: ${e.message}`);
  }
}
testFoxBifrost();
