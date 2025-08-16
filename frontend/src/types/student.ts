export interface Student { 
  id: string; 
  name: string; 
  email?: string; 
  lastSubmissionAt?: string; 
}

export interface Assignment { 
  id: string; 
  title: string; 
  dueDate: string; 
  submittedCount: number; 
  totalCount: number; 
} 