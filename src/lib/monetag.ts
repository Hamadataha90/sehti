/**
 * Centralized Monetag ad loader.
 * Uses window-scoped flags so duplicate bundles cannot get out of sync,
 * and only marks "loaded" after the script fires load (failed loads can retry).
 */

const FLAG = '__sehti_monetag__';

type MonetagFlag = { loading: boolean; loaded: boolean };

function getState(): MonetagFlag {
  if (typeof window === 'undefined') {
    return { loading: false, loaded: false };
  }
  const w = window as Window & Record<string, MonetagFlag | undefined>;
  if (!w[FLAG]) {
    w[FLAG] = { loading: false, loaded: false };
  }
  return w[FLAG]!;
}

export function triggerMonetag(): void {
  if (typeof window === 'undefined') return;

  const st = getState();
  if (st.loaded || st.loading) return;

  const src = process.env.NEXT_PUBLIC_MONETAG_SRC;
  const zone = process.env.NEXT_PUBLIC_MONETAG_ZONE;

  if (!src || !zone) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        '[Monetag] Missing NEXT_PUBLIC_MONETAG_SRC or NEXT_PUBLIC_MONETAG_ZONE — ads will not load. Check .env',
      );
    }
    return;
  }

  st.loading = true;

  try {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.setAttribute('data-zone', zone);
    script.onload = () => {
      st.loaded = true;
      st.loading = false;
    };
    script.onerror = () => {
      st.loading = false;
      console.warn('[Monetag] Script failed to load (network or blocked). Will retry on next triggerMonetag.');
    };
    (document.body ?? document.documentElement).appendChild(script);
  } catch (err) {
    st.loading = false;
    console.warn('[Monetag] Failed to inject script:', err);
  }
}
