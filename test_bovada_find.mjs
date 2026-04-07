async function findBovadaProps() {
  const url = 'https://www.bovada.lv/services/sports/event/v2/events/A/description/basketball/nba';
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    });
    const data = await res.json();
    if (data[0] && data[0].events) {
        for (const event of data[0].events) {
            if (event.numMarkets > 100) {
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
                        const gp = fullEvent.displayGroups.find(dg => dg.description === 'Score Props');
                        if (gp && gp.markets) {
                            gp.markets.slice(0, 20).forEach(m => {
                                console.log('  Prop:', m.description);
                            });
                        }
                    }
                }
                return;
            }
        }
    }
  } catch (e) {
    console.log('Error:', e.message);
  }
}
findBovadaProps();
