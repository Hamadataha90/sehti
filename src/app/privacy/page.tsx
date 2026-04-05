import type { Metadata } from 'next';
import { PrivacyPage as PrivacyPageContent } from '@/components/app/PrivacyPage';

export const metadata: Metadata = {
  title: 'سياسة الخصوصية | صِحتي',
  description: 'تعرف على سياسة الخصوصية الخاصة بمنصة صِحتي وكيفية حماية بياناتك الشخصية.',
};

export default function PrivacyRoute() {
  return <PrivacyPageContent />;
}
