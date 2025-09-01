import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useFirebase } from '@/hooks/use-firebase';
import { useQueryBuilder } from '@/hooks/use-query-builder';
import { useToast } from '@/hooks/use-toast';
import { FavoriteQuery } from '@/types/query';

interface FavoritesProps {
  onSearch: (url: string, query: string, explanation: string) => void;
  onLoadFavorite: (queryData: any) => void;
}

export function Favorites({ onSearch, onLoadFavorite }: FavoritesProps) {
  const { favorites, deleteFavorite, saveFavorite, loading } = useFirebase();
  const { toast } = useToast();
  const [showAddModal, setShowAddModal] = useState(false);
  const [favoriteName, setFavoriteName] = useState('');
  const [favoriteDescription, setFavoriteDescription] = useState('');

  const handleUseFavorite = (favorite: FavoriteQuery) => {
    onLoadFavorite(favorite.queryData);
    toast({
      title: "تم التحميل",
      description: `تم تحميل الاستعلام: ${favorite.name}`
    });
  };

  const handleSearchFavorite = (favorite: FavoriteQuery) => {
    // Build URL and explanation from queryData
    // This is a simplified version - you might want to use the query builder utils
    const query = Object.entries(favorite.queryData)
      .filter(([key, value]) => value && key !== 'engine')
      .map(([key, value]) => `${key}:${value}`)
      .join(' ');
    
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    onSearch(url, query, favorite.description || 'استعلام محفوظ');
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`هل أنت متأكد من حذف "${name}"؟`)) {
      try {
        await deleteFavorite(id);
        toast({
          title: "تم الحذف",
          description: "تم حذف الاستعلام من المفضلة"
        });
      } catch (error) {
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء الحذف",
          variant: "destructive"
        });
      }
    }
  };

  const handleAddFavorite = async () => {
    if (!favoriteName.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال اسم للاستعلام",
        variant: "destructive"
      });
      return;
    }

    try {
      // For demo purposes, create a simple favorite
      await saveFavorite(favoriteName, favoriteDescription, { engine: 'google' });
      setShowAddModal(false);
      setFavoriteName('');
      setFavoriteDescription('');
      toast({
        title: "تم الحفظ",
        description: "تم إضافة الاستعلام إلى المفضلة"
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء الحفظ",
        variant: "destructive"
      });
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-bold text-foreground mb-2">الاستعلامات المفضلة</h2>
        <p className="text-muted-foreground">استعلاماتك المحفوظة للوصول السريع ({favorites.length} استعلام)</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((favorite) => (
          <Card key={favorite.id} className="research-card" data-testid={`card-favorite-${favorite.id}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg" data-testid={`text-favorite-name-${favorite.id}`}>
                  {favorite.name}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(favorite.id, favorite.name)}
                  className="text-muted-foreground hover:text-red-500"
                  disabled={loading}
                  data-testid={`button-delete-favorite-${favorite.id}`}
                >
                  <i className="fas fa-times"></i>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="font-mono text-xs bg-muted p-3 rounded-lg mb-3" data-testid={`text-favorite-query-${favorite.id}`}>
                {JSON.stringify(favorite.queryData, null, 2)}
              </div>
              {favorite.description && (
                <p className="text-sm text-muted-foreground mb-4" data-testid={`text-favorite-description-${favorite.id}`}>
                  {favorite.description}
                </p>
              )}
              <div className="flex space-x-2 rtl:space-x-reverse">
                <Button
                  className="flex-1"
                  onClick={() => handleSearchFavorite(favorite)}
                  data-testid={`button-search-favorite-${favorite.id}`}
                >
                  <i className="fas fa-search ml-1"></i>
                  بحث
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleUseFavorite(favorite)}
                  data-testid={`button-use-favorite-${favorite.id}`}
                >
                  <i className="fas fa-edit"></i>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add New Favorite Card */}
        <Card 
          className="border-2 border-dashed border-border hover:border-accent transition-colors cursor-pointer group"
          onClick={() => setShowAddModal(true)}
          data-testid="card-add-favorite"
        >
          <CardContent className="p-6 text-center">
            <i className="fas fa-plus text-4xl text-muted-foreground group-hover:text-accent transition-colors mb-4"></i>
            <h3 className="font-serif font-semibold text-muted-foreground group-hover:text-accent transition-colors">
              إضافة استعلام مفضل
            </h3>
            <p className="text-sm text-muted-foreground mt-2">احفظ استعلامك الحالي للوصول السريع</p>
          </CardContent>
        </Card>
      </div>

      {favorites.length === 0 && (
        <div className="text-center py-12" data-testid="empty-favorites">
          <i className="fas fa-heart text-6xl text-muted-foreground mb-4"></i>
          <h3 className="text-xl font-semibold text-muted-foreground mb-2">لا توجد استعلامات مفضلة</h3>
          <p className="text-muted-foreground">احفظ استعلاماتك المهمة لسهولة الوصول إليها</p>
        </div>
      )}

      {/* Add Favorite Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent data-testid="modal-add-favorite">
          <DialogHeader>
            <DialogTitle>إضافة استعلام مفضل</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="add-favorite-name">اسم الاستعلام</Label>
              <Input
                id="add-favorite-name"
                value={favoriteName}
                onChange={(e) => setFavoriteName(e.target.value)}
                placeholder="مثال: أبحاث الذكاء الاصطناعي"
                data-testid="input-add-favorite-name"
              />
            </div>
            <div>
              <Label htmlFor="add-favorite-description">وصف (اختياري)</Label>
              <Textarea
                id="add-favorite-description"
                value={favoriteDescription}
                onChange={(e) => setFavoriteDescription(e.target.value)}
                placeholder="وصف مختصر للاستعلام..."
                rows={3}
                data-testid="textarea-add-favorite-description"
              />
            </div>
          </div>
          <DialogFooter className="space-x-3 rtl:space-x-reverse">
            <Button onClick={handleAddFavorite} disabled={loading} data-testid="button-add-favorite-confirm">
              حفظ
            </Button>
            <Button variant="outline" onClick={() => setShowAddModal(false)} data-testid="button-add-favorite-cancel">
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
