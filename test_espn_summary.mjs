async function testEspnSummary() {
  const eventId = '401705353'; // Knicks @ Hawks
  const url = `https://site.web.api.espn.com/apis/site/v2/sports/basketball/nba/summary?event=${eventId}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log('Got summary data');
    if (data.pickcenter) {
      console.log('Pickcenter odds:', JSON.stringify(data.pickcenter[0], null, 2));
    }
  } catch (e) {
    console.log('Error:', e.message);
  }
}
testEspnSummary();
