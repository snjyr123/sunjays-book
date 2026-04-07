async function testTheOddsApi() {
  const apiKey = '4f749000a0b27b4e9f7832876610738d';
  const url = `https://api.the-odds-api.com/v4/sports/basketball_nba/odds/?apiKey=${apiKey}&regions=us&markets=h2h,spreads,totals&oddsFormat=american`;
  try {
    const res = await fetch(url);
    console.log('Status:', res.status);
    if (res.status === 401) {
        console.log('Unauthorized (Invalid API Key)');
        return;
    }
    const data = await res.json();
    console.log('Got data, count:', data.length);
    if (data.length > 0) {
        console.log('Sample Event:', data[0].home_team, 'vs', data[0].away_team);
    }
  } catch (e) {
    console.log('Error:', e.message);
  }
}
testTheOddsApi();
