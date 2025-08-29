# ToneTrace Frontend

A modern React-based dashboard for analyzing student writing and providing insights to teachers. Built with TypeScript, Tailwind CSS, and Recharts for data visualization.

## 🚀 Features

- **Dashboard Overview**: KPI cards, notifications panel, and student performance metrics
- **Student Management**: Comprehensive student profiles with writing analysis
- **Assignment Tracking**: Monitor submission rates and class performance
- **Data Visualization**: Interactive charts for readability, grammar, and tone analysis
- **Export Functionality**: CSV export for reports and data analysis
- **Print-Friendly**: Optimized print styles for reports
- **Responsive Design**: Works seamlessly across all device sizes

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

## 🔌 API Integration

### Current Mock Implementation

The project currently uses `src/api/mockApi.ts` which provides:
- Simulated API latency (300-600ms)
- Seeded data for development
- Type-safe interfaces matching backend expectations

### Replacing with Real Backend

To integrate with a real backend:

1. **Update API endpoints** in `src/api/mockApi.ts`:
   ```typescript
   // Replace mock functions with real API calls
   export const getDashboardSummary = async (): Promise<DashboardSummary> => {
     const response = await fetch('/api/dashboard/summary');
     if (!response.ok) throw new Error('Failed to fetch dashboard data');
     return response.json();
   };
   ```

2. **Configure base URL** in environment variables:
   ```typescript
   const API_BASE = import.meta.env.VITE_API_BASE || 'https://your-backend-name.onrender.com';
   ```

3. **Add authentication** headers:
   ```typescript
   const headers = {
     'Authorization': `Bearer ${token}`,
     'Content-Type': 'application/json',
   };
   ```

4. **Update error handling** for network failures:
   ```typescript
   try {
     const data = await apiCall();
   } catch (error) {
     if (error.name === 'TypeError') {
       // Network error
       setError('Network connection failed');
     } else {
       // API error
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

## 📊 Data Models

### Student
- Basic info (id, name, email, createdAt)
- Risk level assessment
- Writing metrics and trends

### Assignment
- Title, due date, submission status
- Class performance metrics
- Outlier detection flags

### Analysis Result
- Formality and complexity scores
- Sentiment analysis
- Grammar quality metrics
- Readability scores (FKGL, SMOG, Fog, Dale-Chall)
- Tone distribution analysis

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

## 🌟 Key Features Implemented

1. ✅ **Project Scaffolding** - Vite + React + TypeScript setup
2. ✅ **UI Primitives** - Reusable components with Tailwind
3. ✅ **Dashboard Layout** - KPI cards and notifications panel
4. ✅ **Student Management** - List and detail views
5. ✅ **Assignment Tracking** - Submission monitoring and analytics
6. ✅ **Data Visualization** - Charts for trends and analysis
7. ✅ **Export Functionality** - CSV download and print styles
8. ✅ **Responsive Design** - Mobile-first approach
9. ✅ **Accessibility** - WCAG compliance and keyboard navigation
10. ✅ **Type Safety** - Strict TypeScript with no `any` types

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For questions or issues:
- Check the documentation
- Review existing issues
- Create a new issue with detailed information

---

**Built with ❤️ for educators and students**
