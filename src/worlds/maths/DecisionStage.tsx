import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SEASONS } from './types';

interface DecisionStageProps {
  onComplete: () => void;
}

type Step = 'choosing' | 'watering' | 'done';

export function DecisionStage({ onComplete }: DecisionStageProps) {
  const [step, setStep] = useState<Step>('choosing');
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [wrong, setWrong] = useState<string | null>(null);
  const [waterFlowing, setWaterFlowing] = useState(false);

  const handleFieldSelect = useCallback((id: string) => {
    if (step !== 'choosing') return;
    if (id === 'monsoon') {
      setSelectedField(id);
      setStep('watering');
      setWaterFlowing(true);
      setTimeout(() => {
        setStep('done');
        setTimeout(onComplete, 2500);
      }, 2500);
    } else {
      setWrong(id);
      setTimeout(() => setWrong(null), 500);
    }
  }, [step, onComplete]);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-bold text-stone-800">Stage 4: Use the Data</h3>
        <p className="text-sm text-stone-600 mt-0.5">
          {step === 'choosing' ? 'Which season should the village plant crops for the best harvest?' :
           step === 'watering' ? 'Water flowing to the fields...' :
           'Harvest plan complete!'}
        </p>
      </div>

      {/* Rainfall bar chart */}
      <div className="flex justify-center items-end gap-3 sm:gap-4 py-4 h-36">
        {SEASONS.map((season, idx) => {
          const isSelected = selectedField === season.id;
          const isWrong = wrong === season.id;
          return (
            <motion.button
              key={season.id}
              onClick={() => handleFieldSelect(season.id)}
              disabled={step !== 'choosing'}
              animate={isWrong ? { x: [-5, 5, -5, 5, 0] } : {}}
              whileHover={step === 'choosing' ? { scale: 1.05, y: -3 } : {}}
              whileTap={step === 'choosing' ? { scale: 0.95 } : {}}
              className="flex flex-col items-center gap-1"
            >
              <span className="text-[10px] sm:text-xs font-bold text-stone-600">{season.rainfall}mm</span>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: season.rainfall }}
                transition={{ delay: idx * 0.15, duration: 0.5, type: 'spring' }}
                className={`w-10 sm:w-12 ${season.color} rounded-t-lg border-2 ${
                  isSelected ? 'border-forest-500 ring-2 ring-forest-300' : 'border-cream-200'
                } ${step === 'choosing' ? 'cursor-pointer' : ''}`}
              />
              <span className={`text-xs font-semibold ${isSelected ? 'text-forest-700' : 'text-stone-700'}`}>
                {season.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Village field scene */}
      <AnimatePresence>
        {(step === 'watering' || step === 'done') && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-forest-50 border-2 border-forest-300 rounded-2xl p-4"
          >
            <svg width="100%" height="120" viewBox="0 0 300 120" className="max-w-sm mx-auto">
              {/* Water tank */}
              <rect x="10" y="10" width="40" height="35" rx="4" fill="#818CF8" stroke="#4338CA" strokeWidth="2" />
              <text x="30" y="30" textAnchor="middle" fontSize="7" fontWeight="bold" fill="white">TANK</text>

              {/* Irrigation pipe */}
              <line x1="50" y1="45" x2="150" y2="45" stroke="#6B7280" strokeWidth="4" />

              {/* Water flowing */}
              {waterFlowing && (
                <motion.circle
                  cx="60" cy="45" r="3" fill="#3B82F6"
                  animate={{ x: [0, 80], opacity: [1, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}

              {/* Fields with crops */}
              {[0, 1, 2].map((i) => (
                <g key={i}>
                  <rect x={80 + i * 55} y="55" width="45" height="50" rx="3" fill="#9A6B3F" stroke="#7C2D12" strokeWidth="1.5" />
                  {/* Plants growing */}
                  {[0, 1, 2].map((p) => (
                    <motion.g key={p}>
                      <line x1={88 + i * 55 + p * 12} y1="55" x2={88 + i * 55 + p * 12} y2={step === 'done' ? 35 : 45} stroke="#15803D" strokeWidth="2" />
                      <ellipse
                        cx={88 + i * 55 + p * 12}
                        cy={step === 'done' ? 33 : 43}
                        rx="4" ry="3"
                        fill={step === 'done' ? '#22C55E' : '#86EFAC'}
                        stroke="#15803D" strokeWidth="0.8"
                      />
                    </motion.g>
                  ))}
                </g>
              ))}

              {/* Sun */}
              <motion.circle
                cx="270" cy="15" r="8" fill="#FBBF24"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result */}
      {step === 'done' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-3 bg-forest-50 border-2 border-forest-300 rounded-2xl"
        >
          <p className="text-sm font-bold text-forest-700">
            Correct! Monsoon season has the highest rainfall (80mm) — perfect for planting!
          </p>
          <p className="text-xs text-stone-600 mt-1">Data helps us make better decisions for the village</p>
        </motion.div>
      )}
    </div>
  );
}
