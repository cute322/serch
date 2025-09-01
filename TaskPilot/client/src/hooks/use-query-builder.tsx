import { useState, useCallback } from 'react';
import { QueryData, SearchEngine } from '@/types/query';
import { buildQuery, buildExplanation, buildSearchUrl } from '@/utils/query-builder';

const searchEngines: SearchEngine[] = [
  {
    id: 'google',
    name: 'Google',
    baseUrl: 'https://www.google.com/search',
    icon: 'fab fa-google'
  },
  {
    id: 'scholar',
    name: 'Google Scholar',
    baseUrl: 'https://scholar.google.com/scholar',
    icon: 'fas fa-university'
  },
  {
    id: 'pubmed',
    name: 'PubMed',
    baseUrl: 'https://pubmed.ncbi.nlm.nih.gov/',
    icon: 'fas fa-microscope'
  }
];

export function useQueryBuilder() {
  const [queryData, setQueryData] = useState<QueryData>({
    engine: 'google'
  });

  const updateField = useCallback((field: keyof QueryData, value: string) => {
    setQueryData(prev => ({ ...prev, [field]: value }));
  }, []);

  const setEngine = useCallback((engine: QueryData['engine']) => {
    setQueryData(prev => ({ ...prev, engine }));
  }, []);

  const resetQuery = useCallback(() => {
    setQueryData({ engine: queryData.engine });
  }, [queryData.engine]);

  const loadExample = useCallback((exampleData: Partial<QueryData>) => {
    setQueryData(prev => ({ ...prev, ...exampleData }));
  }, []);

  const query = buildQuery(queryData);
  const explanation = buildExplanation(queryData);
  const searchUrl = buildSearchUrl(queryData);
  const selectedEngine = searchEngines.find(e => e.id === queryData.engine);

  return {
    queryData,
    query,
    explanation,
    searchUrl,
    selectedEngine,
    searchEngines,
    updateField,
    setEngine,
    resetQuery,
    loadExample
  };
}
