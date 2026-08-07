import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// If you're on bare React Native (not Expo), swap the three functions in
// `tokenStorage` below for the react-native-keychain version - see the note
// at the bottom of this file.

export const BASE_URL = 'https://examprep-backend-p6lt.onrender.com/api';

// ---------------------------------------------------------------------------
// Token storage
// ---------------------------------------------------------------------------
const ACCESS_TOKEN_KEY = 'examprep_access_token';
const REFRESH_TOKEN_KEY = 'examprep_refresh_token';

export const tokenStorage = {
  async getAccessToken() {
    return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  },
  async getRefreshToken() {
    return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  },
  async setTokens(accessToken, refreshToken) {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) {
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
    }
  },
  async clearTokens() {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  },
};

// ---------------------------------------------------------------------------
// Axios client
// ---------------------------------------------------------------------------
export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await tokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// NOTE: neither backend doc shows the actual login/register response body,
// so the field names guessed below (accessToken/token) are unconfirmed.
// Adjust once you see a real response from the backend team.
function extractTokens(responseData) {
  const d = responseData?.data ?? responseData;
  if (d?.accessToken) return { accessToken: d.accessToken, refreshToken: d.refreshToken };
  if (d?.token) return { accessToken: d.token, refreshToken: d.refreshToken };
  return null;
}

let isRefreshing = false;
let pendingQueue = [];

