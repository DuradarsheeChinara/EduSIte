import { useState, useEffect, useCallback } from 'react';
import type { GameProgress } from '@/types';
import { DEFAULT_PROGRESS, STORAGE_KEY } from '@/data/worlds';

export function useProgress() {
  const [progress, setProgress] = useState<GameProgress>(() => {
    if (typeof window === 'undefined') return DEFAULT_PROGRESS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as GameProgress;
        if (parsed.version === 1 && parsed.worlds) {
          return parsed;
        }
      }
    } catch {
      // fall through to default
    }
    return DEFAULT_PROGRESS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // storage might be full or unavailable
    }
  }, [progress]);

  const completeWorld = useCallback(
    (worldId: string, score: number, concepts: string[]) => {
      setProgress((prev) => {
        const worldKey = worldId as keyof typeof prev.worlds;
        const wasCompleted = prev.worlds[worldKey].completed;
        const newBestScore = Math.max(prev.worlds[worldKey].bestScore, score);

        const newBadges = wasCompleted
          ? prev.badges
          : [...prev.badges, worldKey];

        const newConcepts = [...prev.conceptsLearned];
        for (const c of concepts) {
          if (!newConcepts.includes(c)) {
            newConcepts.push(c);
          }
        }

        const worldScoreDelta = wasCompleted
          ? 0
          : score;

        return {
          ...prev,
          worlds: {
            ...prev.worlds,
            [worldKey]: {
              completed: true,
              score,
              bestScore: newBestScore,
              completedAt: new Date().toISOString(),
            },
          },
          totalPoints: prev.totalPoints + worldScoreDelta,
          badges: newBadges,
          conceptsLearned: newConcepts,
        };
      });
    },
    []
  );

  const resetProgress = useCallback(() => {
    setProgress(DEFAULT_PROGRESS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return { progress, completeWorld, resetProgress };
}
