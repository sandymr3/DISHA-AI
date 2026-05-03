// DISHA AI — Backend API Client
import { auth } from './firebase';
import type {
  StudentProfile, ECPResult, MatchedUniversity, LoanOffer,
  EMIResult, ROIResult, FundingPassport, DreamGapResult,
  LoanApplication, LoanApplicationRequest, APIResponse,
  SSEEvent, ChatMessage,
} from './types';

const API_BASE = '/api/v1';

/** Returns Authorization header with fresh Firebase ID token, or empty object if not signed in. */
async function getAuthHeaders(): Promise<Record<string, string>> {
  const user = auth.currentUser;
  if (!user) return {};
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
}

async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...authHeaders, ...(init?.headers || {}) },
  });
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error((errorBody as APIResponse)?.error?.message || `API error ${res.status}`);
  }
  const body: APIResponse<T> = await res.json();
  if (!body.success) throw new Error(body.error?.message || 'Unknown API error');
  return body.data;
}


export async function createStudent(profile: StudentProfile): Promise<{ studentId: string; ecpResult: ECPResult }> {
  return fetchJSON(`${API_BASE}/students`, { method: 'POST', body: JSON.stringify(profile) });
}

export async function getStudent(studentId: string) {
  return fetchJSON<{ studentId: string; profile: StudentProfile; ecpResult: ECPResult; createdAt: string }>(`${API_BASE}/students/${studentId}`);
}

export async function updateStudent(studentId: string, profile: StudentProfile) {
  return fetchJSON<{ studentId: string; profile: StudentProfile; ecpResult: ECPResult }>(`${API_BASE}/students/${studentId}`, { method: 'PUT', body: JSON.stringify(profile) });
}

export async function calculateECP(profile: StudentProfile): Promise<ECPResult> {
  return fetchJSON(`${API_BASE}/ecp/calculate`, { method: 'POST', body: JSON.stringify(profile) });
}

export async function simulateECP(profile: StudentProfile): Promise<ECPResult> {
  return fetchJSON(`${API_BASE}/ecp/simulate`, { method: 'POST', body: JSON.stringify(profile) });
}

export async function matchUniversities(studentId: string, filters?: { country?: string; program?: string }): Promise<MatchedUniversity[]> {
  const params = new URLSearchParams({ studentId });
  if (filters?.country) params.set('country', filters.country);
  if (filters?.program) params.set('program', filters.program);
  return fetchJSON(`${API_BASE}/universities/match?${params.toString()}`);
}

export async function getUniversity(universityId: string) {
  return fetchJSON<MatchedUniversity>(`${API_BASE}/universities/${universityId}`);
}

export async function getAllUniversities() {
  return fetchJSON<MatchedUniversity[]>(`${API_BASE}/universities`);
}

export async function getLoanOffers(studentId: string) {
  return fetchJSON<{ offers: LoanOffer[]; unlocked: boolean; ecpScore: number }>(`${API_BASE}/loans/offers?studentId=${studentId}`);
}

export async function calculateEMI(params: { loanAmountLakh: number; annualRatePercent: number; repaymentYears: number }): Promise<EMIResult> {
  return fetchJSON(`${API_BASE}/loans/emi`, { method: 'POST', body: JSON.stringify(params) });
}

export async function calculateROI(params: { studentId: string; universityId: string; loanAmountLakh?: number; annualRatePercent?: number; currentSalaryLPA?: number }): Promise<ROIResult> {
  return fetchJSON(`${API_BASE}/roi/calculate`, { method: 'POST', body: JSON.stringify(params) });
}

export async function streamChat(
  studentId: string, messages: ChatMessage[],
  onDelta: (text: string) => void,
  onDone?: (usage: SSEEvent['usage']) => void,
  onError?: (message: string) => void,
  signal?: AbortSignal
): Promise<void> {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders },
    body: JSON.stringify({ studentId, messages }), signal,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as APIResponse)?.error?.message || 'Chat request failed');
  }
  const reader = res.body?.getReader();
  if (!reader) throw new Error('No response body');
  const decoder = new TextDecoder();
  let buffer = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const jsonStr = line.slice(6).trim();
      if (!jsonStr) continue;
      try {
        const event: SSEEvent = JSON.parse(jsonStr);
        if (event.type === 'delta' && event.text) onDelta(event.text);
        else if (event.type === 'done') onDone?.(event.usage);
        else if (event.type === 'error') onError?.(event.message || 'AI service unavailable');
      } catch { /* ignore malformed */ }
    }
  }
}

export async function getFundingPassport(studentId: string): Promise<FundingPassport> {
  return fetchJSON(`${API_BASE}/funding-passport/${studentId}`);
}

export async function getDreamGap(studentId: string, universityId: string): Promise<DreamGapResult> {
  return fetchJSON(`${API_BASE}/dream-gap?studentId=${studentId}&universityId=${universityId}`);
}

export async function createApplication(req: LoanApplicationRequest): Promise<LoanApplication> {
  return fetchJSON(`${API_BASE}/applications`, { method: 'POST', body: JSON.stringify(req) });
}

export async function getApplication(applicationId: string): Promise<LoanApplication> {
  return fetchJSON(`${API_BASE}/applications/${applicationId}`);
}

export async function healthCheck() {
  return fetchJSON<{ status: string; version: string }>(`${API_BASE}/health`);
}

// ─── Dynamic Search & Ingestion ────────────────────────────────────────

export interface AutocompleteResult {
  id: string;
  name: string;
  country: string;
  source: 'db' | 'web';
}

export async function autocompleteSearch(query: string): Promise<AutocompleteResult[]> {
  return fetchJSON(`${API_BASE}/search/autocomplete?q=${encodeURIComponent(query)}`);
}

export async function ingestEntity(entityName: string, entityType: 'university' | 'loan'): Promise<any> {
  return fetchJSON(`${API_BASE}/ingest`, {
    method: 'POST',
    body: JSON.stringify({ entityName, entityType }),
  });
}
