'use client';

import { useQuery } from '@tanstack/react-query';
import { Bar, Line, Radar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { VennDiagram } from '@upsetjs/react';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { Tooltip as TippyTooltip } from 'react-tippy';
import 'react-tippy/dist/tippy.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Define chart options with proper typing
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 1000,
    easing: 'easeInOutQuart'
  },
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        padding: 20,
        usePointStyle: true,
        color: 'rgb(107 114 128)' // text-gray-500
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      titleFont: { size: 14 },
      bodyFont: { size: 13 },
      displayColors: true
    }
  }
};

interface InsightsData {
  topicDistribution: ChartData;
  activityTrends: ChartData;
  domainCoverage: VennData[];
  categoryDistribution: ChartData;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string | string[];
    borderColor: string | string[];
    fill?: boolean;
  }[];
  metadata?: Record<string, CategoryMetadata>;
}

interface VennData {
  sets: string[];
  size: number;
  label: string;
  keywords: string[];
  clusterCount: number;
}

interface CategoryMetadata {
  complexity: number;
  keywords: string[];
}

const CategoryTooltip = ({ category, metadata }: { category: string, metadata: CategoryMetadata }) => (
  <div className="p-2">
    <div className="font-semibold">{category}</div>
    <div className="text-sm">
      <div>Complexity: {metadata.complexity.toFixed(1)}</div>
      <div>Key topics: {metadata.keywords.join(', ')}</div>
    </div>
  </div>
);

export default function DocumentInsights() {
  const { data: insights, isLoading } = useQuery<InsightsData>({
    queryKey: ['document-insights'],
    queryFn: async () => {
      const response = await api.get('/api/v1/analytics/document-insights');
      return response.data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  const defaultChartData = {
    labels: ['No data available'],
    datasets: [{
      label: 'No data',
      data: [0],
      backgroundColor: 'rgba(239, 68, 68, 0.2)',
      borderColor: 'rgba(239, 68, 68, 1)',
      borderWidth: 1
    }]
  };

  const vennData = insights?.domainCoverage || [];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
        >
          <h3 className="text-lg font-semibold mb-4">Topic Distribution</h3>
          <div className="h-[300px]">
            <Radar 
              data={insights?.topicDistribution || defaultChartData}
              options={{
                ...chartOptions,
                scales: {
                  r: {
                    beginAtZero: true,
                    ticks: { backdropColor: 'transparent' }
                  }
                }
              }}
            />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
        >
          <h3 className="text-lg font-semibold mb-4">Document Activity</h3>
          <div className="h-[300px]">
            <Line 
              data={insights?.activityTrends || defaultChartData}
              options={{
                ...chartOptions,
                scales: {
                  y: { 
                    beginAtZero: true,
                    grid: {
                      color: 'rgba(107, 114, 128, 0.1)'
                    }
                  },
                  x: {
                    grid: {
                      display: false
                    }
                  }
                }
              }}
            />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
        >
          <h3 className="text-lg font-semibold mb-4">Domain Coverage</h3>
          <div className="h-[300px] flex items-center justify-center">
            {vennData.length > 0 ? (
              <VennDiagram
                data={vennData}
                width={400}
                height={300}
                padding={20}
                className="mx-auto"
              />
            ) : (
              <p className="text-gray-500">No domain data available</p>
            )}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
        >
          <h3 className="text-lg font-semibold mb-4">Category Distribution</h3>
          <div className="h-[300px]">
            <Doughnut 
              data={insights?.categoryDistribution || defaultChartData}
              options={{
                ...chartOptions,
                cutout: '60%',
                plugins: {
                  ...chartOptions.plugins,
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const metadata = insights?.categoryDistribution.metadata?.[context.label as string];
                        if (metadata) {
                          return `${context.label}: ${context.parsed} docs (${metadata.keywords.join(', ')})`;
                        }
                        return `${context.label}: ${context.parsed}`;
                      }
                    }
                  }
                }
              }}
            />
          </div>
          {insights?.categoryDistribution.metadata && (
            <div className="mt-4 grid grid-cols-2 gap-2">
              {Object.entries(insights.categoryDistribution.metadata).map(([category, metadata]) => (
                <TippyTooltip
                  key={category}
                  content={<CategoryTooltip category={category} metadata={metadata} />}
                  arrow={true}
                  duration={200}
                >
                  <div className="text-sm p-2 bg-gray-50 dark:bg-gray-700 rounded cursor-help">
                    {category}
                  </div>
                </TippyTooltip>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
} 