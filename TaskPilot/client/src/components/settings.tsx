import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useFirebase } from '@/hooks/use-firebase';
import { useToast } from '@/hooks/use-toast';
import { exportSearchesAsJSON, exportSearchesAsCSV, exportFavoritesAsJSON } from '@/utils/export';

interface SettingsProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export function Settings({ darkMode, onToggleDarkMode }: SettingsProps) {
  const { searches, favorites, clearAllSearches, loading } = useFirebase();
  const { toast } = useToast();
  const [fontSize, setFontSize] = useState('medium');

  const handleExportSearchesJSON = () => {
    try {
      exportSearchesAsJSON(searches);
      toast({
        title: "تم التصدير",
        description: "تم تصدير السجل بصيغة JSON"
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في تصدير السجل",
        variant: "destructive"
      });
    }
  };

  const handleExportSearchesCSV = () => {
    try {
      exportSearchesAsCSV(searches);
      toast({
        title: "تم التصدير",
        description: "تم تصدير السجل بصيغة CSV"
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في تصدير السجل",
        variant: "destructive"
      });
    }
  };

  const handleExportFavorites = () => {
    try {
      exportFavoritesAsJSON(favorites);
      toast({
        title: "تم التصدير",
        description: "تم تصدير المفضلة بصيغة JSON"
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في تصدير المفضلة",
        variant: "destructive"
      });
    }
  };

