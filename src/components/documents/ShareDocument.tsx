import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Button from '@/components/ui/Button';

interface ShareDocumentProps {
  onClose: () => void;
}

interface Document {
  id: string;
  title: string;
}

export default function ShareDocument({ onClose }: ShareDocumentProps) {
  const [email, setEmail] = useState('');
  const [selectedDoc, setSelectedDoc] = useState('');

  // Add query to fetch documents
  const { data: documents, isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const response = await api.get('/api/v1/documents');
      return response.data;
    }
  });

  const shareMutation = useMutation({
    mutationFn: async (data: { email: string; documentId: string }) => {
      const response = await api.post('/api/v1/documents/share', data);
      return response.data;
    },
    onSuccess: () => {
      onClose();
    },
  });

  const handleShare = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && selectedDoc) {
      shareMutation.mutate({ email, documentId: selectedDoc });
    }
  };

  return (
    <form onSubmit={handleShare} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Share with (email)</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Select Document</label>
        <select
          value={selectedDoc}
          onChange={(e) => setSelectedDoc(e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
          required
        >
          <option value="">Select a document</option>
          {isLoading ? (
            <option disabled>Loading documents...</option>
          ) : (
            documents?.map((doc: Document) => (
              <option key={doc.id} value={doc.id}>
                {doc.title}
              </option>
            ))
          )}
        </select>
      </div>
      <Button
        type="submit"
        isLoading={shareMutation.isPending}
        disabled={!email || !selectedDoc || shareMutation.isPending}
        className="w-full"
      >
        Share Document
      </Button>
      
      {shareMutation.isError && (
        <div className="text-red-500 text-sm">
          Failed to share document. Please try again.
        </div>
      )}
    </form>
  );
} 