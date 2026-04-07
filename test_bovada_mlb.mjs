async function testBovadaMlb() {
  const url = 'https://www.bovada.lv/services/sports/event/v2/events/A/description/baseball/mlb';
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    });
    const data = await res.json();
    console.log('Status:', res.status);
    if (data[0] && data[0].events) {
        const event = data[0].events[0];
        console.log('MLB Event:', event.description, 'Markets:', event.numMarkets);
        if (event.numMarkets > 50) {
            const fullUrl = `https://www.bovada.lv/services/sports/event/v2/events/A/description${event.link}`;
            const res2 = await fetch(fullUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                    'Accept': 'application/json'
                }
            });
            const data2 = await res2.json();
            if (data2[0] && data2[0].events) {
                const fullEvent = data2[0].events[0];
                if (fullEvent.displayGroups) {
                    fullEvent.displayGroups.forEach(dg => {
                        console.log('  Display Group:', dg.description);
                    });
                }
            }
        }
    } else {
        console.log('No MLB events found');
    }
  } catch (e) {
    console.log('Error:', e.message);
  }
}
testBovadaMlb();
