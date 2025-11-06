import { apiClient } from './apiClient';

const entryService = {
  getMyEntries: async ({ page = 1, limit = 10, fromDate, toDate, skill, sortBy, order } = {}) => {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', String(limit));
    if (fromDate) params.append('fromDate', fromDate);
    if (toDate) params.append('toDate', toDate);
    if (skill) params.append('skill', skill);
    if (sortBy) params.append('sortBy', sortBy);
    if (order) params.append('order', order);
    const res = await apiClient.get(`/api/entries/my?${params.toString()}`);
    return res.data;
  },

  getEntryAnalytics: async ({ fromDate, toDate } = {}) => {
    const params = new URLSearchParams();
    if (fromDate) params.append('fromDate', fromDate);
    if (toDate) params.append('toDate', toDate);
    const qs = params.toString() ? `?${params.toString()}` : '';
    const res = await apiClient.get(`/api/entries/analytics${qs}`);
    return res.data;
  },

  getOthersAnalytics: async ({ fromDate, toDate } = {}) => {
    const params = new URLSearchParams();
    if (fromDate) params.append('fromDate', fromDate);
    if (toDate) params.append('toDate', toDate);
    const qs = params.toString() ? `?${params.toString()}` : '';
    const res = await apiClient.get(`/api/entries/others-analytics${qs}`);
    return res.data;
  },

  submitEntry: async (entry) => {
    const res = await apiClient.post('/api/entries', entry);
    return res.data;
  }
};

export default entryService;
