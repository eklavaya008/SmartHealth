import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// React Router doesn't scroll to a URL hash on navigation by default; this restores that
// behavior for anchor links like /#symptom-checker used across the navbar and footer.
export default function ScrollToHash() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0 });
      return;
    }
    const id = hash.replace('#', '');
    const scroll = () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const timeout = setTimeout(scroll, 80);
    return () => clearTimeout(timeout);
  }, [hash, pathname]);

  return null;
}
