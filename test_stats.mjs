async function testNba() {
  console.log('Testing NBA (BallDontLie)...');
  try {
    const res = await fetch('https://www.balldontlie.io/api/v1/players?search=LeBron');
    const data = await res.json();
    console.log('NBA Search Result:', data.data?.length > 0 ? 'SUCCESS' : 'EMPTY');
  } catch (e) {
    console.log('NBA Search Result: FAILED', e.message);
  }
}

async function testMlb() {
  console.log('Testing MLB (Official)...');
  try {
    const res = await fetch('https://statsapi.mlb.com/api/v1/people/search?names=Judge');
    const data = await res.json();
    console.log('MLB Search Result:', data.people?.length > 0 ? 'SUCCESS' : 'EMPTY');
  } catch (e) {
    console.log('MLB Search Result: FAILED', e.message);
  }
}

testNba().then(testMlb);
