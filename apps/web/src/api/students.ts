import { apiClient } from './client';
import { Student } from './types';

export function getStudents(): Promise<Student[]> {
  return apiClient.get<Student[]>('students');
}
