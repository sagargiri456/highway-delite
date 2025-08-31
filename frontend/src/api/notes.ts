import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export interface Note {
  _id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteData {
  title: string;
  content: string;
}

export interface UpdateNoteData {
  title: string;
  content: string;
}

export interface NotesResponse {
  success: boolean;
  message: string;
  data: {
    notes: Note[];
    pagination: {
      page: number;
      limit: number;
      totalNotes: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export interface NoteResponse {
  success: boolean;
  message: string;
  data: Note;
}

export interface ApiError {
  success: boolean;
  message: string;
  error?: string;
}

// Notes API functions
export const notesApi = {
  // Get all notes with pagination
  async getNotes(page: number = 1, limit: number = 10): Promise<NotesResponse> {
    try {
      const response = await api.get(`/notes?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  },

  // Create a new note
  async createNote(noteData: CreateNoteData): Promise<NoteResponse> {
    try {
      const response = await api.post('/notes', noteData);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  },

  // Update an existing note
  async updateNote(id: string, noteData: UpdateNoteData): Promise<NoteResponse> {
    try {
      const response = await api.put(`/notes/${id}`, noteData);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  },

  // Delete a note
  async deleteNote(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete(`/notes/${id}`);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  },

  // Error handler
  handleError(error: any): Error {
    if (error.response?.data) {
      const apiError = error.response.data as ApiError;
      return new Error(apiError.message || 'An error occurred');
    }
    if (error.message) {
      return new Error(error.message);
    }
    return new Error('Network error occurred');
  }
};

export default notesApi;
