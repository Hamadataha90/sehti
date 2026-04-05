import { create } from 'zustand';

export type ViewType =
  | 'home'
  | 'article'
  | 'calculators'
  | 'about'
  | 'privacy'
  | 'code'
  | 'admin-login'
  | 'admin';

interface ArticleData {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  coverImage: string;
  calculatorType: string | null;
  createdAt: string;
}

interface AppState {
  currentView: ViewType;
  selectedArticleId: string | null;
  selectedArticle: ArticleData | null;
  adminToken: string | null;
  searchQuery: string;
  selectedCategory: string;

  navigate: (view: ViewType) => void;
  openArticle: (article: ArticleData) => void;
  setAdminToken: (token: string | null) => void;
  goHome: () => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  syncUrlToState: (allArticles: ArticleData[]) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentView: 'home',
  selectedArticleId: null,
  selectedArticle: null,
  adminToken: typeof window !== 'undefined' ? sessionStorage.getItem('adminToken') : null,
  searchQuery: '',
  selectedCategory: 'all',

  navigate: (view) => {
    if (typeof window !== 'undefined') {
      const routes: Record<string, string> = {
        home: '/',
        calculators: '/#calculators',
        about: '/about',
        privacy: '/privacy',
        'admin-login': '/admin',
        admin: '/admin',
      };
      const url = routes[view] ?? '/';
      window.history.pushState({}, '', url);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    set({ currentView: view, searchQuery: '' });
  },

  openArticle: (article) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', `/article/${article.slug}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    set({
      currentView: 'article',
      selectedArticleId: article.id,
      selectedArticle: article,
    });
  },

  setAdminToken: (token) => {
    if (typeof window !== 'undefined') {
      if (token) {
        sessionStorage.setItem('adminToken', token);
      } else {
        sessionStorage.removeItem('adminToken');
      }
    }
    set({ adminToken: token });
  },

  goHome: () => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    set({
      currentView: 'home',
      selectedArticleId: null,
      selectedArticle: null,
      searchQuery: '',
    });
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),

  // Sync browser URL to Zustand state (for back/forward navigation)
  syncUrlToState: (allArticles) => {
    if (typeof window === 'undefined') return;
    const pathname = window.location.pathname;
    const state = get();

    // If on an article URL
    const articleMatch = pathname.match(/^\/article\/(.+)$/);
    if (articleMatch) {
      const slug = decodeURIComponent(articleMatch[1]);
      // Only sync if we're not already on this article
      if (state.currentView !== 'article' || state.selectedArticle?.slug !== slug) {
        const article = allArticles.find((a) => a.slug === slug);
        if (article) {
          set({
            currentView: 'article',
            selectedArticleId: article.id,
            selectedArticle: article,
          });
          window.scrollTo({ top: 0 });
          return;
        }
      }
      return;
    }

    // If on home URL and currently viewing article, go home
    if (pathname === '/' && state.currentView === 'article') {
      set({
        currentView: 'home',
        selectedArticleId: null,
        selectedArticle: null,
      });
      window.scrollTo({ top: 0 });
    }
  },
}));

// Set up popstate listener for browser back/forward
if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => {
    // We need allArticles to find articles by slug
    // This will be called from page.tsx with articles available
    const state = useAppStore.getState();
    const pathname = window.location.pathname;

    const articleMatch = pathname.match(/^\/article\/(.+)$/);
    if (articleMatch) {
      const slug = decodeURIComponent(articleMatch[1]);
      // Fetch articles if needed to find the matching one
      fetch('/api/articles')
        .then((r) => r.json())
        .then((data) => {
          const articles = data.articles ?? [];
          const article = articles.find((a: ArticleData) => a.slug === slug);
          if (article) {
            useAppStore.setState({
              currentView: 'article',
              selectedArticleId: article.id,
              selectedArticle: article,
            });
            window.scrollTo({ top: 0 });
          } else {
            useAppStore.setState({
              currentView: 'home',
              selectedArticleId: null,
              selectedArticle: null,
            });
          }
        })
        .catch(() => {
          useAppStore.setState({
            currentView: 'home',
            selectedArticleId: null,
            selectedArticle: null,
          });
        });
    } else {
      useAppStore.setState({
        currentView: 'home',
        selectedArticleId: null,
        selectedArticle: null,
      });
      window.scrollTo({ top: 0 });
    }
  });
}
