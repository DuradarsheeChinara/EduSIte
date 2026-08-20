import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COMMANDS, BUGGY_SEQUENCE, CORRECT_SEQUENCE, type CommandId } from './types';

interface DebugSystemProps {
  onComplete: () => void;
}

type Step = 'broken' | 'runBuggy' | 'fixing' | 'fixed' | 'runFixed' | 'done';

export function DebugSystem({ onComplete }: DebugSystemProps) {
  const [step, setStep] = useState<Step>('broken');
  const [sequence, setSequence] = useState<CommandId[]>(BUGGY_SEQUENCE);
  const [bugIdentified, setBugIdentified] = useState(false);
  const [wrong, setWrong] = useState(false);
  const [running, setRunning] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);
  const [cropsWatered, setCropsWatered] = useState(false);

  const handleRunBuggy = useCallback(() => {
    if (step !== 'broken') return;
    setStep('runBuggy');
    setRunning(true);
    setActiveStep(0);

    BUGGY_SEQUENCE.forEach((_, idx) => {
      setTimeout(() => {
        setActiveStep(idx);
        if (idx === BUGGY_SEQUENCE.length - 1) {
          setTimeout(() => {
            setRunning(false);
            setStep('fixing');
            setActiveStep(-1);
          }, 1000);
        }
      }, idx * 800);
    });
  }, [step]);

  const handleIdentifyBug = useCallback((idx: number) => {
    if (step !== 'fixing') return;
    // The bug is at index 3 (close-valve before wait)
    if (idx === 3) {
      setBugIdentified(true);
      // Fix the sequence
      setSequence(CORRECT_SEQUENCE);
      setStep('fixed');
    } else {
      setWrong(true);
      setTimeout(() => setWrong(false), 500);
    }
  }, [step]);

  const handleRunFixed = useCallback(() => {
    if (step !== 'fixed') return;
    setStep('runFixed');
    setRunning(true);
    setActiveStep(0);

    CORRECT_SEQUENCE.forEach((_, idx) => {
      setTimeout(() => {
        setActiveStep(idx);
        if (idx === 2) setCropsWatered(true);
        if (idx === CORRECT_SEQUENCE.length - 1) {
          setTimeout(() => {
            setRunning(false);
            setStep('done');
            setTimeout(onComplete, 2000);
          }, 1000);
        }
      }, idx * 800);
    });
  }, [step, onComplete]);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-bold text-stone-800">Stage 4: Debug the System</h3>
        <p className="text-sm text-stone-600 mt-0.5">
          {step === 'broken' ? 'The system is malfunctioning! Run it to see what goes wrong.' :
           step === 'runBuggy' ? 'Running buggy program... crops are still dry!' :
           step === 'fixing' ? 'Tap the step that is in the wrong order!' :
           step === 'fixed' ? 'Bug fixed! Now run the corrected program.' :
           step === 'runFixed' ? 'Running fixed program... crops are getting water!' :
           'Bug fixed! The crops received water this time!'}
        </p>
      </div>

      {/* System visualization */}
      <div className="flex justify-center">
        <svg width="260" height="100" viewBox="0 0 260 100">
          {/* Valve */}
          <circle cx="50" cy="50" r="12" fill={step === 'runFixed' && activeStep >= 2 && activeStep < 4 ? '#22C55E' : step === 'runBuggy' && activeStep >= 2 ? '#22C55E' : '#D4B565'} stroke="#4B5563" strokeWidth="2" />
          <text x="50" y="53" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#4B5563">VALVE</text>

          {/* Water flow */}
          {step === 'runFixed' && activeStep >= 2 && activeStep < 4 && (
            <motion.circle cx="65" cy="50" r="3" fill="#3B82F6"
              animate={{ x: [0, 80], opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          )}

          {/* Crops */}
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <line x1={150 + i * 15} y1="50" x2={150 + i * 15} y2={cropsWatered ? 30 : 42} stroke="#15803D" strokeWidth="2" />
              <ellipse cx={150 + i * 15} cy={cropsWatered ? 28 : 40} rx="4" ry="3" fill={cropsWatered ? '#22C55E' : '#86EFAC'} />
            </g>
          ))}

          {/* Water meter */}
          <rect x="200" y="35" width="50" height="14" rx="3" fill="#F5ECD4" stroke="#9A3412" strokeWidth="1" />
          <motion.rect x="202" y="37" width={cropsWatered ? 40 : 0} height="10" rx="2" fill="#3B82F6"
            animate={{ width: cropsWatered ? 40 : 0 }}
          />
          <text x="225" y="62" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#9A3412">WATER</text>
        </svg>
      </div>

      {/* Command blocks */}
      {(step === 'broken' || step === 'runBuggy' || step === 'fixing' || step === 'fixed' || step === 'runFixed') && (
        <div className="space-y-2">
          {sequence.map((cmdId, idx) => {
            const cmd = COMMANDS[cmdId];
            const isActive = running && activeStep === idx;
            const isBug = step === 'fixing' && idx === 3;
            return (
              <motion.div
                key={`${cmdId}-${idx}`}
                layout
                animate={
                  isActive ? { scale: 1.05, x: 5 } :
                  wrong && step === 'fixing' && idx !== 3 ? { x: [-3, 3, 0] } :
                  { scale: 1, x: 0 }
                }
                onClick={step === 'fixing' ? () => handleIdentifyBug(idx) : undefined}
                className={`relative p-3 rounded-2xl border-2 shadow-md flex items-center gap-3 transition-all ${
                  isActive
                    ? 'bg-teal-100 border-teal-500 ring-2 ring-teal-300'
                    : step === 'fixing'
                    ? `bg-white ${cmd.borderColor} cursor-pointer hover:shadow-lg ${isBug ? 'hover:border-terracotta-500' : ''}`
                    : 'bg-white border-cream-300'
                }`}
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-cream-200 text-stone-600">
                  {idx + 1}
                </div>
                <span className="text-xl">{cmd.icon}</span>
                <p className={`flex-1 text-sm font-semibold ${cmd.textColor}`}>{cmd.label}</p>
                {isActive && (
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="w-3 h-3 rounded-full bg-teal-500"
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Run buggy button */}
      {step === 'broken' && (
        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRunBuggy}
            className="px-6 py-3 bg-terracotta-600 text-white font-bold rounded-2xl shadow-lg flex items-center gap-2 mx-auto"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M8 5V19L19 12L8 5Z" /></svg>
            Run Buggy Program
          </motion.button>
        </div>
      )}

      {/* Run fixed button */}
      {step === 'fixed' && (
        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRunFixed}
            className="px-8 py-3 bg-teal-600 text-white font-bold rounded-2xl shadow-lg flex items-center gap-2 mx-auto"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M8 5V19L19 12L8 5Z" /></svg>
            Run Fixed Program
          </motion.button>
        </div>
      )}

      {/* Done */}
      <AnimatePresence>
        {step === 'done' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-3 bg-forest-50 border-2 border-forest-300 rounded-2xl"
          >
            <p className="text-sm font-bold text-forest-700">Bug fixed! Crops received water!</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
