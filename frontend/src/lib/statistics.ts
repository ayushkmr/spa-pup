import api from './api';

export interface Statistics {
  totalPuppies: number;
  servicedPuppies: number;
  mostPopularService: string;
  serviceBreakdown: Record<string, number>;
  dailyTotals: Record<string, number>;
  averageWaitTime?: number;
}

export const statisticsApi = {
  getStatistics: async (startDate?: string, endDate?: string): Promise<Statistics> => {
    let url = '/waiting-list/statistics';
    
    // Add query parameters if provided
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const queryString = params.toString();
    if (queryString) url += `?${queryString}`;
    
    const response = await api.get(url);
    return response.data;
  }
};
