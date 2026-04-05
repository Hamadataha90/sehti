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

interface AppState {
  currentView: ViewType;
  selectedArticleId: string | null;
  selectedArticle: {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    coverImage: string;
    calculatorType: string | null;
    createdAt: string;
  } | null;
  adminToken: string | null;
  searchQuery: string;
  selectedCategory: string;

  navigate: (view: ViewType) => void;
  openArticle: (article: {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    coverImage: string;
    calculatorType: string | null;
    createdAt: string;
  }) => void;
  setAdminToken: (token: string | null) => void;
  goHome: () => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
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
    }
    set({ currentView: view, searchQuery: '' });
  },

  openArticle: (article) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', `/article/${article.slug}`);
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
}));
