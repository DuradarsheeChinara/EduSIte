import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HARVEST_VALUES, SORTED_VALUES, MEDIAN_VALUE, MODE_VALUE } from './types';

interface MedianModeStageProps {
  onComplete: () => void;
}

type Step = 'arrange' | 'arranging' | 'median' | 'mode' | 'done';

export function MedianModeStage({ onComplete }: MedianModeStageProps) {
  const [step, setStep] = useState<Step>('arrange');
  const [order, setOrder] = useState<number[]>(HARVEST_VALUES.map((_, i) => i));
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [medianFound, setMedianFound] = useState(false);
  const [modeFound, setModeFound] = useState(false);
  const [wrong, setWrong] = useState<number | null>(null);

  const handleArrange = useCallback(() => {
    setStep('arranging');
    const sortedIndices = HARVEST_VALUES.map((_, i) => i).sort((a, b) => HARVEST_VALUES[a] - HARVEST_VALUES[b]);
    setOrder(sortedIndices);
    setTimeout(() => {
      setStep('median');
    }, 1000);
  }, []);

  const handleItemClick = useCallback((idx: number) => {
    if (step === 'median' && !medianFound) {
      if (HARVEST_VALUES[idx] === MEDIAN_VALUE) {
        setMedianFound(true);
        setStep('mode');
      } else {
        setWrong(idx);
        setTimeout(() => setWrong(null), 500);
      }
    } else if (step === 'mode' && !modeFound) {
      if (HARVEST_VALUES[idx] === MODE_VALUE) {
        setModeFound(true);
        setStep('done');
        setTimeout(onComplete, 2000);
      } else {
        setWrong(idx);
        setTimeout(() => setWrong(null), 500);
      }
    }
  }, [step, medianFound, modeFound, onComplete]);

  const isSorted = step !== 'arrange' && step !== 'arranging';

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-bold text-stone-800">Stage 2: Median & Mode</h3>
        <p className="text-sm text-stone-600 mt-0.5">
          {step === 'arrange' ? 'Arrange the harvest values from smallest to largest' :
           step === 'median' ? 'Tap the MIDDLE value (median)' :
           step === 'mode' ? 'Tap the value that appears MOST often (mode)' :
           'Great work!'}
        </p>
      </div>

      {/* Harvest fields */}
      <div className="flex justify-center gap-3 flex-wrap py-2">
        {order.map((origIdx, pos) => {
          const value = HARVEST_VALUES[origIdx];
          const isMiddle = isSorted && pos === 2 && medianFound;
          const isRepeated = isSorted && value === MODE_VALUE && modeFound;
          const isWrong = wrong === origIdx;

          return (
            <motion.button
              key={origIdx}
              layout
              onClick={() => handleItemClick(origIdx)}
              animate={
                isWrong ? { x: [-5, 5, -5, 5, 0] } :
                isMiddle ? { scale: [1, 1.15, 1] } :
                isRepeated ? { scale: [1, 1.1, 1] } :
                { scale: 1 }
              }
              transition={{ duration: 0.4, type: 'spring' }}
              disabled={step === 'arrange' || step === 'arranging' || step === 'done'}
              className={`flex flex-col items-center p-2 rounded-2xl border-2 transition-all ${
                isMiddle
                  ? 'bg-indigo-200 border-indigo-500 ring-2 ring-indigo-300'
                  : isRepeated
                  ? 'bg-saffron-100 border-saffron-500 ring-2 ring-saffron-300'
                  : 'bg-white border-cream-300'
              } ${step === 'median' || step === 'mode' ? 'cursor-pointer hover:border-indigo-400' : ''}`}
            >
              {/* Crop field SVG */}
              <svg width="50" height="55" viewBox="0 0 50 55">
                <rect x="2" y="30" width="46" height="22" rx="3" fill="#9A6B3F" stroke="#7C2D12" strokeWidth="1" />
                {/* Plants */}
                {[0, 1, 2].map((p) => (
                  <g key={p}>
                    <line x1={10 + p * 12} y1="30" x2={10 + p * 12} y2={18} stroke="#15803D" strokeWidth="2" />
                    <ellipse cx={10 + p * 12} cy="16" rx="4" ry="3" fill="#22C55E" stroke="#15803D" strokeWidth="0.8" />
                  </g>
                ))}
                {/* Sun */}
                <circle cx="42" cy="8" r="4" fill="#FBBF24" opacity="0.6" />
              </svg>
              <span className="text-sm font-bold text-stone-700 mt-1">{value} kg</span>
            </motion.button>
          );
        })}
      </div>

      {/* Arrange button */}
      {step === 'arrange' && (
        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleArrange}
            className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg"
          >
            Arrange Smallest to Largest
          </motion.button>
        </div>
      )}

      {/* Labels */}
      <AnimatePresence>
        {medianFound && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-3 bg-indigo-50 border-2 border-indigo-300 rounded-2xl"
          >
            <p className="text-sm font-bold text-indigo-700">Median = {MEDIAN_VALUE}</p>
            <p className="text-xs text-stone-600 mt-0.5">The middle value after arranging the data</p>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {modeFound && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-3 bg-saffron-50 border-2 border-saffron-300 rounded-2xl"
          >
            <p className="text-sm font-bold text-saffron-700">Mode = {MODE_VALUE}</p>
            <p className="text-xs text-stone-600 mt-0.5">The value that appears most often</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
