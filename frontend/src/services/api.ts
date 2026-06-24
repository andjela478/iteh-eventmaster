import axios from 'axios';
import type { LoginCredentials, RegisterData, AuthResponse, Event, Category, Location, Registration } from '../types';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL
});

// Dodavanje tokena u svaki request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  register: async (data: RegisterData) => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  }
};

// Events API
export const eventsAPI = {
  getAll: async () => {
    const response = await api.get<Event[]>('/events');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<Event>(`/events/${id}`);
    return response.data;
  },

  create: async (eventData: Partial<Event>) => {
    const response = await api.post<{ message: string; event: Event }>('/events', eventData);
    return response.data;
  },

  update: async (id: number, eventData: Partial<Event>) => {
    const response = await api.put<{ message: string; event: Event }>(`/events/${id}`, eventData);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete<{ message: string }>(`/events/${id}`);
    return response.data;
  }
};

// Categories API
export const categoriesAPI = {
  getAll: async () => {
    const response = await api.get<Category[]>('/categories');
    return response.data;
  }
};

// Locations API
export const locationsAPI = {
  getAll: async () => {
    const response = await api.get<Location[]>('/locations');
    return response.data;
  }
};

// Registrations API
export const registrationsAPI = {
  create: async (event_id: number) => {
    const response = await api.post<{ message: string; registration: Registration }>('/registrations', { event_id });
    return response.data;
  },

  cancel: async (id: number) => {
    const response = await api.delete<{ message: string }>(`/registrations/${id}`);
    return response.data;
  },

  getUserRegistrations: async (userId: number) => {
    const response = await api.get<Registration[]>(`/registrations/user/${userId}`);
    return response.data;
  }
};
