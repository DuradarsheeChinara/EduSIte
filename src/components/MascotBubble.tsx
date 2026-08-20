import type { SubjectId } from '@/types';
import { Mascot } from './Mascot';
import { WORLD_MAP } from '@/data/worlds';

interface MascotBubbleProps {
  subject: SubjectId;
  text: string;
  size?: number;
  position?: 'left' | 'right';
}

export function MascotBubble({ subject, text, size = 80, position = 'left' }: MascotBubbleProps) {
  const world = WORLD_MAP[subject];

  return (
    <div className={`flex gap-4 items-start ${position === 'right' ? 'flex-row-reverse' : ''}`}>
      <div className="flex-shrink-0 animate-float">
        <Mascot subject={subject} size={size} />
      </div>
      <div className={`relative ${position === 'left' ? 'ml-2' : 'mr-2'}`}>
        <div className="bg-white rounded-2xl p-4 card-shadow border-2 border-cream-300 max-w-md">
          <p className="text-sm font-semibold text-stone-700 mb-1">
            {world.mascotName} the {world.mascotSpecies}
          </p>
          <p className="text-stone-800 text-base leading-relaxed">{text}</p>
        </div>
        {position === 'left' ? (
          <div className="absolute -left-2 top-6 w-4 h-4 bg-white border-l-2 border-b-2 border-cream-300 rotate-45" />
        ) : (
          <div className="absolute -right-2 top-6 w-4 h-4 bg-white border-r-2 border-t-2 border-cream-300 rotate-45" />
        )}
      </div>
    </div>
  );
}