function flushQueue(error, token) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (token) resolve(token);
    else reject(error);
  });
  pendingQueue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({
          resolve: (token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = await tokenStorage.getRefreshToken();
      const res = await axios.post(`${BASE_URL}/auth/refresh-token`, { refreshToken });
      const tokens = extractTokens(res.data);
      if (!tokens) throw new Error('Refresh response did not contain a token');

      await tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken);
      flushQueue(null, tokens.accessToken);

      originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      flushQueue(refreshError, null);
      await tokenStorage.clearTokens();
      // TODO: navigate to your login screen here (e.g. via an event emitter
      // or a navigation ref) - this file has no access to navigation context.
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
export const authService = {
  async register({ fullName, email, password }) {
    const { data } = await apiClient.post('/auth/register', { fullName, email, password });
    return data;
  },

  async login({ email, password }) {
    const { data } = await apiClient.post('/auth/login', { email, password });
    const tokens = extractTokens(data);
    if (tokens) {
      await tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken);
    }
    return data;
  },

  // Confirmed with backend dev: separate endpoint, just needs email.
  async resendVerificationOtp(email) {
    const { data } = await apiClient.post('/auth/resend-verification-otp', { email });
    return data;
  },

  async logout() {
    await apiClient.post('/auth/logout');
    await tokenStorage.clearTokens();
  },

  async forgotPassword(email) {
    const { data } = await apiClient.post('/auth/forgot-password', { email });
    return data;
  },

  async resetPassword(token, password) {
    const { data } = await apiClient.post('/auth/reset-password', { token, password });
    return data;
  },

  // Confirmed directly with the backend dev: body is { email, otp } - not
  // { token } as the docs stated, and not { verificationToken } either.
  async verifyEmail(email, otp) {
    const { data } = await apiClient.post('/auth/verify-email', { email, otp });
    return data;
  },

  async getProfile() {
    const { data } = await apiClient.get('/auth/profile');
    return data.data;
  },

  async updateProfile(payload) {
    const { data } = await apiClient.put('/auth/profile', payload);
    return data;
  },

  async changePassword(payload) {
    const { data } = await apiClient.put('/auth/change-password', payload);
    return data;
  },

  async getSettings() {
    const { data } = await apiClient.get('/auth/settings');
    return data.data ?? data;
  },

  async updateSettings(payload) {
    const { data } = await apiClient.put('/auth/settings', payload);
    return data.data ?? data;
  },
};

// ---------------------------------------------------------------------------
// Subjects
// ASSUMPTION: not present in the original file/docs. /questions and
// /practice/start both need a subjectId, so the setup screen needs a list
// somehow. Guessing a REST-conventional '/subjects' route here - confirm
// the real path (and response shape) with the backend dev and adjust.
// ---------------------------------------------------------------------------
export const subjectsService = {
  async getAll(params) {
    const { data } = await apiClient.get('/subjects', { params });
    return data.data ?? data;
  },
};

// ---------------------------------------------------------------------------
// Questions (public read, admin write)
// ---------------------------------------------------------------------------
export const questionsService = {
  async getQuestions(params) {
    const { data } = await apiClient.get('/questions', { params });
    return data;
  },
  async searchQuestions(q) {
    const { data } = await apiClient.get('/questions/search', { params: { q } });
    return data;
  },
  async getQuestionById(id) {
    const { data } = await apiClient.get(`/questions/${id}`);
    return data.data;
  },
  async createQuestion(payload) {
    const { data } = await apiClient.post('/questions', payload);
    return data;
  },
  async updateQuestion(id, payload) {
    const { data } = await apiClient.put(`/questions/${id}`, payload);
    return data;
  },
  async deleteQuestion(id) {
    const { data } = await apiClient.delete(`/questions/${id}`);
    return data;
  },
};

// ---------------------------------------------------------------------------
// Practice (all protected)
// ---------------------------------------------------------------------------
export const practiceService = {
  async start(payload) {
    const { data } = await apiClient.post('/practice/start', payload);
    return data;
  },
  async submit(id, payload) {
    const { data } = await apiClient.post(`/practice/${id}/submit`, payload);
    return data;
  },
  async getHistory() {
    const { data } = await apiClient.get('/practice/history');
    return data;
  },
  async getSession(id) {
    const { data } = await apiClient.get(`/practice/${id}`);
    return data;
  },
  async autosave(id, payload) {
    const { data } = await apiClient.patch(`/practice/${id}/autosave`, payload);
    return data;
  },
  async review(id) {
    const { data } = await apiClient.get(`/practice/${id}/review`);
    return data;
  },
};

// ---------------------------------------------------------------------------
// Exams / CBT (all protected)
// NOTE: the raw URL list had what look like typos - "/resultd" and
// "/save-answery". Using the clean paths below - confirm with backend team.
// ---------------------------------------------------------------------------
export const examsService = {
  async start(payload) {
    const { data } = await apiClient.post('/exams/start', payload);
    return data;
  },
  async submit(id, payload) {
    const { data } = await apiClient.post(`/exams/${id}/submit`, payload);
    return data;
  },
  async getResult(id) {
    const { data } = await apiClient.get(`/exams/${id}/result`);
    return data;
  },
  async getHistory() {
    const { data } = await apiClient.get('/exams/history');
    return data;
  },
  async getExam(id) {
    const { data } = await apiClient.get(`/exams/${id}`);
    return data;
  },
  async review(id) {
    const { data } = await apiClient.get(`/exams/${id}/review`);
    return data;
  },
  async resume(id) {
    const { data } = await apiClient.get(`/exams/${id}/resume`);
    return data;
  },
  async saveAnswer(id, payload) {
    const { data } = await apiClient.patch(`/exams/${id}/save-answer`, payload);
    return data;
  },
};

// ---------------------------------------------------------------------------
// Bookmarks (all protected)
// ---------------------------------------------------------------------------
export const bookmarksService = {
  async create(questionId) {
    const { data } = await apiClient.post('/bookmarks', { questionId });
    return data.data;
  },
  async getAll() {
    const { data } = await apiClient.get('/bookmarks');
    return data.data;
  },
  async remove(id) {
    const { data } = await apiClient.delete(`/bookmarks/${id}`);
    return data;
  },
  async removeByQuestion(questionId) {
    const { data } = await apiClient.delete(`/bookmarks/question/${questionId}`);
    return data;
  },
};

// ---------------------------------------------------------------------------
// Analytics (all protected)
// ---------------------------------------------------------------------------
export const analyticsService = {
  async getDashboard() {
    const { data } = await apiClient.get('/analytics/dashboard');
    return data;
  },
  async getPractice(params) {
    const { data } = await apiClient.get('/analytics/practice', { params });
    return data;
  },
  async getCbt(params) {
    const { data } = await apiClient.get('/analytics/cbt', { params });
    return data;
  },
  async getSubjects(params) {
    const { data } = await apiClient.get('/analytics/subjects', { params });
    return data;
  },
  async getTrend(params) {
    const { data } = await apiClient.get('/analytics/trend', { params });
    return data;
  },
  async getBookmarksAnalytics() {
    const { data } = await apiClient.get('/analytics/bookmarks');
    return data;
  },
  async getActivities(params) {
    const { data } = await apiClient.get('/analytics/activities', { params });
    return data;
  },
};

/* ---- Bare RN alternative for tokenStorage (no Expo) ----
import * as Keychain from 'react-native-keychain';

export const tokenStorage = {
  async getAccessToken() {
    const creds = await Keychain.getGenericPassword({ service: 'examprep_access' });
    return creds ? creds.password : null;
  },
  async setTokens(accessToken, refreshToken) {
    await Keychain.setGenericPassword('token', accessToken, { service: 'examprep_access' });
    if (refreshToken) {
      await Keychain.setGenericPassword('token', refreshToken, { service: 'examprep_refresh' });
    }
  },
  async getRefreshToken() {
    const creds = await Keychain.getGenericPassword({ service: 'examprep_refresh' });
    return creds ? creds.password : null;
  },
  async clearTokens() {
    await Keychain.resetGenericPassword({ service: 'examprep_access' });
    await Keychain.resetGenericPassword({ service: 'examprep_refresh' });
  },
};
*/