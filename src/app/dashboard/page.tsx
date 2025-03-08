'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { RequireAuth } from '@/components/auth/RequireAuth';
import MainLayout from '@/components/layout/MainLayout';
import DocumentUpload from '@/components/documents/DocumentUpload';
import DocumentList from '@/components/documents/DocumentList';
import CreateNote from '@/components/documents/CreateNote';
import ShareDocument from '@/components/documents/ShareDocument';
import SearchDocuments from '@/components/documents/SearchDocuments';
import DocumentInsights from '@/components/dashboard/DocumentInsights';
import KnowledgeGraph from '@/components/visualization/KnowledgeGraph';

import Modal from '@/components/ui/Modal';
export default function DashboardPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'documents' | 'insights' | 'graph'>('documents');
    const [activeModal, setActiveModal] = useState<'upload' | 'note' | 'share' | 'search' | null>(null);
  
    const closeModal = () => setActiveModal(null);
  
    return (
      <RequireAuth>
        <MainLayout>
          <div className="container-custom py-8">
            <h1 className="text-3xl font-bold mb-8">
              Welcome, {user?.name}!
            </h1>
  
            {/* Tab Navigation */}
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setActiveTab('documents')}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === 'documents' 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Documents
              </button>
              <button
                onClick={() => setActiveTab('insights')}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === 'insights' 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Insights
              </button>
              <button
                onClick={() => setActiveTab('graph')}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === 'graph' 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Knowledge Graph
              </button>
            </div>
  
            {/* Quick Actions */}
            {activeTab === 'documents' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <button
                  onClick={() => setActiveModal('upload')}
                  className="p-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-500 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  Upload Document
                </button>
                <button
                  onClick={() => setActiveModal('note')}
                  className="p-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-500 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  Create Note
                </button>
                <button
                  onClick={() => setActiveModal('share')}
                  className="p-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-500 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  Share Document
                </button>
                <button
                  onClick={() => setActiveModal('search')}
                  className="p-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-500 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  Search
                </button>
              </div>
            )}
  
            {/* Content Area */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              {activeTab === 'documents' && <DocumentList />}
              {activeTab === 'insights' && <DocumentInsights />}
              {activeTab === 'graph' && <KnowledgeGraph />}
            </div>
  
            {/* Modals */}
            {activeModal === 'upload' && (
              <Modal onClose={closeModal} title="Upload Document">
                <DocumentUpload onSuccess={closeModal} />
              </Modal>
            )}
            {activeModal === 'note' && (
              <Modal onClose={closeModal} title="Create Note">
                <CreateNote onSuccess={closeModal} />
              </Modal>
            )}
            {activeModal === 'share' && (
              <Modal onClose={closeModal} title="Share Document">
                <ShareDocument onClose={closeModal} />
              </Modal>
            )}
            {activeModal === 'search' && (
              <Modal onClose={closeModal} title="Search Documents">
                <SearchDocuments onClose={closeModal} />
              </Modal>
            )}
          </div>
        </MainLayout>
      </RequireAuth>
    );
  }