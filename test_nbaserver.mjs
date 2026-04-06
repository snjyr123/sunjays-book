async function testNbaServer() {
  const playerId = 'jamesle01'; // LeBron James
  const season = '2023';
  console.log(`Testing NBA Server Gamelog for ${playerId} ${season}...`);
  try {
    const url = `https://api.server.nbaapi.com/api/playertotals?playerId=${playerId}&season=${season}`;
    const res = await fetch(url);
    console.log(`- Status: ${res.status}`);
    const data = await res.json();
    console.log(`- Data Sample:`, JSON.stringify(data).slice(0, 500));
  } catch (e) {
    console.log(`- FAILED: ${e.message}`);
  }
}
testNbaServer();
