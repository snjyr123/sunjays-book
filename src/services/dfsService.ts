import { DfsData } from '@/types/dfs';

// Replace this with your actual hosted API URL (e.g., https://your-app.vercel.app)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const fetchDfsData = async (retries = 2): Promise<DfsData> => {
  const startTime = Date.now();
  try {
    const apiUrl = `${API_BASE_URL}/api/dfs`;
    console.log('Fetching DFS data from:', apiUrl);
    
    const response = await fetch(apiUrl, { 
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Fetch successful in ${Date.now() - startTime}ms`);

    if (!data || data.error) {
      // If the backend returned an error but we have retries left, try again
      if (retries > 0) {
        console.warn(`Backend returned error, retrying... (${retries} left)`);
        return await fetchDfsData(retries - 1);
      }
      console.error('API specific error:', data?.error || 'No data returned');
      return { projections: [], teamMarkets: [], lastUpdated: new Date().toISOString() };
    }

    return {
      projections: Array.isArray(data.projections) ? data.projections : [],
      teamMarkets: Array.isArray(data.teamMarkets) ? data.teamMarkets : [],
      lastUpdated: data.lastUpdated || new Date().toISOString()
    };
  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error(`DFS data fetch failed after ${duration}ms:`, error.message);
    
    if (retries > 0) {
      console.warn(`Fetch failed, retrying... (${retries} left)`);
      return await fetchDfsData(retries - 1);
    }

    return {
      projections: [],
      teamMarkets: [],
      lastUpdated: new Date().toISOString()
    };
  }
};

export const getDfsData = async (): Promise<DfsData> => {
  return await fetchDfsData();
};
