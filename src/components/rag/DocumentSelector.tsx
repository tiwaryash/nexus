'use client';

import React, { useState, useEffect } from 'react';
import { CheckSquare, Square, FileText, Search, X, Filter, Clock } from 'lucide-react';
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-3xl max-h-[85vh] flex flex-col animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <Filter className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Select Documents for Chat
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Choose which documents to include in your conversation context
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 hover:scale-105"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Search and Controls */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search documents by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex space-x-3">
              <button
                onClick={handleSelectAll}
                className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
              >
                {selectedDocumentIds.length === filteredDocuments.length ? 'Deselect All' : 'Select All'}
              </button>
              <button
                onClick={handleSelectNone}
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                Clear Selection
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                selectedDocumentIds.length > 0 ? 'bg-red-500' : 'bg-gray-400'
              }`} />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {selectedDocumentIds.length} of {filteredDocuments.length} selected
              </span>
            </div>
          </div>
        </div>

        {/* Document List */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-gray-500 dark:text-gray-400 font-medium">Loading your documents...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
                <p className="text-red-600 dark:text-red-400 font-medium mb-3">{error}</p>
                <button
                  onClick={loadDocuments}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 font-medium"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {!loading && !error && filteredDocuments.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 font-medium mb-2">
                  {searchTerm ? 'No documents match your search' : 'No documents available'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  {searchTerm ? 'Try adjusting your search terms' : 'Upload some documents to get started'}
                </p>
              </div>
            </div>
          )}

          {!loading && !error && filteredDocuments.length > 0 && (
            <div className="space-y-3">
              {filteredDocuments.map((doc) => {
                const isSelected = selectedDocumentIds.includes(doc.id);
                return (
                  <div
                    key={doc.id}
                    onClick={() => handleDocumentToggle(doc.id)}
                    className={`group flex items-center space-x-4 p-4 border rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                      isSelected
                        ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 shadow-sm'
                        : 'border-gray-200 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-800 hover:bg-red-50/50 dark:hover:bg-red-900/10'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {isSelected ? (
                        <div className="relative">
                          <CheckSquare className="w-6 h-6 text-red-600 dark:text-red-400" />
                          <div className="absolute inset-0 bg-red-600 dark:bg-red-400 rounded opacity-10" />
                        </div>
                      ) : (
                        <Square className="w-6 h-6 text-gray-400 group-hover:text-red-400 transition-colors" />
                      )}
                    </div>
                    
                    <div className={`p-2 rounded-lg flex-shrink-0 ${
                      isSelected
                        ? 'bg-red-100 dark:bg-red-800/30'
                        : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-red-100 dark:group-hover:bg-red-800/30'
                    }`}>
                      <FileText className={`w-5 h-5 ${
                        isSelected
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-gray-500 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400'
                      }`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className={`font-semibold truncate transition-colors ${
                        isSelected
                          ? 'text-red-900 dark:text-red-100'
                          : 'text-gray-900 dark:text-white group-hover:text-red-900 dark:group-hover:text-red-100'
                      }`}>
                        {doc.title}
                      </div>
                      <div className="flex items-center space-x-3 mt-1">
                        <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded-md font-medium">
                            {doc.file_type?.toUpperCase() || 'DOC'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                        </div>
                        {doc.metadata_col?.summary && (
                          <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                            <span>•</span>
                            <span className="truncate max-w-xs">
                              {doc.metadata_col.summary.substring(0, 50)}...
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {isSelected && (
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${
              selectedDocumentIds.length === 0 ? 'bg-gray-400' : 'bg-red-500'
            }`} />
            <div className="text-sm">
              {selectedDocumentIds.length === 0 ? (
                <span className="text-gray-600 dark:text-gray-400">
                  All documents will be searched
                </span>
              ) : (
                <span className="font-medium text-gray-900 dark:text-white">
                  {selectedDocumentIds.length} document{selectedDocumentIds.length === 1 ? '' : 's'} selected for chat
                </span>
              )}
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md"
            >
              Apply Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
