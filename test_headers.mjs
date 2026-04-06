async function test() {
  const ppUrl = 'https://api.prizepicks.com/projections?per_page=500&single_stat=true';
  const ppRes = await fetch(ppUrl, {
    headers: { 
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    }
  });
  console.log('PP Status:', ppRes.status);
  
  const ppUrl2 = 'https://api.prizepicks.com/projections?per_page=500&single_stat=true';
  const ppRes2 = await fetch(ppUrl2, {
    headers: { 
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Referer': 'https://app.prizepicks.com/'
    }
  });
  console.log('PP Status with Referer:', ppRes2.status);
}
test();
