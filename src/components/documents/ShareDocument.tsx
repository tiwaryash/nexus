import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import Button from '@/components/ui/Button';

interface ShareDocumentProps {
  onClose: () => void;
}

export default function ShareDocument({ onClose }: ShareDocumentProps) {
  const [email, setEmail] = useState('');
  const [selectedDoc, setSelectedDoc] = useState('');
  const [documents, setDocuments] = useState([]);

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
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Select Document</label>
        <select
          value={selectedDoc}
          onChange={(e) => setSelectedDoc(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select a document</option>
          {documents.map((doc: any) => (
            <option key={doc.id} value={doc.id}>
              {doc.title}
            </option>
          ))}
        </select>
      </div>
      <Button
        type="submit"
        isLoading={shareMutation.isPending}
        disabled={!email || !selectedDoc}
      >
        Share Document
      </Button>
    </form>
  );
} 