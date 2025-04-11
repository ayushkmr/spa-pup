import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Use the environment variable with type assertion for TypeScript
const API_URL = (process.env.NEXT_PUBLIC_API_URL as string) || 'http://localhost:3005';

// For debugging purposes
if (process.env.NODE_ENV !== 'test') {
  console.log('Using API URL:', API_URL);
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Add request interceptor for debugging
api.interceptors.request.use(function (config: InternalAxiosRequestConfig) {
  if (process.env.NODE_ENV !== 'test') {
    console.log('API Request:', config);
  }
  return config;
}, function (error: AxiosError) {
  if (process.env.NODE_ENV !== 'test') {
    console.error('API Request Error:', error);
  }
  return Promise.reject(error);
});

// Add response interceptor for debugging
api.interceptors.response.use(function (response: AxiosResponse) {
  if (process.env.NODE_ENV !== 'test') {
    console.log('API Response:', response);
  }
  return response;
}, function (error: AxiosError) {
  if (process.env.NODE_ENV !== 'test') {
    console.error('API Response Error:', error);
  }
  return Promise.reject(error);
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

  addEntry: (data: {
    puppyId: number;
    serviceRequired: string;
    notes?: string;
    arrivalTime?: Date;
    scheduledTime?: Date;
    isFutureBooking?: boolean;
  }) => api.post('/waiting-list/add-entry', data),

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
