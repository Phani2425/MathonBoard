# MathonGo Leaderboard

A responsive leaderboard application for displaying student performance data for educational test series, built with React, TypeScript, and Vite.

![MathonGo Leaderboard](src/assets/MathonGo_logo.svg)

## Overview

The MathonGo Leaderboard application provides educational institutions with a comprehensive solution for displaying and analyzing student performance in test series. It features detailed ranking systems, subject-specific analytics, and interactive visualizations to help students understand their performance in competitive examinations.

## Features

### Comprehensive Leaderboard Display

- **Rank-based Sorting**: Display students ranked by overall performance
- **Top Performers Highlight**: Special visual treatment for top 3 ranks
- **Current User Identification**: Easily locate your position in the leaderboard
- **Subject-wise Filtering**: View rankings based on performance in Physics, Chemistry, or Mathematics
- **Top Performers View**: Quick access to top 10 performers

### Advanced Filtering System

- **Search Functionality**: Find specific students by name
- **Score Range Filtering**: Filter by predefined score ranges (0-100, 101-200, 201-300)
- **Accuracy Filtering**: Filter by accuracy percentages
- **Subject Filtering**: Filter by strong subjects

### Analytics Dashboard

- **Subject Performance Visualization**: Detailed charts showing performance across different subjects
- **Position Analysis**: Doughnut chart displaying rank distribution
- **Accuracy Comparison**: Compare individual accuracy with class average
- **Competitive Analysis**: Bar chart comparing individual scores with top performers

### Responsive Design

- **Device Optimization**: Fully responsive interface for all device sizes
- **Synchronized Horizontal Scrolling**: Synchronized table scrolling for small screens
- **Adaptive Layout Components**: UI elements that adjust based on screen size

### Theme Support

- **Light/Dark Mode**: Toggle between light and dark themes
- **Consistent Styling**: Custom theme variables ensure consistent styling

### Interactive Elements

- **Pagination System**: Navigate through large datasets with ease
- **Dynamic Sorting**: Sort table data by different columns
- **Smooth Animations**: Transitions and loading states using Framer Motion
- **Loading Indicators**: Skeleton loaders for improved user experience

### Social Integration

- **Multi-platform Sharing**: Share performance on various platforms:
  - WhatsApp
  - Twitter/X
  - LinkedIn
  - Facebook
  - Telegram
- **Link Sharing**: Easily copy shareable links to clipboard

### Achievement Recognition

- **Achievement System**: Modal displays for achievement recognition
- **Rank Classification**: Visual indicators for different rank levels:
  - Elite Champion (Top 3)
  - Top Performer (Top 10)
  - High Achiever (Top 50)
  - Rising Star (Others)

## Technical Architecture

### Technology Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build System**: Vite
- **Styling Framework**: Tailwind CSS with custom theme variables
- **UI Components**: Custom components based on Radix UI primitives
- **Data Visualization**: Chart.js with React wrappers
- **Animation Library**: Framer Motion
- **State Management**: React hooks and context API
- **UI Synchronization**: React Scroll Sync for table scrolling

### Project Structure

```
leaderboard/
├── components/
│   ├── charts/               # Chart components (Bar, Line, Doughnut)
│   ├── leaderboard/          # Main leaderboard components
│   ├── shared/               # Shared UI components
│   ├── theme/                # Theme provider and toggle
│   └── ui/                   # Base UI components
├── hooks/                    # Custom React hooks
├── lib/                      # Utility functions
│   ├── utils.ts              # General utilities
│   └── chartUtils.ts         # Chart data generation utilities
├── types/                    # TypeScript type definitions
└── assets/                   # Static assets and icons
```

### Key Components

- **LeaderboardPage**: Main container component orchestrating the application
- **TopPerformers**: Component displaying cards for top 3 performers
- **LeaderboardTable**: Sortable and filterable table of student performances
- **AnalyticsSection**: Data visualization dashboard
- **CurrentUserCard**: Sticky card showing current user's performance
- **CollapsibleFilterSection**: Expandable filtering section
- **SocialShare**: Component for sharing results on social media

## Implementation Guide

### Prerequisites

- Node.js 18+ and npm/yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Phani2425/MathonBoard

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Deployment

```bash
# Build the project
npm run build

# Preview production build
npm run preview
```

## Data Architecture

The leaderboard works with the following key data structures:

- **LeaderboardEntry**: Individual student performance data
- **CurrentUserInfo**: Current user's performance information
- **SubjectScore**: Performance data for individual subjects
- **AnalyticsData**: Aggregated data for charts and visualizations

## Customization Options

The application uses CSS variables for theming, allowing easy customization of:

- Color schemes
- Border radiuses
- Spacing
- Special rank styles (for top performers)

## Configuration

The application can be configured through environment variables or by modifying the configuration files:

- **vite.config.ts**: Vite configuration
- **tailwind.config.js**: Tailwind
