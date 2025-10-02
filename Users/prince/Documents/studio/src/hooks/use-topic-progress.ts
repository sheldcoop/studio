
'use client';

import { useState, useCallback } from 'react';

/**
 * A hook to manage and track user progress through a topic.
 * In a real application, this would sync with localStorage and/or a backend service.
 */
export function useTopicProgress(topicId: string, totalConcepts: number) {
  // For demonstration, we'll start with one concept completed if there are enough.
  const initialProgress = totalConcepts > 3 ? new Set(['la-vectors-vector-spaces-vector-basics']) : new Set<string>();
  const [progress, setProgress] = useState<Set<string>>(initialProgress);
  
  const markAsComplete = useCallback((subTopicId: string) => {
    setProgress(prev => {
        const newProgress = new Set(prev);
        newProgress.add(subTopicId);
        // In a real app:
        // localStorage.setItem(`progress-${topicId}`, JSON.stringify(Array.from(newProgress)));
        // api.saveProgress(topicId, newProgress);
        return newProgress;
    });
  }, [topicId]);
  
  const isCompleted = useCallback((id: string) => progress.has(id), [progress]);

  return {
    completedIds: progress,
    completedCount: progress.size,
    isCompleted,
    markAsComplete
  };
}
