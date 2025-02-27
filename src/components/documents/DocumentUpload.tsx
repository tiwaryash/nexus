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
    <div className="space-y-4">
      <div className="border-2 border-dashed rounded-lg p-6 text-center">
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
          <Upload className="w-12 h-12 text-gray-400 mb-2" />
          <span className="text-sm text-gray-500">
            {file ? file.name : 'Click to upload or drag and drop'}
          </span>
        </label>
      </div>

      {error && (
        <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
          {error}
        </div>
      )}

      <Button
        onClick={() => file && uploadMutation.mutate(file)}
        disabled={!file || uploadMutation.isPending}
        isLoading={uploadMutation.isPending}
        className="w-full"
      >
        {uploadMutation.isPending ? 'Uploading...' : 'Upload Document'}
      </Button>
    </div>
  );
} 