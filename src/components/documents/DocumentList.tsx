'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FileText, Trash2 } from 'lucide-react';
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

export default function DocumentList() {
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">My Documents</h2>
        <div className="space-y-4">
        {documents?.map((doc) => (
  <div
    key={doc.id}
    onClick={() => setSelectedDocument(doc)}
    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
  >
    <div className="flex items-center space-x-4">
      <FileText className="w-6 h-6 text-gray-500" />
      <div>
        <h3 className="font-medium">{doc.title}</h3>
        <p className="text-sm text-gray-500">
          {new Date(doc.created_at).toLocaleDateString()}
        </p>
        {doc.metadata_col?.keywords && (
          <div className="flex flex-wrap gap-1 mt-2">
            {doc.metadata_col.keywords.slice(0, 3).map((keyword, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded-full text-xs"
              >
                {keyword}
              </span>
            ))}
            {doc.metadata_col.keywords.length > 3 && (
              <span className="text-xs text-gray-500">
                +{doc.metadata_col.keywords.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
    <div className="flex items-center space-x-4">
      <div className="text-sm text-gray-500">
        {doc.file_type.toUpperCase()}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setDocumentToDelete(doc);
        }}
        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-colors"
      >
        <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
      </button>
    </div>
  </div>
))}
        </div>
      </div>

      {selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">{selectedDocument.title}</h3>
              <button
                onClick={() => setSelectedDocument(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
            <DocumentViewer
              documentId={selectedDocument.id}
              fileType={selectedDocument.file_type}
            />
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
    </div>
  );
} 