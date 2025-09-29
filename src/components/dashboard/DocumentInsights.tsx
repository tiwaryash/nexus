'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Bar, Line, Radar, Doughnut } from 'react-chartjs-2';
import { Target, TrendingUp, Globe, PieChart } from 'lucide-react';
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
    easing: 'easeInOutQuart' as const
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
  const [leftCard, setLeftCard] = useState<number>(0); // Topic Distribution
  const [rightCard, setRightCard] = useState<number>(2); // Domain Coverage
  
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

  const cards = [
    {
      id: 0,
      title: "Topic Distribution",
      subtitle: "Radar Analysis",
      color: "bg-white dark:bg-gray-800",
      icon: Target,
      component: (
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
      )
    },
    {
      id: 1,
      title: "Document Activity",
      subtitle: "Timeline Trends",
      color: "bg-white dark:bg-gray-800",
      icon: TrendingUp,
      component: (
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
      )
    },
    {
      id: 2,
      title: "Domain Coverage",
      subtitle: "Knowledge Areas",
      color: "bg-white dark:bg-gray-800",
      icon: Globe,
      component: (
        <div className="h-[400px]">
          {vennData.length > 0 ? (
            <div className="space-y-3 pr-2">
              {vennData.map((d, i) => (
        <motion.div 
                  key={i} 
                  className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">{d.label}</h4>
                  <p className="text-sm text-blue-600 dark:text-blue-300">Size: {d.size}</p>
                  <p className="text-sm text-blue-600 dark:text-blue-300">Topics: {d.keywords.join(', ')}</p>
                </motion.div>
                ))}
              </div>
            ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No domain data available</p>
            </div>
            )}
          </div>
      )
    },
    {
      id: 3,
      title: "Category Distribution",
      subtitle: "Document Types",
      color: "bg-white dark:bg-gray-800",
      icon: PieChart,
      component: (
        <>
          <div className="h-[400px]">
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
        </>
      )
    }
  ];

  // Left side options: Topic Distribution (0), Document Activity (1)
  // Right side options: Document Activity (1), Domain Coverage (2), Category Distribution (3)
  const leftOptions = [0, 1]; // Topic Distribution, Document Activity
  const rightOptions = [2, 3]; // Document Activity, Domain Coverage, Category Distribution
  
  const handleCardClick = (cardId: number) => {
    if (leftOptions.includes(cardId)) {
      setLeftCard(cardId);
    } else if (rightOptions.includes(cardId)) {
      setRightCard(cardId);
    }
  };

  return (
    <div>
      <div className="w-full">
         {/* Two Card Display with Navigation */}
         <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 w-full">
          {/* Left Column */}
          <div className="space-y-4 ">
            {/* Left Side Navigation */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center space-x-2 "
            >
              {cards.filter(card => leftOptions.includes(card.id)).map((card) => {
                const isSelected = card.id === leftCard;
                
                return (
                  <motion.button
                    key={card.id}
                    onClick={() => handleCardClick(card.id)}
                    className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 text-sm ${
                      isSelected
                        ? 'bg-red-500 text-white shadow-lg'
                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:shadow-md'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {card.title}
                  </motion.button>
                );
              })}
            </motion.div>

            {/* Left Card */}
            {(() => {
              const card = cards.find(c => c.id === leftCard);
              if (!card) return null;
              
              return (
                <motion.div
                  key={`left-${card.id}`}
                  className={`w-full h-[650px] rounded-2xl shadow-xl ${card.color} text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700`}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 200,
                    damping: 20 
                  }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className="p-6 h-full flex flex-col">
                    {/* Card Header */}
                    <div className="flex items-center mb-6">
                      <div className="flex items-center">
                        <card.icon className="w-8 h-8 text-red-500 mr-3" />
                        <div>
                          <h3 className="text-xl font-bold">{card.title}</h3>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">{card.subtitle}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Card Content */}
                    <div className="flex-1 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 min-h-0">
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="h-full min-h-[450px]"
                      >
                        {card.component}
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              );
            })()}
          </div>
          
          {/* Right Column */}
          <div className="space-y-4">
            {/* Right Side Navigation */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center space-x-2"
            >
              {cards.filter(card => rightOptions.includes(card.id)).map((card) => {
                const isSelected = card.id === rightCard;
                
                return (
                  <motion.button
                    key={card.id}
                    onClick={() => handleCardClick(card.id)}
                    className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 text-sm ${
                      isSelected
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:shadow-md'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {card.title}
                  </motion.button>
                );
              })}
            </motion.div>

            {/* Right Card */}
            {(() => {
              const card = cards.find(c => c.id === rightCard);
              if (!card) return null;
              
              return (
                <motion.div
                  key={`right-${card.id}`}
                  className={`w-full h-[650px] rounded-2xl shadow-xl ${card.color} text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700`}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 200,
                    damping: 20 
                  }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className="p-6 h-full flex flex-col">
                    {/* Card Header */}
                    <div className="flex items-center mb-6">
                      <div className="flex items-center">
                        <card.icon className="w-8 h-8 text-blue-500 mr-3" />
                        <div>
                          <h3 className="text-xl font-bold">{card.title}</h3>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">{card.subtitle}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Card Content */}
                    <div className="flex-1 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 overflow-auto min-h-0">
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="h-full min-h-[450px]"
                      >
                        {card.component}
                      </motion.div>
                    </div>
            </div>
        </motion.div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
} 