import { motion } from 'framer-motion';
import type { SubjectId } from '@/types';
import { WORLD_MAP } from '@/data/worlds';
import { Mascot } from '@/components/Mascot';
import { BadgeIcon } from '@/components/BadgeIcon';
import { Star, BookOpen, Home } from 'lucide-react';

interface LearningSummaryProps {
  subject: SubjectId;
  score: number;
  maxScore: number;
  onReturnHome: () => void;
}

export function LearningSummary({ subject, score, maxScore, onReturnHome }: LearningSummaryProps) {
  const world = WORLD_MAP[subject];
  const isPerfect = score === maxScore;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: world.environment === 'garden' ? 'linear-gradient(135deg, #F0FDF4, #DCFCE7)'
          : world.environment === 'laboratory' ? 'linear-gradient(135deg, #FFF7ED, #FED7AA)'
          : world.environment === 'powerstation' ? 'linear-gradient(135deg, #FDF4F0, #FAE5DC)'
          : world.environment === 'council' ? 'linear-gradient(135deg, #EEF2FF, #E0E7FF)'
          : world.environment === 'workshop' ? 'linear-gradient(135deg, #F0FDFA, #CCFBF1)'
          : world.environment === 'bridge' ? 'linear-gradient(135deg, #FFF7ED, #FED7AA)'
          : 'linear-gradient(135deg, #F0FDFA, #CCFBF1)',
      }}
    >
      <div className="max-w-lg w-full">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-cream-300 text-center"
        >
          {/* Mascot celebrating */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex justify-center mb-3"
          >
            <Mascot subject={subject} size={120} />
          </motion.div>

          {/* Badge pop-in */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
            className="flex justify-center mb-4"
          >
            <BadgeIcon subject={subject} size={80} earned />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-2xl sm:text-3xl font-extrabold text-stone-800 mb-1"
          >
            Mission Complete!
          </motion.h2>
          <p className="text-stone-600 text-sm mb-3">
            {world.mascotName} says: "Thank you for your help!"
          </p>

          {/* Score */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="w-6 h-6 text-saffron-500 fill-saffron-500" />
            <span className="text-2xl font-extrabold text-stone-800">
              {score} / {maxScore}
            </span>
          </div>

          {isPerfect && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.9, type: 'spring' }}
              className="mb-4 p-2.5 bg-saffron-100 border-2 border-saffron-300 rounded-xl"
            >
              <p className="text-saffron-700 font-bold text-sm">Perfect Score! You're a true STEM Explorer!</p>
            </motion.div>
          )}

          {/* What You Learned */}
          <div className="text-left mb-5">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-bold text-stone-800">What You Learned</h3>
            </div>
            <ul className="space-y-1.5">
              {world.recap.map((item, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + idx * 0.1 }}
                  className="flex items-start gap-2 text-stone-700 text-sm leading-relaxed"
                >
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onReturnHome}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg hover:bg-indigo-700"
          >
            <Home className="w-5 h-5" />
            Return to Village Map
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
