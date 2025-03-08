'use client';

import { useEffect, useRef } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import { useTheme } from 'next-themes';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

interface GraphData {
  nodes: Array<{
    id: string;
    name: string;
    val: number;
    color: string;
    category: string;
  }>;
  links: Array<{
    source: string;
    target: string;
    strength: number;
  }>;
}

export default function KnowledgeGraph() {
  const { resolvedTheme } = useTheme();
  const fgRef = useRef();

  const { data: graphData } = useQuery<GraphData>({
    queryKey: ['knowledge-graph'],
    queryFn: async () => {
      const response = await api.get('/api/v1/analytics/knowledge-graph');
      return response.data;
    }
  });

  return (
    <div className="h-[600px] w-full rounded-lg overflow-hidden border dark:border-gray-700">
      {graphData && (
        <ForceGraph3D
          ref={fgRef}
          graphData={graphData}
          nodeColor={node => node.color}
          nodeLabel={node => node.name}
          linkWidth={link => link.strength}
          backgroundColor={resolvedTheme === 'dark' ? '#1a1b1e' : '#ffffff'}
          nodeRelSize={6}
          linkDirectionalParticles={2}
          linkDirectionalParticleSpeed={0.005}
        />
      )}
    </div>
  );
} 