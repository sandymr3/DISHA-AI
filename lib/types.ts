// DISHA AI Types

export interface ECPResult {
  score: number;
  band: 'High' | 'Medium' | 'Low';
  recommendation: string;
}

export interface StudentProfile {
  name: string;
  email: string;
  cgpa: number;
  incomeLevel: 'Low' | 'Medium' | 'High' | 'Very High';
  targetCountry: string;
  targetProgram: string;
  yearsOfExp?: number;
  testScore?: number;
  ecpResult?: ECPResult;
}

export interface University {
  id: string;
  name: string;
  country: string;
  ranking: number;
  avgFees: number;
  program: string;
  fundingAvailable: 'Full' | 'Partial' | 'Limited';
  cutoffCGPA: number;
  cutoffECP: number;
}

export interface LoanOffer {
  id: string;
  provider: string;
  minAmount: number;
  maxAmount: number;
  interestRate: number;
  processingFee: number;
  tenure: number;
  ecpRequirement: number;
  features: string[];
  locked: boolean;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ECPFormData {
  q1: number; // CGPA scale
  q2: number; // Test score scale
  q3: number; // Experience
  q4: number; // Internships
  q5: number; // Projects
  q6: number; // Leadership
  q7: number; // Language proficiency
  q8: number; // Additional certifications
}
