import type { GameProgress } from '@/types';
import { WORLDS } from '@/data/worlds';
import { BadgeIcon } from '@/components/BadgeIcon';
import { Mascot } from '@/components/Mascot';
import { Trophy, Star, BookOpen, Home, RotateCcw, Sparkles } from 'lucide-react';

interface CelebrationScreenProps {
  progress: GameProgress;
  onReturnHome: () => void;
  onReset: () => void;
}

export function CelebrationScreen({ progress, onReturnHome, onReset }: CelebrationScreenProps) {
  const totalPossible = WORLDS.length * 100;
  const percentage = Math.round((progress.totalPoints / totalPossible) * 100);
  const isPerfect = progress.totalPoints === totalPossible;

  return (
    <div className="min-h-screen village-texture flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        <div className="bg-white rounded-3xl p-6 sm:p-10 card-shadow-lg border-2 border-cream-300 text-center animate-pop-in">
          {/* Trophy */}
          <div className="flex justify-center mb-4 animate-bounce-slow">
            <div className="relative">
              <div className="absolute inset-0 bg-saffron-300 blur-2xl rounded-full" />
              <Trophy className="w-20 h-20 text-saffron-500 relative z-10" />
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-800 mb-2">
            {isPerfect ? 'Perfect Journey!' : 'STEM Yatra Complete!'}
          </h1>
          <p className="text-stone-600 mb-6">
            You've helped the village with all seven STEM challenges. Here's your journey summary:
          </p>

          {/* Total Score */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <Star className="w-8 h-8 text-saffron-500 fill-saffron-500" />
            <span className="text-4xl font-extrabold text-stone-800">
              {progress.totalPoints}
            </span>
            <span className="text-xl text-stone-500 font-semibold">/ {totalPossible} points</span>
          </div>

          <div className="mb-6">
            <div className="w-full h-4 bg-cream-200 rounded-full overflow-hidden border border-cream-300">
              <div
                className="h-full bg-gradient-to-r from-saffron-400 via-terracotta-400 to-indigo-500 rounded-full transition-all duration-1000"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-lg font-bold text-stone-700 mt-2">{percentage}% Complete</p>
          </div>

          {/* All badges */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-stone-800 mb-4">Your Badges</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {WORLDS.map((world) => (
                <BadgeIcon
                  key={world.id}
                  subject={world.id}
                  size={70}
                  earned={progress.worlds[world.id].completed}
                  showLabel
                />
              ))}
            </div>
          </div>

          {/* Mascots row */}
          <div className="flex flex-wrap justify-center gap-2 mb-6 opacity-80">
            {WORLDS.map((world) => (
              <Mascot key={world.id} subject={world.id} size={50} />
            ))}
          </div>

          {/* Concepts learned */}
          <div className="text-left mb-6">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-bold text-stone-800">
                Concepts You Learned ({progress.conceptsLearned.length})
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto scrollbar-thin pr-2">
              {progress.conceptsLearned.map((concept, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 p-2.5 bg-cream-50 border border-cream-200 rounded-xl text-sm text-stone-700"
                >
                  <Sparkles className="w-4 h-4 text-saffron-500 flex-shrink-0 mt-0.5" />
                  <span>{concept}</span>
                </div>
              ))}
            </div>
          </div>

          {/* World scores breakdown */}
          <div className="text-left mb-6">
            <h3 className="text-lg font-bold text-stone-800 mb-3">World Scores</h3>
            <div className="space-y-2">
              {WORLDS.map((world) => {
                const wp = progress.worlds[world.id];
                return (
                  <div
                    key={world.id}
                    className="flex items-center justify-between p-2.5 bg-cream-50 border border-cream-200 rounded-xl"
                  >
                    <span className="text-sm font-semibold text-stone-700">{world.title}</span>
                    <span className="text-sm font-bold text-stone-800">
                      {wp.bestScore} / {world.points} pts
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onReturnHome}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg transition-all duration-200 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Home className="w-5 h-5" />
              Back to Map
            </button>
            <button
              onClick={onReset}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-cream-200 text-stone-600 font-bold rounded-2xl border-2 border-cream-300 transition-all duration-200 hover:bg-cream-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <RotateCcw className="w-5 h-5" />
              Start Over
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-stone-500 italic mt-6">
          A student-created CBSE Class X STEM learning prototype.
        </p>
      </div>
    </div>
  );
}
