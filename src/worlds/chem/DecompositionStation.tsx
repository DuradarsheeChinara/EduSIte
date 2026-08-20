import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DecompositionStationProps {
  onComplete: () => void;
}

type Step = 'idle' | 'heating' | 'breaking' | 'done';

export function DecompositionStation({ onComplete }: DecompositionStationProps) {
  const [step, setStep] = useState<Step>('idle');
  const [heatLevel, setHeatLevel] = useState(0);
  const [shake, setShake] = useState(false);

  const handleActivate = useCallback(() => {
    if (step !== 'idle') return;
    setStep('heating');

    let level = 0;
    const interval = setInterval(() => {
      level += 1;
      setHeatLevel(level);

      if (level >= 10) {
        clearInterval(interval);
        setStep('breaking');
        setShake(true);
        setTimeout(() => setShake(false), 600);
        setTimeout(() => {
          setStep('done');
          setTimeout(onComplete, 1800);
        }, 1200);
      }
    }, 150);
  }, [step, onComplete]);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-bold text-stone-800">Station 2: Decomposition</h3>
        <p className="text-sm text-stone-600 mt-0.5">
          Activate the heat control to break the compound apart
        </p>
      </div>

      <div className="flex justify-center">
        <div className="px-4 py-2 bg-terracotta-50 border-2 border-terracotta-300 rounded-xl">
          <p className="font-mono text-sm font-bold text-terracotta-800">CaCO₃ → CaO + CO₂</p>
        </div>
      </div>

      {/* Reaction chamber + collection containers */}
      <div className="flex justify-center">
        <svg width="280" height="200" viewBox="0 0 280 200">
          {/* Central chamber */}
          <motion.g animate={shake ? { x: [-3, 3, -3, 3, 0] } : {}} transition={{ duration: 0.4 }}>
            <rect x="100" y="30" width="80" height="70" rx="6" fill={step === 'done' ? '#FDF4F0' : '#FFFCF5'} stroke="#8F2F1F" strokeWidth="3" />
            {/* CaCO3 inside */}
            {step !== 'done' && (
              <motion.g
                animate={step === 'breaking' ? { y: [0, -3, 3, 0], opacity: [1, 0.5, 1] } : {}}
                transition={{ duration: 0.3, repeat: step === 'breaking' ? Infinity : 0 }}
              >
                <rect x="115" y="55" width="50" height="20" rx="4" fill="#E0745C" stroke="#8F2F1F" strokeWidth="1.5" />
                <text x="140" y="69" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">CaCO₃</text>
              </motion.g>
            )}
            {/* Heat glow */}
            {step === 'heating' && (
              <motion.g
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <ellipse cx="140" cy="100" rx="35" ry="8" fill="#F97316" opacity="0.5" />
                {[0, 1, 2].map((i) => (
                  <motion.circle
                    key={i}
                    cx={125 + i * 15} cy={95}
                    r="3" fill="#FB923C"
                    animate={{ y: [0, -20, -40], opacity: [1, 0.5, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </motion.g>
            )}
          </motion.g>

          {/* Heat control (flame icon) */}
          {step === 'idle' && (
            <motion.g
              onClick={handleActivate}
              className="cursor-pointer"
              whileHover={{ scale: 1.1 }}
            >
              <circle cx="140" cy="140" r="18" fill="#FED7AA" stroke="#EA580C" strokeWidth="2" />
              <path d="M 140 130 Q 136 136 138 140 Q 134 138 133 144 Q 135 150 140 150 Q 145 150 147 144 Q 146 138 142 140 Q 144 136 140 130" fill="#F97316" />
              <text x="140" y="175" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#9A3412">TAP TO HEAT</text>
            </motion.g>
          )}

          {/* Collection containers */}
          {/* Left: CaO */}
          <g>
            <rect x="20" y="120" width="50" height="50" rx="4" fill="white" stroke="#78716C" strokeWidth="2" />
            <text x="45" y="140" textAnchor="middle" fontSize="8" fill="#78716C">CaO</text>
            <AnimatePresence>
              {step === 'done' && (
                <motion.g
                  initial={{ x: 60, y: 60, opacity: 0 }}
                  animate={{ x: 0, y: 0, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <rect x="30" y="140" width="30" height="18" rx="3" fill="#A8A29E" stroke="#57534E" strokeWidth="1" />
                  <text x="45" y="152" textAnchor="middle" fontSize="9" fontWeight="bold" fill="white">CaO</text>
                </motion.g>
              )}
            </AnimatePresence>
          </g>
          {/* Right: CO2 */}
          <g>
            <rect x="210" y="120" width="50" height="50" rx="4" fill="white" stroke="#78716C" strokeWidth="2" />
            <text x="235" y="140" textAnchor="middle" fontSize="8" fill="#78716C">CO₂</text>
            <AnimatePresence>
              {step === 'done' && (
                <motion.g
                  initial={{ x: -60, y: 60, opacity: 0 }}
                  animate={{ x: 0, y: 0, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <circle cx="235" cy="150" r="12" fill="#99F6E4" stroke="#0F766E" strokeWidth="1.5" opacity="0.7" />
                  <text x="235" y="153" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#0F766E">CO₂</text>
                </motion.g>
              )}
            </AnimatePresence>
          </g>

          {/* Pipes from chamber to containers */}
          <path d="M 100 80 Q 70 80 70 120" fill="none" stroke={step === 'done' ? '#16A34A' : '#D4B565'} strokeWidth="2" strokeDasharray="3 2" />
          <path d="M 180 80 Q 210 80 210 120" fill="none" stroke={step === 'done' ? '#16A34A' : '#D4B565'} strokeWidth="2" strokeDasharray="3 2" />

          {/* Heat meter */}
          {step === 'heating' && (
            <g>
              <rect x="105" y="175" width="70" height="6" rx="3" fill="#F5ECD4" />
              <motion.rect
                x="105" y="175"
                width={heatLevel * 7}
                height="6" rx="3"
                fill="#F97316"
                animate={{ width: heatLevel * 7 }}
              />
            </g>
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
              ONE compound → simpler products
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
