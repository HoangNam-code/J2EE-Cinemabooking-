import client from './axiosClient';

export const authApi = {
  login: (data) => client.post('/auth/login', data),
  sendRegisterOtp: (data) => client.post('/auth/send-register-otp', data),
  register: (data) => client.post('/auth/register', data),
  getGoogleConfig: () => client.get('/auth/google/config'),
  googleLogin: (credential) => client.post('/auth/google', { credential }),
};

export const movieApi = {
  getAll: () => client.get('/movies'),
  getNowShowing: () => client.get('/movies/now-showing'),
  getComingSoon: () => client.get('/movies/coming-soon'),
  getById: (id) => client.get(`/movies/${id}`),
  search: (query) => client.get(`/movies/search?q=${encodeURIComponent(query)}`),
};

export const showtimeApi = {
  getByMovie: (movieId, date) => client.get(`/showtimes/movie/${movieId}${date ? `?date=${date}` : ''}`),
  getSeatMap: (showtimeId) => client.get(`/showtimes/${showtimeId}/seats`),
};

export const categoryApi = {
  getAll: () => client.get('/categories'),
  getById: (id) => client.get(`/categories/${id}`),
  create: (data) => client.post('/admin/categories', data),
  update: (id, data) => client.put(`/admin/categories/${id}`, data),
  delete: (id) => client.delete(`/admin/categories/${id}`),
};

export const foodApi = {
  getAll: () => client.get('/foods'),
};

export const bookingApi = {
  createHold: (payload) => client.post('/bookings/hold', payload),
  getSummary: (bookingId) => client.get(`/bookings/${bookingId}`),
  getMyBookings: () => client.get('/bookings/my-bookings'),
  cancel: (bookingId) => client.post(`/bookings/${bookingId}/cancel`, {}),
};

export const paymentApi = {
  createPayment: (bookingId, method = 'VNPAY') =>
    client.post(`/payments/create?bookingId=${bookingId}&method=${method}`, {}),
  checkPayOSStatus: (bookingId) =>
    client.get(`/payments/payos/status/${bookingId}`),
};

export const staffApi = {
  checkTicket: (code) => client.get(`/staff/check-ticket?code=${encodeURIComponent(code)}`),
  checkIn: (code) => client.post(`/staff/check-in?code=${encodeURIComponent(code)}`, {}),
  getFoods: () => client.get('/staff/foods'),
  toggleFoodStatus: (foodId) => client.put(`/staff/foods/${foodId}/toggle`),
  updateFoodStatus: (foodId, status) => client.put(`/staff/foods/${foodId}/status?status=${status}`),
  getRooms: () => client.get('/staff/rooms'),
  getRoomSeats: (roomId) => client.get(`/staff/rooms/${roomId}/seats`),
  toggleSeatMaintenance: (seatId) => client.put(`/staff/seats/${seatId}/toggle-maintenance`),
  updateSeatStatus: (seatId, status) => client.put(`/staff/seats/${seatId}/status?status=${status}`),
};

export const aiApi = {
  chat: (message) => client.post('/ai/chat', { message }),
};

export const graphqlApi = {
  query: (query, variables = {}) => client.post('/graphql', { query, variables }),
};

export const adminApi = {
  getStats: () => client.get('/admin/stats'),
  createMovie: (data) => client.post('/admin/movies', data),
  updateMovie: (id, data) => client.put(`/admin/movies/${id}`, data),
  deleteMovie: (id) => client.delete(`/admin/movies/${id}`),
  createShowtime: (data) => client.post('/admin/showtimes', data),
  deleteShowtime: (id) => client.delete(`/admin/showtimes/${id}`),
  // RBAC & User Management
  getUsers: () => client.get('/admin/users'),
  updateUserRole: (userId, role) => client.put(`/admin/users/${userId}/role?role=${encodeURIComponent(role)}`, {}),
  updateUserStatus: (userId, status) => client.put(`/admin/users/${userId}/status?status=${encodeURIComponent(status)}`, {}),
  deleteUser: (userId) => client.delete(`/admin/users/${userId}`),
};
