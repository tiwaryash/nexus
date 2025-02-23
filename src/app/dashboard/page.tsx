'use client';

import { useAuth } from '@/contexts/AuthContext';
import { RequireAuth } from '@/components/auth/RequireAuth';
import MainLayout from '@/components/layout/MainLayout';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <RequireAuth>
      <MainLayout>
        <div className="container-custom py-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Welcome, {user?.name}!
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Quick Stats */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Documents
                </h3>
                <p className="text-2xl font-bold text-red-800 dark:text-red-500">0</p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Recent Activity
                </h3>
                <p className="text-2xl font-bold text-red-800 dark:text-red-500">0</p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Shared Items
                </h3>
                <p className="text-2xl font-bold text-red-800 dark:text-red-500">0</p>
              </div>
            </div>

            {/* Recent Documents Section */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Recent Documents
              </h2>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-gray-600 dark:text-gray-300">
                  No recent documents found.
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="p-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-500 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                  Upload Document
                </button>
                <button className="p-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-500 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                  Create Note
                </button>
                <button className="p-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-500 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                  Share Document
                </button>
                <button className="p-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-500 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </RequireAuth>
  );
} 