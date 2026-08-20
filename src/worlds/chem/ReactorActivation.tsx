import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ReactorActivationProps {
  onActivate: () => void;
}

export function ReactorActivation({ onActivate }: ReactorActivationProps) {
  const [stage, setStage] = useState<'charging' | 'online' | 'ready'>('charging');

  useEffect(() => {
    const t1 = setTimeout(() => setStage('online'), 2000);
    const t2 = setTimeout(() => setStage('ready'), 3500);
    const t3 = setTimeout(onActivate, 4500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onActivate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #1E1B4B 0%, #312E81 50%, #1E1B4B 100%)' }}
    >
      {/* Stars / particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 3 + (i % 3) * 2,
            height: 3 + (i % 3) * 2,
            left: `${(i * 37) % 100}%`,
            top: `${(i * 53) % 100}%`,
            background: ['#FBBF24', '#F97316', '#4ADE80'][i % 3],
          }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: (i * 0.1) % 2 }}
        />
      ))}

      {/* Central reactor */}
      <div className="relative flex flex-col items-center">
        <motion.div
          animate={
            stage === 'charging'
              ? { scale: [1, 1.1, 1], rotate: [0, 180] }
              : stage === 'online'
              ? { scale: [1, 1.3, 1.2], rotate: [180, 360] }
              : { scale: 1.2, rotate: 360 }
          }
          transition={
            stage === 'charging'
              ? { duration: 2, ease: 'easeInOut' }
              : stage === 'online'
              ? { duration: 1.5, ease: 'easeOut' }
              : { duration: 4, repeat: Infinity, ease: 'linear' }
          }
        >
          <svg width="160" height="160" viewBox="0 0 160 160">
            {/* Outer ring */}
            <circle cx="80" cy="80" r="70" fill="none" stroke={stage === 'online' ? '#4ADE80' : '#F97316'} strokeWidth="3" strokeDasharray="6 4" opacity="0.6" />
            {/* Middle ring */}
            <circle cx="80" cy="80" r="50" fill="none" stroke={stage === 'online' ? '#22C55E' : '#FB923C'} strokeWidth="4" strokeDasharray="8 6" />
            {/* Core */}
            <motion.circle
              cx="80" cy="80" r="28"
              fill={stage === 'online' ? '#22C55E' : '#F97316'}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
            {/* Energy lines */}
            {[0, 45, 90, 135].map((angle) => {
              const rad = (angle * Math.PI) / 180;
              return (
                <line
                  key={angle}
                  x1={80 + Math.cos(rad) * 30}
                  y1={80 + Math.sin(rad) * 30}
                  x2={80 + Math.cos(rad) * 60}
                  y2={80 + Math.sin(rad) * 60}
                  stroke={stage === 'online' ? '#4ADE80' : '#FB923C'}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              );
            })}
          </svg>
        </motion.div>

        {/* Status text */}
        <AnimatePresence mode="wait">
          {stage === 'charging' && (
            <motion.p
              key="charging"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-lg font-bold text-saffron-300 mt-4"
            >
              Reactor charging...
            </motion.p>
          )}
          {stage === 'online' && (
            <motion.p
              key="online"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-xl font-extrabold text-forest-300 mt-4"
            >
              LABORATORY ONLINE!
            </motion.p>
          )}
          {stage === 'ready' && (
            <motion.p
              key="ready"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm font-bold text-white mt-4"
            >
              Preparing your badge...
            </motion.p>
          )}
        </AnimatePresence>

        {/* Power text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-sm font-bold text-white/70 mt-2"
        >
          Laboratory Power: 100%
        </motion.p>
      </div>

      {/* Confetti when online */}
      {stage !== 'charging' && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-sm"
              style={{
                left: `${(i * 31) % 100}%`,
                top: '-5%',
                background: ['#F97316', '#22C55E', '#4ADE80', '#FBBF24', '#A5B4FC'][i % 5],
              }}
              animate={{ y: ['0vh', '110vh'], rotate: [0, 360], opacity: [1, 1, 0] }}
              transition={{ duration: 2 + (i % 3), repeat: Infinity, delay: (i * 0.05) % 2, ease: 'easeIn' }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
