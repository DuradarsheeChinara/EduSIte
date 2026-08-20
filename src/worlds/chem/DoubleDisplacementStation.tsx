import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DoubleDisplacementProps {
  onComplete: () => void;
}

type Step = 'idle' | 'exchanging' | 'done';

interface Ion {
  id: string;
  label: string;
  color: string;
}

const LEFT_COMPOUND: { cation: Ion; anion: Ion; label: string } = {
  cation: { id: 'ag', label: 'Ag⁺', color: '#E0E7FF' },
  anion: { id: 'no3', label: 'NO₃⁻', color: '#A5B4FC' },
  label: 'AgNO₃',
};

const RIGHT_COMPOUND: { cation: Ion; anion: Ion; label: string } = {
  cation: { id: 'na', label: 'Na⁺', color: '#CCFBF1' },
  anion: { id: 'cl', label: 'Cl⁻', color: '#5EEAD4' },
  label: 'NaCl',
};

export function DoubleDisplacementStation({ onComplete }: DoubleDisplacementProps) {
  const [step, setStep] = useState<Step>('idle');
  const [exchanging, setExchanging] = useState(false);

  const handleExchange = useCallback(() => {
    if (step !== 'idle') return;
    setStep('exchanging');
    setExchanging(true);
    setTimeout(() => {
      setStep('done');
      setExchanging(false);
      setTimeout(onComplete, 1800);
    }, 2000);
  }, [step, onComplete]);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-bold text-stone-800">Station 4: Double Displacement</h3>
        <p className="text-sm text-stone-600 mt-0.5">
          Tap the exchange control to swap partners between the two compounds
        </p>
      </div>

      <div className="flex justify-center">
        <div className="px-4 py-2 bg-teal-50 border-2 border-teal-300 rounded-xl">
          <p className="font-mono text-sm font-bold text-teal-800">AgNO₃ + NaCl → AgCl + NaNO₃</p>
        </div>
      </div>

      {/* Reaction scene */}
      <div className="flex justify-center">
        <svg width="300" height="200" viewBox="0 0 300 200">
          {/* Left container: AgNO3 */}
          <g>
            <rect x="20" y="40" width="80" height="100" rx="6" fill="white" stroke="#4338CA" strokeWidth="2.5" />
            <text x="60" y="35" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#3730A3">AgNO₃</text>
            {/* Ag+ ion */}
            <motion.g
              animate={
                exchanging
                  ? { x: [0, 140, 140], y: [0, 0, 0] }
                  : step === 'done'
                  ? { x: 140 }
                  : {}
              }
              transition={{ duration: 1.5 }}
            >
              <circle cx="40" cy="80" r="14" fill={LEFT_COMPOUND.cation.color} stroke="#4338CA" strokeWidth="1.5" />
              <text x="40" y="84" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#3730A3">Ag⁺</text>
            </motion.g>
            {/* NO3- ion */}
            <motion.g
              animate={
                exchanging
                  ? { x: [0, -100, -100], y: [0, 20, 20] }
                  : step === 'done'
                  ? { x: -100, y: 20 }
                  : {}
              }
              transition={{ duration: 1.5 }}
            >
              <circle cx="80" cy="110" r="14" fill={LEFT_COMPOUND.anion.color} stroke="#4338CA" strokeWidth="1.5" />
              <text x="80" y="114" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#3730A3">NO₃⁻</text>
            </motion.g>
          </g>

          {/* Right container: NaCl */}
          <g>
            <rect x="200" y="40" width="80" height="100" rx="6" fill="white" stroke="#0F766E" strokeWidth="2.5" />
            <text x="240" y="35" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0F766E">NaCl</text>
            {/* Na+ ion */}
            <motion.g
              animate={
                exchanging
                  ? { x: [0, -100, -100], y: [0, 0, 0] }
                  : step === 'done'
                  ? { x: -100 }
                  : {}
              }
              transition={{ duration: 1.5 }}
            >
              <circle cx="220" cy="80" r="14" fill={RIGHT_COMPOUND.cation.color} stroke="#0F766E" strokeWidth="1.5" />
              <text x="220" y="84" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#0F766E">Na⁺</text>
            </motion.g>
            {/* Cl- ion */}
            <motion.g
              animate={
                exchanging
                  ? { x: [0, 140, 140], y: [0, 20, 20] }
                  : step === 'done'
                  ? { x: 140, y: 20 }
                  : {}
              }
              transition={{ duration: 1.5 }}
            >
              <circle cx="260" cy="110" r="14" fill={RIGHT_COMPOUND.anion.color} stroke="#0F766E" strokeWidth="1.5" />
              <text x="260" y="114" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#0F766E">Cl⁻</text>
            </motion.g>
          </g>

          {/* Exchange arrows */}
          {exchanging && (
            <g>
              <motion.path
                d="M 60 80 Q 150 50 220 80"
                fill="none" stroke="#F97316" strokeWidth="2" strokeDasharray="4 3"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5 }}
              />
              <motion.path
                d="M 240 110 Q 150 140 80 110"
                fill="none" stroke="#F97316" strokeWidth="2" strokeDasharray="4 3"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5 }}
              />
            </g>
          )}

          {/* Products when done */}
          {step === 'done' && (
            <motion.g
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* AgCl precipitate */}
              <rect x="20" y="160" width="80" height="30" rx="4" fill="#F5ECD4" stroke="#9A3412" strokeWidth="2" />
              <text x="60" y="180" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#9A3412">AgCl ↓</text>
              {/* Precipitate particles */}
              {[0, 1, 2].map((i) => (
                <motion.circle
                  key={i}
                  cx={35 + i * 15} cy={175}
                  r="2" fill="#D4B565"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
              {/* NaNO3 */}
              <rect x="200" y="160" width="80" height="30" rx="4" fill="#F0FDFA" stroke="#0F766E" strokeWidth="2" />
              <text x="240" y="180" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0F766E">NaNO₃</text>
            </motion.g>
          )}

          {/* Exchange button */}
          {step === 'idle' && (
            <motion.g
              onClick={handleExchange}
              className="cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <circle cx="150" cy="100" r="22" fill="#FED7AA" stroke="#EA580C" strokeWidth="2" />
              <path d="M 138 95 L 162 95 M 158 91 L 162 95 L 158 99" fill="none" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 162 105 L 138 105 M 142 101 L 138 105 L 142 109" fill="none" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <text x="150" y="140" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#9A3412">TAP TO EXCHANGE</text>
            </motion.g>
          )}
        </svg>
      </div>

      <AnimatePresence>
        {step === 'done' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-3 bg-forest-50 border-2 border-forest-300 rounded-2xl"
          >
            <p className="text-sm font-bold text-forest-700">
              Two compounds exchange partners
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
