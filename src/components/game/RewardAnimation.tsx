import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface RewardAnimationProps {
  trigger: number;
}

export function RewardAnimation({ trigger }: RewardAnimationProps) {
  if (trigger <= 0) return null;

  const particles = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
      {particles.map((i) => {
        const angle = (i / particles.length) * Math.PI * 2;
        const distance = 80 + Math.random() * 60;
        return (
          <motion.div
            key={`${trigger}-${i}`}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
            animate={{
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance,
              opacity: 0,
              scale: 1,
            }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute"
          >
            <Star className="w-5 h-5 text-saffron-400 fill-saffron-400" />
          </motion.div>
        );
      })}
    </div>
  );
}
