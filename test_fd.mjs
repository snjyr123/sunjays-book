async function testFanDuel() {
  const url = 'https://sbapi.nj.sportsbook.fanduel.com/api/content-managed-page?page=CUSTOM&customPageId=nba&_ak=FhCbtvE9Xp8S0Dpg';
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    });
    console.log('Status:', res.status);
    const data = await res.json();
    if (data.attachments) {
        console.log('Attachments keys:', Object.keys(data.attachments));
        // Check for markets
        const markets = data.attachments.markets;
        if (markets) {
            const keys = Object.keys(markets);
            console.log('Found', keys.length, 'markets');
            keys.slice(0, 5).forEach(k => {
                const m = markets[k];
                console.log('Market:', m.marketName);
                if (m.runners) {
                    m.runners.slice(0, 2).forEach(r => {
                        console.log('  Runner:', r.runnerName, r.winRunnerOdds?.americanDisplayOdds?.americanOdds);
                    });
                }
            });
        }
    } else {
        console.log('No attachments found');
    }
  } catch (e) {
    console.log('Error:', e.message);
  }
}
testFanDuel();
