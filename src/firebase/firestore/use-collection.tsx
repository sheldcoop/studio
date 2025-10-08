
'use client';

import { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  type Query,
  type DocumentData,
  type FirestoreError,
} from 'firebase/firestore';
import { firestore } from '@/firebase';

export function useCollection<T>(collectionName: string) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    const collectionRef: Query<DocumentData> = query(
      collection(firestore, collectionName),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      collectionRef,
      (snapshot) => {
        const result: T[] = [];
        snapshot.forEach((doc) => {
          result.push({ id: doc.id, ...doc.data() } as T);
        });
        setData(result);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName]);

  return { data, loading, error };
}
