async function testDraftKings() {
  const url = 'https://sportsbook-nash.draftkings.com/sites/US-SB/api/v5/eventgroups/42648/categories/513?format=json';
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Origin': 'https://sportsbook.draftkings.com',
        'Referer': 'https://sportsbook.draftkings.com/'
      }
    });
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Got data');
  } catch (e) {
    console.log('Error:', e.message);
  }
}
testDraftKings();
