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
  restoreAdminToken: () => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentView: 'home',
  selectedArticleId: null,
  selectedArticle: null,
  adminToken: null,
  searchQuery: '',
  selectedCategory: 'all',

  navigate: (view) => {
    if (typeof window === 'undefined') return;

    // Views that are SPA-only (rendered in page.tsx via currentView)
    const spaViews: ViewType[] = ['home', 'calculators', 'about', 'code', 'admin-login', 'admin'];

    if (spaViews.includes(view)) {
      // If already on the main page, just switch view via Zustand + pushState
      if (window.location.pathname === '/') {
        const routes: Record<string, string> = {
          home: '/',
          calculators: '/#calculators',
          about: '/#about',
          code: '/#code',
          'admin-login': '/#admin-login',
          admin: '/#admin',
        };
        window.history.pushState({}, '', routes[view] ?? '/');
      } else {
        // On another page (like /articles), navigate back to / and set view
        // Use sessionStorage to remember which view to show after navigation
        sessionStorage.setItem('spa_target_view', view);
        window.location.href = '/';
      }
    } else if (view === 'privacy') {
      // /privacy is a real Next.js page
      window.location.href = '/privacy';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    set({ currentView: view, searchQuery: '' });
  },

  openArticle: (article) => {
    if (typeof window === 'undefined') return;

    // /article/[slug] is a real Next.js page - always use full navigation
    if (window.location.pathname === '/') {
      // From SPA, update state and push URL (smooth transition)
      window.history.pushState({}, '', `/article/${article.slug}`);
      set({
        currentView: 'article',
        selectedArticleId: article.id,
        selectedArticle: article,
      });
    } else {
      // From another page, use full navigation
      window.location.href = `/article/${article.slug}`;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  setAdminToken: (token) => {
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminTokenExpiry', String(Date.now() + 7 * 24 * 60 * 60 * 1000));
      } else {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminTokenExpiry');
      }
    }
    set({ adminToken: token });
  },

  restoreAdminToken: () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('adminToken');
    const expiry = localStorage.getItem('adminTokenExpiry');
    if (token && expiry && Date.now() < Number(expiry)) {
      set({ adminToken: token });
    } else {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminTokenExpiry');
    }
  },

  goHome: () => {
    if (typeof window === 'undefined') return;

    if (window.location.pathname === '/') {
      // Already on main page - just reset state
      window.history.pushState({}, '', '/');
    } else {
      // On another page - full navigation back to /
      window.location.href = '/';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    set({
      currentView: 'home',
      selectedArticleId: null,
      selectedArticle: null,
      searchQuery: '',
    });
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
}));
