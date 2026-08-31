import { motion, AnimatePresence } from 'framer-motion';
import type { World } from '@/types';
import { ArrowLeft, Star } from 'lucide-react';
import { LearningSummary } from './LearningSummary';
import { FloatingPoints } from './FloatingPoints';
import { Mascot } from '@/components/Mascot';
import { MascotBubble } from './MascotBubble';
import { HintButton } from './HintButton';
import type { ReactNode } from 'react';

interface MissionShellProps {
  world: World;
  phase: 'intro' | 'playing' | 'complete';
  currentStage: number;
  totalStages: number;
  score: number;
  maxScore: number;
  mascotText: string;
  mascotReaction?: 'idle' | 'happy' | 'sad';
  hint?: string;
  pointsTrigger: number;
  onExit: () => void;
  onBegin: () => void;
  onComplete: () => void;
  children: ReactNode;
}

const envBackgrounds: Record<string, string> = {
  garden: 'linear-gradient(180deg, #BBF7D0 0%, #86EFAC 30%, #DCFCE7 60%, #F0FDF4 100%)',
  laboratory: 'linear-gradient(180deg, #FED7AA 0%, #FDBA74 25%, #FFEDD5 60%, #FFF7ED 100%)',
  powerstation: 'linear-gradient(180deg, #F4C7B5 0%, #ECA088 25%, #FAE5DC 60%, #FDF4F0 100%)',
  council: 'linear-gradient(180deg, #C7D2FE 0%, #A5B4FC 25%, #E0E7FF 60%, #EEF2FF 100%)',
  workshop: 'linear-gradient(180deg, #99F6E4 0%, #5EEAD4 25%, #CCFBF1 60%, #F0FDFA 100%)',
  bridge: 'linear-gradient(180deg, #FED7AA 0%, #FDBA74 25%, #FFEDD5 60%, #FFF7ED 100%)',
  irrigation: 'linear-gradient(180deg, #99F6E4 0%, #5EEAD4 25%, #CCFBF1 60%, #F0FDFA 100%)',
};

const accentBarMap: Record<string, string> = {
  forest: 'from-forest-400 to-forest-600',
  saffron: 'from-saffron-400 to-saffron-600',
  terracotta: 'from-terracotta-400 to-terracotta-600',
  indigo: 'from-indigo-400 to-indigo-600',
  teal: 'from-teal-400 to-teal-600',
};

const progressBarMap: Record<string, string> = {
  forest: 'bg-forest-500',
  saffron: 'bg-saffron-500',
  terracotta: 'bg-terracotta-500',
  indigo: 'bg-indigo-500',
  teal: 'bg-teal-500',
};

export function MissionShell({
  world,
  phase,
  currentStage,
  totalStages,
  score,
  maxScore,
  mascotText,
  mascotReaction = 'idle',
  hint,
  pointsTrigger,
  onExit,
  onBegin,
  onComplete,
  children,
}: MissionShellProps) {
  const bg = envBackgrounds[world.environment] || envBackgrounds.garden;
  const accentBar = accentBarMap[world.accentColor] || accentBarMap.forest;
  const progressBarColor = progressBarMap[world.accentColor] || progressBarMap.forest;

  if (phase === 'complete') {
    return <LearningSummary subject={world.id} score={score} maxScore={maxScore} onReturnHome={onComplete} />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'transparent' }}>
      {/* Decorative top border */}
      <div className="folk-border-top w-full relative z-30" />

      {/* Top HUD bar */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b-2 border-cream-200 px-3 py-2.5">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-cream-100 text-stone-600 font-semibold rounded-lg border border-cream-300 hover:bg-cream-200 transition-all text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Map
          </button>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-stone-800 truncate">{world.missionTitle}</p>
            {phase === 'playing' && (
              <p className="text-xs text-stone-500">Stage {currentStage} of {totalStages}</p>
            )}
          </div>

          {/* Score */}
          <div className="flex items-center gap-1 bg-saffron-50 px-2.5 py-1.5 rounded-lg border border-saffron-200">
            <Star className="w-4 h-4 text-saffron-500 fill-saffron-500" />
            <span className="text-sm font-extrabold text-saffron-700 tabular-nums">{score}</span>
          </div>
        </div>

        {/* Progress bar */}
        {phase === 'playing' && (
          <div className="mt-2 w-full h-2 bg-cream-200 rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${progressBarColor} rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${(currentStage / totalStages) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        )}
      </div>

      {/* Floating points animation */}
      <FloatingPoints points={50} trigger={pointsTrigger} />

      {/* Intro phase */}
      {phase === 'intro' && (
        <div className="max-w-2xl mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl p-6 shadow-xl border-2 border-cream-200"
          >
            <div className="flex justify-center mb-4">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <IntroMascot subject={world.id} />
              </motion.div>
            </div>

            <div className="bg-cream-50 rounded-2xl p-4 border-2 border-cream-200 mb-4">
              <p className="text-sm font-bold text-stone-500 mb-1">
                {world.mascotName} the {world.mascotSpecies}
              </p>
              <p className="text-stone-800 text-base leading-relaxed">{world.intro}</p>
            </div>

            <div className="space-y-1.5 mb-5">
              <div className="flex items-center gap-2 text-sm text-stone-600">
                <span className="w-2 h-2 rounded-full bg-saffron-500" />
                <span>{totalStages} interactive challenges</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-stone-600">
                <span className="w-2 h-2 rounded-full bg-forest-500" />
                <span>Earn up to {maxScore} points</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-stone-600">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                <span>Estimated time: 2-4 minutes</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onBegin}
              className={`w-full py-4 bg-gradient-to-r ${accentBar} text-white font-bold text-lg rounded-2xl shadow-lg`}
            >
              Begin Mission
            </motion.button>
          </motion.div>
        </div>
      )}

      {/* Playing phase */}
      {phase === 'playing' && (
        <div className="relative min-h-[calc(100vh-100px)]">
          {/* Mascot in corner */}
          <div className="absolute top-3 left-3 z-20 max-w-xs">
            <GameMascotBubble subject={world.id} text={mascotText} reaction={mascotReaction} />
          </div>

          {/* Hint button */}
          {hint && <HintOverlay hint={hint} accentColor={world.accentColor} />}

          {/* Game content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStage}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
              className="min-h-[calc(100vh-100px)] flex items-start justify-center p-4 pt-32 sm:pt-28"
            >
              <div className="w-full max-w-3xl">{children}</div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function IntroMascot({ subject }: { subject: World['id'] }) {
  return <Mascot subject={subject} size={130} />;
}

function GameMascotBubble({ subject, text, reaction }: { subject: World['id']; text: string; reaction: 'idle' | 'happy' | 'sad' }) {
  return <MascotBubble subject={subject} text={text} size={70} reaction={reaction} />;
}

function HintOverlay({ hint, accentColor }: { hint: string; accentColor: string }) {
  return <HintButton hint={hint} accentColor={accentColor} />;
}
