async function testActionNetwork() {
  const url = 'https://api.actionnetwork.com/v2/props/nba';
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
  } catch (e) {
    console.log('Error:', e.message);
  }
}
testActionNetwork();
