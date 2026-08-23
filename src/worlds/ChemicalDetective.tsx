import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { World } from '@/types';
import { MissionShell } from '@/components/game/MissionShell';
import { LabStatus } from './chem/LabStatus';
import { CombinationStation } from './chem/CombinationStation';
import { DecompositionStation } from './chem/DecompositionStation';
import { DisplacementStation } from './chem/DisplacementStation';
import { DoubleDisplacementStation } from './chem/DoubleDisplacementStation';
import { ReactorActivation } from './chem/ReactorActivation';
import {
  REACTION_ORDER,
  STATION_META,
  HINTS,
  MASCOT_EXPLANATIONS,
  MASCOT_INTRO,
  type ReactionType,
  type StationMap,
} from './chem/types';

interface ChemicalDetectiveProps {
  world: World;
  onComplete: (score: number) => void;
  onExit: () => void;
}

type GamePhase = 'intro' | 'playing' | 'reactor' | 'complete';

const INITIAL_STATIONS: StationMap = {
  combination: { phase: 'active' },
  decomposition: { phase: 'locked' },
  displacement: { phase: 'locked' },
  'double-displacement': { phase: 'locked' },
};

export function ChemicalDetective({ world, onComplete, onExit }: ChemicalDetectiveProps) {
  const [phase, setPhase] = useState<GamePhase>('intro');
  const [stations, setStations] = useState<StationMap>(INITIAL_STATIONS);
  const [score, setScore] = useState(0);
  const [pointsTrigger, setPointsTrigger] = useState(0);
  const [mascotReaction, setMascotReaction] = useState<'idle' | 'happy' | 'sad'>('idle');
  const [mascotText, setMascotText] = useState(MASCOT_INTRO);
  const [currentReaction, setCurrentReaction] = useState<ReactionType>('combination');

  const totalStages = REACTION_ORDER.length;
  const maxScore = world.points;
  const completedCount = REACTION_ORDER.filter((r) => stations[r].phase === 'complete').length;
  const power = (completedCount / REACTION_ORDER.length) * 100;
  const reactorActive = phase === 'complete';

  const handleBegin = useCallback(() => {
    setPhase('playing');
  }, []);

  const handleStationComplete = useCallback(
    (reactionType: ReactionType) => {
      setStations((prev) => {
        const updated = { ...prev, [reactionType]: { phase: 'complete' as const } };
        const nextIdx = REACTION_ORDER.indexOf(reactionType) + 1;
        if (nextIdx < REACTION_ORDER.length) {
          const nextType = REACTION_ORDER[nextIdx];
          updated[nextType] = { phase: 'active' };
          setCurrentReaction(nextType);
        }
        return updated;
      });

      setScore((prev) => prev + 50);
      setPointsTrigger((prev) => prev + 1);
      setMascotReaction('happy');
      setMascotText(MASCOT_EXPLANATIONS[reactionType]);

      const isLast = REACTION_ORDER.indexOf(reactionType) === REACTION_ORDER.length - 1;
      if (isLast) {
        setTimeout(() => setPhase('reactor'), 2000);
      } else {
        setTimeout(() => setMascotReaction('idle'), 2000);
      }
    },
    []
  );

  const handleReactorDone = useCallback(() => {
    setPhase('complete');
    setMascotReaction('happy');
  }, []);

  const handleReturnHome = useCallback(() => {
    onComplete(score);
  }, [onComplete, score]);

  const currentHint = HINTS[currentReaction];
  const currentMeta = STATION_META[currentReaction];
  const currentStageNum = REACTION_ORDER.indexOf(currentReaction) + 1;

  // Reactor activation overlay
  if (phase === 'reactor') {
    return (
      <div className="min-h-screen relative overflow-hidden" style={{ background: 'transparent' }}>
        <div className="folk-border-top w-full relative z-30" />
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b-2 border-cream-200 px-3 py-2.5">
          <div className="flex items-center gap-3">
            <button
              onClick={onExit}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-cream-100 text-stone-600 font-semibold rounded-lg border border-cream-300 hover:bg-cream-200 transition-all text-xs"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Map
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-stone-800 truncate">{world.missionTitle}</p>
              <p className="text-xs text-stone-500">All stations repaired!</p>
            </div>
            <div className="flex items-center gap-1 bg-saffron-50 px-2.5 py-1.5 rounded-lg border border-saffron-200">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#F97316"><path d="M12 2L15 9H8L12 2Z" /><path d="M12 22L9 15H16L12 22Z" /></svg>
              <span className="text-sm font-extrabold text-saffron-700 tabular-nums">{score}</span>
            </div>
          </div>
        </div>
        <ReactorActivation onActivate={handleReactorDone} />
      </div>
    );
  }

  return (
    <MissionShell
      world={world}
      phase={phase === 'complete' ? 'complete' : phase === 'intro' ? 'intro' : 'playing'}
      currentStage={currentStageNum}
      totalStages={totalStages}
      score={score}
      maxScore={maxScore}
      mascotText={mascotText}
      mascotReaction={mascotReaction}
      hint={phase === 'playing' ? currentHint : undefined}
      pointsTrigger={pointsTrigger}
      onExit={onExit}
      onBegin={handleBegin}
      onComplete={handleReturnHome}
    >
      {phase === 'playing' && (
        <div className="space-y-4">
          {/* Lab status strip */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 border-2 border-cream-300 shadow-sm">
            <LabStatus stations={stations} power={power} reactorActive={false} />
          </div>

          {/* Current station interaction */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentReaction}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
            >
              {currentReaction === 'combination' && (
                <CombinationStation onComplete={() => handleStationComplete('combination')} />
              )}
              {currentReaction === 'decomposition' && (
                <DecompositionStation onComplete={() => handleStationComplete('decomposition')} />
              )}
              {currentReaction === 'displacement' && (
                <DisplacementStation onComplete={() => handleStationComplete('displacement')} />
              )}
              {currentReaction === 'double-displacement' && (
                <DoubleDisplacementStation onComplete={() => handleStationComplete('double-displacement')} />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Station label badge */}
          <div className="flex justify-center">
            <div className={`px-4 py-1.5 rounded-full border-2 ${currentMeta.accentBg} ${currentMeta.accentBorder}`}>
              <p className={`text-xs font-bold ${currentMeta.accentText}`}>
                {currentMeta.iconHint}
              </p>
            </div>
          </div>
        </div>
      )}
    </MissionShell>
  );
}
