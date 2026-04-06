async function test() {
  const ppUrl = 'https://api.prizepicks.com/projections?per_page=10&single_stat=true';
  const ppRes = await fetch(ppUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' },
  });
  const ppJson = await ppRes.json();
  const data = ppJson.data || [];
  const included = ppJson.included || [];
  
  const leagues = included.filter(inc => inc.type === 'league').reduce((acc, curr) => { acc[curr.id] = curr.attributes.name; return acc; }, {});
  const players = included.filter(inc => inc.type === 'new_player').reduce((acc, curr) => { acc[curr.id] = curr.attributes; return acc; }, {});
  
  const types = new Set(included.map(inc => inc.type));
  console.log('Included Types:', Array.from(types));
  
  const sampleStat = included.find(inc => inc.type === 'stat_average'); // Guessing type name
  if (sampleStat) console.log('Found stats average:', JSON.stringify(sampleStat, null, 2));

  // Let's also check for 'trend' or something similar in attributes
  const firstProj = data[0];
  if (firstProj) console.log('Proj Attributes:', Object.keys(firstProj.attributes));
}
test();
