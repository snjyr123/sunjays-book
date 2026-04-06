async function testFoxSports() {
  const mahomesId = '110750';
  console.log(`Testing Fox Sports Gamelog for Mahomes (ID: ${mahomesId})...`);
  try {
    const url = `https://api.foxsports.com/v1/stats/nfl/players/${mahomesId}/gamelogs`;
    // Fox Sports usually needs an API key even for their site.
    // Let's see if it works without one or with a common one.
    const res = await fetch(url);
    console.log(`- Status: ${res.status}`);
    const text = await res.text();
    console.log(`- Sample: ${text.slice(0, 100)}`);
  } catch (e) {
    console.log(`- FAILED: ${e.message}`);
  }
}
testFoxSports();
