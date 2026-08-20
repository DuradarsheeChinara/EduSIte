import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COMMANDS, CORRECT_SEQUENCE } from './types';

interface RunProgramProps {
  onComplete: () => void;
}

type RunState = 'idle' | 'running' | 'complete';

const STEP_LABELS = [
  'Sensor checking soil...',
  'Evaluating: Is soil dry?',
  'Opening water valve...',
  'Watering crops (10 min)...',
  'Closing water valve...',
];

export function RunProgram({ onComplete }: RunProgramProps) {
  const [state, setState] = useState<RunState>('idle');
  const [activeStep, setActiveStep] = useState(-1);
  const [moisture, setMoisture] = useState(0);
  const [valveOpen, setValveOpen] = useState(false);
  const [cropsHealthy, setCropsHealthy] = useState(false);

  const handleRun = useCallback(() => {
    if (state !== 'idle') return;
    setState('running');
    setActiveStep(0);

    CORRECT_SEQUENCE.forEach((_, idx) => {
      setTimeout(() => {
        setActiveStep(idx);
        if (idx === 0) setMoisture(20);
        if (idx === 1) setMoisture(20);
        if (idx === 2) setValveOpen(true);
        if (idx === 3) {
          setMoisture((m) => Math.min(m + 5, 80));
        }
        if (idx === 4) {
          setValveOpen(false);
          setCropsHealthy(true);
        }
        if (idx === CORRECT_SEQUENCE.length - 1) {
          setTimeout(() => {
            setState('complete');
            setTimeout(onComplete, 1500);
          }, 1000);
        }
      }, idx * 1000);
    });
  }, [state, onComplete]);

  // Animate moisture during watering
  useEffect(() => {
    if (activeStep === 3) {
      const interval = setInterval(() => {
        setMoisture((m) => Math.min(m + 3, 75));
      }, 200);
      return () => clearInterval(interval);
    }
  }, [activeStep]);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-bold text-stone-800">Stage 2: Run the Program</h3>
        <p className="text-sm text-stone-600 mt-0.5">
          {state === 'idle' ? 'Press RUN to execute the irrigation algorithm' :
           state === 'running' ? STEP_LABELS[activeStep] || 'Running...' :
           'Irrigation complete! Crops are healthy.'}
        </p>
      </div>

      {/* System visualization */}
      <div className="flex justify-center">
        <svg width="300" height="180" viewBox="0 0 300 180">
          {/* Soil sensor */}
          <rect x="10" y="100" width="40" height="30" rx="4" fill={activeStep >= 0 ? '#4F46E5' : '#A5B4FC'} stroke="#3730A3" strokeWidth="2" />
          <text x="30" y="118" textAnchor="middle" fontSize="7" fontWeight="bold" fill="white">SENSOR</text>
          {activeStep >= 0 && (
            <motion.text x="30" y="145" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#4F46E5"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            >
              {moisture}%
            </motion.text>
          )}

          {/* Control box */}
          <rect x="65" y="90" width="50" height="40" rx="4" fill={activeStep >= 1 ? '#0D9488' : '#5EEAD4'} stroke="#0F766E" strokeWidth="2" />
          <text x="90" y="113" textAnchor="middle" fontSize="7" fontWeight="bold" fill="white">CONTROL</text>

          {/* Decision diamond */}
          {activeStep >= 1 && (
            <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ transformOrigin: '150px 70px' }}>
              <polygon points="150,50 170,70 150,90 130,70" fill="#FFEDD5" stroke="#F97316" strokeWidth="2" />
              <text x="150" y="73" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#9A3412">DRY?</text>
            </motion.g>
          )}
          {activeStep >= 2 && (
            <motion.text x="150" y="45" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#22C55E"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            >
              YES
            </motion.text>
          )}

          {/* Valve */}
          <circle cx="200" cy="105" r="12" fill={valveOpen ? '#22C55E' : '#D4B565'} stroke="#4B5563" strokeWidth="2" />
          <text x="200" y="108" textAnchor="middle" fontSize="7" fontWeight="bold" fill={valveOpen ? 'white' : '#4B5563'}>
            {valveOpen ? 'OPEN' : 'CLOSED'}
          </text>

          {/* Pipe */}
          <line x1="115" y1="105" x2="188" y2="105" stroke="#6B7280" strokeWidth="4" />
          <line x1="212" y1="105" x2="260" y2="105" stroke="#6B7280" strokeWidth="4" />

          {/* Water flow */}
          {valveOpen && (
            <motion.circle cx="215" cy="105" r="3" fill="#3B82F6"
              animate={{ x: [0, 40], opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          )}

          {/* Crops */}
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <line x1={245 + i * 12} y1="105" x2={245 + i * 12} y2={cropsHealthy ? 75 : 90} stroke="#15803D" strokeWidth="2" />
              <ellipse
                cx={245 + i * 12}
                cy={cropsHealthy ? 73 : 88}
                rx="4" ry="3"
                fill={cropsHealthy ? '#22C55E' : '#86EFAC'}
                stroke="#15803D" strokeWidth="0.8"
              />
            </g>
          ))}

          {/* Water drops on crops */}
          {valveOpen && (
            <motion.circle cx="255" cy="65" r="2" fill="#3B82F6"
              animate={{ y: [0, 25], opacity: [1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            />
          )}

          {/* Flow arrows */}
          <line x1="50" y1="107" x2="63" y2="107" stroke="#4F46E5" strokeWidth="1.5" strokeDasharray="3 2" />
          <line x1="115" y1="107" x2="130" y2="107" stroke="#0D9488" strokeWidth="1.5" strokeDasharray="3 2" />
        </svg>
      </div>

      {/* Step indicators */}
      <div className="flex justify-center gap-2">
        {CORRECT_SEQUENCE.map((cmdId, idx) => {
          const cmd = COMMANDS[cmdId];
          const isActive = activeStep === idx;
          const isDone = activeStep > idx;
          return (
            <motion.div
              key={cmdId}
              animate={isActive ? { scale: 1.1 } : { scale: 1 }}
              className={`flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl border-2 ${
                isActive ? 'bg-teal-100 border-teal-500' :
                isDone ? 'bg-forest-50 border-forest-300' :
                'bg-white border-cream-200 opacity-50'
              }`}
            >
              <span className="text-lg">{cmd.icon}</span>
              <span className="text-[8px] font-bold text-stone-600">{cmd.label.split(' ')[0]}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Run button */}
      {state === 'idle' && (
        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRun}
            className="px-8 py-3 bg-teal-600 text-white font-bold rounded-2xl shadow-lg flex items-center gap-2 mx-auto"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M8 5V19L19 12L8 5Z" /></svg>
            RUN SYSTEM
          </motion.button>
        </div>
      )}

      {/* Complete */}
      <AnimatePresence>
        {state === 'complete' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-3 bg-forest-50 border-2 border-forest-300 rounded-2xl"
          >
            <p className="text-sm font-bold text-forest-700">IRRIGATION COMPLETE! Crops are healthy!</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
