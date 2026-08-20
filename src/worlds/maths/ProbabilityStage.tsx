import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PROBABILITY_BAG } from './types';

interface ProbabilityStageProps {
  onComplete: () => void;
}

type Step = 'ready' | 'drawing' | 'drawn' | 'selecting' | 'done';

const FRACTION_OPTIONS = ['3/5', '2/5', '3/2', '5/3'];

export function ProbabilityStage({ onComplete }: ProbabilityStageProps) {
  const [step, setStep] = useState<Step>('ready');
  const [drawnToken, setDrawnToken] = useState<'red' | 'blue' | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [wrong, setWrong] = useState<string | null>(null);
  const [drawCount, setDrawCount] = useState(0);

  const handleDraw = useCallback(() => {
    if (step !== 'ready') return;
    setStep('drawing');
    setTimeout(() => {
      setDrawnToken('red');
      setDrawCount(1);
      setStep('drawn');
      setTimeout(() => setStep('selecting'), 1000);
    }, 800);
  }, [step]);

  const handleAnswer = useCallback((answer: string) => {
    if (step !== 'selecting') return;
    setSelectedAnswer(answer);
    if (answer === '3/5') {
      setStep('done');
      setTimeout(onComplete, 2000);
    } else {
      setWrong(answer);
      setTimeout(() => {
        setWrong(null);
        setSelectedAnswer(null);
      }, 500);
    }
  }, [step, onComplete]);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-bold text-stone-800">Stage 3: Water Probability</h3>
        <p className="text-sm text-stone-600 mt-0.5">
          {step === 'ready' ? 'Tap the bag to draw a water token' :
           step === 'drawn' || step === 'drawing' ? 'Drawing a token...' :
           step === 'selecting' ? 'What is the probability of drawing a red token?' :
           'P(red) = 3/5'}
        </p>
      </div>

      {/* Resource bag */}
      <div className="flex justify-center py-2">
        <motion.div
          onClick={step === 'ready' ? handleDraw : undefined}
          whileHover={step === 'ready' ? { scale: 1.05 } : {}}
          whileTap={step === 'ready' ? { scale: 0.95 } : {}}
          className={step === 'ready' ? 'cursor-pointer' : ''}
        >
          <svg width="180" height="160" viewBox="0 0 180 160">
            {/* Bag */}
            <path d="M 45 35 L 35 140 L 145 140 L 135 35 Z" fill="#E0C98A" stroke="#9A3412" strokeWidth="2.5" />
            <ellipse cx="90" cy="35" rx="45" ry="9" fill="#D4B565" stroke="#9A3412" strokeWidth="2.5" />

            {/* Tokens inside */}
            {PROBABILITY_BAG.map((type) =>
              Array.from({ length: type.count }, (_, i) => {
                const isRed = type.color === 'red';
                const cx = isRed ? 55 + i * 18 : 65 + i * 18;
                const cy = 70 + (i % 2) * 22;
                return (
                  <motion.circle
                    key={`${type.color}-${i}`}
                    cx={cx}
                    cy={cy}
                    r="11"
                    fill={isRed ? '#E0745C' : '#818CF8'}
                    stroke="#9A3412"
                    strokeWidth="1.5"
                    animate={
                      step === 'done'
                        ? { y: [0, -15, 0], opacity: [1, 0.6, 1] }
                        : {}
                    }
                    transition={{ duration: 1.5, repeat: step === 'done' ? Infinity : 0, delay: i * 0.15 }}
                  />
                );
              })
            )}

            {/* Drawn token */}
            <AnimatePresence>
              {drawnToken && step !== 'ready' && (
                <motion.g
                  initial={{ y: 0, opacity: 0 }}
                  animate={{ y: -50, opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <circle cx="90" cy="20" r="12" fill="#E0745C" stroke="#9A3412" strokeWidth="2" />
                  <text x="90" y="24" textAnchor="middle" fontSize="8" fontWeight="bold" fill="white">RED</text>
                </motion.g>
              )}
            </AnimatePresence>

            {/* Tap hint */}
            {step === 'ready' && (
              <motion.text
                x="90" y="155" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#9A3412"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                TAP TO DRAW
              </motion.text>
            )}
          </svg>
        </motion.div>
      </div>

      {/* Token counts */}
      <div className="flex justify-center gap-4">
        <div className="flex items-center gap-2 bg-terracotta-50 px-3 py-2 rounded-xl border border-terracotta-200">
          <div className="w-4 h-4 rounded-full bg-terracotta-400" />
          <span className="text-sm font-bold text-stone-700">3 Red (Water Available)</span>
        </div>
        <div className="flex items-center gap-2 bg-indigo-50 px-3 py-2 rounded-xl border border-indigo-200">
          <div className="w-4 h-4 rounded-full bg-indigo-400" />
          <span className="text-sm font-bold text-stone-700">2 Blue (No Water)</span>
        </div>
      </div>

      {/* Visual fraction */}
      {step === 'selecting' || step === 'done' ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center items-center gap-3 py-2"
        >
          <div className="flex flex-col items-center">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="w-7 h-7 rounded-full bg-terracotta-400 border-2 border-terracotta-600"
                />
              ))}
            </div>
            <div className="w-24 h-0.5 bg-stone-400 mt-1" />
            <div className="flex gap-1 mt-1">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-7 h-7 rounded-full bg-terracotta-400 border-2 border-terracotta-600" />
              ))}
              {[0, 1].map((i) => (
                <div key={i} className="w-7 h-7 rounded-full bg-indigo-400 border-2 border-indigo-600" />
              ))}
            </div>
            <span className="text-xs font-bold text-stone-600 mt-1">3 red / 5 total</span>
          </div>
        </motion.div>
      ) : null}

      {/* Answer options */}
      {(step === 'selecting' || step === 'done') && (
        <div className="grid grid-cols-2 gap-3">
          {FRACTION_OPTIONS.map((answer) => (
            <motion.button
              key={answer}
              onClick={() => handleAnswer(answer)}
              disabled={step === 'done'}
              animate={wrong === answer ? { x: [-5, 5, -5, 5, 0] } : {}}
              transition={{ duration: 0.4 }}
              className={`p-4 rounded-2xl border-2 shadow-md font-bold text-lg transition-all ${
                step === 'done' && answer === '3/5'
                  ? 'bg-forest-50 border-forest-500 text-forest-700'
                  : 'bg-white border-cream-300 hover:border-indigo-300 text-stone-700'
              }`}
            >
              P(red) = {answer}
            </motion.button>
          ))}
        </div>
      )}

      {/* Result */}
      {step === 'done' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-3 bg-forest-50 border-2 border-forest-300 rounded-2xl"
        >
          <p className="text-sm font-bold text-forest-700">P(red) = 3/5 = 0.6 = 60%</p>
          <p className="text-xs text-stone-600 mt-0.5">There is a 60% chance of drawing a red water token</p>
        </motion.div>
      )}
    </div>
  );
}
