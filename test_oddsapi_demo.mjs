async function testTheOddsApi() {
  const apiKey = '2320b9231f4a475654378f46757f5c78';
  const url = `https://api.the-odds-api.com/v4/sports/basketball_nba/odds/?apiKey=${apiKey}&regions=us&markets=h2h&oddsFormat=american`;
  try {
    const res = await fetch(url);
    console.log('Status:', res.status);
    const data = await res.json();
    if (res.ok) {
        console.log('Success! Got', data.length, 'events');
    } else {
        console.log('Error:', data);
    }
  } catch (e) {
    console.log('Error:', e.message);
  }
}
testTheOddsApi();
