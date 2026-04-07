async function testSbrProps() {
  const url = 'https://www.sportsbookreview.com/ms-api/v2/props/nba/points';
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    });
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Got data');
    if (data.props) {
        console.log('Found', data.props.length, 'props');
        data.props.slice(0, 3).forEach(p => {
            console.log('Prop:', p.player_name, p.line);
        });
    }
  } catch (e) {
    console.log('Error:', e.message);
  }
}
testSbrProps();
