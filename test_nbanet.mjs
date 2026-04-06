async function testNbaNet() {
  const personId = '2544'; // LeBron James
  const season = '2023';
  console.log(`Testing NBA.net Gamelog for ${personId} ${season}...`);
  try {
    const url = `http://data.nba.net/10s/prod/v1/${season}/players/${personId}_gamelog.json`;
    const res = await fetch(url);
    console.log(`- Status: ${res.status}`);
    const text = await res.text();
    console.log(`- Sample: ${text.slice(0, 200)}`);
  } catch (e) {
    console.log(`- FAILED: ${e.message}`);
  }
}
testNbaNet();
