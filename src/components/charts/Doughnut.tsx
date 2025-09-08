import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import type { ChartData } from '../../types/leaderboard';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  data: ChartData;
  title: string;
  height?: number;
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ data, title, height = 200 }) => {
  const getThemeColors = () => {
    const style = getComputedStyle(document.documentElement);
    return {
      background: style.getPropertyValue('--card').trim(),
      text: style.getPropertyValue('--foreground').trim(),
      mutedText: style.getPropertyValue('--muted-foreground').trim(),
      border: style.getPropertyValue('--border').trim(),
    };
  };

  const themeColors = getThemeColors();

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: themeColors.mutedText,
          font: {
            size: 12,
          },
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: themeColors.background,
        titleColor: themeColors.text,
        bodyColor: themeColors.text,
        borderColor: themeColors.border,
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
      },
    },
  };

  return (
    <div 
      className="p-4 rounded-xl border"
      style={{ 
        background: 'var(--card)',
        borderColor: 'var(--border)'
      }}
    >
      <h3 className="text-base font-semibold text-foreground mb-4 text-center">{title}</h3>
      <div style={{ height }}>
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default DoughnutChart;
