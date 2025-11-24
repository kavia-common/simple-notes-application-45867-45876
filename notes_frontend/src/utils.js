/**
 * Utility helpers for the notes app.
 */

// PUBLIC_INTERFACE
export function debounce(fn, wait = 300) {
  /** Create a debounced function to delay invoking fn until wait ms have elapsed. */
  let t = null;
  return function debounced(...args) {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

// PUBLIC_INTERFACE
export function formatRelativeTime(ts) {
  /** Format a timestamp into a simple relative time string. */
  const now = Date.now();
  const diff = Math.max(0, now - ts);
  const s = Math.floor(diff / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  const date = new Date(ts);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

// PUBLIC_INTERFACE
export function safeTitle(title) {
  /** Ensure we always show a usable title. */
  const t = (title || '').trim();
  return t.length ? t : 'Untitled';
}
