'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FileText, Trash2, Upload, Share2, Search } from 'lucide-react';
import api from '@/lib/api';
import DocumentViewer from './DocumentViewer';
import DeleteConfirmation from './DeleteConfirmation';

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

interface DocumentListProps {
  onOpenModal?: (modalType: 'upload' | 'note' | 'share' | 'search') => void;
}

export default function DocumentList({ onOpenModal }: DocumentListProps) {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const queryClient = useQueryClient();
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);

  const { data: documents, isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const { data } = await api.get('/api/v1/documents');
      return data as Document[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (documentId: string) => {
      await api.delete(`/api/v1/documents/${documentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      setDocumentToDelete(null);
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Documents</h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {documents?.length || 0} documents
            </div>
          </div>
          {onOpenModal && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onOpenModal('upload')}
                className="inline-flex items-center px-3 py-2 rounded-lg border bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 border-blue-200 dark:border-blue-800 transition-all duration-200 hover:shadow-sm group"
              >
                <Upload className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium text-sm">Upload</span>
              </button>
              <button
                onClick={() => onOpenModal('note')}
                className="inline-flex items-center px-3 py-2 rounded-lg border bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30 border-green-200 dark:border-green-800 transition-all duration-200 hover:shadow-sm group"
              >
                <FileText className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium text-sm">Note</span>
              </button>
              <button
                onClick={() => onOpenModal('share')}
                className="inline-flex items-center px-3 py-2 rounded-lg border bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 border-purple-200 dark:border-purple-800 transition-all duration-200 hover:shadow-sm group"
              >
                <Share2 className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium text-sm">Share</span>
              </button>
              <button
                onClick={() => onOpenModal('search')}
                className="inline-flex items-center px-3 py-2 rounded-lg border bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/30 border-orange-200 dark:border-orange-800 transition-all duration-200 hover:shadow-sm group"
              >
                <Search className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium text-sm">Search</span>
              </button>
            </div>
          )}
        </div>
        
        {!documents || documents.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No documents yet</h3>
            <p className="text-gray-500 dark:text-gray-400">Upload your first document to get started</p>
          </div>
         ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pr-2">
               {documents.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDocument(doc)}
                  className="bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-lg hover:border-red-300 dark:hover:border-red-500 transition-all duration-200 cursor-pointer group flex flex-col h-[280px]"
                >
                {/* Document Header */}
                <div className="p-6 pb-4 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <FileText className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                          {doc.title}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full">
                            {doc.file_type.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(doc.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDocumentToDelete(doc);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4 text-red-500 dark:text-red-400" />
                    </button>
                  </div>

                  {/* Document Summary */}
                  <div className="flex-1 min-h-0">
                    {doc.metadata_col?.summary && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-3">
                        {doc.metadata_col.summary}
                      </p>
                    )}
                  </div>

                  {/* Keywords */}
                  {doc.metadata_col?.keywords && doc.metadata_col.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-auto">
                      {doc.metadata_col.keywords.slice(0, 3).map((keyword, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md text-xs font-medium"
                      >
                          {keyword}
                        </span>
                      ))}
                      {doc.metadata_col.keywords.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400 rounded-md text-xs">
                          +{doc.metadata_col.keywords.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Document Footer */}
                <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl border-t border-gray-100 dark:border-gray-600">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Click to view</span>
                    <div className="flex items-center space-x-1">
                      <span>•</span>
                      <span>
                        {doc.metadata_col?.entities?.length ? `${doc.metadata_col.entities.length} entities` : 'No entities'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 animate-in fade-in-0 zoom-in-95 duration-300">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{selectedDocument.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {selectedDocument.file_type.toUpperCase()} • {new Date(selectedDocument.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDocument(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 hover:scale-105"
              >
                <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="h-[calc(95vh-5rem)] overflow-hidden">
              <DocumentViewer
                documentId={selectedDocument.id}
                fileType={selectedDocument.file_type}
              />
            </div>
          </div>
        </div>
      )}

      {documentToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <DeleteConfirmation
            onConfirm={() => deleteMutation.mutate(documentToDelete.id)}
            onCancel={() => setDocumentToDelete(null)}
            isDeleting={deleteMutation.isPending}
          />
        </div>
      )}
    </>
  );
} 