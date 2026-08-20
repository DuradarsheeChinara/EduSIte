import { useState, useCallback } from 'react';
import type { Screen, SubjectId } from '@/types';
import { WORLD_MAP } from '@/data/worlds';
import { useProgress } from '@/hooks/useProgress';
import { VillageMap } from '@/screens/VillageMap';
import { MissionView } from '@/screens/MissionView';
import { CelebrationScreen } from '@/screens/CelebrationScreen';

function App() {
  const { progress, completeWorld, resetProgress } = useProgress();
  const [screen, setScreen] = useState<Screen>({ name: 'home' });

  const handleEnterWorld = useCallback((worldId: string) => {
    setScreen({ name: 'mission', worldId: worldId as SubjectId });
  }, []);

  const handleCompleteWorld = useCallback(
    (score: number, concepts: string[]) => {
      if (screen.name === 'mission') {
        completeWorld(screen.worldId, score, concepts);
      }
      setScreen({ name: 'home' });
    },
    [screen, completeWorld]
  );

  const handleExitMission = useCallback(() => {
    setScreen({ name: 'home' });
  }, []);

  const handleReset = useCallback(() => {
    resetProgress();
    setScreen({ name: 'home' });
  }, [resetProgress]);

  const handleCelebrate = useCallback(() => {
    setScreen({ name: 'celebration' });
  }, []);

  const handleReturnHome = useCallback(() => {
    setScreen({ name: 'home' });
  }, []);

  if (screen.name === 'home') {
    return (
      <VillageMap
        progress={progress}
        onEnterWorld={handleEnterWorld}
        onReset={handleReset}
        onCelebrate={handleCelebrate}
      />
    );
  }

  if (screen.name === 'mission') {
    const world = WORLD_MAP[screen.worldId];
    return (
      <MissionView
        world={world}
        onComplete={handleCompleteWorld}
        onExit={handleExitMission}
      />
    );
  }

  if (screen.name === 'celebration') {
    return (
      <CelebrationScreen
        progress={progress}
        onReturnHome={handleReturnHome}
        onReset={handleReset}
      />
    );
  }

  return null;
}

export default App;
