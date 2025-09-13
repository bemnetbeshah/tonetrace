# ToneTrace Frontend

A modern React-based teacher dashboard that transforms student writing into actionable classroom insights. Built to empower educators with the visibility they need to support every student's writing journey, from early intervention to long-term growth tracking.

## Vision

ToneTrace is built on the idea that teachers deserve better tools — and that better tools for teachers mean better outcomes for students. This dashboard acts as a **teaching assistant**, offering a **classroom health check** at a glance, and **restoring balance** by letting technology handle repetitive work so teachers can focus on building relationships and fostering creativity.

## 🚀 Teacher-Focused Features

### Classroom Analytics Dashboard
- **Classroom Health Check**: KPI cards showing class-wide writing trends and student performance at a glance
- **Early Intervention Alerts**: Notifications highlighting students who need attention or support
- **Growth Tracking**: Visual progress indicators showing student development over time
- **Cross-Subject Impact**: Insights into how writing skills affect performance across all subjects

### Student-Centered Management
- **Individual Student Profiles**: Deep dive into each student's writing patterns, emotional tones, and growth trajectory
- **Authentic Voice Monitoring**: Identify students who may not be expressing themselves genuinely
- **Confidence Building Tools**: Surface writing patterns that help teachers connect with students personally
- **At-Risk Student Identification**: Detect shifts in sentiment and performance that may indicate struggles

### Assignment & Progress Tracking
- **Submission Monitoring**: Track completion rates and identify students falling behind
- **Writing Development Analysis**: Monitor vocabulary growth, complexity improvement, and style evolution
- **Pattern Recognition**: Identify recurring issues across assignments and students
- **Longitudinal Growth**: Track progress over semesters and years

