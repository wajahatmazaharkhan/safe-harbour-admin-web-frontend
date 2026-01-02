import api from './api-client';

export const counsellorService = {
  // 1. GET: Using your provided endpoint
  getAll: () => api.get('/counsellor/getcounsellor'),

  // 2. UPDATE: Using your provided endpoint
  // We send 'id' inside the body along with data
  update: (id, data) => api.post('/counsellor/update', { ...data, id }),

  // 3. CREATE: Please replace with your actual endpoint
  create: (data) => api.post('/counsellor/ENDPOINT_CREATE', data),

  // 4. DELETE: Please replace with your actual endpoint
  delete: (id) => api.delete(`/counsellor/ENDPOINT_DELETE/${id}`),
};