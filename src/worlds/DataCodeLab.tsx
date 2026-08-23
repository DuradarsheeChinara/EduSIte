import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { World } from '@/types';
import { MissionShell } from '@/components/game/MissionShell';
import { BuildAlgorithm } from './code/BuildAlgorithm';
import { RunProgram } from './code/RunProgram';
import { IfElseLogic } from './code/IfElseLogic';
import { DebugSystem } from './code/DebugSystem';
import { FinalAutomation } from './code/FinalAutomation';
import { MASCOT_INTRO, MASCOT_TEXTS } from './code/types';

interface DataCodeLabProps {
  world: World;
  onComplete: (score: number) => void;
  onExit: () => void;
}

type GamePhase = 'intro' | 'build' | 'run' | 'ifelse' | 'debug' | 'automation' | 'complete';

const HINTS: Record<string, string> = {
  build: 'Think logically: First check moisture, then decide if dry, then open valve, wait, then close valve.',
  run: 'Watch each step execute in order. The sensor checks, the control box decides, then water flows!',
  ifelse: 'IF moisture < 30% THEN start pump. ELSE keep pump off. Compare the sensor value to the threshold.',
  debug: 'The valve closes BEFORE the wait step! The crops never get water. Find the step that is out of order.',
};

export function DataCodeLab({ world, onComplete, onExit }: DataCodeLabProps) {
  const [phase, setPhase] = useState<GamePhase>('intro');
  const [stage, setStage] = useState(0);
  const [score, setScore] = useState(0);
  const [pointsTrigger, setPointsTrigger] = useState(0);
  const [mascotReaction, setMascotReaction] = useState<'idle' | 'happy' | 'sad'>('idle');

  const totalStages = 4;
  const maxScore = world.points;

  const handleBegin = useCallback(() => {
    setPhase('build');
    setStage(1);
  }, []);

  const handleStageComplete = useCallback(
    (nextPhase: GamePhase, nextStage: number) => {
      setScore((prev) => prev + 50);
      setPointsTrigger((prev) => prev + 1);
      setMascotReaction('happy');
      setTimeout(() => {
        setPhase(nextPhase);
        setStage(nextStage);
        setMascotReaction('idle');
      }, 1500);
    },
    []
  );

  const handleReturnHome = useCallback(() => {
    onComplete(score);
  }, [onComplete, score]);

  // Automation overlay
  if (phase === 'automation') {
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
              <p className="text-xs text-stone-500">All systems repaired!</p>
            </div>
            <div className="flex items-center gap-1 bg-saffron-50 px-2.5 py-1.5 rounded-lg border border-saffron-200">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#F97316"><path d="M12 2L15 9H8L12 2Z" /><path d="M12 22L9 15H16L12 22Z" /></svg>
              <span className="text-sm font-extrabold text-saffron-700 tabular-nums">{score}</span>
            </div>
          </div>
        </div>
        <FinalAutomation onActivate={() => setPhase('complete')} />
      </div>
    );
  }

  return (
    <MissionShell
      world={world}
      phase={phase === 'complete' ? 'complete' : phase === 'intro' ? 'intro' : 'playing'}
      currentStage={stage}
      totalStages={totalStages}
      score={score}
      maxScore={maxScore}
      mascotText={phase === 'intro' ? MASCOT_INTRO : MASCOT_TEXTS[phase] || MASCOT_INTRO}
      mascotReaction={mascotReaction}
      hint={phase !== 'intro' && phase !== 'complete' ? HINTS[phase] : undefined}
      pointsTrigger={pointsTrigger}
      onExit={onExit}
      onBegin={handleBegin}
      onComplete={handleReturnHome}
    >
      {phase !== 'intro' && phase !== 'complete' && (
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
          >
            {phase === 'build' && (
              <BuildAlgorithm onComplete={() => handleStageComplete('run', 2)} />
            )}
            {phase === 'run' && (
              <RunProgram onComplete={() => handleStageComplete('ifelse', 3)} />
            )}
            {phase === 'ifelse' && (
              <IfElseLogic onComplete={() => handleStageComplete('debug', 4)} />
            )}
            {phase === 'debug' && (
              <DebugSystem onComplete={() => {
                setScore((prev) => prev + 50);
                setPointsTrigger((prev) => prev + 1);
                setMascotReaction('happy');
                setTimeout(() => setPhase('automation'), 1500);
              }} />
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </MissionShell>
  );
}
