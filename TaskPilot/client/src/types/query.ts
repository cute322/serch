export interface QueryData {
  exactPhrase?: string;
  anyWords?: string;
  excludeWords?: string;
  inTitle?: string;
  site?: string;
  customSite?: string;
  filetype?: string;
  afterYear?: string;
  beforeYear?: string;
  engine: 'google' | 'scholar' | 'pubmed';
}

export interface SearchResult {
  id: string;
  query: string;
  explanation: string;
  url: string;
  engine: string;
  createdAt: Date;
}

export interface FavoriteQuery {
  id: string;
  name: string;
  description?: string;
  queryData: QueryData;
  createdAt: Date;
}

export interface SearchEngine {
  id: 'google' | 'scholar' | 'pubmed';
  name: string;
  baseUrl: string;
  icon: string;
}
