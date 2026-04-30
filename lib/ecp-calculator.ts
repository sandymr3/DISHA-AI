import { ECPFormData, ECPResult } from './types'

// Calculate ECP score (0-100) from form data
export function calculateECPScore(formData: ECPFormData): number {
  const weights = {
    q1: 0.20, // CGPA (20%)
    q2: 0.18, // Test Score (18%)
    q3: 0.12, // Experience (12%)
    q4: 0.15, // Internships (15%)
    q5: 0.14, // Projects (14%)
    q6: 0.10, // Leadership (10%)
    q7: 0.06, // Language (6%)
    q8: 0.05, // Certifications (5%)
  }

  const score =
    formData.q1 * weights.q1 +
    formData.q2 * weights.q2 +
    formData.q3 * weights.q3 +
    formData.q4 * weights.q4 +
    formData.q5 * weights.q5 +
    formData.q6 * weights.q6 +
    formData.q7 * weights.q7 +
    formData.q8 * weights.q8

  return Math.min(100, Math.max(0, score))
}

// Get ECP band and recommendation
export function getECPBandAndRecommendation(score: number): Omit<ECPResult, 'score'> {
  if (score >= 75) {
    return {
      band: 'High',
      recommendation:
        'Excellent profile! You qualify for top universities globally with strong funding opportunities. Consider Ivy League institutions and Russell Group universities.',
    }
  } else if (score >= 55) {
    return {
      band: 'Medium',
      recommendation:
        'Good profile! You can apply to reputable universities worldwide. Focus on universities ranked 50-150 with funding assistance available.',
    }
  } else {
    return {
      band: 'Low',
      recommendation:
        'Profile improvement needed. Consider enhancing your portfolio with internships, projects, or certifications before applying.',
    }
  }
}

// Get full ECP result
export function getECPResult(formData: ECPFormData): ECPResult {
  const score = calculateECPScore(formData)
  const bandAndRecommendation = getECPBandAndRecommendation(score)
  return {
    score: Math.round(score),
    ...bandAndRecommendation,
  }
}

// Filter universities by ECP score
export function filterUniversitiesByECP(universities: any[], ecpScore: number) {
  return universities.filter((uni) => uni.cutoffECP <= ecpScore)
}

// Filter universities by funding band
export function filterUniversitiesByFunding(universities: any[], fundingNeeded: boolean) {
  if (!fundingNeeded) return universities
  return universities.filter((uni) => uni.fundingAvailable !== 'Limited')
}

// Calculate ROI projection for 10 years
export function calculateROIProjection(
  loanAmount: number,
  interestRate: number,
  tenure: number,
  expectedSalaryStart: number,
  expectedSalaryGrowthRate: number = 0.08
) {
  const monthlyRate = interestRate / 100 / 12
  const numberOfPayments = tenure * 12

  // Calculate monthly EMI
  const emi =
    (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1)

  const projections = []

  for (let year = 1; year <= 10; year++) {
    const salary = expectedSalaryStart * Math.pow(1 + expectedSalaryGrowthRate, year - 1)
    const monthlyIncome = salary / 12
    const totalLoanPaid = year <= tenure ? emi * 12 * year : emi * 12 * tenure
    const remainingLoan = Math.max(0, loanAmount - totalLoanPaid)

    projections.push({
      year,
      salary: Math.round(salary),
      monthlyEMI: Math.round(emi),
      monthlyIncome: Math.round(monthlyIncome),
      totalLoanPaid: Math.round(totalLoanPaid),
      remainingLoan: Math.round(remainingLoan),
      emiToIncomeRatio: ((emi * 12) / salary) * 100,
    })
  }

  return projections
}
