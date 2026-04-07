async function testDraftKings() {
  // NBA Event Group: 42648
  // Player Points Category: 513
  const url = 'https://sportsbook-nash.draftkings.com/sites/US-SB/api/v5/eventgroups/42648/categories/513?format=json';
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    });
    console.log('Status:', res.status);
    const data = await res.json();
    if (data.eventGroup && data.eventGroup.offerCategories) {
        const category = data.eventGroup.offerCategories.find(c => c.offerCategoryId === 513);
        if (category && category.offerSubcategoryDescriptors) {
            category.offerSubcategoryDescriptors.forEach(sub => {
                console.log('Subcategory:', sub.name);
                if (sub.offerSubcategory && sub.offerSubcategory.offers) {
                    sub.offerSubcategory.offers.slice(0, 3).forEach(offer => {
                        offer.forEach(o => {
                            console.log('  Outcome:', o.outcomes.map(oc => `${oc.participant} ${oc.label} ${oc.line} (${oc.oddsAmerican})`).join(' | '));
                        });
                    });
                }
            });
        }
    } else {
        console.log('No data found');
    }
  } catch (e) {
    console.log('Error:', e.message);
  }
}
testDraftKings();
