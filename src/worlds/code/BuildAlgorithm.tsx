import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COMMANDS, CORRECT_SEQUENCE, SHUFFLED_SEQUENCE, type CommandId } from './types';

interface BuildAlgorithmProps {
  onComplete: () => void;
}

export function BuildAlgorithm({ onComplete }: BuildAlgorithmProps) {
  const [sequence, setSequence] = useState<CommandId[]>(SHUFFLED_SEQUENCE);
  const [checked, setChecked] = useState(false);
  const [wrong, setWrong] = useState(false);
  const [activePreview, setActivePreview] = useState<CommandId | null>(null);

  const moveUp = useCallback((idx: number) => {
    if (checked || idx === 0) return;
    setSequence((prev) => {
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });
  }, [checked]);

  const moveDown = useCallback((idx: number) => {
    if (checked || idx === sequence.length - 1) return;
    setSequence((prev) => {
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });
  }, [checked, sequence.length]);

  const handleCheck = useCallback(() => {
    const isCorrect = sequence.every((cmd, idx) => cmd === CORRECT_SEQUENCE[idx]);
    if (isCorrect) {
      setChecked(true);
      setTimeout(onComplete, 1500);
    } else {
      setWrong(true);
      setTimeout(() => setWrong(false), 500);
    }
  }, [sequence, onComplete]);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-bold text-stone-800">Stage 1: Build the Algorithm</h3>
        <p className="text-sm text-stone-600 mt-0.5">
          Arrange the command blocks in the correct order using the arrows
        </p>
      </div>

      {/* Irrigation system preview */}
      <div className="flex justify-center">
        <svg width="280" height="80" viewBox="0 0 280 80" className="opacity-60">
          {/* Sensor */}
          <rect x="5" y="25" width="35" height="25" rx="4" fill="#4F46E5" stroke="#3730A3" strokeWidth="2" />
          <text x="22" y="40" textAnchor="middle" fontSize="7" fontWeight="bold" fill="white">SENSOR</text>
          {/* Control box */}
          <rect x="60" y="20" width="45" height="30" rx="4" fill="#0D9488" stroke="#0F766E" strokeWidth="2" />
          <text x="82" y="38" textAnchor="middle" fontSize="7" fontWeight="bold" fill="white">CONTROL</text>
          {/* Valve */}
          <circle cx="135" cy="35" r="10" fill={activePreview === 'open-valve' || (checked && activePreview !== 'close-valve') ? '#22C55E' : '#D4B565'} stroke="#4B5563" strokeWidth="2" />
          {/* Pipe */}
          <line x1="145" y1="35" x2="220" y2="35" stroke="#6B7280" strokeWidth="4" />
          {/* Crops */}
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <line x1={225 + i * 15} y1="35" x2={225 + i * 15} y2={checked ? 18 : 25} stroke="#15803D" strokeWidth="2" />
              <ellipse cx={225 + i * 15} cy={checked ? 16 : 23} rx="4" ry="3" fill={checked ? '#22C55E' : '#86EFAC'} stroke="#15803D" strokeWidth="0.8" />
            </g>
          ))}
          {/* Flow arrows */}
          <line x1="40" y1="37" x2="58" y2="37" stroke="#4F46E5" strokeWidth="1.5" strokeDasharray="3 2" />
          <line x1="108" y1="37" x2="125" y2="37" stroke="#0D9488" strokeWidth="1.5" strokeDasharray="3 2" />
        </svg>
      </div>

      {/* Command blocks */}
      <div className="space-y-2">
        {sequence.map((cmdId, idx) => {
          const cmd = COMMANDS[cmdId];
          const isCorrectPos = checked && cmdId === CORRECT_SEQUENCE[idx];
          return (
            <motion.div
              key={cmdId}
              layout
              animate={wrong ? { x: [-5, 5, -5, 5, 0] } : {}}
              onHoverStart={() => setActivePreview(cmdId)}
              onHoverEnd={() => setActivePreview(null)}
              className={`relative p-3 rounded-2xl border-2 shadow-md flex items-center gap-3 transition-all ${
                isCorrectPos
                  ? 'bg-forest-50 border-forest-400'
                  : `bg-white ${cmd.borderColor}`
              }`}
            >
              {/* Step number */}
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-cream-200 text-stone-600">
                {idx + 1}
              </div>
              {/* Icon */}
              <span className="text-xl">{cmd.icon}</span>
              {/* Label */}
              <p className={`flex-1 text-sm font-semibold ${cmd.textColor}`}>{cmd.label}</p>
              {/* Arrows */}
              {!checked && (
                <div className="flex gap-1">
                  <button
                    onClick={() => moveUp(idx)}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg bg-cream-100 hover:bg-cream-200 disabled:opacity-30 border border-cream-200"
                    aria-label="Move up"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 19V5M5 12L12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                  <button
                    onClick={() => moveDown(idx)}
                    disabled={idx === sequence.length - 1}
                    className="p-1.5 rounded-lg bg-cream-100 hover:bg-cream-200 disabled:opacity-30 border border-cream-200"
                    aria-label="Move down"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5V19M5 12L12 19L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Check button */}
      {!checked && (
        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCheck}
            className="px-6 py-3 bg-teal-600 text-white font-bold rounded-2xl shadow-lg"
          >
            Check Order
          </motion.button>
        </div>
      )}

      {/* Success */}
      <AnimatePresence>
        {checked && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-3 bg-forest-50 border-2 border-forest-300 rounded-2xl"
          >
            <p className="text-sm font-bold text-forest-700">Algorithm built! The sequence is correct!</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
