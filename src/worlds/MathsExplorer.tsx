import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { World } from '@/types';
import { MissionShell } from '@/components/game/MissionShell';
import { MeanStage } from './maths/MeanStage';
import { MedianModeStage } from './maths/MedianModeStage';
import { ProbabilityStage } from './maths/ProbabilityStage';
import { DecisionStage } from './maths/DecisionStage';
import { MASCOT_INTRO } from './maths/types';

interface MathsExplorerProps {
  world: World;
  onComplete: (score: number) => void;
  onExit: () => void;
}

type GamePhase = 'intro' | 'mean' | 'median' | 'probability' | 'decision' | 'complete';

const STAGE_TEXTS: Record<string, string> = {
  mean: 'Each field produced a different amount of grain. Collect the harvest data and find the mean!',
  median: 'Now arrange the harvest values from smallest to largest to find the median and mode.',
  probability: 'Let us test probability with water tokens! Draw a token from the bag and find the chance of getting red.',
  decision: 'Finally, look at the rainfall data. Which season should the village plant crops for the best harvest?',
};

const HINTS: Record<string, string> = {
  mean: 'Mean = sum of all values / number of values. Total = 10+20+20+30+40 = 120. Mean = 120 / 5 = 24',
  median: 'Arrange in order first: 10, 20, 20, 30, 40. The median is the MIDDLE value. The mode is the value that appears MOST.',
  probability: 'P(red) = number of red tokens / total tokens = 3 / 5 = 3/5',
  decision: 'Look at the rainfall bar chart. The monsoon season has the highest rainfall — best for planting!',
};

export function MathsExplorer({ world, onComplete, onExit }: MathsExplorerProps) {
  const [phase, setPhase] = useState<GamePhase>('intro');
  const [stage, setStage] = useState(0);
  const [score, setScore] = useState(0);
  const [pointsTrigger, setPointsTrigger] = useState(0);
  const [mascotReaction, setMascotReaction] = useState<'idle' | 'happy' | 'sad'>('idle');

  const totalStages = 4;
  const maxScore = world.points;

  const handleBegin = useCallback(() => {
    setPhase('mean');
    setStage(1);
  }, []);

  const handleStageComplete = useCallback((nextPhase: GamePhase, nextStage: number) => {
    setScore((prev) => prev + 50);
    setPointsTrigger((prev) => prev + 1);
    setMascotReaction('happy');
    setTimeout(() => {
      setPhase(nextPhase);
      setStage(nextStage);
      setMascotReaction('idle');
    }, 1500);
  }, []);

  const handleReturnHome = useCallback(() => {
    onComplete(score);
  }, [onComplete, score]);

  return (
    <MissionShell
      world={world}
      phase={phase === 'complete' ? 'complete' : phase === 'intro' ? 'intro' : 'playing'}
      currentStage={stage}
      totalStages={totalStages}
      score={score}
      maxScore={maxScore}
      mascotText={phase === 'intro' ? MASCOT_INTRO : STAGE_TEXTS[phase] || MASCOT_INTRO}
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
            {phase === 'mean' && (
              <MeanStage onComplete={() => handleStageComplete('median', 2)} />
            )}
            {phase === 'median' && (
              <MedianModeStage onComplete={() => handleStageComplete('probability', 3)} />
            )}
            {phase === 'probability' && (
              <ProbabilityStage onComplete={() => handleStageComplete('decision', 4)} />
            )}
            {phase === 'decision' && (
              <DecisionStage onComplete={() => {
                setScore((prev) => prev + 50);
                setPointsTrigger((prev) => prev + 1);
                setMascotReaction('happy');
                setTimeout(() => setPhase('complete'), 2500);
              }} />
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </MissionShell>
  );
}
