import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RTLLayout } from '@/components/ui/rtl-layout';
import { QueryBuilder } from '@/components/query-builder';
import { SearchHistory } from '@/components/search-history';
import { Favorites } from '@/components/favorites';
import { Settings } from '@/components/settings';
import { Dialog, DialogContent } from '@/components/ui/dialog';

type Screen = 'search' | 'history' | 'favorites' | 'settings';

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('search');
  const [darkMode, setDarkMode] = useState(false);
  const [showWebView, setShowWebView] = useState(false);
  const [currentSearchUrl, setCurrentSearchUrl] = useState('');

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleSearch = (url: string, query: string, explanation: string) => {
    setCurrentSearchUrl(url);
    setShowWebView(true);
  };

  const handleLoadFavorite = (queryData: any) => {
    setCurrentScreen('search');
    // The QueryBuilder component will handle loading the data
  };

  const navItems = [
    { id: 'search', label: 'البحث', icon: 'fas fa-search' },
    { id: 'history', label: 'السجلّ', icon: 'fas fa-history' },
    { id: 'favorites', label: 'المفضلة', icon: 'fas fa-heart' },
    { id: 'settings', label: 'الإعدادات', icon: 'fas fa-cog' },
  ];

  return (
    <RTLLayout className="min-h-screen academic-texture">
      {/* Enhanced Academic Header */}
      <header className="bg-card paper-shadow border-b-2 border-accent/20 sticky top-0 z-50 backdrop-blur-sm" data-testid="header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-6 rtl:space-x-reverse">
              <div className="academic-gradient w-14 h-14 rounded-xl flex items-center justify-center shadow-lg">
                <i className="fas fa-university text-primary-foreground text-xl"></i>
              </div>
              <div>
                <h1 className="text-2xl font-serif font-bold text-foreground mb-1">أكاديمي برو</h1>
                <p className="text-sm text-muted-foreground font-medium">🎓 منصة البحث الأكاديمي المتقدمة</p>
              </div>
            </div>
            <nav className="flex items-center space-x-2 rtl:space-x-reverse">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={currentScreen === item.id ? "default" : "ghost"}
                  className="nav-item"
                  onClick={() => setCurrentScreen(item.id as Screen)}
                  data-testid={`nav-${item.id}`}
                >
                  <i className={`${item.icon} ml-2`}></i>
                  {item.label}
                </Button>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className="nav-item"
                data-testid="button-theme-toggle"
              >
                <i className={darkMode ? "fas fa-sun" : "fas fa-moon"}></i>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentScreen === 'search' && (
          <QueryBuilder onSearch={handleSearch} />
        )}
        {currentScreen === 'history' && (
          <SearchHistory onSearch={handleSearch} />
        )}
        {currentScreen === 'favorites' && (
          <Favorites onSearch={handleSearch} onLoadFavorite={handleLoadFavorite} />
        )}
        {currentScreen === 'settings' && (
          <Settings darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />
        )}
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-card border-t-2 border-accent/20 mt-16" data-testid="footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Brand Section */}
            <div className="text-center md:text-right">
              <div className="flex items-center justify-center md:justify-start space-x-3 rtl:space-x-reverse mb-3">
                <div className="academic-gradient w-10 h-10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-university text-primary-foreground"></i>
                </div>
                <h3 className="font-serif font-bold text-lg text-foreground">أكاديمي برو</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                منصة البحث الأكاديمي المتقدمة للباحثين والطلبة
              </p>
            </div>

            {/* Developer Info */}
            <div className="text-center">
              <h4 className="font-semibold text-foreground mb-3 flex items-center justify-center">
                <i className="fas fa-user-tie text-accent ml-2"></i>
                معلومات المطور
              </h4>
              <p className="text-sm font-bold text-primary mb-1">دليلة شريف سليمان</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <a href="mailto:barmajawebb@gmail.com" className="block hover:text-accent transition-colors">
                  <i className="fas fa-envelope ml-1"></i>
                  barmajawebb@gmail.com
                </a>
                <a href="https://www.facebook.com/share/1B3sVo5ReG/" target="_blank" rel="noopener noreferrer" 
                   className="block hover:text-accent transition-colors">
                  <i className="fab fa-facebook-f ml-1"></i>
                  صفحة المطور على الفيسبوك
                </a>
              </div>
            </div>

            {/* Trust & Security */}
            <div className="text-center md:text-left">
              <h4 className="font-semibold text-foreground mb-3 flex items-center justify-center md:justify-start">
                <i className="fas fa-shield-alt text-green-600 ml-2"></i>
                الثقة والأمان
              </h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p className="flex items-center justify-center md:justify-start">
                  <i className="fas fa-lock ml-1 text-green-600"></i>
                  بيانات محمية ومشفرة
                </p>
                <p className="flex items-center justify-center md:justify-start">
                  <i className="fas fa-user-shield ml-1 text-green-600"></i>
                  خصوصية مضمونة
                </p>
                <p className="flex items-center justify-center md:justify-start">
                  <i className="fas fa-certificate ml-1 text-blue-600"></i>
                  منصة موثوقة وآمنة
                </p>
              </div>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="border-t border-border mt-8 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-center md:text-right">
                <p className="text-sm text-muted-foreground">
                  © 2025 <span className="font-bold text-primary">دليلة شريف سليمان</span> - جميع الحقوق محفوظة
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  ترخيص ملكية خاصة | يُمنع النسخ أو إعادة التوزيع دون إذن مكتوب
                </p>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className="knowledge-badge">
                  🛡️ محمي بحقوق الطبع
                </div>
                <div className="knowledge-badge">
                  🎓 للاستخدام الأكاديمي
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* WebView Modal */}
      <Dialog open={showWebView} onOpenChange={setShowWebView}>
        <DialogContent className="max-w-7xl max-h-[90vh] p-0" data-testid="modal-webview">
          <div className="h-[80vh] flex flex-col">
            <div className="bg-card border-b border-border p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowWebView(false)}
                  data-testid="button-webview-back"
                >
                  <i className="fas fa-arrow-right"></i>
                </Button>
                <div>
                  <h3 className="font-medium text-foreground">نتائج البحث</h3>
                  <p className="text-xs text-muted-foreground">محرك البحث</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowWebView(false)}
                data-testid="button-webview-close"
              >
                <i className="fas fa-times"></i>
              </Button>
            </div>
            <div className="flex-1 bg-white">
              <div className="h-full flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="bg-white bg-opacity-90 p-8 rounded-xl text-center shadow-lg">
                  <i className="fas fa-globe text-4xl text-primary mb-4"></i>
                  <h3 className="text-xl font-serif font-bold text-primary mb-2">سيتم فتح نتائج البحث</h3>
                  <p className="text-muted-foreground mb-4">يمكنك الآن زيارة الرابط للحصول على النتائج</p>
                  <Button 
                    onClick={() => window.open(currentSearchUrl, '_blank')}
                    className="bg-primary text-primary-foreground"
                    data-testid="button-open-external"
                  >
                    <i className="fas fa-external-link-alt ml-2"></i>
                    فتح في نافذة جديدة
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </RTLLayout>
  );
}
