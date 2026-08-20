import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DisplacementStationProps {
  onComplete: () => void;
}

type Step = 'idle' | 'inserting' | 'reacting' | 'done';

export function DisplacementStation({ onComplete }: DisplacementStationProps) {
  const [step, setStep] = useState<Step>('idle');
  const [feInserted, setFeInserted] = useState(false);
  const [feY, setFeY] = useState(0);
  const [showCu, setShowCu] = useState(false);

  const handleInsertFe = useCallback(() => {
    if (step !== 'idle') return;
    setStep('inserting');
    setFeInserted(true);

    let y = 0;
    const interval = setInterval(() => {
      y += 3;
      setFeY(y);
      if (y >= 30) {
        clearInterval(interval);
        setStep('reacting');
        setTimeout(() => setShowCu(true), 800);
        setTimeout(() => {
          setStep('done');
          setTimeout(onComplete, 1800);
        }, 2000);
      }
    }, 50);
  }, [step, onComplete]);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-bold text-stone-800">Station 3: Displacement</h3>
        <p className="text-sm text-stone-600 mt-0.5">
          Insert iron into the copper sulphate solution to displace copper
        </p>
      </div>

      <div className="flex justify-center">
        <div className="px-4 py-2 bg-indigo-50 border-2 border-indigo-300 rounded-xl">
          <p className="font-mono text-sm font-bold text-indigo-800">Fe + CuSO₄ → FeSO₄ + Cu</p>
        </div>
      </div>

      {/* Reaction vessel */}
      <div className="flex justify-center">
        <svg width="240" height="220" viewBox="0 0 240 220">
          {/* Vessel outline */}
          <path
            d="M 80 40 L 80 170 Q 80 190 100 190 L 140 190 Q 160 190 160 170 L 160 40"
            fill={step === 'done' ? '#E0E7FF' : '#DBEAFE'}
            stroke="#4338CA"
            strokeWidth="3"
          />
          {/* Vessel rim */}
          <rect x="75" y="34" width="90" height="8" rx="2" fill="#A5B4FC" stroke="#4338CA" strokeWidth="2" />

          {/* CuSO4 solution */}
          <motion.rect
            x="83" y="100" width="74" height="88" rx="4"
            fill={step === 'done' ? '#C7D2FE' : '#60A5FA'}
            opacity="0.5"
            animate={step === 'reacting' ? { fill: ['#60A5FA', '#A5B4FC', '#C7D2FE'] } : {}}
            transition={{ duration: 1.5 }}
          />
          <text x="120" y="120" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#3730A3">CuSO₄</text>

          {/* Fe piece (nail) */}
          {feInserted ? (
            <motion.g
              initial={{ y: -30 }}
              animate={{ y: feY }}
              transition={{ duration: 0.05 }}
            >
              <rect x="116" y="50" width="8" height="40" rx="2" fill="#78716C" stroke="#44403C" strokeWidth="1.5" />
              <circle cx="120" cy="48" r="5" fill="#78716C" stroke="#44403C" strokeWidth="1.5" />
              <text x="120" y="45" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#44403C">Fe</text>
            </motion.g>
          ) : (
            <motion.g
              onClick={handleInsertFe}
              className="cursor-pointer"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <rect x="116" y="10" width="8" height="40" rx="2" fill="#78716C" stroke="#44403C" strokeWidth="1.5" />
              <circle cx="120" cy="8" r="5" fill="#78716C" stroke="#44403C" strokeWidth="1.5" />
              <text x="120" y="5" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#44403C">Fe</text>
              <motion.text
                x="150" y="30" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#4338CA"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                TAP TO INSERT
              </motion.text>
            </motion.g>
          )}

          {/* Bubbles during reaction */}
          {step === 'reacting' && (
            <g>
              {[0, 1, 2, 3].map((i) => (
                <motion.circle
                  key={i}
                  cx={95 + i * 14} cy={150}
                  r="3" fill="#A5B4FC" opacity="0.6"
                  animate={{ y: [0, -60], opacity: [0.6, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </g>
          )}

          {/* Cu displaced (copper particles dropping out) */}
          <AnimatePresence>
            {showCu && (
              <motion.g
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <circle cx="120" cy="180" r="8" fill="#EA580C" stroke="#9A3412" strokeWidth="1.5" />
                <text x="120" y="183" textAnchor="middle" fontSize="8" fontWeight="bold" fill="white">Cu</text>
              </motion.g>
            )}
          </AnimatePresence>

          {/* FeSO4 label when done */}
          {step === 'done' && (
            <motion.g
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <rect x="95" y="130" width="50" height="20" rx="4" fill="#4F46E5" stroke="#3730A3" strokeWidth="1.5" />
              <text x="120" y="143" textAnchor="middle" fontSize="9" fontWeight="bold" fill="white">FeSO₄</text>
            </motion.g>
          )}

          {/* Output containers */}
          <g>
            <rect x="180" y="150" width="45" height="40" rx="4" fill="white" stroke="#78716C" strokeWidth="2" />
            <text x="202" y="175" textAnchor="middle" fontSize="8" fill="#78716C">FeSO₄</text>
          </g>
          <g>
            <rect x="15" y="150" width="45" height="40" rx="4" fill="white" stroke="#78716C" strokeWidth="2" />
            <text x="37" y="175" textAnchor="middle" fontSize="8" fill="#78716C">Cu</text>
          </g>
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
              One element replaces another in the compound
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
