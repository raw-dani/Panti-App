import axios from 'axios';
import type { Orphan, OrphanMedicalRecord, OrphanEducationRecord, OrphanFamilyContact, LoginResponse, ApiResponse, User, Staff, Donation } from './types';

const API_BASE = 'http://127.0.0.1:8000/api';



const api = axios.create({
  baseURL: API_BASE,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // JANGAN set Content-Type jika FormData, biarkan browser set otomatis dengan boundary
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  return config;
});

export const orphansApi = {
  getAll: (filters = {}): Promise<ApiResponse<Orphan[]>> => api.get('/orphans', { params: filters }).then(res => res.data),
  create: (data: FormData): Promise<ApiResponse<Orphan>> => api.post('/orphans', data, { headers: { 'Content-Type': 'multipart/form-data' }}).then(res => res.data),
  getById: (id: number): Promise<Orphan> => api.get(`/orphans/${id}`).then(res => res.data),
  update: (id: number, data: FormData): Promise<ApiResponse> => api.post(`/orphans/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'X-HTTP-Method-Override': 'PUT'
    },
  }).then(res => res.data),
  delete: (id: number): Promise<ApiResponse> => api.delete(`/orphans/${id}`).then(res => res.data),

  // Medical Records
  getMedicalRecords: (orphanId: number): Promise<ApiResponse<OrphanMedicalRecord[]>> => api.get(`/orphans/${orphanId}/medical-records`).then(res => res.data),
  createMedicalRecord: (orphanId: number, data: Partial<OrphanMedicalRecord>): Promise<ApiResponse<OrphanMedicalRecord>> => api.post(`/orphans/${orphanId}/medical-records`, data).then(res => res.data),
  updateMedicalRecord: (recordId: number, data: Partial<OrphanMedicalRecord>): Promise<ApiResponse> => api.put(`/medical-records/${recordId}`, data).then(res => res.data),
  deleteMedicalRecord: (recordId: number): Promise<ApiResponse> => api.delete(`/medical-records/${recordId}`).then(res => res.data),

  // Education Records
  getEducationRecords: (orphanId: number): Promise<ApiResponse<OrphanEducationRecord[]>> => api.get(`/orphans/${orphanId}/education-records`).then(res => res.data),
  createEducationRecord: (orphanId: number, data: Partial<OrphanEducationRecord>): Promise<ApiResponse<OrphanEducationRecord>> => api.post(`/orphans/${orphanId}/education-records`, data).then(res => res.data),
  updateEducationRecord: (recordId: number, data: Partial<OrphanEducationRecord>): Promise<ApiResponse> => api.put(`/education-records/${recordId}`, data).then(res => res.data),
  deleteEducationRecord: (recordId: number): Promise<ApiResponse> => api.delete(`/education-records/${recordId}`).then(res => res.data),

  // Family Contacts
  getFamilyContacts: (orphanId: number): Promise<ApiResponse<OrphanFamilyContact[]>> => api.get(`/orphans/${orphanId}/family-contacts`).then(res => res.data),
  createFamilyContact: (orphanId: number, data: Partial<OrphanFamilyContact>): Promise<ApiResponse<OrphanFamilyContact>> => api.post(`/orphans/${orphanId}/family-contacts`, data).then(res => res.data),
  updateFamilyContact: (contactId: number, data: Partial<OrphanFamilyContact>): Promise<ApiResponse> => api.put(`/family-contacts/${contactId}`, data).then(res => res.data),
  deleteFamilyContact: (contactId: number): Promise<ApiResponse> => api.delete(`/family-contacts/${contactId}`).then(res => res.data),

  // Birthday Reminders
  getUpcomingBirthdays: (days = 30): Promise<ApiResponse<Orphan[]>> => api.get('/orphans/upcoming-birthdays', { params: { days } }).then(res => res.data),
};

export const staffApi = {
  getAll: (filters = {}): Promise<ApiResponse<Staff[]>> => api.get('/staff', { params: filters }).then(res => res.data),
  create: (data: Partial<Staff>): Promise<ApiResponse<Staff>> => api.post('/staff', data).then(res => res.data),
  getById: (id: number): Promise<Staff> => api.get(`/staff/${id}`).then(res => res.data),
  update: (id: number, data: Partial<Staff>): Promise<ApiResponse> => api.put(`/staff/${id}`, data).then(res => res.data),
  delete: (id: number): Promise<ApiResponse> => api.delete(`/staff/${id}`).then(res => res.data),

  // Attendance
  getAttendances: (staffId: number): Promise<ApiResponse<import('./types').StaffAttendance[]>> => api.get(`/staff/${staffId}/attendances`).then(res => res.data),
  createAttendance: (staffId: number, data: any): Promise<ApiResponse> => api.post(`/staff/${staffId}/attendances`, data).then(res => res.data),
  updateAttendance: (attendanceId: number, data: any): Promise<ApiResponse> => api.put(`/attendances/${attendanceId}`, data).then(res => res.data),
  deleteAttendance: (attendanceId: number): Promise<ApiResponse> => api.delete(`/attendances/${attendanceId}`).then(res => res.data),

  // Payroll
  getPayrolls: (staffId: number): Promise<ApiResponse<import('./types').StaffPayroll[]>> => api.get(`/staff/${staffId}/payrolls`).then(res => res.data),
  createPayroll: (staffId: number, data: any): Promise<ApiResponse> => api.post(`/staff/${staffId}/payrolls`, data).then(res => res.data),
  updatePayroll: (payrollId: number, data: any): Promise<ApiResponse> => api.put(`/payrolls/${payrollId}`, data).then(res => res.data),
  deletePayroll: (payrollId: number): Promise<ApiResponse> => api.delete(`/payrolls/${payrollId}`).then(res => res.data),

  // Performance Reviews
  getPerformanceReviews: (staffId: number): Promise<ApiResponse<import('./types').StaffPerformanceReview[]>> => api.get(`/staff/${staffId}/performance-reviews`).then(res => res.data),
  createPerformanceReview: (staffId: number, data: any): Promise<ApiResponse> => api.post(`/staff/${staffId}/performance-reviews`, data).then(res => res.data),
  updatePerformanceReview: (reviewId: number, data: any): Promise<ApiResponse> => api.put(`/performance-reviews/${reviewId}`, data).then(res => res.data),
  deletePerformanceReview: (reviewId: number): Promise<ApiResponse> => api.delete(`/performance-reviews/${reviewId}`).then(res => res.data),
};

export const authApi = {
   login: (email: string, password: string): Promise<LoginResponse> => api.post('/login', { email, password }).then(res => res.data),
   register: (data: { name: string; email: string; password: string; password_confirmation: string; role?: string }): Promise<LoginResponse> => api.post('/register', data).then(res => res.data),
   logout: (): Promise<ApiResponse> => api.post('/logout').then(res => res.data),
   getUser: (): Promise<User> => api.get('/user').then(res => res.data),
   getUsers: (): Promise<User[]> => api.get('/users').then(res => res.data),
};

export const donationsApi = {
    getAll: (filters = {}): Promise<ApiResponse<Donation[]>> => api.get('/donations', { params: filters }).then(res => res.data),
    create: (data: Partial<Donation>): Promise<ApiResponse<Donation>> => api.post('/donations', data).then(res => res.data),
    getById: (id: number): Promise<Donation> => api.get(`/donations/${id}`).then(res => res.data),
    update: (id: number, data: Partial<Donation>): Promise<ApiResponse> => api.put(`/donations/${id}`, data).then(res => res.data),
    delete: (id: number): Promise<ApiResponse> => api.delete(`/donations/${id}`).then(res => res.data),
};

export const dashboardApi = {
    getStats: (): Promise<{
        total_orphans: number;
        total_active_staff: number;
        donations_this_month: number;
        upcoming_events: number;
    }> => api.get('/dashboard/stats').then(res => res.data),
};

export default api;

