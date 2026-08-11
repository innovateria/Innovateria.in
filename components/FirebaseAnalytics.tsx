'use client';

import { useEffect, useRef } from 'react';
import { initAnalytics } from '@/lib/firebase';

export default function FirebaseAnalytics() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Delay initialization until window is fully idle to avoid Turbopack HMR and IndexedDB lock conflicts
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        initAnalytics().catch(() => {
          // Gracefully handled
        });
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return null;
}
