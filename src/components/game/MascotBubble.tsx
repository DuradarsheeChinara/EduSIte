import { motion } from 'framer-motion';
import type { SubjectId } from '@/types';
import { WORLD_MAP } from '@/data/worlds';
import { Mascot } from '@/components/Mascot';
import { CheckCircle2, XCircle } from 'lucide-react';

interface MascotBubbleProps {
  subject: SubjectId;
  text: string;
  size?: number;
  reaction?: 'idle' | 'happy' | 'sad';
}

export function MascotBubble({ subject, text, size = 90, reaction = 'idle' }: MascotBubbleProps) {
  const world = WORLD_MAP[subject];

  const reactionEmoji = reaction === 'happy' ? '!' : reaction === 'sad' ? '?' : '';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="flex gap-3 items-start"
    >
      <motion.div
        animate={
          reaction === 'happy'
            ? { y: [0, -8, 0], rotate: [0, 5, 0] }
            : reaction === 'sad'
            ? { x: [0, -3, 3, 0] }
            : { y: [0, -4, 0] }
        }
        transition={{ duration: reaction === 'sad' ? 0.3 : 2, repeat: reaction === 'idle' ? Infinity : 0 }}
      >
        <Mascot subject={subject} size={size} />
      </motion.div>
      <div className="relative flex-1">
        <div className="bg-white rounded-2xl p-3 shadow-lg border-2 border-cream-300 max-w-sm">
          <p className="text-xs font-bold text-stone-500 mb-0.5">
            {world.mascotName} the {world.mascotSpecies}
          </p>
          <p className="text-stone-800 text-sm leading-relaxed">{text}</p>
        </div>
        <div className="absolute -left-2 top-5 w-3 h-3 bg-white border-l-2 border-b-2 border-cream-300 rotate-45" />
        {reactionEmoji && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold ${
              reaction === 'happy' ? 'bg-forest-500' : 'bg-terracotta-500'
            }`}
          >
            {reaction === 'happy' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
