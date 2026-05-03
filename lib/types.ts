// DISHA AI — Type definitions matching Go backend contracts

// ─── ECP Scoring ───────────────────────────────────────────────────────

export type IncomeBand = '<3L' | '3-8L' | '8-20L' | '20L+';
export type ProgramType = 'MBA' | 'MS' | 'MiM' | 'PhD' | 'MArch' | 'MPH';
export type Country = 'USA' | 'UK' | 'Canada' | 'Germany' | 'Australia' | 'India';
export type IntakePeriod = 'Jan2026' | 'Sep2026' | 'Jan2027';
export type ECPTier = 'Green' | 'Amber' | 'Red';

export interface StudentProfile {
  name: string;
  cgpa: number;
  greScore: number;
  familyIncome: IncomeBand;
  hasCoApplicant: boolean;
  coApplicantIncome?: IncomeBand;
  targetCountry: Country;
  targetProgram: ProgramType;
  intake: IntakePeriod;
}

export interface SubScores {
  academic: number;
  financial: number;
  loanReadiness: number;
}

export interface ImprovementTip {
  action: string;
  potentialGain: number;
  effort: 'Low' | 'Medium' | 'High';
}

export interface ECPResult {
  score: number;
  tier: ECPTier;
  fundingBandLower: number;
  fundingBandUpper: number;
  subScores: SubScores;
  improvementTips: ImprovementTip[];
}

// ─── Student Record ────────────────────────────────────────────────────

export interface StudentRecord {
  studentId: string;
  profile: StudentProfile;
  ecpResult: ECPResult;
  createdAt: string;
}

// ─── University Matching ───────────────────────────────────────────────

export type FundingStatus = 'Within Band' | 'Stretch Goal' | 'Out of Range';

export interface University {
  id: string;
  name: string;
  country: Country;
  programType: ProgramType;
  programName: string;
  totalCostUSD: number;
  totalCostINR: number;
  postStudySalaryUSD: number;
  roiYears: number;
  admitProbability: Record<string, number>;
}

export interface MatchedUniversity extends University {
  coveragePercent: number;
  fundingStatus: FundingStatus;
  admitProbabilityForStudent: number;
  roiScore: number;
  matchScore: number;
}

// ─── Loan Offers ───────────────────────────────────────────────────────

export interface LoanOffer {
  id: string;
  lender: string;
  logo: string;
  color: string;
  maxAmountLakh: number;
  interestRateMin: number;
  interestRateMax: number;
  moratoriumMonths: number;
  repaymentYears: number;
  processingFeePercent: number;
  collateralRequired: boolean;
  usp: string;
  processingDays: number;
}

export interface LoanOffersResponse {
  offers: LoanOffer[];
  unlocked: boolean;
  ecpScore: number;
}

export interface EMIResult {
  monthlyEMI: number;
  totalInterest: number;
  totalPayment: number;
  loanAmountINR: number;
}

// ─── ROI ────────────────────────────────────────────────────────────────

export interface ROIDataPoint {
  year: number;
  withoutDegree: number;
  withDegree: number;
}

export interface ROIResult {
  data: ROIDataPoint[];
  breakEvenYear: number | null;
  tenYearGain: number;
}

// ─── Chat ───────────────────────────────────────────────────────────────

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface SSEEvent {
  type: 'delta' | 'done' | 'error';
  text?: string;
  message?: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
}

// ─── Funding Passport ──────────────────────────────────────────────────

export interface FundingPassport {
  name: string;
  ecpScore: number;
  tier: ECPTier;
  fundingBandLower: number;
  fundingBandUpper: number;
  topTwoUniversities: {
    name: string;
    program: string;
    fundingStatus: FundingStatus;
  }[];
  nbfcTier: string;
  shareUrl: string;
  generatedAt: string;
}

// ─── Dream Gap ─────────────────────────────────────────────────────────

export interface GapPath {
  action: string;
  potentialUnlockLakh: number;
  effort: 'Low' | 'Medium' | 'High';
}

export interface DreamGapResult {
  dreamUniversityName: string;
  dreamUniversityTotalCostLakh: number;
  studentFundingUpperLakh: number;
  gapLakh: number;
  pathsToCloseGap: GapPath[];
}

// ─── Loan Application ──────────────────────────────────────────────────

export interface LoanApplicationRequest {
  studentId: string;
  loanOfferId: string;
  universityId?: string;
  requestedAmountLakh?: number;
  phone?: string;
  pan?: string;
}

export interface LoanApplication {
  applicationId: string;
  studentId: string;
  loanOfferId: string;
  status: string;
  createdAt: string;
}

// ─── API Response Envelope ─────────────────────────────────────────────

export interface APIResponse<T = unknown> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
  };
  meta: {
    requestId: string;
    timestamp: string;
  };
}
