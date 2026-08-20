import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CombinationStationProps {
  onComplete: () => void;
}

type ReactantId = 'mg' | 'o2';
type Step = 'idle' | 'combining' | 'done';

interface Piece {
  id: ReactantId;
  label: string;
  formula: string;
  color: string;
  bgColor: string;
  borderColor: string;
  placed: boolean;
}

const INITIAL_PIECES: Piece[] = [
  { id: 'mg', label: 'Magnesium', formula: 'Mg', color: 'text-stone-700', bgColor: 'bg-stone-100', borderColor: 'border-stone-400', placed: false },
  { id: 'o2', label: 'Oxygen', formula: 'O\u2082', color: 'text-sky-700', bgColor: 'bg-sky-100', borderColor: 'border-sky-400', placed: false },
];

export function CombinationStation({ onComplete }: CombinationStationProps) {
  const [pieces, setPieces] = useState<Piece[]>(INITIAL_PIECES);
  const [step, setStep] = useState<Step>('idle');
  const [selected, setSelected] = useState<ReactantId | null>(null);
  const [chamberContents, setChamberContents] = useState<ReactantId[]>([]);
  const [wrongShake, setWrongShake] = useState<string | null>(null);

  const handlePieceClick = useCallback((id: ReactantId) => {
    if (step !== 'idle') return;
    const piece = pieces.find((p) => p.id === id);
    if (piece?.placed) return;
    setSelected(id);
  }, [pieces, step]);

  const handleChamberClick = useCallback(() => {
    if (step !== 'idle' || !selected) return;
    const piece = pieces.find((p) => p.id === selected);
    if (!piece || piece.placed) return;

    setPieces((prev) => prev.map((p) => (p.id === selected ? { ...p, placed: true } : p)));
    setChamberContents((prev) => [...prev, selected]);
    setSelected(null);

    const remaining = pieces.filter((p) => p.id !== selected && !p.placed);
    if (remaining.length === 0) {
      setStep('combining');
      setTimeout(() => {
        setStep('done');
        setTimeout(onComplete, 1600);
      }, 1800);
    }
  }, [pieces, selected, step, onComplete]);

  return (
    <div className="space-y-4">
      {/* Instruction */}
      <div className="text-center">
        <h3 className="text-lg font-bold text-stone-800">
          Station 1: Combination
        </h3>
        <p className="text-sm text-stone-600 mt-0.5">
          Drag both reactants into the reaction chamber to build the product
        </p>
      </div>

      {/* Equation banner */}
      <div className="flex justify-center">
        <div className="px-4 py-2 bg-saffron-50 border-2 border-saffron-300 rounded-xl">
          <p className="font-mono text-sm font-bold text-saffron-800">2Mg + O₂ → 2MgO</p>
        </div>
      </div>

      {/* Reaction chamber */}
      <div className="flex justify-center">
        <motion.div
          onClick={handleChamberClick}
          animate={wrongShake === 'chamber' ? { x: [-6, 6, -6, 6, 0] } : {}}
          className={`relative cursor-pointer transition-all ${
            selected ? 'ring-2 ring-saffron-400' : ''
          }`}
        >
          <svg width="200" height="160" viewBox="0 0 200 160">
            {/* Chamber outline */}
            <path
              d="M 50 20 L 50 120 Q 50 140 70 140 L 130 140 Q 150 140 150 120 L 150 20"
              fill={step === 'done' ? '#F0FDF4' : '#FFFCF5'}
              stroke={step === 'done' ? '#16A34A' : '#9A3412'}
              strokeWidth="3"
            />
            {/* Chamber top */}
            <rect x="45" y="14" width="110" height="10" rx="3" fill="#D4B565" stroke="#9A3412" strokeWidth="2" />
            {/* Glow when combining */}
            {step === 'combining' && (
              <motion.circle
                cx="100" cy="80" r="30"
                fill="#F97316" opacity="0.3"
                animate={{ r: [20, 40, 20], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            )}
            {/* Reactant pieces inside chamber */}
            {chamberContents.map((id, idx) => {
              const piece = INITIAL_PIECES.find((p) => p.id === id)!;
              return (
                <motion.g
                  key={id}
                  initial={{ x: idx === 0 ? -60 : 60, y: 0, opacity: 0 }}
                  animate={{ x: idx === 0 ? -20 : 20, y: 70, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <rect x="-18" y="-12" width="36" height="24" rx="4" fill="white" stroke="#9A3412" strokeWidth="1.5" />
                  <text x="0" y="4" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#1C1917">{piece.formula}</text>
                </motion.g>
              );
            })}
            {/* Product MgO */}
            {step === 'done' && (
              <motion.g
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <rect x="70" y="65" width="60" height="30" rx="6" fill="#22C55E" stroke="#15803D" strokeWidth="2" />
                <text x="100" y="84" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">MgO</text>
              </motion.g>
            )}
            {/* Sparkles when done */}
            {step === 'done' && (
              <g>
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.circle
                    key={i}
                    cx={60 + i * 20} cy={40}
                    r="2" fill="#FBBF24"
                    animate={{ y: [0, -15, 0], opacity: [0, 1, 0] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </g>
            )}
          </svg>
        </motion.div>
      </div>

      {/* Reactant pieces */}
      {step === 'idle' && (
        <div className="flex justify-center gap-4">
          {pieces.map((piece) => (
            <motion.button
              key={piece.id}
              onClick={() => handlePieceClick(piece.id)}
              disabled={piece.placed}
              animate={
                piece.placed
                  ? { scale: 0, opacity: 0 }
                  : selected === piece.id
                  ? { scale: 1.1, y: -4 }
                  : { scale: 1, y: 0 }
              }
              whileHover={!piece.placed ? { scale: 1.05 } : {}}
              whileTap={!piece.placed ? { scale: 0.95 } : {}}
              className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 shadow-md ${
                piece.placed
                  ? 'opacity-0 pointer-events-none'
                  : selected === piece.id
                  ? `${piece.bgColor} ${piece.borderColor} ring-2 ring-saffron-300`
                  : `bg-white ${piece.borderColor} hover:shadow-lg`
              }`}
            >
              <span className={`font-mono text-lg font-bold ${piece.color}`}>{piece.formula}</span>
              <span className="text-xs text-stone-500">{piece.label}</span>
            </motion.button>
          ))}
        </div>
      )}

      {/* Concept text */}
      <AnimatePresence>
        {step === 'done' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-3 bg-forest-50 border-2 border-forest-300 rounded-2xl"
          >
            <p className="text-sm font-bold text-forest-700">
              Multiple reactants → ONE PRODUCT
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
