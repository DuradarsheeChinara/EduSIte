import type { GameProgress } from '@/types';
import { WORLDS } from '@/data/worlds';
import { MissionCard } from '@/components/MissionCard';
import { ProgressBar } from '@/components/ProgressBar';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { Trophy, RotateCcw, Sparkles, BookOpen, GraduationCap, Wrench, Scale } from 'lucide-react';
import { useState } from 'react';
import completionPercent from '../../UI icons[part e]/Completion percent.jpeg';

interface VillageMapProps {
  progress: GameProgress;
  onEnterWorld: (worldId: string) => void;
  onReset: () => void;
  onCelebrate: () => void;
}

const SDG_INFO = [
  {
    num: '4',
    title: 'Quality Education',
    desc: 'Ensure inclusive and equitable quality education',
    icon: GraduationCap,
    color: 'bg-forest-500',
    bg: 'bg-forest-50',
    border: 'border-forest-300',
  },
  {
    num: '9',
    title: 'Industry & Innovation',
    desc: 'Build resilient infrastructure, promote innovation',
    icon: Wrench,
    color: 'bg-saffron-500',
    bg: 'bg-saffron-50',
    border: 'border-saffron-300',
  },
  {
    num: '10',
    title: 'Reduced Inequalities',
    desc: 'Reduce inequality within and among countries',
    icon: Scale,
    color: 'bg-indigo-500',
    bg: 'bg-indigo-50',
    border: 'border-indigo-300',
  },
];

export function VillageMap({ progress, onEnterWorld, onReset, onCelebrate }: VillageMapProps) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const completedCount = Object.values(progress.worlds).filter((w) => w.completed).length;
  const overallProgress = Math.round((completedCount / WORLDS.length) * 100);
  const allComplete = completedCount === WORLDS.length;

  return (
    <div className="min-h-screen village-texture">
      <AnimatedBackground src="animated_backgroundhomepage.html" />
      {/* Decorative top border */}
      <div className="folk-border-top w-full" />

      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <header className="text-center mb-6">
          {/* Title with folk-art decorative elements */}
          <div className="relative inline-block">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Sparkles className="w-6 h-6 text-saffron-500" />
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-stone-800 text-shadow-md">
                STEM Yatra
              </h1>
              <Sparkles className="w-6 h-6 text-saffron-500" />
            </div>
            {/* Decorative dots under title */}
            <div className="flex justify-center gap-1.5 mb-2">
              {[...Array(7)].map((_, i) => (
                <span
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: ['#F97316', '#CC5238', '#4F46E5', '#16A34A', '#0D9488', '#E0745C', '#22C55E'][i],
                  }}
                />
              ))}
            </div>
          </div>
          <p className="text-base sm:text-lg text-stone-600 font-medium italic">
            Learn the concept. Solve the problem. Help the community.
          </p>
        </header>

        {/* Stats bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {/* Overall Progress */}
          <div className="bg-white rounded-2xl p-4 card-shadow border-2 border-cream-200">
            <div className="flex items-center gap-2 mb-2">
              <img src={completionPercent} alt="" className="w-5 h-5" />
              <span className="font-bold text-stone-700 text-sm">Overall Progress</span>
            </div>
            <ProgressBar current={completedCount} total={WORLDS.length} color="bg-gradient-to-r from-saffron-400 to-terracotta-500" />
            <p className="text-right text-2xl font-extrabold text-stone-800 mt-1">{overallProgress}%</p>
          </div>

          {/* Points */}
          <div className="bg-white rounded-2xl p-4 card-shadow border-2 border-cream-200">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              <span className="font-bold text-stone-700 text-sm">Total Points</span>
            </div>
            <p className="text-3xl font-extrabold text-indigo-600">{progress.totalPoints}</p>
            <p className="text-xs text-stone-500 mt-1">
              {progress.badges.length} badge{progress.badges.length !== 1 ? 's' : ''} earned
            </p>
          </div>

          {/* Reset / Celebrate */}
          <div className="bg-white rounded-2xl p-4 card-shadow border-2 border-cream-200 flex flex-col justify-center gap-2">
            {allComplete ? (
              <button
                onClick={onCelebrate}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-saffron-500 to-terracotta-500 text-white font-bold rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] text-sm"
              >
                <Trophy className="w-4 h-4" />
                View Celebration!
              </button>
            ) : (
              <div className="flex items-center justify-center gap-2 text-stone-500 text-sm font-medium">
                <BookOpen className="w-4 h-4" />
                {progress.conceptsLearned.length} concepts learned
              </div>
            )}
            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="flex items-center justify-center gap-1.5 px-3 py-2 text-stone-500 hover:text-terracotta-600 font-semibold rounded-xl border border-cream-200 hover:border-terracotta-300 transition-all text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Progress
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onReset();
                    setShowResetConfirm(false);
                  }}
                  className="flex-1 px-3 py-2 bg-terracotta-500 text-white font-bold rounded-xl text-xs hover:bg-terracotta-600 transition-all"
                >
                  Yes, Reset
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 px-3 py-2 bg-cream-200 text-stone-600 font-bold rounded-xl text-xs hover:bg-cream-300 transition-all"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* SDG Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {SDG_INFO.map((sdg) => {
            const Icon = sdg.icon;
            return (
              <div
                key={sdg.num}
                className={`flex items-center gap-3 p-3 rounded-2xl ${sdg.bg} border-2 ${sdg.border}`}
              >
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${sdg.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-stone-800 text-sm">SDG {sdg.num}: {sdg.title}</p>
                  <p className="text-xs text-stone-600 leading-snug">{sdg.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* World cards grid */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-stone-800 mb-1 text-center">
            Choose Your Adventure
          </h2>
          <p className="text-center text-stone-500 text-sm mb-4">
            Complete each world to unlock the next. Help the village with your STEM skills!
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {WORLDS.map((world, idx) => (
              <MissionCard
                key={world.id}
                world={world}
                progress={progress}
                index={idx}
                onEnter={() => onEnterWorld(world.id)}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-6">
          <div className="folk-border-bottom w-full mb-4" />
          <p className="text-sm text-stone-500 italic">
            A student-created CBSE Class X STEM learning prototype.
          </p>
        </footer>
      </div>
    </div>
  );
}
