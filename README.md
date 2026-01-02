# Trackerr - Habit Tracker Application

A modern, responsive habit tracking application built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

### 🏠 Dashboard
- **Responsive Layout**: Three-column desktop layout, stacked mobile layout
- **Habit Table**: Weekly view with checkboxes for daily tracking
- **Habit List**: Quick overview of all habits with management options
- **Analytics Panel**: Real-time progress tracking and statistics
- **Loading States**: Skeleton components for better UX

### 📊 Analytics
- **Progress Tracking**: Visual progress indicators
- **Streak Counting**: Track consecutive completions
- **Performance Metrics**: Completion rates and trends
- **Responsive Charts**: Mobile-optimized data visualization

### 🎯 Goals
- **Goal Setting**: Create and manage personal goals
- **Progress Tracking**: Visual progress bars with percentage completion
- **Categories**: Organize goals by type (Personal, Career, Health, etc.)
- **Deadline Tracking**: Monitor days remaining until target dates
- **Status Management**: Mark goals as completed

### 😊 Mood Tracking
- **Daily Mood Logging**: 5-point emoji scale
- **Notes**: Optional text notes for context
- **Local Storage**: Persistent mood history

### 🔧 Technical Features
- **API Client**: Centralized HTTP client with caching and deduplication
- **Type Safety**: Full TypeScript implementation
- **Responsive Design**: Mobile-first approach
- **Performance Optimized**: Memoized components and efficient re-renders
- **Error Handling**: Comprehensive error boundaries and validation

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Prisma ORM (configured for PostgreSQL)
- **Authentication**: NextAuth.js
- **Validation**: Zod schemas
- **Icons**: Lucide React
- **State Management**: React hooks with custom API client

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── analytics/         # Analytics page
│   ├── goals/            # Goals management page
│   ├── habits/           # Habits management page
│   ├── mood/             # Mood tracking page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Dashboard page
├── components/
│   ├── analytics/        # Analytics components
│   ├── dashboard/        # Dashboard components
│   ├── habits/          # Habit management components
│   ├── ui/              # Reusable UI components
│   └── navigation.tsx   # Main navigation
├── hooks/               # Custom React hooks
├── lib/                # Utilities and configurations
└── types/              # TypeScript type definitions
```

## API Routes

- `GET/POST /api/habits` - Habit CRUD operations
- `PUT/DELETE /api/habits/[id]` - Individual habit operations
- `GET/POST /api/habit-logs` - Habit completion logging
- `GET /api/analytics` - Analytics data retrieval

## Key Components

### Dashboard
- **HabitTable**: Weekly grid view with completion tracking
- **HabitList**: Sidebar with habit management
- **AnalyticsPanel**: Real-time statistics and progress
- **CheckboxCell**: Interactive completion toggles

### Analytics
- **CircularProgress**: Animated progress rings
- **WeeklyTrendChart**: Completion trend visualization
- **DailyCompletionChart**: Daily performance metrics

### UI Components
- **Skeleton**: Loading state components
- **Card/Button/Textarea**: Reusable UI elements

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env.local
   # Configure your database and auth settings
   ```

3. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Open Application**
   Navigate to `http://localhost:3000`

## Features in Detail

### Habit Tracking
- Create habits with daily/weekly frequency
- Mark completions with visual feedback
- Track streaks and completion rates
- Edit and delete habits

### Analytics Dashboard
- Real-time progress calculation
- Visual progress indicators
- Completion statistics
- Trend analysis

### Responsive Design
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly interactions
- Optimized performance

### Data Management
- Efficient API client with caching
- Request deduplication
- Optimistic updates
- Error handling and recovery

## Performance Optimizations

- **Memoized Components**: Prevent unnecessary re-renders
- **API Caching**: 30-second TTL with intelligent invalidation
- **Request Deduplication**: Prevent duplicate API calls
- **Lazy Loading**: Components loaded on demand
- **Optimized Queries**: Efficient database operations

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details