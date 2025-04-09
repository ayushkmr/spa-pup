import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Puppy API
export const puppyApi = {
  create: (data: { name: string; ownerName: string }) => 
    api.post('/puppy/create', data),
  
  search: (query: string) => 
    api.get(`/puppy/search?q=${encodeURIComponent(query)}`),
  
  getAll: () => 
    api.get('/puppy/all'),
};

// Waiting List API
export const waitingListApi = {
  createToday: () => 
    api.post('/waiting-list/create-today'),
  
  addEntry: (data: { puppyId: number; serviceRequired: string; arrivalTime?: Date }) => 
    api.post('/waiting-list/add-entry', data),
  
  getToday: () => 
    api.get('/waiting-list/today'),
  
  reorder: (entryOrder: number[]) => 
    api.patch('/waiting-list/reorder', { entryOrder }),
  
  markServiced: (entryId: number) => 
    api.patch(`/waiting-list/mark-serviced/${entryId}`),
  
  getByDate: (date: string) => 
    api.get(`/waiting-list/history/${date}`),
  
  getAll: () => 
    api.get('/waiting-list/all'),
  
  search: (query: string) => 
    api.get(`/waiting-list/search?q=${encodeURIComponent(query)}`),
};

export default api;
