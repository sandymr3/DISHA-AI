# DISHA AI - Quick Start Guide

## 🚀 Get Started in 60 Seconds

### 1. Set Your API Key
```bash
# In terminal, set the Gemini API key
export GOOGLE_API_KEY=your_key_from_makersuite.google.com
```

### 2. Start the Server
```bash
pnpm dev
```

Server runs at: http://localhost:3000

### 3. Navigate the App

**Flow 1: Calculator Demo**
```
Home Page (/
  ↓
Start ECP Calculator (/calculator)
  - Answer 8 questions
  - See animated gauge fill to your score
  - View profile band & recommendation
  - Click "View Matching Universities"
  ↓
Dashboard (/dashboard)
  - See 15+ universities filtered by your score
  - Filter by funding availability
  - Open AI Mentor chat (bottom right)
  - Ask questions about universities
```

**Flow 2: Loan & ROI**
```
Dashboard
  ↓
"Explore Loans & ROI" button
  ↓
Loans Page (/loans)
  - Browse loan providers
  - Locked loans show unlock requirement
  - ROI Simulator tab for financial projections
  - Interactive 10-year charts
```

**Flow 3: Features**
```
Home Page
  ↓
"Features" link in navigation
  ↓
See detailed feature descriptions
  - All features with benefits
  - Navigation to each section
```

## 🎯 Key Interactions

### Calculator (Most Impressive)
- 8 sliders for input
- Real-time preview grid
- **Animated gauge fills in 2 seconds** when complete
- Color-coded score (Red/Purple/Blue)

### Universities
- **20 universities** with real data
- Cards show: Ranking, fees, CGPA/ECP cutoff
- Funding badge (Full/Partial/Limited)
- Filter by funding needs

### AI Mentor
- Click chat icon in top-right
- Type any education question
- **Gemini responds with your profile context**
- Shows: Name, ECP score, target country, etc.
- Streaming responses (typing effect)

### Loan Cards
- **Padlock icon** for locked offers
- Click to unlock at score ≥ 60
- **Smooth animations** on unlock
- Shows: Interest rate, tenure, features

### ROI Simulator
- Adjust: Loan amount, interest, tenure, salary
- **Interactive charts** update in real-time
- 10 years of data visualized
- Table view with year-by-year breakdown

## 📱 Test Responsive Design

- **Desktop** (1920px) - Full 3-column grid
- **Tablet** (768px) - 2-column grid
- **Mobile** (375px) - 1-column, collapsed navigation

## 🎨 Visual Highlights

- **Deep black background** (#0a0e27)
- **Vibrant indigo/purple** accents
- **Smooth hover effects** on cards
- **Gradient backgrounds** for emphasis
- **Glassmorphism** headers with backdrop blur
- **Animated progress bars** in calculator

## 🔧 Customization

### Change Colors
Edit `app/globals.css`:
```css
:root {
  --primary: #6366f1;        /* Indigo */
  --secondary: #8b5cf6;      /* Purple */
  /* ... other colors */
}
```

### Add More Universities
Edit `lib/data.ts` - `UNIVERSITIES` array

### Modify Questions
Edit `lib/data.ts` - `ECP_QUESTIONS` array

### Adjust Animation Speed
Edit `components/animated-gauge.tsx`:
```tsx
transition={{
  duration: 2,  // Change this value
  ease: 'easeInOut',
}}
```

## 🧪 Test Data

**Sample ECP Scores After Calculator:**
- All questions at max = Score: ~95 (High Band)
- Moderate answers = Score: ~60 (Medium Band)
- Minimal answers = Score: ~25 (Low Band)

**Loan Unlock Thresholds:**
- Score < 55: No loans available (show lock)
- Score ≥ 55: 5 loan options available
- Score ≥ 60: All loans unlocked

**University Filtering:**
- Score < 45: 8 universities matched
- Score 45-65: 12 universities matched
- Score > 75: All 20 universities available

## 📊 What's Using Real APIs

✅ **Gemini AI Chat** - Connected to Google AI
❌ **Universities** - Static data (no API)
❌ **Loans** - Static data (no API)
❌ **Auth** - No authentication needed for demo

## 🚀 Deploy to Production

```bash
# One command deployment to Vercel
vercel deploy

# Add environment variable to Vercel dashboard:
GOOGLE_API_KEY=your_production_key
```

## 📝 Important Notes

1. **Session Storage**: ECP results are stored in browser (not persistent)
2. **No Database**: Uses static data for demo
3. **Free Tier**: Gemini API free tier works great for testing
4. **No Auth Required**: Just start using immediately
5. **Fully Responsive**: Mobile-first design works everywhere

## 🎓 Features for Demo

**Best to show judges:**
1. ECP calculator with gauge animation (2 sec fill)
2. AI mentor responding to questions
3. Loan unlock animations
4. ROI simulator with live chart updates
5. Responsive design across devices

## 💡 Pro Tips

- **Fast Forward**: Skip to score screen by entering all max values
- **Test Chat**: Ask "What universities in USA match my profile?"
- **ROI Simulation**: Try extreme numbers to see financial impact
- **Mobile Test**: Use browser dev tools (F12) to test responsive design
- **Dark Mode**: Already in dark mode by default

## ❓ Troubleshooting

**Chat not responding?**
- Check if GOOGLE_API_KEY is set
- Try refreshing the page

**Gauges not animating?**
- Works best in Chrome/Edge
- Firefox should also work
- Safari has same animation support

**Page not loading?**
- Check console (F12) for errors
- Clear browser cache
- Try incognito window

**Data not persisting?**
- It's stored in session storage
- Closing tab clears data (by design)
- Refresh page - data persists within session

---

**Ready to impress? Click "Get Started" and take the ECP calculator! 🎉**
