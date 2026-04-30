'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { calculateROIProjection } from '@/lib/ecp-calculator'
import { TrendingUp } from 'lucide-react'

interface ROISimulatorProps {
  loanAmount?: number
  interestRate?: number
  tenure?: number
}

export function ROISimulator({ loanAmount = 300000, interestRate = 8.9, tenure = 15 }: ROISimulatorProps) {
  const [inputs, setInputs] = useState({
    loanAmount,
    interestRate,
    tenure,
    startingSalary: 60000,
    growthRate: 8,
  })

  const [projections, setProjections] = useState<any[]>([])
  const [showResults, setShowResults] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({
      ...prev,
      [field]: parseFloat(value) || 0,
    }))
  }

  const handleCalculate = () => {
    const data = calculateROIProjection(
      inputs.loanAmount,
      inputs.interestRate,
      inputs.tenure,
      inputs.startingSalary,
      inputs.growthRate / 100
    )
    setProjections(data)
    setShowResults(true)
  }

  const chartData = projections.map((proj) => ({
    year: proj.year,
    salary: Math.round(proj.salary / 1000),
    emiRatio: proj.emiToIncomeRatio,
    totalLoanPaid: Math.round(proj.totalLoanPaid / 1000),
  }))

  const finalProjection = projections[projections.length - 1]

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-card border border-border p-6">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            ROI Simulator - 10 Year Projection
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div>
              <Label htmlFor="loanAmount" className="text-sm font-medium mb-2 block">
                Loan Amount ($)
              </Label>
              <Input
                id="loanAmount"
                type="number"
                value={inputs.loanAmount}
                onChange={(e) => handleInputChange('loanAmount', e.target.value)}
                className="bg-input border-border/50"
              />
            </div>

            <div>
              <Label htmlFor="interestRate" className="text-sm font-medium mb-2 block">
                Interest Rate (%)
              </Label>
              <Input
                id="interestRate"
                type="number"
                step="0.1"
                value={inputs.interestRate}
                onChange={(e) => handleInputChange('interestRate', e.target.value)}
                className="bg-input border-border/50"
              />
            </div>

            <div>
              <Label htmlFor="tenure" className="text-sm font-medium mb-2 block">
                Tenure (Years)
              </Label>
              <Input
                id="tenure"
                type="number"
                value={inputs.tenure}
                onChange={(e) => handleInputChange('tenure', e.target.value)}
                className="bg-input border-border/50"
              />
            </div>

            <div>
              <Label htmlFor="startingSalary" className="text-sm font-medium mb-2 block">
                Starting Salary ($)
              </Label>
              <Input
                id="startingSalary"
                type="number"
                value={inputs.startingSalary}
                onChange={(e) => handleInputChange('startingSalary', e.target.value)}
                className="bg-input border-border/50"
              />
            </div>

            <div>
              <Label htmlFor="growthRate" className="text-sm font-medium mb-2 block">
                Growth Rate (%)
              </Label>
              <Input
                id="growthRate"
                type="number"
                step="0.5"
                value={inputs.growthRate}
                onChange={(e) => handleInputChange('growthRate', e.target.value)}
                className="bg-input border-border/50"
              />
            </div>
          </div>

          <Button onClick={handleCalculate} className="w-full bg-primary hover:bg-primary/90">
            Calculate 10-Year Projection
          </Button>
        </Card>
      </motion.div>

      {/* Results Section */}
      {showResults && projections.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Chart */}
          <Card className="bg-card border border-border p-6">
            <h4 className="font-semibold mb-4">10-Year Financial Projection</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="year" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" yAxisId="left" />
                <YAxis stroke="rgba(255,255,255,0.5)" yAxisId="right" orientation="right" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#131829',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="salary"
                  stroke="#6366f1"
                  name="Annual Salary (k$)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="emiRatio"
                  stroke="#8b5cf6"
                  name="EMI/Income Ratio (%)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Summary Stats */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-card border border-border/50 p-4">
              <p className="text-foreground/60 text-sm mb-1">Starting Salary</p>
              <p className="text-2xl font-bold text-primary">${inputs.startingSalary.toLocaleString()}</p>
            </Card>

            <Card className="bg-card border border-border/50 p-4">
              <p className="text-foreground/60 text-sm mb-1">Year 10 Salary</p>
              <p className="text-2xl font-bold text-secondary">
                ${finalProjection?.salary?.toLocaleString()}
              </p>
            </Card>

            <Card className="bg-card border border-border/50 p-4">
              <p className="text-foreground/60 text-sm mb-1">Total Loan Paid</p>
              <p className="text-2xl font-bold text-accent">
                ${finalProjection?.totalLoanPaid?.toLocaleString()}
              </p>
            </Card>

            <Card className="bg-card border border-border/50 p-4">
              <p className="text-foreground/60 text-sm mb-1">Avg EMI/Income</p>
              <p className={`text-2xl font-bold ${
                projections.reduce((avg, p) => avg + p.emiToIncomeRatio, 0) / projections.length > 30
                  ? 'text-red-400'
                  : 'text-green-400'
              }`}>
                {(projections.reduce((avg, p) => avg + p.emiToIncomeRatio, 0) / projections.length).toFixed(1)}%
              </p>
            </Card>
          </div>

          {/* Detailed Table */}
          <Card className="bg-card border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/30 bg-muted/20">
                    <th className="px-4 py-3 text-left font-semibold">Year</th>
                    <th className="px-4 py-3 text-left font-semibold">Salary</th>
                    <th className="px-4 py-3 text-left font-semibold">Monthly EMI</th>
                    <th className="px-4 py-3 text-left font-semibold">Total Paid</th>
                    <th className="px-4 py-3 text-left font-semibold">EMI Ratio</th>
                  </tr>
                </thead>
                <tbody>
                  {projections.map((proj, idx) => (
                    <tr
                      key={idx}
                      className={`border-b border-border/20 hover:bg-muted/10 transition ${
                        idx % 2 === 0 ? 'bg-muted/5' : ''
                      }`}
                    >
                      <td className="px-4 py-3">{proj.year}</td>
                      <td className="px-4 py-3">${proj.salary.toLocaleString()}</td>
                      <td className="px-4 py-3">${proj.monthlyEMI.toLocaleString()}</td>
                      <td className="px-4 py-3">${proj.totalLoanPaid.toLocaleString()}</td>
                      <td className={`px-4 py-3 font-semibold ${
                        proj.emiToIncomeRatio > 30 ? 'text-red-400' : 'text-green-400'
                      }`}>
                        {proj.emiToIncomeRatio.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
