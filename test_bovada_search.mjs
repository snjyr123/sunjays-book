async function testBovadaSearch() {
  const url = 'https://www.bovada.lv/services/sports/search/v2/query?term=points';
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
    if (data.items) {
        console.log('Found', data.items.length, 'items');
        data.items.slice(0, 5).forEach(i => {
            console.log('Item:', i.description, i.type);
        });
    }
  } catch (e) {
    console.log('Error:', e.message);
  }
}
testBovadaSearch();
