// src/components/documents/DocumentViewer.tsx
'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import DocumentAnalysis from './DocumentAnalysis';
import TemplateSelector from './TemplateSelector';

interface DocumentViewerProps {
  documentId: string;
  fileType: string;
}

export default function DocumentViewer({ documentId, fileType }: DocumentViewerProps) {
  const [activeTab, setActiveTab] = useState<'document' | 'analysis'>('document');
  const queryClient = useQueryClient();

  // Query for document URL
  const { data: documentData, isLoading: isLoadingDoc } = useQuery({
    queryKey: ['document', documentId],
    queryFn: async () => {
      const response = await api.get(`/api/v1/documents/${documentId}`);
      return response.data;
    }
  });

  // Query for document metadata
  const { data: metadataData, isLoading: isLoadingMeta } = useQuery({
    queryKey: ['document-metadata', documentId],
    queryFn: async () => {
      const response = await api.get(`/api/v1/documents/${documentId}/metadata`);
      return response.data;
    }
  });

  if (isLoadingDoc || isLoadingMeta) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading document...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { 
      id: 'document', 
      label: 'Document',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    { 
      id: 'analysis', 
      label: 'AI Analysis',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Tab Navigation */}
      <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <nav className="flex px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'document' | 'analysis')}
              className={`flex items-center space-x-2 py-4 px-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-red-500 text-red-600 dark:text-red-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'document' ? (
          <div className="h-full bg-gray-100 dark:bg-gray-900 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg h-full overflow-hidden border border-gray-200 dark:border-gray-700">
              {documentData?.url ? (
                <iframe
                  src={documentData.url}
                  className="w-full h-full border-0 rounded-xl"
                  title="Document Viewer"
                  style={{ minHeight: '600px' }}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                      <svg className="w-8 h-8 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Document not available</h3>
                    <p className="text-gray-500 dark:text-gray-400">The document could not be loaded for viewing</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full overflow-auto p-6 bg-gray-50 dark:bg-gray-900">
            <DocumentAnalysis metadata={metadataData?.metadata_col} />
          </div>
        )}
      </div>
    </div>
  );
}