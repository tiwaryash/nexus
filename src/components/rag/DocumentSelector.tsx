'use client';

import React, { useState, useEffect } from 'react';
import { CheckSquare, Square, FileText, Search, X } from 'lucide-react';
import Button from '../ui/Button';

interface Document {
  id: number;
  title: string;
  file_type: string;
  created_at: string;
  metadata_col?: any;
}

interface DocumentSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDocumentIds: number[];
  onSelectionChange: (selectedIds: number[]) => void;
}

export default function DocumentSelector({
  isOpen,
  onClose,
  selectedDocumentIds,
  onSelectionChange
}: DocumentSelectorProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Load documents when component opens
  useEffect(() => {
    if (isOpen) {
      loadDocuments();
    }
  }, [isOpen]);

  const loadDocuments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/documents`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load documents');
      }

      const documentsData = await response.json();
      setDocuments(documentsData);
    } catch (error) {
      console.error('Error loading documents:', error);
      setError('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDocumentToggle = (documentId: number) => {
    const newSelection = selectedDocumentIds.includes(documentId)
      ? selectedDocumentIds.filter(id => id !== documentId)
      : [...selectedDocumentIds, documentId];
    
    onSelectionChange(newSelection);
  };

  const handleSelectAll = () => {
    if (selectedDocumentIds.length === filteredDocuments.length) {
      // Deselect all
      onSelectionChange([]);
    } else {
      // Select all filtered documents
      onSelectionChange(filteredDocuments.map(doc => doc.id));
    }
  };

  const handleSelectNone = () => {
    onSelectionChange([]);
  };

  const handleApply = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Select Documents for Chat
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search and Controls */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 mb-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <Button
                onClick={handleSelectAll}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                {selectedDocumentIds.length === filteredDocuments.length ? 'Deselect All' : 'Select All'}
              </Button>
              <Button
                onClick={handleSelectNone}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                Clear Selection
              </Button>
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {selectedDocumentIds.length} of {filteredDocuments.length} selected
            </div>
          </div>
        </div>

        {/* Document List */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500 dark:text-gray-400">Loading documents...</div>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <div className="text-red-600 dark:text-red-400">{error}</div>
              <Button onClick={loadDocuments} className="mt-2" size="sm">
                Retry
              </Button>
            </div>
          )}

          {!loading && !error && filteredDocuments.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              {searchTerm ? 'No documents match your search.' : 'No documents found.'}
            </div>
          )}

          {!loading && !error && filteredDocuments.length > 0 && (
            <div className="space-y-2">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => handleDocumentToggle(doc.id)}
                  className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex-shrink-0">
                    {selectedDocumentIds.includes(doc.id) ? (
                      <CheckSquare className="w-5 h-5 text-blue-500" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  
                  <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 dark:text-white truncate">
                      {doc.title}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {doc.file_type?.toUpperCase()} • {new Date(doc.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {selectedDocumentIds.length === 0 
              ? 'All documents will be searched' 
              : `${selectedDocumentIds.length} document${selectedDocumentIds.length === 1 ? '' : 's'} selected`
            }
          </div>
          
          <div className="flex space-x-2">
            <Button
              onClick={onClose}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              onClick={handleApply}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Apply Selection
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
