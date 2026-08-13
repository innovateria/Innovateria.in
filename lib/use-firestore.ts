'use client';

import { useState, useEffect } from 'react';
import { subscribeFirestoreCollection, subscribeFirestoreDoc } from '@/lib/firestore-db';

/**
 * Custom React Hook to subscribe to a Cloud Firestore Collection in real-time
 */
export function useFirestoreCollection<T>(collectionName: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeFirestoreCollection<T>(collectionName, (items) => {
      setData(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [collectionName]);

  return { data, loading };
}

/**
 * Custom React Hook to subscribe to a Cloud Firestore Document in real-time
 */
export function useFirestoreDocument<T>(collectionName: string, docId: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!docId) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeFirestoreDoc<T>(collectionName, docId, (item) => {
      setData(item);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [collectionName, docId]);

  return { data, loading };
}
