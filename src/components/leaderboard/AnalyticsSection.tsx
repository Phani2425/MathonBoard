import React, { useMemo } from 'react';
import BarChart from '../charts/BarChart';
import LineChart from '../charts/LineChart';
import DoughnutChart from '../charts/Doughnut';
import { generateAnalyticsData } from '../../lib/chartUtils';
import type { AnalyticsProps } from '../../types/leaderboard';

const AnalyticsSection: React.FC<AnalyticsProps> = ({ 
  leaderboardData, 
  currentUser 
}) => {
  const analyticsData = useMemo(() => 
    generateAnalyticsData(leaderboardData, currentUser), 
    [leaderboardData, currentUser]
  );

  if (!currentUser) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Please log in to view your analytics</p>
      </div>
    );
  }

  if (!leaderboardData.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No data available for analytics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        <BarChart 
          data={analyticsData.scoreDistribution}
          title="Your Subject-wise Performance"
          height={250}
        />
        <DoughnutChart 
          data={analyticsData.subjectPerformance}
          title="Your Position Analysis"
          height={250}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        <LineChart 
          data={analyticsData.accuracyTrend}
          title="Your vs Average Accuracy"
          height={250}
        />
        <BarChart 
          data={analyticsData.topPerformersComparison}
          title="You vs Top Performers"
          height={250}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">#{currentUser.rank}</div>
          <div className="text-sm text-muted-foreground">Your Rank</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">{currentUser.totalMarkScored}/300</div>
          <div className="text-sm text-muted-foreground">Total Score</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">{currentUser.accuracy.toFixed(1)}%</div>
          <div className="text-sm text-muted-foreground">Overall Accuracy</div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSection;
