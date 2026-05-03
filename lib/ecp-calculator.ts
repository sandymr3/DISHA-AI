// DISHA AI — ECP Calculator (backend-driven)
// All scoring now happens on the Go backend via api.ts
// This file is kept for backward compatibility but is essentially a no-op.

import type { StudentProfile, ECPResult } from './types';
import { calculateECP as apiCalculateECP } from './api';

export async function calculateECPFromBackend(profile: StudentProfile): Promise<ECPResult> {
  return apiCalculateECP(profile);
}
