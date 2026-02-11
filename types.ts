export type UserRole = 'candidate' | 'recruiter' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'candidate' | 'recruiter';
  company?: string; // For recruiters
  avatar?: string;
}

export enum ApplicationStatus {
  APPLIED = 'APPLIED',
  REVIEWING = 'REVIEWING',
  INTERVIEWING = 'INTERVIEWING',
  REJECTED = 'REJECTED',
  OFFER = 'OFFER'
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  postedAt: string;
  deadline?: string;
}

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  appliedAt: string;
  status: ApplicationStatus;
  feedback?: string; // Mandatory if status is REJECTED
  resumeLink?: string;
  skills: string[];
}

export interface FeedbackRequest {
  candidateName: string;
  jobTitle: string;
  reasons: string[];
  tone: 'gentle' | 'direct' | 'encouraging';
}