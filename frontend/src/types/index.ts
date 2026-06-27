export interface User {
  id: number;
  name: string;
  email: string;
  role: 'guest' | 'user' | 'organizer';
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface Location {
  id: number;
  name: string;
  address?: string;
  city: string;
  capacity?: number;
}

export interface Event {
  id: number;
  title: string;
  short_description?: string;
  description?: string;
  date: string;
  max_participants: number;
  organizer_id: number;
  category_id: number;
  location_id: number;
  image_url?: string;
  createdAt?: string;
  updatedAt?: string;
  category?: Category;
  location?: Location;
  organizer?: User;
  registrations?: Registration[];
}

export interface Registration {
  id: number;
  user_id: number;
  event_id: number;
  registration_date: string;
  status: 'active' | 'cancelled';
  event?: Event;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'organizer';
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}