### Data Visualization & Reporting
- **Interactive Charts**: Visual representations of readability trends, grammar patterns, and tone analysis
- **Export Functionality**: CSV export for detailed reports and parent conferences
- **Print-Friendly Reports**: Optimized print styles for sharing insights with colleagues and families
- **Responsive Design**: Access insights seamlessly across all devices, from classroom tablets to home computers

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design tokens
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **State Management**: React Hooks (no global store for MVP)
- **Code Quality**: ESLint + Prettier

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tonetrace/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🎯 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── charts/          # Chart components (Recharts)
│   ├── states/          # Loading, error, and empty states
│   └── ...              # Other components
├── pages/               # Page components
│   ├── Dashboard.tsx    # Main dashboard
│   ├── Students.tsx     # Students list
│   └── StudentDetail.tsx # Individual student view
├── api/                 # API layer
│   └── mockApi.ts       # Mock data and API simulation
├── types/               # TypeScript type definitions
├── schemas/             # Zod validation schemas
├── utils/               # Utility functions
│   └── csv.ts          # CSV export functionality
├── lib/                 # Shared utilities
│   └── ui.ts           # UI helper functions
└── styles/              # Global styles and Tailwind config
```

## 🔌 Teacher Dashboard Integration

### Current Development Setup

The project currently uses `src/api/mockApi.ts` which provides:
- Simulated classroom data for development and testing
- Realistic API latency to mimic production conditions
- Type-safe interfaces designed for teacher workflows
- Seeded student profiles and writing analysis data

### Connecting to Real Classroom Data

To integrate with the ToneTrace backend for live classroom data:

1. **Update API endpoints** in `src/api/mockApi.ts`:
   ```typescript
   // Replace mock functions with real classroom data calls
   export const getDashboardSummary = async (): Promise<DashboardSummary> => {
     const response = await fetch('/api/classroom/dashboard');
     if (!response.ok) throw new Error('Failed to fetch classroom insights');
     return response.json();
   };
   ```

2. **Configure backend URL** in environment variables:
   ```typescript
   const API_BASE = import.meta.env.VITE_API_BASE || 'https://tonetrace-backend.onrender.com';
   ```

3. **Add teacher authentication** headers:
   ```typescript
   const headers = {
     'Authorization': `Bearer ${teacherToken}`,
     'Content-Type': 'application/json',
   };
   ```

4. **Handle classroom-specific errors**:
   ```typescript
   try {
     const classroomData = await apiCall();
   } catch (error) {
     if (error.name === 'TypeError') {
       // Network error - teacher may need to check connection
       setError('Unable to connect to classroom data');
     } else {
       // API error - may indicate data access issues
       setError(error.message);
     }
   }
   ```

## 🎨 Design System

### Color Palette
- **Brand Colors**: Blue scale (50-900) for primary elements
- **Semantic Colors**: Success (green), Warning (yellow), Danger (red)
- **Neutral Colors**: Gray scale for text and backgrounds

### Typography
- **Headings**: Custom font sizes with consistent line heights
- **Body Text**: Optimized for readability
- **Responsive**: Scales appropriately across device sizes

### Components
- **Cards**: Consistent rounded corners (xl: 1rem, 2xl: 1.25rem)
- **Buttons**: Hover states and focus indicators
- **Tables**: Responsive with proper spacing
- **Charts**: Accessible with proper labels and tooltips

## ♿ Accessibility Features

- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Screen Reader**: Proper ARIA labels and semantic HTML
- **Focus Management**: Visible focus indicators
- **Color Contrast**: WCAG AA compliant color combinations
- **Responsive Design**: Works on all screen sizes

## 📱 Responsive Breakpoints

- **Mobile**: 360px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px - 1279px
- **Large Desktop**: 1280px - 1439px
- **Extra Large**: 1440px+

## 🧪 Testing

The project includes Jest and React Testing Library setup:

```bash
npm run test          # Run all tests
npm run test:watch    # Run tests in watch mode
```

## 📊 Educational Data Models

### Student Profile
- Basic info (id, name, email, enrollment date)
- Writing development baseline and growth trajectory
- Risk level assessment for early intervention
- Emotional tone patterns and authenticity indicators
- Cross-subject impact analysis

### Classroom Assignment
- Title, due date, submission tracking
- Class-wide performance metrics and patterns
- Individual student progress indicators
- Writing quality trends and outlier detection
- Teacher intervention flags and recommendations

### Writing Analysis Results
- Formality and complexity development tracking
- Sentiment analysis for student well-being monitoring
- Grammar quality metrics and improvement areas
- Readability scores (FKGL, SMOG, Fog, Dale-Chall) for grade-level appropriateness
- Tone distribution analysis for authentic voice detection
- Vocabulary growth and sophistication indicators

## 🚀 Performance Optimizations

- **Code Splitting**: Lazy-loaded page components
- **Bundle Analysis**: Vite build optimization
- **Image Optimization**: Responsive images and lazy loading
- **Caching**: Efficient data fetching and state management

## 🔧 Configuration Files

- **Tailwind**: `tailwind.config.js` - Custom colors, spacing, and breakpoints
- **TypeScript**: `tsconfig.json` - Strict type checking and module resolution
- **Vite**: `vite.config.ts` - Build optimization and development server
- **ESLint**: `.eslintrc.cjs` - Code quality and consistency
- **Prettier**: `.prettierrc` - Code formatting rules

## 🌟 Teacher Dashboard Features Implemented

1. ✅ **Classroom Analytics Foundation** - Vite + React + TypeScript setup for teacher workflows
2. ✅ **Educational UI Components** - Teacher-focused components with accessibility-first design
3. ✅ **Classroom Health Dashboard** - KPI cards showing class-wide trends and student performance
4. ✅ **Student Growth Management** - Individual profiles with writing development tracking
5. ✅ **Assignment Progress Monitoring** - Submission tracking with early intervention alerts
6. ✅ **Educational Data Visualization** - Charts showing writing trends, vocabulary growth, and sentiment patterns
7. ✅ **Teacher Reporting Tools** - CSV export for parent conferences and administrative reports
8. ✅ **Multi-Device Accessibility** - Responsive design for classroom tablets, teacher laptops, and home computers
9. ✅ **Universal Access** - WCAG compliance ensuring all teachers can use the platform effectively
10. ✅ **Reliable Type Safety** - Strict TypeScript ensuring consistent educational data handling

## 🤝 Contributing

We welcome contributions from educators, developers, and anyone passionate about improving educational outcomes through better tools for teachers.

1. Fork the repository
2. Create a feature branch focused on teacher or student outcomes
3. Make your changes with educational impact in mind
4. Run tests and linting to ensure reliability
5. Submit a pull request with clear explanation of educational benefits

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For questions or issues related to the teacher dashboard:
- Check the educational documentation
- Review existing issues for classroom-related concerns
- Create a new issue with detailed information about the educational context

---

**Built with ❤️ for educators and students everywhere**

*ToneTrace: Empowering teachers with the insights they need to help every student thrive.*
