import type { World } from '@/types';
import { Mascot } from './Mascot';
import { BadgeIcon } from './BadgeIcon';
import { Star, BookOpen, Home } from 'lucide-react';

interface CompletionScreenProps {
  world: World;
  score: number;
  onReturnHome: () => void;
}

export function CompletionScreen({ world, score, onReturnHome }: CompletionScreenProps) {
  const isPerfect = score === world.points;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 village-texture">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl p-8 card-shadow-lg border-2 border-cream-300 text-center animate-pop-in">
          {/* Celebration mascot */}
          <div className="flex justify-center mb-4 animate-bounce-slow">
            <Mascot subject={world.id} size={140} />
          </div>

          {/* Badge earned */}
          <div className="flex justify-center mb-4">
            <BadgeIcon subject={world.id} size={80} earned />
          </div>

          <h2 className="text-3xl font-bold text-stone-800 mb-2">Mission Complete!</h2>
          <p className="text-stone-600 mb-4">
            {world.mascotName} says: "Thank you for your help!"
          </p>

          {/* Score */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <Star className="w-6 h-6 text-saffron-500 fill-saffron-500" />
            <span className="text-2xl font-bold text-stone-800">
              {score} / {world.points} points
            </span>
          </div>

          {isPerfect && (
            <div className="mb-6 p-3 bg-saffron-100 border-2 border-saffron-300 rounded-xl">
              <p className="text-saffron-700 font-bold">Perfect Score! You're a true STEM Explorer!</p>
            </div>
          )}

          {/* What You Learned */}
          <div className="text-left mb-6">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-bold text-stone-800">What You Learned</h3>
            </div>
            <ul className="space-y-2">
              {world.recap.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-stone-700 text-sm leading-relaxed"
                >
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Return button */}
          <button
            onClick={onReturnHome}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg transition-all duration-200 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Home className="w-5 h-5" />
            Return to Village Map
          </button>
        </div>
      </div>
    </div>
  );
}
