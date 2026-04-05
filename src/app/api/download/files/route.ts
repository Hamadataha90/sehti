import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    const filePaths = [
      'package.json',
      'prisma/schema.prisma',
      'public/manifest.json',
      'src/app/layout.tsx',
      'src/app/page.tsx',
      'src/app/globals.css',
      'src/store/useAppStore.ts',
      'src/lib/env.ts',
      'src/lib/jwt.ts',
      'src/components/app/Header.tsx',
      'src/components/app/Footer.tsx',
      'src/components/app/HomePage.tsx',
      'src/components/app/ArticleComponents.tsx',
      'src/components/app/CalculatorsPage.tsx',
      'src/components/app/AdminPanel.tsx',
      'src/components/app/AboutPage.tsx',
      'src/components/app/PrivacyPage.tsx',
      'src/components/app/CodePage.tsx',
      'src/app/api/articles/route.ts',
      'src/app/api/articles/[id]/route.ts',
      'src/app/api/leads/route.ts',
      'src/app/api/auth/login/route.ts',
      'src/app/api/email/route.ts',
      'src/app/api/newsletter/route.ts',
      'src/app/api/seed/route.ts',
    ];

    const files: Array<{ path: string; content: string }> = [];
    for (const fp of filePaths) {
      try {
        const content = await readFile(join(process.cwd(), fp), 'utf8');
        files.push({ path: fp, content });
      } catch {
        // skip
      }
    }

    return NextResponse.json({ files });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
