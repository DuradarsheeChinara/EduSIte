import type { World, GameProgress } from '@/types';
import { Mascot } from './Mascot';
import { Lock, CheckCircle2, Play, ArrowRight } from 'lucide-react';
import lockedGateImage from '../../mission state graphics[part f]/score_stts_door_lock_path.jpeg';
import completedGateImage from '../../mission state graphics[part f]/score_stts_perfect_correct.jpeg';
import unlockedGateImage from '../../mission state graphics[part f]/score_stts_retry_nxtmission.jpeg';

const MISSION_STATE_IMAGES = {
  locked: lockedGateImage,
  unlocked: unlockedGateImage,
  completed: completedGateImage,
};

interface MissionCardProps {
  world: World;
  progress: GameProgress;
  index: number;
  onEnter: () => void;
}

export function MissionCard({ world, progress, index, onEnter }: MissionCardProps) {
  const worldProgress = progress.worlds[world.id];
  const isCompleted = worldProgress.completed;
  const prerequisitesMet = world.prerequisites.every(
    (prereq) => progress.worlds[prereq].completed
  );
  const isLocked = !prerequisitesMet && !isCompleted;
  const missionState = isLocked ? 'locked' : isCompleted ? 'completed' : 'unlocked';

  const colorClasses: Record<string, { bg: string; border: string; text: string; gradient: string }> = {
    forest: {
      bg: 'bg-forest-50',
      border: 'border-forest-400',
      text: 'text-forest-700',
      gradient: 'from-forest-400 to-forest-600',
    },
    saffron: {
      bg: 'bg-saffron-50',
      border: 'border-saffron-400',
      text: 'text-saffron-700',
      gradient: 'from-saffron-400 to-saffron-600',
    },
    terracotta: {
      bg: 'bg-terracotta-50',
      border: 'border-terracotta-400',
      text: 'text-terracotta-700',
      gradient: 'from-terracotta-400 to-terracotta-600',
    },
    indigo: {
      bg: 'bg-indigo-50',
      border: 'border-indigo-400',
      text: 'text-indigo-700',
      gradient: 'from-indigo-400 to-indigo-600',
    },
    teal: {
      bg: 'bg-teal-50',
      border: 'border-teal-400',
      text: 'text-teal-700',
      gradient: 'from-teal-400 to-teal-600',
    },
  };

  const colors = colorClasses[world.accentColor] || colorClasses.forest;

  return (
    <div
      className={`relative rounded-3xl border-3 ${colors.border} ${colors.bg} p-5 card-shadow card-shadow-hover overflow-hidden transition-all duration-300 ${
        isLocked ? 'opacity-60 grayscale' : ''
      }`}
    >
      {/* World number badge */}
      <div
        className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-white font-bold text-sm shadow-md`}
      >
        {index + 1}
      </div>

      {/* SDG badge */}
      <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/80 backdrop-blur px-2 py-1 rounded-full text-[10px] font-bold text-stone-600 border border-cream-200">
        <span className="w-3 h-3 rounded-full bg-saffron-500" />
        SDG {world.sdg}
      </div>

      <div className="flex flex-col items-center text-center mt-8">
        {/* Mascot */}
        <div className={`relative ${!isLocked ? 'animate-float' : ''}`}>
          <Mascot subject={world.id} size={100} />
          {isCompleted && (
            <div className="absolute -bottom-1 -right-1 bg-forest-500 rounded-full p-1.5 border-2 border-white">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
          )}
          {isLocked && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-stone-700/70 rounded-full p-3">
                <Lock className="w-8 h-8 text-white" />
              </div>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className={`text-xl font-bold ${colors.text} mt-3`}>{world.title}</h3>
        <p className="text-xs text-stone-500 font-semibold mt-0.5">{world.subject}</p>
        <p className="text-sm text-stone-600 mt-2 leading-snug">{world.missionTitle}</p>

        {/* Status / Action button */}
        <div className="mt-4 w-full">
          <img
            src={MISSION_STATE_IMAGES[missionState]}
            alt=""
            className="mx-auto mb-2 h-16 w-24 object-contain"
          />
          {isLocked ? (
            <div className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-stone-200 text-stone-500 font-semibold rounded-xl text-sm">
              <Lock className="w-4 h-4" />
              Complete previous world
            </div>
          ) : isCompleted ? (
            <button
              onClick={onEnter}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-stone-700 font-bold rounded-xl border-2 border-cream-300 hover:border-cream-400 transition-all hover:scale-[1.02] active:scale-[0.98] text-sm"
            >
              <Play className="w-4 h-4" />
              Replay Mission
              <span className="ml-auto text-xs text-stone-500">
                {worldProgress.bestScore}/{world.points} pts
              </span>
            </button>
          ) : (
            <button
              onClick={onEnter}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r ${colors.gradient} text-white font-bold rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] text-sm`}
            >
              Start Mission
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
