async function testBovadaFull() {
  const baseUrl = 'https://www.bovada.lv/services/sports/event/v2/events/A/description/basketball/nba';
  try {
    const res = await fetch(baseUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    });
    const data = await res.json();
    if (data[0] && data[0].events) {
        const event = data[0].events[0];
        const fullUrl = `https://www.bovada.lv/services/sports/event/v2/events/A/description${event.link}`;
        console.log('Fetching:', fullUrl);
        const res2 = await fetch(fullUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept': 'application/json'
            }
        });
        const data2 = await res2.json();
        if (data2[0] && data2[0].events) {
            const fullEvent = data2[0].events[0];
            console.log('Event Name:', fullEvent.description);
            if (fullEvent.displayGroups) {
                fullEvent.displayGroups.forEach(dg => {
                    console.log('Display Group:', dg.description);
                    if (dg.markets) {
                        const playerProps = dg.markets.filter(m => m.description.toLowerCase().includes('points') || m.description.toLowerCase().includes('rebounds') || m.description.toLowerCase().includes('assists'));
                        playerProps.slice(0, 3).forEach(p => {
                            console.log('  Prop:', p.description);
                        });
                    }
                });
            }
        }
    }
  } catch (e) {
    console.log('Error:', e.message);
  }
}
testBovadaFull();
