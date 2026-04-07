async function testBovadaProps() {
  const url = 'https://www.bovada.lv/services/sports/event/v2/events/A/description/basketball/nba?marketFilter=player_props';
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
        data[0].events.forEach(event => {
            console.log('--- Event:', event.description, '---');
            if (event.displayGroups) {
                event.displayGroups.forEach(dg => {
                    console.log('Display Group:', dg.description);
                    if (dg.markets) {
                        dg.markets.slice(0, 5).forEach(m => {
                            console.log('  Prop:', m.description);
                            if (m.outcomes) {
                                m.outcomes.forEach(o => {
                                    console.log(`    Outcome: ${o.description} | Price: ${o.price?.american} | Value: ${o.price?.handicap}`);
                                });
                            }
                        });
                    }
                });
            }
        });
    } else {
        console.log('No events found');
    }
  } catch (e) {
    console.log('Error:', e.message);
  }
}
testBovadaProps();
