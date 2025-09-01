import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useQueryBuilder } from '@/hooks/use-query-builder';
import { useFirebase } from '@/hooks/use-firebase';
import { useToast } from '@/hooks/use-toast';
import { QueryData } from '@/types/query';

const academicSites = [
  { value: 'scholar.google.com', label: 'Google Scholar' },
  { value: 'pubmed.ncbi.nlm.nih.gov', label: 'PubMed' },
  { value: 'sciencedirect.com', label: 'ScienceDirect' },
  { value: 'jstor.org', label: 'JSTOR' },
  { value: 'arxiv.org', label: 'arXiv' },
  { value: 'researchgate.net', label: 'ResearchGate' },
];

const fileTypes = [
  { value: 'pdf', label: 'PDF' },
  { value: 'doc', label: 'Word Document' },
  { value: 'docx', label: 'Word Document (حديث)' },
  { value: 'ppt', label: 'PowerPoint' },
  { value: 'pptx', label: 'PowerPoint (حديث)' },
  { value: 'xls', label: 'Excel' },
  { value: 'xlsx', label: 'Excel (حديث)' },
];

const examples = [
  {
    name: 'أبحاث التعلم الآلي الحديثة',
    data: { exactPhrase: 'machine learning', site: 'scholar.google.com', filetype: 'pdf', afterYear: '2020' }
  },
  {
    name: 'الذكاء الاصطناعي في الطب',
    data: { exactPhrase: 'artificial intelligence', site: 'pubmed.ncbi.nlm.nih.gov', afterYear: '2022' }
  },
  {
    name: 'أبحاث التغير المناخي',
    data: { inTitle: 'climate change', filetype: 'pdf', afterYear: '2021' }
  }
];

interface QueryBuilderProps {
  onSearch: (url: string, query: string, explanation: string) => void;
}

