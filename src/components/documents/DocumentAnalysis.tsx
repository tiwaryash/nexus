// src/components/documents/DocumentAnalysis.tsx
import { Tag } from 'lucide-react';

interface Document {
  id: string;
  title: string;
  file_type: string;
  created_at: string;
  metadata_col: {
    summary: string;
    keywords: string[];
    entities?: string[];
  };
  content: string;
}

interface DocumentAnalysisProps {
  metadata: Document['metadata_col'];
}

export default function DocumentAnalysis({ metadata }: DocumentAnalysisProps) {
  if (!metadata) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-4 w-16 h-16 mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Analysis Available</h3>
        <p className="text-gray-500 dark:text-gray-400">Document metadata is not available</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">AI Document Analysis</h2>
        <p className="text-gray-500 dark:text-gray-400">Automatically extracted insights and metadata</p>
      </div>

      {/* Summary Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg">
            <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">AI Summary</h3>
        </div>
        <div className="bg-red-50 dark:bg-red-900/10 rounded-lg p-4 border-l-4 border-red-500">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{metadata.summary}</p>
        </div>
      </div>

      {/* Keywords Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
            <Tag className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Key Topics</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{metadata.keywords?.length || 0} topics identified</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {metadata.keywords?.map((keyword, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded-xl text-sm font-medium border border-green-200 dark:border-green-800 flex items-center gap-2 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              {keyword}
            </span>
          ))}
        </div>
      </div>

      {/* Entities Section */}
      {metadata.entities && metadata.entities.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
              <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Named Entities</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{metadata.entities.length} entities found</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {metadata.entities.map((entity, index) => (
              <div
                key={index}
                className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3 text-center hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
              >
                <span className="text-purple-800 dark:text-purple-300 font-medium">{entity}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Footer */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>AI Powered Analysis</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Automatically Generated</span>
          </div>
        </div>
      </div>
    </div>
  );
}