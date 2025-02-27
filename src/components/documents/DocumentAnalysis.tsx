// src/components/documents/DocumentAnalysis.tsx
import { Tag } from 'lucide-react';

interface DocumentAnalysisProps {
  metadata: Document['metadata_col'];
}

export default function DocumentAnalysis({ metadata }: DocumentAnalysisProps) {
  if (!metadata) return null;

  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
      {/* Summary Section */}
      <div>
        <h3 className="text-lg font-semibold mb-2">AI Summary</h3>
        <p className="text-gray-700 dark:text-gray-300">{metadata.summary}</p>
      </div>

      {/* Keywords Section */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Key Topics</h3>
        <div className="flex flex-wrap gap-2">
          {metadata.keywords?.map((keyword, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded-full text-sm flex items-center gap-1"
            >
              <Tag size={14} />
              {keyword}
            </span>
          ))}
        </div>
      </div>

      {/* Entities Section */}
      {metadata.entities && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Named Entities</h3>
          <div className="flex flex-wrap gap-2">
            {metadata.entities.map((entity, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full text-sm"
              >
                {entity}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}