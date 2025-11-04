export interface User {
  id: string;
  password: string;
  name: string;
  role: 'user' | 'admin';
  lastLogin?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  content: string;
  type: 'pdf' | 'text';
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  questions: QuizQuestion[];
  createdAt: string;
}

export interface QuizResult {
  id: string;
  userId: string;
  quizId: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
  answers: number[];
}

export interface AppSettings {
  appName: string;
  logoUrl: string;
}
