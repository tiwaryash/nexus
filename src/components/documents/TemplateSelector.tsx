import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import Button from '@/components/ui/Button';

interface TemplateSelectorProps {
  documentId: string;
  onSuccess: (content: string) => void;
  onClose: () => void;
}

const DOCUMENT_TEMPLATES = [
  {
    id: 'academic',
    name: 'Academic Paper',
    description: 'Formal academic paper format with abstract, methodology, and conclusions'
  },
  {
    id: 'business',
    name: 'Business Report',
    description: 'Professional business report with executive summary and recommendations'
  },
  {
    id: 'technical',
    name: 'Technical Documentation',
    description: 'Technical documentation format with specifications and implementation details'
  },
  {
    id: 'letter',
    name: 'Formal Letter',
    description: 'Standard formal letter format with letterhead and signature block'
  }
];

export default function TemplateSelector({ documentId, onSuccess, onClose }: TemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const applyTemplateMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(`/api/v1/documents/${documentId}/apply-template`, {
        templateId: selectedTemplate
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (data.content) {
        onSuccess(data.content);
      }
      onClose();
    }
  });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Select Template</h3>
      <div className="grid grid-cols-1 gap-4">
        {DOCUMENT_TEMPLATES.map((template) => (
          <div
            key={template.id}
            onClick={() => setSelectedTemplate(template.id)}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedTemplate === template.id
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : 'hover:border-gray-300'
            }`}
          >
            <h4 className="font-medium">{template.name}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {template.description}
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={() => applyTemplateMutation.mutate()}
          disabled={!selectedTemplate || applyTemplateMutation.isPending}
          isLoading={applyTemplateMutation.isPending}
        >
          Apply Template
        </Button>
      </div>
    </div>
  );
} 