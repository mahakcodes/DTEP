import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach JWT Access Token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('dtep_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth APIs
export const loginUser = async (credentials) => {
  // Using /api/users/login/ based on urls.py structure
  const response = await api.post('/api/users/login/', credentials);
  return response.data;
};

// Test APIs
export const fetchStudentTests = async () => {
  const response = await api.get('/api/tests/');
  return response.data;
};

export const fetchTestDetails = async (testId) => {
  const response = await api.get(`/api/tests/${testId}/`);
  return response.data;
};

export const submitTest = async (testId, payload) => {
  const response = await api.post(`/api/tests/${testId}/submit/`, payload);
  return response.data;
};

// Results APIs
export const fetchSubmissionResult = async (submissionId) => {
  const response = await api.get(`/api/results/${submissionId}/`);
  return response.data;
};

export default api;