export function QueryBuilder({ onSearch }: QueryBuilderProps) {
  const { 
    queryData, 
    query, 
    explanation, 
    searchUrl, 
    selectedEngine, 
    searchEngines, 
    updateField, 
    setEngine, 
    loadExample 
  } = useQueryBuilder();
  
  const { saveSearch, saveFavorite, loading } = useFirebase();
  const { toast } = useToast();
  
  const [showCustomSite, setShowCustomSite] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [favoriteName, setFavoriteName] = useState('');
  const [favoriteDescription, setFavoriteDescription] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال معايير البحث أولاً",
        variant: "destructive"
      });
      return;
    }

    try {
      await saveSearch(queryData, query, explanation, searchUrl);
      onSearch(searchUrl, query, explanation);
      toast({
        title: "تم البحث",
        description: "تم حفظ الاستعلام في السجل"
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء البحث",
        variant: "destructive"
      });
    }
  };

  const handleSaveFavorite = async () => {
    if (!favoriteName.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال اسم للاستعلام",
        variant: "destructive"
      });
      return;
    }

    try {
      await saveFavorite(favoriteName, favoriteDescription, queryData);
      setShowSaveModal(false);
      setFavoriteName('');
      setFavoriteDescription('');
      toast({
        title: "تم الحفظ",
        description: "تم حفظ الاستعلام في المفضلة"
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء الحفظ",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "تم النسخ",
        description: "تم نسخ الرابط إلى الحافظة"
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في نسخ الرابط",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Academic Hero Section */}
      <div className="text-center mb-12">
        <div className="academic-hero w-full h-56 rounded-2xl shadow-2xl mb-8 flex items-center justify-center relative">
          <div className="text-center z-10 relative">
            <div className="flex justify-center items-center mb-6 space-x-4 rtl:space-x-reverse">
              <i className="fas fa-microscope text-5xl text-primary"></i>
              <i className="fas fa-book-open text-4xl text-accent"></i>
              <i className="fas fa-graduation-cap text-5xl text-primary"></i>
            </div>
            <h1 className="text-2xl font-serif font-bold text-primary mb-2">مختبر البحث الأكاديمي الذكي</h1>
            <p className="text-muted-foreground font-medium">منصة متطورة لصياغة استعلامات البحث العلمي</p>
            <div className="knowledge-badge mt-4">
              🎓 مصمم خصيصاً للباحثين والأكاديميين
            </div>
          </div>
        </div>
        <h2 className="text-4xl font-serif font-bold text-foreground mb-3">منشئ الاستعلامات البحثية المتقدم</h2>
        <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
          استخدم أدوات البحث المتطورة لإنشاء استعلامات دقيقة ومعقدة تساعدك في الوصول إلى أحدث الأبحاث العلمية والأكاديمية
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Query Builder Forms */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Content Search */}
          <Card className="research-card border-l-4 border-l-accent" data-testid="card-content-search">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-serif">
                <i className="fas fa-search text-accent ml-3 text-xl"></i>
                تحديد المحتوى والكلمات المفتاحية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="exact-phrase">العبارة الدقيقة</Label>
                <div className="relative">
                  <Input
                    id="exact-phrase"
                    value={queryData.exactPhrase || ''}
                    onChange={(e) => updateField('exactPhrase', e.target.value)}
                    placeholder="مثال: الذكاء الاصطناعي في التعليم"
                    className="academic-input pr-20 text-base"
                    data-testid="input-exact-phrase"
                  />
                  <span className="absolute top-1 left-1 bg-accent text-accent-foreground px-2 py-1 rounded text-xs font-medium">
                    phrase:
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">البحث عن النص الكامل بالترتيب المحدد</p>
              </div>

              <div>
                <Label htmlFor="any-words">أي من هذه الكلمات</Label>
                <Input
                  id="any-words"
                  value={queryData.anyWords || ''}
                  onChange={(e) => updateField('anyWords', e.target.value)}
                  placeholder="مثال: تعلم آلة، شبكة عصبية، خوارزمية"
                  className="academic-input text-base"
                  data-testid="input-any-words"
                />
                <p className="text-xs text-muted-foreground mt-1">البحث عن صفحات تحتوي على أي من هذه الكلمات</p>
              </div>

              <div>
                <Label htmlFor="exclude-words">استبعاد الكلمات</Label>
                <div className="relative">
                  <Input
                    id="exclude-words"
                    value={queryData.excludeWords || ''}
                    onChange={(e) => updateField('excludeWords', e.target.value)}
                    placeholder="مثال: مقالة، مدونة"
                    className="academic-input pr-12 text-base"
                    data-testid="input-exclude-words"
                  />
                  <span className="absolute top-1 left-1 bg-accent text-accent-foreground px-2 py-1 rounded text-xs font-medium">
                    -
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">استبعاد النتائج التي تحتوي على هذه الكلمات</p>
              </div>

              <div>
                <Label htmlFor="in-title">في العنوان فقط</Label>
                <div className="relative">
                  <Input
                    id="in-title"
                    value={queryData.inTitle || ''}
                    onChange={(e) => updateField('inTitle', e.target.value)}
                    placeholder="مثال: دراسة"
                    className="academic-input pr-20 text-base"
                    data-testid="input-in-title"
                  />
                  <span className="absolute top-1 left-1 bg-accent text-accent-foreground px-2 py-1 rounded text-xs font-medium">
                    intitle:
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">البحث عن الكلمات في عناوين الصفحات فقط</p>
              </div>
            </CardContent>
          </Card>

          {/* Source & Format */}
          <Card className="research-card border-l-4 border-l-accent" data-testid="card-source-format">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-serif">
                <i className="fas fa-university text-accent ml-3 text-xl"></i>
                مصادر المعلومات وأنواع الملفات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="site-select">موقع محدد</Label>
                  <div className="relative">
                    <Select
                      value={queryData.site || ''}
                      onValueChange={(value) => {
                        if (value === 'custom') {
                          setShowCustomSite(true);
                          updateField('site', '');
                        } else {
                          setShowCustomSite(false);
                          updateField('site', value);
                          updateField('customSite', '');
                        }
                      }}
                    >
                      <SelectTrigger data-testid="select-site">
                        <SelectValue placeholder="اختر موقعاً أو أدخل رابط مخصص" />
                      </SelectTrigger>
                      <SelectContent>
                        {academicSites.map(site => (
                          <SelectItem key={site.value} value={site.value}>
                            {site.label}
                          </SelectItem>
                        ))}
                        <SelectItem value="custom">موقع مخصص</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="absolute top-1 left-1 bg-accent text-accent-foreground px-2 py-1 rounded text-xs font-medium">
                      site:
                    </span>
                  </div>
                  {showCustomSite && (
                    <Input
                      className="academic-input mt-2 text-base"
                      value={queryData.customSite || ''}
                      onChange={(e) => updateField('customSite', e.target.value)}
                      placeholder="أدخل الموقع مثال: example.com"
                      data-testid="input-custom-site"
                    />
                  )}
                </div>

                <div>
                  <Label htmlFor="filetype">نوع الملف</Label>
                  <div className="relative">
                    <Select
                      value={queryData.filetype || ''}
                      onValueChange={(value) => updateField('filetype', value)}
                    >
                      <SelectTrigger data-testid="select-filetype">
                        <SelectValue placeholder="جميع أنواع الملفات" />
                      </SelectTrigger>
                      <SelectContent>
                        {fileTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="absolute top-1 left-1 bg-accent text-accent-foreground px-2 py-1 rounded text-xs font-medium">
                      filetype:
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Time Range */}
          <Card className="research-card border-l-4 border-l-accent" data-testid="card-time-range">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-serif">
                <i className="fas fa-calendar-alt text-accent ml-3 text-xl"></i>
                تحديد النطاق الزمني للنشر
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="after-year">من سنة</Label>
                  <div className="relative">
                    <Input
                      id="after-year"
                      type="number"
                      value={queryData.afterYear || ''}
                      onChange={(e) => updateField('afterYear', e.target.value)}
                      placeholder="2020"
                      min="1990"
                      max="2024"
                      className="academic-input pr-16 text-base"
                      data-testid="input-after-year"
                    />
                    <span className="absolute top-1 left-1 bg-accent text-accent-foreground px-2 py-1 rounded text-xs font-medium">
                      after:
                    </span>
                  </div>
                </div>
                <div>
                  <Label htmlFor="before-year">إلى سنة</Label>
                  <div className="relative">
                    <Input
                      id="before-year"
                      type="number"
                      value={queryData.beforeYear || ''}
                      onChange={(e) => updateField('beforeYear', e.target.value)}
                      placeholder="2024"
                      min="1990"
                      max="2024"
                      className="academic-input pr-18 text-base"
                      data-testid="input-before-year"
                    />
                    <span className="absolute top-1 left-1 bg-accent text-accent-foreground px-2 py-1 rounded text-xs font-medium">
                      before:
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search Engine Selection */}
          <Card className="research-card border-l-4 border-l-accent" data-testid="card-search-engines">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-serif">
                <i className="fas fa-database text-accent ml-3 text-xl"></i>
                قواعد البيانات الأكاديمية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {searchEngines.map(engine => (
                  <Button
                    key={engine.id}
                    variant={queryData.engine === engine.id ? "default" : "outline"}
                    className="p-4 h-auto flex-col space-y-2"
                    onClick={() => setEngine(engine.id)}
                    data-testid={`button-engine-${engine.id}`}
                  >
                    <i className={`${engine.icon} text-xl`}></i>
                    <span className="font-medium">{engine.name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview & Actions Sidebar */}
        <div className="space-y-6">
          {/* Query Preview */}
          <Card className="research-card" data-testid="card-query-preview">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-serif">
                <i className="fas fa-code text-accent ml-3 text-xl"></i>
                معاينة الاستعلام المُنشأ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg text-sm font-mono min-h-[100px] border" data-testid="text-query-preview">
                {query || <span className="text-muted-foreground italic">سيظهر الاستعلام المُنشأ هنا...</span>}
              </div>
              <div className="bg-secondary p-4 rounded-lg text-sm" data-testid="text-explanation-preview">
                {explanation || <span className="text-muted-foreground italic">سيظهر شرح الاستعلام هنا...</span>}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              variant="secondary" 
              className="w-full" 
              onClick={() => setShowPreviewModal(true)}
              disabled={!query.trim()}
              data-testid="button-preview-link"
            >
              <i className="fas fa-external-link-alt ml-2"></i>
              معاينة الرابط
            </Button>
            <Button 
              className="scholarly-button w-full text-lg py-3" 
              onClick={handleSearch}
              disabled={!query.trim() || loading}
              data-testid="button-search-now"
            >
              <i className="fas fa-search ml-2"></i>
              تشغيل البحث الأكاديمي
            </Button>
            <Button 
              variant="outline" 
              className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground" 
              onClick={() => setShowSaveModal(true)}
              disabled={!query.trim()}
              data-testid="button-save-favorite"
            >
              <i className="fas fa-heart ml-2"></i>
              حفظ في المفضلة
            </Button>
          </div>

          {/* Quick Examples */}
          <Card className="research-card" data-testid="card-quick-examples">
            <CardHeader>
              <CardTitle className="text-lg font-serif flex items-center">
                <i className="fas fa-lightbulb text-accent ml-2"></i>
                نماذج بحثية جاهزة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {examples.map((example, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full text-right justify-start p-3 h-auto"
                  onClick={() => loadExample(example.data)}
                  data-testid={`button-example-${index}`}
                >
                  {example.name}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Save Favorite Modal */}
      <Dialog open={showSaveModal} onOpenChange={setShowSaveModal}>
        <DialogContent data-testid="modal-save-favorite">
          <DialogHeader>
            <DialogTitle>حفظ في المفضلة</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="favorite-name">اسم الاستعلام</Label>
              <Input
                id="favorite-name"
                value={favoriteName}
                onChange={(e) => setFavoriteName(e.target.value)}
                placeholder="مثال: أبحاث الذكاء الاصطناعي"
                data-testid="input-favorite-name"
              />
            </div>
            <div>
              <Label htmlFor="favorite-description">وصف (اختياري)</Label>
              <Textarea
                id="favorite-description"
                value={favoriteDescription}
                onChange={(e) => setFavoriteDescription(e.target.value)}
                placeholder="وصف مختصر للاستعلام..."
                rows={3}
                data-testid="textarea-favorite-description"
              />
            </div>
          </div>
          <DialogFooter className="space-x-3 rtl:space-x-reverse">
            <Button onClick={handleSaveFavorite} disabled={loading} data-testid="button-save-favorite-confirm">
              حفظ
            </Button>
            <Button variant="outline" onClick={() => setShowSaveModal(false)} data-testid="button-save-favorite-cancel">
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
        <DialogContent className="max-w-2xl" data-testid="modal-preview">
          <DialogHeader>
            <DialogTitle>معاينة الرابط والاستعلام</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <Label>الاستعلام المُنشأ</Label>
              <div className="font-mono text-sm bg-muted p-4 rounded-lg border" data-testid="text-preview-query">
                {query}
              </div>
            </div>
            
            <div>
              <Label>الرابط النهائي</Label>
              <div className="flex">
                <Input
                  readOnly
                  value={searchUrl}
                  className="flex-1 rounded-l-none font-mono text-sm"
                  data-testid="input-preview-url"
                />
                <Button
                  variant="outline"
                  className="rounded-r-none border-r-0"
                  onClick={() => copyToClipboard(searchUrl)}
                  data-testid="button-copy-url"
                >
                  <i className="fas fa-copy"></i>
                </Button>
              </div>
            </div>

            <div>
              <Label>الشرح</Label>
              <div className="bg-secondary p-4 rounded-lg text-sm" data-testid="text-preview-explanation">
                {explanation}
              </div>
            </div>
          </div>
          <DialogFooter className="space-x-3 rtl:space-x-reverse">
            <Button onClick={() => window.open(searchUrl, '_blank')} data-testid="button-open-search-url">
              <i className="fas fa-external-link-alt ml-2"></i>
              فتح الرابط
            </Button>
            <Button variant="outline" onClick={() => copyToClipboard(searchUrl)} data-testid="button-copy-search-url">
              <i className="fas fa-copy ml-2"></i>
              نسخ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
