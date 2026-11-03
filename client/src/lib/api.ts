import { apiRequest } from './queryClient';
import type { Student, InsertStudent } from '@shared/schema';
import { INITIAL_STUDENTS } from '@shared/initialData';

export const API_ENDPOINTS = {
  STUDENTS: '/api/students',
};

export const fetchStudents = async (): Promise<Student[]> => {
  try {
    const response = await fetch(API_ENDPOINTS.STUDENTS, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      console.warn(`API /api/students returned ${response.status}. Using standard dataset.`);
      return INITIAL_STUDENTS as Student[];
    }
    
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
    return INITIAL_STUDENTS as Student[];
  } catch (err) {
    console.warn("Network error fetching students. Using standard dataset fallback:", err);
    return INITIAL_STUDENTS as Student[];
  }
};

export const fetchStudent = async (id: number): Promise<Student> => {
  try {
    const response = await fetch(`${API_ENDPOINTS.STUDENTS}/${id}`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      const fallback = (INITIAL_STUDENTS as Student[]).find(s => s.id === id);
      if (fallback) return fallback;
      throw new Error(`Failed to fetch student: ${response.status}`);
    }
    
    return response.json();
  } catch (err) {
    const fallback = (INITIAL_STUDENTS as Student[]).find(s => s.id === id);
    if (fallback) return fallback;
    throw err;
  }
};

export const createStudent = async (student: InsertStudent): Promise<Student> => {
  const response = await apiRequest('POST', API_ENDPOINTS.STUDENTS, student);
  return response.json();
};

export const updateStudent = async (id: number, student: InsertStudent): Promise<Student> => {
  const response = await apiRequest('PUT', `${API_ENDPOINTS.STUDENTS}/${id}`, student);
  return response.json();
};

export const deleteStudent = async (id: number): Promise<void> => {
  await apiRequest('DELETE', `${API_ENDPOINTS.STUDENTS}/${id}`);
};
