// src/components/documents/DocumentViewer.tsx
import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import ReactMarkdown from 'react-markdown';
import { renderAsync } from 'docx-preview';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import DocumentAnalysis from './DocumentAnalysis';

// Update PDF worker configuration
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface DocumentViewerProps {
  documentId: string;
  fileType: string;
}

export default function DocumentViewer({ documentId, fileType }: DocumentViewerProps) {
  const [numPages, setNumPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);

  const { data: documentData, isLoading: metadataLoading } = useQuery({
    queryKey: ['document', documentId],
    queryFn: async () => {
      const response = await api.get(`/api/v1/documents/${documentId}`);
      return response.data;
    }
  });

  const { data: documentContent, isLoading: contentLoading } = useQuery({
    queryKey: ['document-content', documentId],
    queryFn: async () => {
      const response = await api.get(`/api/v1/documents/${documentId}/content`, {
        responseType: 'blob'
      });
      return response.data;
    }
  });

  useEffect(() => {
    if (documentContent) {
      const url = URL.createObjectURL(new Blob([documentContent]));
      setDocumentUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [documentContent]);

  if (metadataLoading || contentLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const renderDocument = () => {
    if (!documentUrl) return null;

    switch (fileType) {
      case 'pdf':
        return (
          <object
            data={documentUrl}
            type="application/pdf"
            className="w-full h-[800px]"
          >
            <div className="p-4 bg-red-50 text-red-600 rounded">
              <p>Unable to display PDF. Please download to view.</p>
              <a 
                href={documentUrl}
                download
                className="mt-2 inline-block px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Download PDF
              </a>
            </div>
          </object>
        );

      case 'md':
        return (
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown>{new TextDecoder().decode(documentContent)}</ReactMarkdown>
          </div>
        );

      case 'docx':
        return (
          <div 
            ref={el => {
              if (el && documentContent) {
                renderAsync(documentContent, el);
              }
            }}
          />
        );

      default:
        return <div>Unsupported file type</div>;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6">
          <h3 className="text-lg font-semibold mb-4">Document Content</h3>
          {renderDocument()}
        </div>
        
        <div className="p-6 border-t lg:border-t-0 lg:border-l">
          <h3 className="text-lg font-semibold mb-4">AI Analysis</h3>
          {documentData?.metadata_col && (
            <DocumentAnalysis metadata={documentData.metadata_col} />
          )}
        </div>
      </div>
    </div>
  );
}