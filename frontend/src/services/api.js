import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('dtep_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('dtep_token')
      localStorage.removeItem('dtep_user')
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
}

export const cyclesAPI = {
  list: (params) => api.get('/cycles', { params }),
  get: (id) => api.get(`/cycles/${id}`),
  create: (data) => api.post('/cycles', data),
  update: (id, data) => api.patch(`/cycles/${id}`, data),
  remove: (id) => api.delete(`/cycles/${id}`),
}

export const evaluationsAPI = {
  list: (params) => api.get('/evaluations', { params }),
  get: (id) => api.get(`/evaluations/${id}`),
  submitDraft: (id, data) => api.patch(`/evaluations/${id}/draft`, data),
  submitFinal: (id, data) => api.post(`/evaluations/${id}/submit`, data),
}

export const reportsAPI = {
  summary: () => api.get('/reports/summary'),
  trends: (range) => api.get('/reports/trends', { params: { range } }),
}
