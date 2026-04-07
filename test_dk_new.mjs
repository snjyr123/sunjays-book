async function testDraftKings() {
  const url = 'https://sportsbook.draftkings.com/sites/US-SB/api/v5/eventgroups/42648/categories/489?format=json';
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    });
    console.log('Status:', res.status);
    if (res.status === 403) {
        console.log('Access Denied (403)');
        return;
    }
    const data = await res.json();
    console.log('Got data');
    if (data.eventGroup) {
        console.log('Event Group:', data.eventGroup.name);
    }
  } catch (e) {
    console.log('Error:', e.message);
  }
}
testDraftKings();
