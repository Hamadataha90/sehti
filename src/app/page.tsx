'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { HomePage } from '@/components/app/HomePage';
import { ArticlePage } from '@/components/app/ArticleComponents';
import { CalculatorsPage } from '@/components/app/CalculatorsPage';
import { AdminLogin, AdminPanel } from '@/components/app/AdminPanel';
import { AboutPage } from '@/components/app/AboutPage';
import { PrivacyPage } from '@/components/app/PrivacyPage';
import { CodePage } from '@/components/app/CodePage';
import { useState } from 'react';

export default function MainPage() {
  const { currentView, selectedArticle, navigate, goHome, adminToken } = useAppStore();
  const [allArticles, setAllArticles] = useState<null | Array<{
    id: string; title: string; slug: string; content: string; excerpt: string | null;
    coverImage: string; calculatorType: string | null; createdAt: string;
  }>>(null);

  useEffect(() => {
    async function fetchAll() {
      try {
        const res = await fetch('/api/articles');
        const data = await res.json();
        setAllArticles(data.articles ?? []);
      } catch { /* silent */ }
    }
    fetchAll();
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem('adminToken');
    if (token && currentView === 'admin-login') {
      useAppStore.getState().setAdminToken(token);
      navigate('admin');
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, selectedArticle?.id]);

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage />;
      case 'article':
        return selectedArticle ? (
          <ArticlePage
            key={selectedArticle.id}
            article={selectedArticle}
            allArticles={allArticles ?? []}
            onGoHome={goHome}
            onGoCalculators={() => navigate('calculators')}
          />
        ) : (
          <HomePage />
        );
      case 'calculators':
        return <CalculatorsPage />;
      case 'about':
        return <AboutPage />;
      case 'privacy':
        return <PrivacyPage />;
      case 'code':
        return <CodePage />;
      case 'admin-login':
        return <AdminLogin />;
      case 'admin':
        return adminToken ? <AdminPanel /> : <AdminLogin />;
      default:
        return <HomePage />;
    }
  };

  return <>{renderView()}</>;
}
