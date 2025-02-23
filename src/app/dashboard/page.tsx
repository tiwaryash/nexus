'use client';

import { useAuth } from '@/contexts/AuthContext';
import { RequireAuth } from '@/components/auth/RequireAuth';
import MainLayout from '@/components/layout/MainLayout';

export default function DashboardPage() {
  const { user } = useAuth();
  console.log("BALLAL",user);

  if (!user) {
    return null; // Let RequireAuth handle the redirect
  }

  return (
    <RequireAuth>
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Welcome, {user.name}!
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              You are now logged into your dashboard.
            </p>
          </div>
          
          {/* Rest of your dashboard content */}
        </div>
      </MainLayout>
    </RequireAuth>
  );
}