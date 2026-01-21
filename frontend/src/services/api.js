import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    logout: () => api.post('/auth/logout'),
    forgotPassword: (data) => api.post('/auth/forgot-password', data),
    resetPassword: (data) => api.post('/auth/reset-password', data)
};

export const studentAPI = {
    getProfile: () => api.get('/student/profile'),
    updateProfile: (data) => api.put('/student/profile', data),
    getPrograms: (params) => api.get('/student/programs', { params }),
    getProgramDetails: (id) => api.get(`/student/programs/${id}`),
    submitApplication: (data) => api.post('/student/applications', data),
    getApplications: (params) => api.get('/student/applications', { params }),
    getApplicationDetails: (id) => api.get(`/student/applications/${id}`),
    withdrawApplication: (id, data) => api.post(`/student/applications/${id}/withdraw`, data),
    getPayments: () => api.get('/student/payments'),
    getNotifications: (params) => api.get('/student/notifications', { params }),
    markNotificationRead: (id) => api.put(`/student/notifications/${id}/read`)
};

export const paymentAPI = {
    initiatePayment: (data) => api.post('/payments/initiate', data),
    verifyPayment: (data) => api.post('/payments/verify', data),
    getPaymentDetails: (id) => api.get(`/payments/${id}`)
};

export const universityAPI = {
    getProfile: () => api.get('/university/profile'),
    updateProfile: (data) => api.put('/university/profile', data),
    createProgram: (data) => api.post('/university/programs', data),
    getPrograms: () => api.get('/university/programs'),
    updateProgram: (id, data) => api.put(`/university/programs/${id}`, data),
    deleteProgram: (id) => api.delete(`/university/programs/${id}`),
    deactivateProgram: (id) => api.post(`/university/programs/${id}/deactivate`),
    getApplications: (params) => api.get('/university/applications', { params }),
    getApplicationDetails: (id) => api.get(`/university/applications/${id}`),
    changeApplicationStatus: (id, data) => api.post(`/university/applications/${id}/status`, data),
    getNotifications: () => api.get('/university/notifications')
};

export const adminAPI = {
    getAllUsers: (params) => api.get('/admin/users', { params }),
    getAllStudents: () => api.get('/admin/students'),
    getPendingStudents: () => api.get('/admin/students/pending'),
    verifyStudent: (id, data) => api.post(`/admin/students/${id}/verify`, data),
    rejectStudent: (id, data) => api.post(`/admin/students/${id}/reject`, data),
    getPendingUniversities: () => api.get('/admin/universities/pending'),
    verifyUniversity: (id) => api.post(`/admin/universities/${id}/verify`),
    rejectUniversity: (id, data) => api.post(`/admin/universities/${id}/reject`, data),
    getAllApplications: (params) => api.get('/admin/applications', { params }),
    getPayments: (params) => api.get('/admin/payments', { params }),
    getAnalytics: () => api.get('/admin/analytics'),
    getLogs: (params) => api.get('/admin/logs', { params }),
    deactivateUser: (id, data) => api.post(`/admin/users/${id}/deactivate`, data),
    resetPassword: (id, data) => api.post(`/admin/users/${id}/reset-password`, data)
};

export default api;
