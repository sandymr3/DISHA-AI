# DISHA AI - Setup & Configuration Guide

## Overview
DISHA AI is a professional education guidance platform that uses AI to help international students find universities, secure loans, and plan their education journey.

## Environment Variables Required

To run the application, you need to set up the following environment variable:

### Google Gemini API Key (Required for AI Mentor)
```
GOOGLE_API_KEY=your_gemini_api_key_here
```

Get your API key from: https://makersuite.google.com/app/apikey

## Features

### 1. Landing Page (`/`)
- Modern hero section with feature highlights
- Call-to-action buttons for getting started
- Responsive design for all devices

### 2. ECP Calculator (`/calculator`)
- 8-question assessment covering:
  - Academic performance (CGPA)
  - Test scores (GMAT/GRE/GATE)
  - Professional experience
  - Internships
  - Projects/Publications
  - Leadership roles
  - Language proficiency
  - Additional certifications

- Features:
  - Real-time score calculation
  - Animated gauge visualization (fills in 2 seconds)
  - Profile band classification (High/Medium/Low)
  - Personalized recommendations

### 3. University Dashboard (`/dashboard`)
- Displays universities filtered by ECP score
- Interactive university cards showing:
  - Ranking
  - Average fees
  - CGPA & ECP cutoffs
  - Funding availability
- Funding filter to show only universities with funding
- AI Mentor chat sidebar with context-aware responses
- Quick navigation to loans page

### 4. Loan Marketplace (`/loans`)
- 5+ education loan providers (Avanse, InCred, HDFC, Axis, ICICI)
- Loan cards showing:
  - Interest rates
  - EMI details
  - Loan amount range
  - Processing fees
  - Key features
- Lock/unlock mechanism based on ECP score (unlocks at score ≥ 60)
- Padlock animation when unlocking
- Detailed loan information cards

### 5. ROI Simulator (`/loans` - Simulator tab)
- 10-year financial projection
- Customizable parameters:
  - Loan amount
  - Interest rate
  - Tenure
  - Starting salary
  - Annual salary growth rate
- Interactive charts showing:
  - Salary growth trajectory
  - EMI to income ratio
  - Total loan paid
- Detailed year-by-year breakdown table

### 6. Features Showcase (`/features`)
- Dedicated page showing all platform capabilities
- Detailed descriptions of each feature
- Benefits and use cases

## Architecture

### Pages
- `app/page.tsx` - Landing page
- `app/calculator/page.tsx` - ECP calculator
- `app/dashboard/page.tsx` - University matching
- `app/loans/page.tsx` - Loans & ROI simulator
- `app/features/page.tsx` - Features showcase

### API Routes
- `app/api/chat/route.ts` - Gemini AI chat endpoint

### Components
- `components/animated-gauge.tsx` - SVG gauge with Framer Motion animation
- `components/ecp-calculator.tsx` - Multi-step calculator form
- `components/university-card.tsx` - University display card
- `components/ai-mentor-chat.tsx` - Chat interface
- `components/loan-card.tsx` - Loan offer card
- `components/roi-simulator.tsx` - 10-year projection simulator

### Utilities
- `lib/types.ts` - TypeScript types and interfaces
- `lib/ecp-calculator.ts` - ECP scoring and filtering logic
- `lib/data.ts` - Static data (universities, loans, questions)

## Design

### Color Scheme
- **Background**: Deep black (#0a0e27)
- **Primary**: Indigo (#6366f1)
- **Secondary**: Purple (#8b5cf6)
- **Accent**: Light indigo (#4f46e5)
- **Card Background**: Darker black (#131829)
- **Border**: Dark blue-gray (#1e2139)

### Typography
- **Font**: Geist (sans-serif) for all text
- **Mono**: Geist Mono for code/technical content

## Key Technologies

- **Framework**: Next.js 16 with Turbopack
- **Language**: TypeScript
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **AI**: Google Generative AI (Gemini 2.5 Flash)

## Data Flow

1. User lands on homepage
2. Starts ECP calculator
3. Submits 8 questions → ECP score calculated
4. Score persisted to session storage
5. Redirected to dashboard with matched universities
6. Can interact with AI mentor (powered by Gemini)
7. Navigate to loans for financing options
8. Use ROI simulator to model finances

## Security Notes

- ECP results stored in browser session storage (not persistent)
- No user authentication required for demo
- Gemini API key should be protected and never exposed in client code
- All API calls go through backend route handler

## Getting Started

1. Set `GOOGLE_API_KEY` environment variable
2. Run: `pnpm dev`
3. Open http://localhost:3000
4. Click "Get Started" to begin ECP assessment

## Deployment

Ready to deploy on Vercel:
```bash
vercel deploy
```

Make sure to add `GOOGLE_API_KEY` to Vercel Environment Variables in project settings.

## Future Enhancements

- User authentication & profiles
- Database storage for results
- More detailed university data
- Scholarship finder
- Visa requirements tracker
- Application timeline generator
- Document checklist
- Interview preparation tools
