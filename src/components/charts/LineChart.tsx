import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import type { ChartData } from '../../types/leaderboard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartProps {
  data: ChartData;
  title: string;
  height?: number;
}

const LineChart: React.FC<LineChartProps> = ({ data, title, height = 200 }) => {
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
        position: 'top' as const,
        labels: {
          color: themeColors.text,
          font: {
            size: 12,
          },
          padding: 20,
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
    scales: {
      x: {
        ticks: {
          color: themeColors.mutedText,
          font: {
            size: 12,
          },
        },
        grid: {
          color: themeColors.border,
        },
      },
      y: {
        ticks: {
          color: themeColors.mutedText,
          font: {
            size: 12,
          },
        },
        grid: {
          color: themeColors.border,
        },
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
      <h3 className="text-base font-semibold text-foreground mb-4">{title}</h3>
      <div style={{ height }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default LineChart;
