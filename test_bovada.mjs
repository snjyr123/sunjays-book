async function testBovada() {
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
            console.log('--- Event:', event.description, '---');
            if (event.displayGroups) {
                const gameProps = event.displayGroups.find(dg => dg.description === 'Game Props');
                if (gameProps && gameProps.markets) {
                    // Look for markets that look like player props
                    const playerProps = gameProps.markets.filter(m => 
                        m.description.toLowerCase().includes('points') || 
                        m.description.toLowerCase().includes('rebounds') || 
                        m.description.toLowerCase().includes('assists')
                    );
                    playerProps.slice(0, 3).forEach(p => {
                        console.log('Prop:', p.description);
                        if (p.outcomes) {
                            p.outcomes.forEach(o => {
                                console.log(`  Outcome: ${o.description} | Price: ${o.price.american} | Value: ${o.price.handicap}`);
                            });
                        }
                    });
                }
            }
        }
    }
  } catch (e) {
    console.log('Error:', e.message);
  }
}
testBovada();
