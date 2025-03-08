// src/components/documents/DocumentViewer.tsx
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import DocumentAnalysis from './DocumentAnalysis';

interface DocumentViewerProps {
  documentId: string;
  fileType: string;
}

export default function DocumentViewer({ documentId, fileType }: DocumentViewerProps) {
  const { data: documentData, isLoading } = useQuery({
    queryKey: ['document', documentId],
    queryFn: async () => {
      const response = await api.get(`/api/v1/documents/${documentId}`);
      return response.data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg">
            <div className="w-full max-w-4xl h-screen">
              {documentData?.url && (
                <iframe
                  src={documentData.url}
                  className="w-full h-full border-0"
                  title="Document Viewer"
                />
              )}
            </div>
          </div>
        </div>
        <div className="p-6 border-t lg:border-t-0 lg:border-l">
          <DocumentAnalysis metadata={documentData?.metadata} />
        </div>
      </div>
    </div>
  );
}