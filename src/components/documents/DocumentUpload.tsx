'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import Button from '@/components/ui/Button';



interface UploadError {
  message: string;
  code?: string;
}

export default function DocumentUpload({ onSuccess }: { onSuccess: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const { data } = await api.post('/api/v1/documents/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return data;
      } catch (err: any) {
        const error = err.response?.data as UploadError;
        throw new Error(error.message || 'Failed to upload document');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['document-insights'] });
      setFile(null);
      setError(null);
      onSuccess();
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Upload Document</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Upload PDF, DOCX, or Markdown files to add to your knowledge base
        </p>
      </div>

      <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
        file 
          ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-600' 
          : 'border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10'
      }`}>
        <input
          type="file"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
          accept=".pdf,.docx,.md"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center"
        >
          <div className={`p-4 rounded-full mb-4 ${
            file 
              ? 'bg-blue-100 dark:bg-blue-800/30' 
              : 'bg-gray-100 dark:bg-gray-800'
          }`}>
            <Upload className={`w-8 h-8 ${
              file 
                ? 'text-blue-600 dark:text-blue-400' 
                : 'text-gray-400 dark:text-gray-500'
            }`} />
          </div>
          <div className="space-y-2">
            <p className={`text-lg font-medium ${
              file 
                ? 'text-blue-700 dark:text-blue-300' 
                : 'text-gray-700 dark:text-gray-300'
            }`}>
              {file ? file.name : 'Choose a file or drag it here'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Supports PDF, DOCX, and MD files up to 10MB
            </p>
          </div>
        </label>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
          </div>
        </div>
      )}

      <div className="flex space-x-3">
        <Button
          onClick={() => file && uploadMutation.mutate(file)}
          disabled={!file || uploadMutation.isPending}
          isLoading={uploadMutation.isPending}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-all duration-200"
        >
          {uploadMutation.isPending ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Uploading...</span>
            </div>
          ) : (
            'Upload Document'
          )}
        </Button>
        {file && (
          <button
            onClick={() => {
              setFile(null);
              setError(null);
            }}
            className="px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
} 