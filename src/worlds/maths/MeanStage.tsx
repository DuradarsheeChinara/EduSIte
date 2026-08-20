import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HARVEST_VALUES, TOTAL_HARVEST, FIELD_COUNT, MEAN_VALUE } from './types';

interface MeanStageProps {
  onComplete: () => void;
}

type Step = 'collect' | 'combining' | 'total' | 'divide' | 'result';

export function MeanStage({ onComplete }: MeanStageProps) {
  const [step, setStep] = useState<Step>('collect');
  const [collected, setCollected] = useState<number[]>([]);
  const [runningTotal, setRunningTotal] = useState(0);
  const [meanInput, setMeanInput] = useState('');
  const [wrong, setWrong] = useState(false);

  const handleBasketClick = useCallback((idx: number) => {
    if (collected.includes(idx)) return;
    if (step !== 'collect') return;

    const value = HARVEST_VALUES[idx];
    const newCollected = [...collected, idx];
    setCollected(newCollected);
    setRunningTotal((prev) => prev + value);

    if (newCollected.length === HARVEST_VALUES.length) {
      setTimeout(() => setStep('total'), 800);
    }
  }, [collected, step]);

  const handleDivide = useCallback(() => {
    setStep('divide');
  }, []);

  const handleSubmit = useCallback(() => {
    const val = parseInt(meanInput);
    if (val === MEAN_VALUE) {
      setStep('result');
      setTimeout(onComplete, 2000);
    } else {
      setWrong(true);
      setTimeout(() => setWrong(false), 500);
    }
  }, [meanInput, onComplete]);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-bold text-stone-800">Stage 1: Understand the Harvest</h3>
        <p className="text-sm text-stone-600 mt-0.5">
          Tap each harvest basket to collect the data
        </p>
      </div>

      {/* Harvest baskets */}
      <div className="flex justify-center gap-3 flex-wrap py-2">
        {HARVEST_VALUES.map((value, idx) => {
          const isCollected = collected.includes(idx);
          return (
            <motion.button
              key={idx}
              onClick={() => handleBasketClick(idx)}
              disabled={isCollected || step !== 'collect'}
              whileHover={!isCollected && step === 'collect' ? { scale: 1.05, y: -3 } : {}}
              whileTap={!isCollected && step === 'collect' ? { scale: 0.95 } : {}}
              animate={isCollected ? { scale: 0.7, opacity: 0.3, y: -20 } : { scale: 1, opacity: 1 }}
              className="flex flex-col items-center"
            >
              {/* Basket SVG */}
              <svg width="60" height="65" viewBox="0 0 60 65">
                <path d="M 8 25 L 12 58 L 48 58 L 52 25 Z" fill="#D4B565" stroke="#9A3412" strokeWidth="2" />
                <ellipse cx="30" cy="25" rx="22" ry="6" fill="#E0C98A" stroke="#9A3412" strokeWidth="2" />
                {/* Grain inside */}
                <circle cx="22" cy="22" r="3" fill="#FBBF24" stroke="#9A3412" strokeWidth="0.5" />
                <circle cx="30" cy="20" r="3" fill="#FBBF24" stroke="#9A3412" strokeWidth="0.5" />
                <circle cx="38" cy="22" r="3" fill="#FBBF24" stroke="#9A3412" strokeWidth="0.5" />
                {/* Weave lines */}
                <path d="M 15 35 L 45 35" stroke="#9A3412" strokeWidth="0.8" opacity="0.4" />
                <path d="M 14 45 L 46 45" stroke="#9A3412" strokeWidth="0.8" opacity="0.4" />
              </svg>
              <span className="text-sm font-bold text-stone-700 mt-1">{value} kg</span>
            </motion.button>
          );
        })}
      </div>

      {/* Data collection panel */}
      <AnimatePresence>
        {collected.length > 0 && step !== 'result' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-4"
          >
            <p className="text-xs font-bold text-indigo-600 mb-2">Data Collection Panel</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {collected.map((idx) => (
                <motion.span
                  key={idx}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="px-3 py-1.5 bg-white rounded-lg border border-indigo-200 text-sm font-bold text-indigo-700"
                >
                  {HARVEST_VALUES[idx]}
                </motion.span>
              ))}
            </div>
            {step === 'total' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 text-center"
              >
                <p className="text-sm text-stone-600">Total Harvest</p>
                <motion.p
                  animate={{ scale: [1, 1.2, 1] }}
                  className="text-3xl font-extrabold text-indigo-700"
                >
                  {TOTAL_HARVEST}
                </motion.p>
                <p className="text-xs text-stone-500 mt-1">10 + 20 + 20 + 30 + 40 = {TOTAL_HARVEST}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDivide}
                  className="mt-3 px-5 py-2 bg-indigo-600 text-white font-bold rounded-xl shadow-md text-sm"
                >
                  Divide by {FIELD_COUNT} fields
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Division step */}
      {step === 'divide' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <div className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-4">
            <p className="text-sm text-stone-600">Total ÷ Number of fields</p>
            <p className="text-lg font-bold text-indigo-700">{TOTAL_HARVEST} ÷ {FIELD_COUNT} = ?</p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg font-bold text-stone-700">Mean =</span>
            <input
              type="number"
              value={meanInput}
              onChange={(e) => setMeanInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="?"
              className="w-20 px-3 py-2 text-center text-xl font-bold rounded-xl border-2 border-cream-300 bg-white focus:border-indigo-500 outline-none"
              aria-label="Mean value"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={!meanInput}
            animate={wrong ? { x: [-5, 5, -5, 5, 0] } : {}}
            className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg disabled:opacity-50"
          >
            Check Answer
          </motion.button>
        </motion.div>
      )}

      {/* Result */}
      {step === 'result' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-4 bg-forest-50 border-2 border-forest-300 rounded-2xl"
        >
          <p className="text-sm font-bold text-forest-700">
            Mean = {TOTAL_HARVEST} ÷ {FIELD_COUNT} = {MEAN_VALUE}
          </p>
          <p className="text-xs text-stone-600 mt-1">The average harvest per field is {MEAN_VALUE} kg</p>
          {/* Average marker visualization */}
          <div className="flex justify-center gap-2 mt-3">
            {HARVEST_VALUES.map((v, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-lg bg-white border-2 border-cream-300 flex items-center justify-center text-xs font-bold text-stone-600">
                  {v}
                </div>
                {v === MEAN_VALUE && (
                  <span className="text-[9px] text-forest-600 font-bold mt-0.5">avg</span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
