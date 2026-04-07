async function testDraftKings() {
  const url = 'https://sportsbook-nash.draftkings.com/sites/US-SB/api/v5/eventgroups/42648/categories/489?format=json';
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
    if (!res.ok) {
        console.log('Error text:', await res.text());
        return;
    }
    const data = await res.json();
    console.log('Got data');
    if (data.eventGroup) {
        console.log('Event Group:', data.eventGroup.name);
        // Look for Player Points or similar
        const categories = data.eventGroup.offerCategories || [];
        categories.forEach(cat => {
            console.log(`- Category: ${cat.name} (ID: ${cat.offerCategoryId})`);
        });
    }
  } catch (e) {
    console.log('Error:', e.message);
  }
}
testDraftKings();
