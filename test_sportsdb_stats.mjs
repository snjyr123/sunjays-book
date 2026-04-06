async function testSportsDbEventStats() {
  const eventId = '1032723'; // Example event ID
  console.log(`Testing Event Stats for ID: ${eventId}...`);
  try {
    const url = `https://www.thesportsdb.com/api/v1/json/3/lookupeventstats.php?id=${eventId}`;
    const res = await fetch(url);
    const data = await res.json();
    console.log(`- Status: ${res.status}`);
    if (data.stats) {
      console.log(`- Found ${data.stats.length} stats`);
      console.log('- Sample Stat:', JSON.stringify(data.stats[0], null, 2));
    } else {
      console.log('- No stats found in lookupeventstats.php');
    }
  } catch (e) {
    console.log(`- FAILED: ${e.message}`);
  }
}
testSportsDbEventStats();
