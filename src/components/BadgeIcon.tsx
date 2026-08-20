import type { SubjectId } from '@/types';
import { WORLD_MAP } from '@/data/worlds';
import { Mascot } from './Mascot';
import { Award } from 'lucide-react';

interface BadgeIconProps {
  subject: SubjectId;
  size?: number;
  earned?: boolean;
  showLabel?: boolean;
}

export function BadgeIcon({ subject, size = 64, earned = true, showLabel = false }: BadgeIconProps) {
  const world = WORLD_MAP[subject];

  const colorMap: Record<string, string> = {
    forest: earned ? 'bg-forest-100 border-forest-500' : 'bg-cream-100 border-cream-300',
    saffron: earned ? 'bg-saffron-100 border-saffron-500' : 'bg-cream-100 border-cream-300',
    terracotta: earned ? 'bg-terracotta-100 border-terracotta-500' : 'bg-cream-100 border-cream-300',
    indigo: earned ? 'bg-indigo-100 border-indigo-500' : 'bg-cream-100 border-cream-300',
    teal: earned ? 'bg-teal-100 border-teal-500' : 'bg-cream-100 border-cream-300',
  };

  const badgeColor = colorMap[world.accentColor] || colorMap.forest;

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`relative rounded-full p-1.5 border-3 ${badgeColor} transition-all duration-300 ${
          earned ? 'card-shadow' : 'opacity-40 grayscale'
        }`}
        style={{ width: size, height: size }}
      >
        {earned && (
          <div className="absolute -top-1 -right-1 bg-saffron-500 rounded-full p-1 border-2 border-cream-50">
            <Award className="w-4 h-4 text-white" />
          </div>
        )}
        <Mascot subject={subject} size={size - 12} className="mx-auto" />
      </div>
      {showLabel && (
        <div className="text-center">
          <p className="text-xs font-bold text-stone-700">{world.mascotName}</p>
          <p className="text-[10px] text-stone-500">{world.subject}</p>
        </div>
      )}
    </div>
  );
}
