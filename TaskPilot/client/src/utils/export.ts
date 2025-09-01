import { SearchResult, FavoriteQuery } from '@/types/query';

export function exportSearchesAsJSON(searches: SearchResult[]): void {
  const dataStr = JSON.stringify(searches, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `academic-searches-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportSearchesAsCSV(searches: SearchResult[]): void {
  const headers = ['التاريخ', 'الاستعلام', 'الشرح', 'محرك البحث', 'الرابط'];
  const csvContent = [
    headers.join(','),
    ...searches.map(search => [
      search.createdAt.toLocaleDateString('ar-SA'),
      `"${search.query.replace(/"/g, '""')}"`,
      `"${search.explanation.replace(/"/g, '""')}"`,
      search.engine,
      search.url
    ].join(','))
  ].join('\n');

  const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `academic-searches-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportFavoritesAsJSON(favorites: FavoriteQuery[]): void {
  const dataStr = JSON.stringify(favorites, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `academic-favorites-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
