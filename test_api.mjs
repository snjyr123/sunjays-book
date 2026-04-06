async function test() {
  const ppUrl = 'https://api.prizepicks.com/projections?per_page=1000&single_stat=true';
  const ppRes = await fetch(ppUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36' },
  });
  console.log('PP Status:', ppRes.status);
  
  const udUrl = 'https://api.underdogfantasy.com/view_api/v2/projections';
  const udRes = await fetch(udUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' },
  });
  console.log('UD Status:', udRes.status);
}
test();
