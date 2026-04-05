/**
 * Centralized Monetag ad loader utility.
 * Loads the Monetag script once per session when triggered.
 */

let monetagLoaded = false;

export function triggerMonetag(): void {
  if (typeof window === 'undefined') return;
  if (monetagLoaded) return;

  // NEXT_PUBLIC_ vars are inlined by Next.js at build time
  const src = process.env.NEXT_PUBLIC_MONETAG_SRC;
  const zone = process.env.NEXT_PUBLIC_MONETAG_ZONE;

  if (!src || !zone) {
    // Env vars not configured - skip silently
    console.debug('[Monetag] Env vars not configured, skipping ad load');
    return;
  }

  monetagLoaded = true;
  console.debug('[Monetag] Loading ad script...');

  try {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.setAttribute('data-zone', zone);
    document.body.appendChild(script);
  } catch (err) {
    console.warn('[Monetag] Failed to load ad script:', err);
  }
}
