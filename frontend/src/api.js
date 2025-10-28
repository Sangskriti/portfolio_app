import axios from 'axios';
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000/api'
});

export async function fetchPortfolios(params) {
  const r = await API.get('/portfolios', { params });
  return r.data;
}
export async function fetchPortfolio(id) {
  const r = await API.get(`/portfolios/${id}`);
  return r.data;
}
export async function createPortfolio(payload) {
  const r = await API.post('/portfolios', payload);
  return r.data;
}
export async function updatePortfolio(id, payload) {
  const r = await API.put(`/portfolios/${id}`, payload);
  return r.data;
}
