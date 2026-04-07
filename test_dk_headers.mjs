async function testDraftKings() {
  const url = 'https://sportsbook-nash.draftkings.com/sites/US-SB/api/v5/eventgroups/42648/categories/513?format=json';
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Origin': 'https://sportsbook.draftkings.com',
        'Referer': 'https://sportsbook.draftkings.com/'
      }
    });
    console.log('Status:', res.status);
    const data = await res.json();
    if (data.eventGroup) {
        console.log('Got Event Group');
        // Check for player props
        const category = data.eventGroup.offerCategories?.find(c => c.offerCategoryId === 513);
        if (category) {
            console.log('Got Category: Player Points');
        }
    }
  } catch (e) {
    console.log('Error:', e.message);
  }
}
testDraftKings();
