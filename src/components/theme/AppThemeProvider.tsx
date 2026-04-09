'use client';

/**
 * next-themes-compatible provider without an inline &lt;script&gt; (React 19 disallows that in client trees).
 * Blocking theme init lives in root layout &lt;head&gt; via {@link buildThemeHeadScript}.
 */
import * as React from 'react';
import type { Attribute, ThemeProviderProps, UseThemeProps } from 'next-themes';

const colorSchemes = ['light', 'dark'] as const;
const MEDIA = '(prefers-color-scheme: dark)';
const isServer = typeof window === 'undefined';

const ThemeContext = React.createContext<UseThemeProps | undefined>(undefined);

const defaultContext: UseThemeProps = {
  setTheme: () => {},
  themes: [],
};

export const useTheme = () => React.useContext(ThemeContext) ?? defaultContext;

const defaultThemes = ['light', 'dark'];

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const existing = React.useContext(ThemeContext);
  if (existing) return <>{children}</>;
  return <ThemeImpl {...props}>{children}</ThemeImpl>;
}

function ThemeImpl({
  forcedTheme,
  disableTransitionOnChange = false,
  enableSystem = true,
  enableColorScheme = true,
  storageKey = 'theme',
  themes = defaultThemes,
  defaultTheme = enableSystem ? 'system' : 'light',
  attribute = 'data-theme',
  value,
  children,
  nonce,
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<string | undefined>(() =>
    getTheme(storageKey, defaultTheme),
  );
  const [resolvedTheme, setResolvedTheme] = React.useState<string | undefined>(() =>
    theme === 'system' ? getSystemTheme() : theme,
  );

  const attrs = React.useMemo(() => (!value ? themes : Object.values(value)), [themes, value]);

  const applyTheme = React.useCallback(
    (next: string | undefined) => {
      let resolved = next;
      if (!resolved) return;

      if (resolved === 'system' && enableSystem) {
        resolved = getSystemTheme();
      }

      const name = value ? value[resolved] : resolved;
      const enable = disableTransitionOnChange ? disableAnimation(nonce) : null;
      const d = document.documentElement;

      const handleAttribute = (attr: Attribute) => {
        if (attr === 'class') {
          d.classList.remove(...attrs);
          if (name) d.classList.add(name);
        } else if (attr.startsWith('data-')) {
          if (resolved) {
            d.setAttribute(attr, resolved);
          } else {
            d.removeAttribute(attr);
          }
        }
      };

      if (Array.isArray(attribute)) {
        attribute.forEach(handleAttribute);
      } else {
        handleAttribute(attribute);
      }

      if (enableColorScheme) {
        const fallback = colorSchemes.includes(defaultTheme as 'light' | 'dark') ? defaultTheme : null;
        const scheme = colorSchemes.includes(resolved as 'light' | 'dark') ? resolved : fallback;
        if (scheme) {
          d.style.colorScheme = scheme;
        }
      }

      enable?.();
    },
    [
      attribute,
      attrs,
      value,
      enableColorScheme,
      defaultTheme,
      disableTransitionOnChange,
      nonce,
      enableSystem,
    ],
  );

  const setTheme = React.useCallback(
    (val: React.SetStateAction<string>) => {
      const newTheme = typeof val === 'function' ? val(theme ?? defaultTheme) : val;
      setThemeState(newTheme);
      try {
        localStorage.setItem(storageKey, newTheme);
      } catch {
        /* unsupported */
      }
    },
    [theme, storageKey, defaultTheme],
  );

  const handleMediaQuery = React.useCallback(
    (e: MediaQueryList | MediaQueryListEvent) => {
      const resolved = getSystemTheme(e);
      setResolvedTheme(resolved);
      if (theme === 'system' && enableSystem && !forcedTheme) {
        applyTheme('system');
      }
    },
    [theme, forcedTheme, enableSystem, applyTheme],
  );

  React.useEffect(() => {
    const media = window.matchMedia(MEDIA);
    media.addListener(handleMediaQuery);
    handleMediaQuery(media);
    return () => media.removeListener(handleMediaQuery);
  }, [handleMediaQuery]);

  React.useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== storageKey) return;
      if (!e.newValue) {
        setTheme(defaultTheme);
      } else {
        setThemeState(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [setTheme, storageKey, defaultTheme]);

  React.useEffect(() => {
    applyTheme(forcedTheme ?? theme);
  }, [forcedTheme, theme, applyTheme]);

  const providerValue = React.useMemo<UseThemeProps>(
    () => ({
      theme,
      setTheme,
      forcedTheme,
      resolvedTheme: theme === 'system' ? resolvedTheme : theme,
      themes: enableSystem ? [...themes, 'system'] : themes,
      systemTheme: enableSystem ? resolvedTheme : undefined,
    }),
    [theme, setTheme, forcedTheme, resolvedTheme, enableSystem, themes],
  );

  return <ThemeContext.Provider value={providerValue}>{children}</ThemeContext.Provider>;
}

function getTheme(key: string, fallback?: string): string | undefined {
  if (isServer) return undefined;
  try {
    const stored = localStorage.getItem(key) ?? undefined;
    return stored || fallback;
  } catch {
    return fallback;
  }
}

function disableAnimation(nonce?: string) {
  const css = document.createElement('style');
  if (nonce) css.setAttribute('nonce', nonce);
  css.appendChild(
    document.createTextNode(
      '*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}',
    ),
  );
  document.head.appendChild(css);
  return () => {
    window.getComputedStyle(document.body);
    setTimeout(() => {
      document.head.removeChild(css);
    }, 1);
  };
}

function getSystemTheme(e?: MediaQueryList | MediaQueryListEvent): 'dark' | 'light' {
  const media = e ?? window.matchMedia(MEDIA);
  return media.matches ? 'dark' : 'light';
}
