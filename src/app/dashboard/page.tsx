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
import KnowledgeGraphWrapper from '@/components/visualization/KnowledgeGraphWrapper';
import { Upload, FileText, Share2, Search, BarChart3, Network } from 'lucide-react';

import Modal from '@/components/ui/Modal';

export default function DashboardPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'documents' | 'insights' | 'graph'>('documents');
    const [activeModal, setActiveModal] = useState<'upload' | 'note' | 'share' | 'search' | null>(null);
  
    const closeModal = () => setActiveModal(null);

    const quickActions = [
      {
        id: 'upload',
        label: 'Upload Document',
        icon: Upload,
        description: 'Add new documents to your knowledge base',
        color: 'blue'
      },
      {
        id: 'note',
        label: 'Create Note',
        icon: FileText,
        description: 'Write and organize your thoughts',
        color: 'green'
      },
      {
        id: 'share',
        label: 'Share Document',
        icon: Share2,
        description: 'Collaborate with others',
        color: 'purple'
      },
      {
        id: 'search',
        label: 'Search',
        icon: Search,
        description: 'Find documents and content',
        color: 'orange'
      }
    ];

    const tabs = [
      {
        id: 'documents',
        label: 'Documents',
        icon: FileText,
        description: 'Manage your documents'
      },
      {
        id: 'insights',
        label: 'Analytics',
        icon: BarChart3,
        description: 'View insights and trends'
      },
      {
        id: 'graph',
        label: 'Knowledge Graph',
        icon: Network,
        description: 'Explore connections'
      }
    ];
  
    return (
      <RequireAuth>
        <MainLayout>
          <div className="h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-900 overflow-hidden">
            <div className="h-full flex flex-col px-6 py-6">
              
              {/* Tab Navigation */}
              <div className="mb-6 flex-shrink-0">
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <nav className="flex space-x-8">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as 'documents' | 'insights' | 'graph')}
                          className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                            isActive
                              ? 'border-red-500 text-red-600 dark:text-red-400'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                          }`}
                        >
                          <Icon className={`mr-2 h-5 w-5 ${
                            isActive ? 'text-red-500 dark:text-red-400' : 'text-gray-400 group-hover:text-gray-500'
                          }`} />
                          {tab.label}
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6 h-full overflow-auto">
                  {activeTab === 'documents' && <DocumentList onOpenModal={setActiveModal} />}
                  {activeTab === 'insights' && <DocumentInsights />}
                  {activeTab === 'graph' && <KnowledgeGraphWrapper />}
                </div>
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
          </div>
        </MainLayout>
      </RequireAuth>
    );
  }