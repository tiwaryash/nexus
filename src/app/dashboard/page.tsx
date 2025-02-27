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

import Modal from '@/components/ui/Modal';

export default function DashboardPage() {
  const { user } = useAuth();
  const [activeModal, setActiveModal] = useState<'upload' | 'note' | 'share' | 'search' | null>(null);

  const closeModal = () => setActiveModal(null);

  return (
    <RequireAuth>
      <MainLayout>
        <div className="container-custom py-8">
          <h1 className="text-3xl font-bold mb-8">
            Welcome, {user?.name}!
          </h1>

          {/* Quick Actions */}
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

          {/* Document List */}
          <DocumentList />
        </div>
      </MainLayout>
    </RequireAuth>
  );
}