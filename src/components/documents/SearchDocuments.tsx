import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Search, FileText, Tag, Filter } from 'lucide-react';
import api from '@/lib/api';
import Button from '@/components/ui/Button';

type SearchType = 'hybrid' | 'semantic' | 'keyword';

interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  similarity_score: number;
  metadata_col?: {
    keywords?: string[];
  };
}

export default function SearchDocuments({ onClose }: { onClose: () => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('hybrid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    keywords: []
  });
  const [results, setResults] = useState<SearchResult[]>([]);
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
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Search Documents</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Find documents using advanced search capabilities
        </p>
      </div>

      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search your documents..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 rounded-xl border transition-all duration-200 ${
              showFilters 
                ? 'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-900/20 dark:border-blue-600 dark:text-blue-300'
                : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
          >
            <Filter size={20} />
          </button>
          <Button 
            type="submit"
            disabled={!searchTerm || searchMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200"
          >
            {searchMutation.isPending ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Searching...</span>
              </div>
            ) : (
              'Search'
            )}
          </Button>
        </div>

        {showFilters && (
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-4">Search Filters</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search Type</label>
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value as SearchType)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="hybrid">🔍 Hybrid Search</option>
                  <option value="semantic">🧠 Semantic Search</option>
                  <option value="keyword">🔤 Keyword Search</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category Filter</label>
                <input
                  type="text"
                  value={filters.category}
                  onChange={(e) => setFilters(f => ({ ...f, category: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white placeholder-gray-400"
                  placeholder="Filter by category..."
                />
              </div>
            </div>
          </div>
        )}
      </form>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
          </div>
        </div>
      )}

      <div className="space-y-3 max-h-[50vh] overflow-y-auto">
        {results.length === 0 && searchMutation.isSuccess && (
          <div className="text-center py-12">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-4 w-16 h-16 mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No results found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your search terms or filters</p>
          </div>
        )}
        
        {results.map((doc) => (
          <div
            key={doc.id}
            className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-6 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                  <FileText className="text-blue-600 dark:text-blue-400" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{doc.title}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full text-xs font-medium">
                      {(doc.similarity_score * 100).toFixed(1)}% match
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
              {doc.excerpt}
            </p>

            {doc.metadata_col?.keywords && (
              <div className="flex flex-wrap gap-2">
                {doc.metadata_col.keywords.slice(0, 5).map((keyword: string, idx: number) => (
                  <span
                    key={idx}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium"
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