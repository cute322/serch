import { QueryData } from '@/types/query';

export function buildQuery(data: QueryData): string {
  let query = '';

  if (data.exactPhrase) {
    query += `"${data.exactPhrase}" `;
  }

  if (data.anyWords) {
    const words = data.anyWords.split(',').map(w => w.trim()).join(' OR ');
    query += `(${words}) `;
  }

  if (data.excludeWords) {
    const words = data.excludeWords.split(',').map(w => w.trim());
    words.forEach(word => {
      query += `-${word} `;
    });
  }

  if (data.inTitle) {
    query += `intitle:"${data.inTitle}" `;
  }

  const site = data.customSite || data.site;
  if (site) {
    query += `site:${site} `;
  }

  if (data.filetype) {
    query += `filetype:${data.filetype} `;
  }

  if (data.afterYear) {
    query += `after:${data.afterYear} `;
  }

  if (data.beforeYear) {
    query += `before:${data.beforeYear} `;
  }

  return query.trim();
}

export function buildExplanation(data: QueryData): string {
  const parts: string[] = [];

  if (data.exactPhrase) {
    parts.push(`البحث عن العبارة الدقيقة: "${data.exactPhrase}"`);
  }

  if (data.anyWords) {
    parts.push(`البحث عن أي من هذه الكلمات: ${data.anyWords}`);
  }

  if (data.excludeWords) {
    parts.push(`استبعاد الكلمات: ${data.excludeWords}`);
  }

  if (data.inTitle) {
    parts.push(`البحث في العناوين فقط عن: "${data.inTitle}"`);
  }

  const site = data.customSite || data.site;
  if (site) {
    const siteNames: Record<string, string> = {
      'scholar.google.com': 'Google Scholar',
      'pubmed.ncbi.nlm.nih.gov': 'PubMed',
      'sciencedirect.com': 'ScienceDirect',
      'jstor.org': 'JSTOR',
      'arxiv.org': 'arXiv',
      'researchgate.net': 'ResearchGate'
    };
    parts.push(`البحث في موقع: ${siteNames[site] || site}`);
  }

  if (data.filetype) {
    const fileTypeNames: Record<string, string> = {
      'pdf': 'ملفات PDF',
      'doc': 'مستندات Word',
      'docx': 'مستندات Word (حديث)',
      'ppt': 'عروض PowerPoint',
      'pptx': 'عروض PowerPoint (حديث)',
      'xls': 'جداول Excel',
      'xlsx': 'جداول Excel (حديث)'
    };
    parts.push(`نوع الملف: ${fileTypeNames[data.filetype] || data.filetype.toUpperCase()}`);
  }

  if (data.afterYear) {
    parts.push(`منشور بعد عام: ${data.afterYear}`);
  }

  if (data.beforeYear) {
    parts.push(`منشور قبل عام: ${data.beforeYear}`);
  }

  if (parts.length === 0) {
    return 'اختر المعايير لإنشاء استعلام البحث';
  }

  return parts.join(' • ');
}

export function buildSearchUrl(data: QueryData): string {
  const query = buildQuery(data);
  if (!query) return '';

  const encodedQuery = encodeURIComponent(query);

  switch (data.engine) {
    case 'google':
      return `https://www.google.com/search?q=${encodedQuery}`;
    case 'scholar':
      return `https://scholar.google.com/scholar?q=${encodedQuery}`;
    case 'pubmed':
      return `https://pubmed.ncbi.nlm.nih.gov/?term=${encodedQuery}`;
    default:
      return `https://www.google.com/search?q=${encodedQuery}`;
  }
}
