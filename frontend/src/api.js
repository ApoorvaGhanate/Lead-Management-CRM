import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';
const api = axios.create({ baseURL });

export const fetchLeads = async ({
  search = '',
  page = 1,
  limit = 10,
  status = '',
  sortBy = 'createdAt',
  order = 'desc'
} = {}) => {
  const params = new URLSearchParams();
  if (search) params.append('q', search);
  if (status) params.append('status', status);
  params.append('page', page);
  params.append('limit', limit);
  params.append('sortBy', sortBy);
  params.append('order', order);

  const response = await api.get(`/leads?${params.toString()}`);
  return response.data;
};

export const createLead = async (lead) => {
  const response = await api.post('/leads', lead);
  return response.data;
};

export const updateLead = async (id, lead) => {
  const response = await api.put(`/leads/${id}`, lead);
  return response.data;
};

export const deleteLead = async (id) => {
  await api.delete(`/leads/${id}`);
};

export const fetchStats = async () => {
  const response = await api.get('/leads/stats');
  return response.data;
};