  const handleClearAllData = async () => {
    if (window.confirm('هل أنت متأكد من حذف جميع البيانات؟ هذا الإجراء لا يمكن التراجع عنه.')) {
      try {
        await clearAllSearches();
        toast({
          title: "تم الحذف",
          description: "تم حذف جميع البيانات"
        });
      } catch (error) {
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء حذف البيانات",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-bold text-foreground mb-2">الإعدادات</h2>
        <p className="text-muted-foreground">تخصيص التطبيق وإدارة البيانات</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Appearance Settings */}
        <Card className="research-card border-l-4 border-l-accent" data-testid="card-appearance-settings">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <i className="fas fa-palette text-accent ml-2"></i>
              المظهر
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium text-foreground">الوضع المظلم</Label>
                <p className="text-xs text-muted-foreground">تغيير لون الواجهة</p>
              </div>
              <Switch 
                checked={darkMode} 
                onCheckedChange={onToggleDarkMode}
                data-testid="switch-dark-mode"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium text-foreground">حجم الخط</Label>
                <p className="text-xs text-muted-foreground">تكبير أو تصغير النصوص</p>
              </div>
              <Select value={fontSize} onValueChange={setFontSize}>
                <SelectTrigger className="w-32" data-testid="select-font-size">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">صغير</SelectItem>
                  <SelectItem value="medium">متوسط</SelectItem>
                  <SelectItem value="large">كبير</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="research-card border-l-4 border-l-accent" data-testid="card-data-management">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <i className="fas fa-database text-accent ml-2"></i>
              إدارة البيانات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="secondary" 
              className="w-full" 
              onClick={handleExportSearchesJSON}
              disabled={searches.length === 0}
              data-testid="button-export-searches-json"
            >
              <i className="fas fa-download ml-2"></i>
              تصدير السجل (JSON)
            </Button>
            <Button 
              variant="secondary" 
              className="w-full" 
              onClick={handleExportSearchesCSV}
              disabled={searches.length === 0}
              data-testid="button-export-searches-csv"
            >
              <i className="fas fa-file-csv ml-2"></i>
              تصدير السجل (CSV)
            </Button>
            <Button 
              variant="secondary" 
              className="w-full" 
              onClick={handleExportFavorites}
              disabled={favorites.length === 0}
              data-testid="button-export-favorites"
            >
              <i className="fas fa-heart ml-2"></i>
              تصدير المفضلة (JSON)
            </Button>
            <Button 
              variant="destructive" 
              className="w-full" 
              onClick={handleClearAllData}
              disabled={loading || searches.length === 0}
              data-testid="button-clear-all-data"
            >
              <i className="fas fa-trash ml-2"></i>
              مسح جميع البيانات
            </Button>
          </CardContent>
        </Card>

        {/* App Information */}
        <Card className="research-card border-l-4 border-l-accent lg:col-span-2" data-testid="card-app-info">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-serif">
              <i className="fas fa-certificate text-accent ml-3 text-xl"></i>
              معلومات التطبيق والترخيص
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="w-full h-48 academic-hero rounded-xl shadow-lg flex items-center justify-center relative overflow-hidden">
                <div className="text-center z-10 relative">
                  <i className="fas fa-university text-4xl text-primary mb-3"></i>
                  <p className="text-primary font-bold text-sm mb-1">أكاديمي برو</p>
                  <p className="text-muted-foreground font-medium text-xs">منصة البحث المتقدمة</p>
                  <div className="knowledge-badge mt-3 text-xs">
                    🛡️ محمي بحقوق الطبع
                  </div>
                </div>
              </div>
              <div className="md:col-span-2">
                <h4 className="font-serif font-bold text-foreground mb-3 text-lg">حول أكاديمي برو</h4>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  منصة متطورة ومتخصصة لإنشاء استعلامات البحث الأكاديمية بطريقة احترافية ومبسطة. تساعد الطلبة والباحثين والأكاديميين على العثور على المصادر العلمية والأبحاث بدقة ومهنية عالية.
                </p>
                
                {/* Developer & Contact Info */}
                <div className="bg-muted/30 p-4 rounded-lg mb-4 border-l-4 border-l-accent">
                  <h5 className="font-semibold text-foreground mb-3 flex items-center">
                    <i className="fas fa-user-tie text-accent ml-2"></i>
                    معلومات المطور
                  </h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">المطور:</span>
                      <span className="font-bold text-primary">دليلة شريف سليمان</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">البريد الإلكتروني:</span>
                      <a href="mailto:barmajawebb@gmail.com" className="font-medium text-accent hover:underline">
                        barmajawebb@gmail.com
                      </a>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">الفيسبوك:</span>
                      <a href="https://www.facebook.com/share/1B3sVo5ReG/" target="_blank" rel="noopener noreferrer" className="font-medium text-accent hover:underline flex items-center">
                        <i className="fab fa-facebook-f ml-1"></i>
                        صفحة المطور
                      </a>
                    </div>
                  </div>
                </div>

                {/* Technical Info */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الإصدار:</span>
                    <span className="font-medium">1.0.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">آخر تحديث:</span>
                    <span className="font-medium">2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">عدد الاستعلامات:</span>
                    <span className="font-medium">{searches.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">عدد المفضلة:</span>
                    <span className="font-medium">{favorites.length}</span>
                  </div>
                </div>

                {/* Privacy & License Section */}
                <div className="mt-6 pt-4 border-t border-border">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                      <h6 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center text-sm">
                        <i className="fas fa-shield-alt ml-2"></i>
                        الخصوصية والأمان
                      </h6>
                      <ul className="text-xs text-green-700 dark:text-green-300 space-y-1">
                        <li>• حماية كاملة لبيانات المستخدمين</li>
                        <li>• عدم مشاركة المعلومات مع طرف ثالث</li>
                        <li>• تشفير البيانات المحلية</li>
                      </ul>
                    </div>
                    
                    <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                      <h6 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center text-sm">
                        <i className="fas fa-copyright ml-2"></i>
                        حقوق الطبع والنشر
                      </h6>
                      <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                        © 2025 دليلة شريف سليمان - جميع الحقوق محفوظة. ترخيص ملكية خاصة.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                    <h6 className="font-semibold text-amber-800 dark:text-amber-200 mb-2 flex items-center text-sm">
                      <i className="fas fa-balance-scale ml-2"></i>
                      شروط الاستخدام والثقة
                    </h6>
                    <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                      هذا التطبيق مطور ومملوك بالكامل من قبل دليلة شريف سليمان. يُمنع النسخ أو التعديل أو إعادة التوزيع دون إذن مكتوب من المطور. التطبيق موثوق ومؤمن لضمان تجربة بحث أكاديمية موثوقة.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
