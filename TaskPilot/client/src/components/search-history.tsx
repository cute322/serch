import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFirebase } from '@/hooks/use-firebase';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

interface SearchHistoryProps {
  onSearch: (url: string, query: string, explanation: string) => void;
}

export function SearchHistory({ onSearch }: SearchHistoryProps) {
  const { searches, deleteSearch, loading } = useFirebase();
  const { toast } = useToast();

  const handleReSearch = (search: any) => {
    onSearch(search.url, search.query, search.explanation);
  };

  const handleCopy = async (query: string) => {
    try {
      await navigator.clipboard.writeText(query);
      toast({
        title: "تم النسخ",
        description: "تم نسخ الاستعلام إلى الحافظة"
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في نسخ الاستعلام",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSearch(id);
      toast({
        title: "تم الحذف",
        description: "تم حذف الاستعلام من السجل"
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء الحذف",
        variant: "destructive"
      });
    }
  };

  const getEngineDisplayName = (engine: string) => {
    const names: Record<string, string> = {
      'google': 'Google',
      'scholar': 'Google Scholar',
      'pubmed': 'PubMed'
    };
    return names[engine] || engine;
  };

  if (searches.length === 0) {
    return (
      <div className="text-center py-12" data-testid="empty-search-history">
        <i className="fas fa-history text-6xl text-muted-foreground mb-4"></i>
        <h3 className="text-xl font-semibold text-muted-foreground mb-2">لا توجد استعلامات محفوظة</h3>
        <p className="text-muted-foreground">ابدأ بإنشاء استعلامات البحث وستظهر هنا</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-bold text-foreground mb-2">سجل البحث</h2>
        <p className="text-muted-foreground">جميع استعلاماتك السابقة محفوظة هنا ({searches.length} استعلام)</p>
      </div>

      {searches.map((search) => (
        <Card key={search.id} className="research-card border border-border" data-testid={`card-search-${search.id}`}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="font-mono text-sm bg-muted p-3 rounded-lg mb-2 break-all" data-testid={`text-search-query-${search.id}`}>
                  {search.query}
                </div>
                <p className="text-sm text-muted-foreground mb-2" data-testid={`text-search-explanation-${search.id}`}>
                  {search.explanation}
                </p>
                <div className="flex items-center space-x-4 rtl:space-x-reverse text-xs text-muted-foreground">
                  <span data-testid={`text-search-time-${search.id}`}>
                    <i className="fas fa-clock ml-1"></i>
                    {formatDistanceToNow(search.createdAt, { addSuffix: true, locale: ar })}
                  </span>
                  <span data-testid={`text-search-engine-${search.id}`}>
                    <i className="fas fa-search ml-1"></i>
                    {getEngineDisplayName(search.engine)}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleReSearch(search)}
                  title="إعادة البحث"
                  data-testid={`button-research-${search.id}`}
                >
                  <i className="fas fa-redo"></i>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(search.query)}
                  title="نسخ"
                  data-testid={`button-copy-${search.id}`}
                >
                  <i className="fas fa-copy"></i>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(search.id)}
                  title="حذف"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  disabled={loading}
                  data-testid={`button-delete-${search.id}`}
                >
                  <i className="fas fa-trash"></i>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
