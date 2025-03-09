'use client';

import dynamic from 'next/dynamic';

const KnowledgeGraph = dynamic(
  () => import('./KnowledgeGraph'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center h-[600px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }
);

export default function KnowledgeGraphWrapper() {
  return <KnowledgeGraph />;
} 