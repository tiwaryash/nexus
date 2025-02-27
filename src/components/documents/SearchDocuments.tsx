import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Search, FileText, Tag, Filter } from 'lucide-react';
import api from '@/lib/api';
import Button from '@/components/ui/Button';

type SearchType = 'hybrid' | 'semantic' | 'keyword';

export default function SearchDocuments({ onClose }: { onClose: () => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('hybrid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    keywords: []
  });
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const searchMutation = useMutation({
    mutationFn: async () => {
      if (!searchTerm) return [];
      try {
        const response = await api.get('/api/v1/documents/search', {
          params: {
            q: searchTerm,
            search_type: searchType,
            filters: JSON.stringify(filters)
          }
        });
        setError('');
        return response.data;
      } catch (err: any) {
        if (err.response?.status === 429) {
          setError('Rate limit exceeded. Please try again later.');
        } else {
          setError('An error occurred while searching.');
        }
        return [];
      }
    },
    onSuccess: (data) => {
      setResults(data);
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm) {
      searchMutation.mutate();
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search documents..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter size={16} />
            Filters
          </Button>
          <Button 
            type="submit"
            disabled={!searchTerm || searchMutation.isPending}
            className="bg-red-500 text-white"
          >
            {searchMutation.isPending ? 'Searching...' : 'Search'}
          </Button>
        </div>

        {showFilters && (
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Search Type</label>
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value as SearchType)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="hybrid">Hybrid Search</option>
                <option value="semantic">Semantic Search</option>
                <option value="keyword">Keyword Search</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <input
                type="text"
                value={filters.category}
                onChange={(e) => setFilters(f => ({ ...f, category: e.target.value }))}
                className="w-full p-2 border rounded-lg"
                placeholder="Filter by category..."
              />
            </div>
          </div>
        )}
      </form>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-4 max-h-[60vh] overflow-y-auto">
        {results.length === 0 && searchMutation.isSuccess && (
          <div className="text-center text-gray-500 py-8">
            No results found
          </div>
        )}
        
        {results.map((doc) => (
          <div
            key={doc.id}
            className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-3">
                <FileText className="text-gray-500" size={20} />
                <h3 className="font-medium">{doc.title}</h3>
              </div>
              <span className="text-sm text-gray-500">
                Score: {(doc.similarity_score * 100).toFixed(1)}%
              </span>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {doc.excerpt}
            </p>

            {doc.metadata_col?.keywords && (
              <div className="flex flex-wrap gap-2">
                {doc.metadata_col.keywords.slice(0, 5).map((keyword: string, idx: number) => (
                  <span
                    key={idx}
                    className="flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded-full text-xs"
                  >
                    <Tag size={12} />
                    {keyword}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}