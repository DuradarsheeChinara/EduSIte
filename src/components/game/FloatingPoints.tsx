import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface FloatingPointsProps {
  points: number;
  trigger: number;
}

export function FloatingPoints({ points, trigger }: FloatingPointsProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (trigger > 0) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 0, scale: 0.5 }}
          animate={{ opacity: 1, y: -60, scale: 1.2 }}
          exit={{ opacity: 0, y: -100, scale: 0.8 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="pointer-events-none fixed left-1/2 top-1/3 -translate-x-1/2 z-50"
        >
          <span className="text-4xl font-extrabold text-saffron-500 drop-shadow-lg">
            +{points}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
