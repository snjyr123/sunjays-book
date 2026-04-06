import { DfsData } from '@/types/dfs';

// Replace this with your actual hosted API URL (e.g., https://your-app.vercel.app)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://sunjays-book.vercel.app';

export const fetchDfsData = async (): Promise<DfsData> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    const apiUrl = `${API_BASE_URL}/api/dfs`;
    const response = await fetch(apiUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();

    if (!data || data.error) {
      console.error('API specific error:', data?.error || 'No data returned');
      return { projections: [], teamMarkets: [], lastUpdated: new Date().toISOString() };
    }

    return {
      projections: Array.isArray(data.projections) ? data.projections : [],
      teamMarkets: Array.isArray(data.teamMarkets) ? data.teamMarkets : [],
      lastUpdated: data.lastUpdated || new Date().toISOString()
    };
  } catch (error: any) {
    console.error('Hyper-Optimization fetch failed:', error.message);
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
