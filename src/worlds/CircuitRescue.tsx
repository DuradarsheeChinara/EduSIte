import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { World } from '@/types';
import { MissionShell } from '@/components/game/MissionShell';
import { CheckCircle2, XCircle, Lightbulb, Zap, Battery, Cog } from 'lucide-react';

interface CircuitRescueProps {
  world: World;
  onComplete: (score: number) => void;
  onExit: () => void;
}

const CIRCUIT_PARTS = [
  { id: 'cell', label: 'Cell (Battery)', correct: true, icon: Battery },
  { id: 'bulb', label: 'Bulb', correct: true, icon: Lightbulb },
  { id: 'wire', label: 'Wire', correct: true, icon: Zap },
  { id: 'switch', label: 'Switch', correct: true, icon: Cog },
  { id: 'resistor', label: 'Resistor', correct: false, icon: Zap },
  { id: 'motor', label: 'Motor', correct: false, icon: Cog },
];

const MASCOT_TEXTS = [
  "The school is dark! Let's build a simple circuit. Select the correct components to complete it — we need a cell, wires, a bulb, and a switch. Avoid the wrong parts!",
  "Great! The circuit is working! Now, should we connect the school's appliances in series or parallel? Think about which arrangement lets each appliance work independently.",
  "Now let's power the bulb! The voltage is 6V and resistance is 2Ω. Use Ohm's Law: I = V / R. Enter the correct current to light up the school!",
];

export function CircuitRescue({ world, onComplete, onExit }: CircuitRescueProps) {
  const [phase, setPhase] = useState<'intro' | 'circuit' | 'arrangement' | 'power' | 'complete'>('intro');
  const [stage, setStage] = useState(0);
  const [score, setScore] = useState(0);
  const [pointsTrigger, setPointsTrigger] = useState(0);
  const [mascotReaction, setMascotReaction] = useState<'idle' | 'happy' | 'sad'>('idle');

  // Circuit state
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [circuitComplete, setCircuitComplete] = useState(false);
  const [wrongShake, setWrongShake] = useState<string | null>(null);

  // Arrangement state
  const [selectedArrangement, setSelectedArrangement] = useState<string | null>(null);
  const [arrangementComplete, setArrangementComplete] = useState(false);
  const [arrWrong, setArrWrong] = useState<string | null>(null);

  // Power state
  const [currentInput, setCurrentInput] = useState('');
  const [powerComplete, setPowerComplete] = useState(false);
  const [powerWrong, setPowerWrong] = useState(false);

  const totalStages = 3;
  const maxScore = world.points;

  const handleBegin = () => {
    setPhase('circuit');
    setStage(1);
  };

  // Circuit handlers
  const handlePartClick = (partId: string, isCorrect: boolean) => {
    if (selectedParts.includes(partId) || circuitComplete) return;

    if (isCorrect) {
      setSelectedParts((prev) => [...prev, partId]);
      setScore((prev) => prev + 25);
      setPointsTrigger((prev) => prev + 1);
      setMascotReaction('happy');

      const correctSelected = [...selectedParts, partId];
      const allCorrect = CIRCUIT_PARTS.filter((p) => p.correct).every((p) => correctSelected.includes(p.id));

      if (allCorrect) {
        setCircuitComplete(true);
        setTimeout(() => {
          setPhase('arrangement');
          setStage(2);
          setMascotReaction('idle');
        }, 2000);
      }
    } else {
      setWrongShake(partId);
      setMascotReaction('sad');
      setTimeout(() => {
        setWrongShake(null);
        setMascotReaction('idle');
      }, 500);
    }
  };

  // Arrangement handlers
  const handleArrangementSelect = (choice: 'series' | 'parallel') => {
    if (arrangementComplete) return;
    setSelectedArrangement(choice);

    if (choice === 'parallel') {
      setArrangementComplete(true);
      setScore((prev) => prev + 25);
      setPointsTrigger((prev) => prev + 1);
      setMascotReaction('happy');
      setTimeout(() => {
        setPhase('power');
        setStage(3);
        setMascotReaction('idle');
      }, 2500);
    } else {
      setArrWrong(choice);
      setMascotReaction('sad');
      setTimeout(() => {
        setArrWrong(null);
        setMascotReaction('idle');
      }, 500);
      setSelectedArrangement(null);
    }
  };

  // Power handlers
  const handlePowerSubmit = () => {
    const answer = parseFloat(currentInput);
    if (isNaN(answer)) return;

    if (answer === 3) {
      setPowerComplete(true);
      setScore((prev) => prev + 25);
      setPointsTrigger((prev) => prev + 1);
      setMascotReaction('happy');
      setTimeout(() => {
        setPhase('complete');
      }, 2500);
    } else {
      setPowerWrong(true);
      setMascotReaction('sad');
      setTimeout(() => {
        setPowerWrong(false);
        setMascotReaction('idle');
      }, 500);
    }
  };

  return (
    <MissionShell
      world={world}
      phase={phase === 'complete' ? 'complete' : phase === 'intro' ? 'intro' : 'playing'}
      currentStage={stage}
      totalStages={totalStages}
      score={score}
      maxScore={maxScore}
      mascotText={
        phase === 'arrangement' ? MASCOT_TEXTS[1] :
        phase === 'power' ? MASCOT_TEXTS[2] :
        MASCOT_TEXTS[0]
      }
      mascotReaction={mascotReaction}
      hint={
        phase === 'circuit' ? 'A basic circuit needs: a cell (power source), wires (to carry current), a bulb (load), and a switch (to control flow). Resistors and motors are not needed here.' :
        phase === 'arrangement' ? 'In a parallel circuit, each appliance has its own path — if one breaks, others still work. In series, if one fails, all stop working.' :
        "Ohm's Law: V = I × R. So I = V / R = 6 / 2 = 3 A. Enter 3!"
      }
      pointsTrigger={pointsTrigger}
      onExit={onExit}
      onBegin={handleBegin}
      onComplete={() => onComplete(score)}
    >
      {/* CIRCUIT BUILDING GAME */}
      {phase === 'circuit' && (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-xl font-bold text-stone-800">Complete the Circuit</h3>
            <p className="text-sm text-stone-600 mt-1">Select the correct components to build a working circuit</p>
          </div>

          {/* Circuit visual */}
          <div className="flex justify-center py-4">
            <svg width="280" height="180" viewBox="0 0 280 180">
              {/* Circuit board outline */}
              <rect x="20" y="20" width="240" height="140" rx="10" fill="#FBF6E9" stroke="#E0C98A" strokeWidth="2" />

              {/* Wire path (lights up when complete) */}
              <motion.path
                d="M 50 90 L 100 90 L 100 50 L 180 50 L 180 90 L 230 90 L 230 130 L 50 130 Z"
                fill="none"
                stroke={circuitComplete ? '#F97316' : '#D4B565'}
                strokeWidth="3"
                animate={circuitComplete ? { strokeOpacity: [1, 0.5, 1] } : {}}
                transition={{ duration: 0.5, repeat: Infinity }}
              />

              {/* Cell symbol */}
              {selectedParts.includes('cell') && (
                <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ transformOrigin: '50px 110px' }}>
                  <rect x="42" y="102" width="16" height="16" rx="2" fill="#F97316" stroke="#9A3412" strokeWidth="1.5" />
                  <text x="50" y="113" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">+</text>
                </motion.g>
              )}

              {/* Bulb */}
              {selectedParts.includes('bulb') && (
                <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ transformOrigin: '140px 50px' }}>
                  <circle cx="140" cy="50" r="12" fill={circuitComplete ? '#FCD34D' : '#F5ECD4'} stroke="#9A3412" strokeWidth="2" />
                  {circuitComplete && (
                    <motion.circle cx="140" cy="50" r="20" fill="#FCD34D" opacity="0.3"
                      animate={{ r: [18, 25, 18], opacity: [0.3, 0.1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                </motion.g>
              )}

              {/* Switch */}
              {selectedParts.includes('switch') && (
                <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ transformOrigin: '230px 90px' }}>
                  <line x1="222" y1="90" x2="238" y2="82" stroke="#4B5563" strokeWidth="2" />
                  <circle cx="222" cy="90" r="3" fill="#4B5563" />
                  <circle cx="238" cy="90" r="3" fill="#4B5563" />
                </motion.g>
              )}

              {/* Wire indicator */}
              {selectedParts.includes('wire') && (
                <motion.text x="140" y="140" textAnchor="middle" fontSize="9" fill="#9A3412" fontWeight="bold"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  Wires connected
                </motion.text>
              )}

              {/* School in background */}
              <rect x="100" y="145" width="80" height="25" rx="2" fill="#D4B565" stroke="#9A3412" strokeWidth="1" />
              <text x="140" y="160" textAnchor="middle" fontSize="8" fill="#9A3412" fontWeight="bold">SCHOOL</text>
              {circuitComplete && (
                <>
                  <motion.rect x="105" y="148" width="8" height="8" fill="#FCD34D"
                    animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1, repeat: Infinity }} />
                  <motion.rect x="120" y="148" width="8" height="8" fill="#FCD34D"
                    animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1, repeat: Infinity, delay: 0.3 }} />
                  <motion.rect x="135" y="148" width="8" height="8" fill="#FCD34D"
                    animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1, repeat: Infinity, delay: 0.6 }} />
                </>
              )}
            </svg>
          </div>

          {/* Parts selection */}
          <div className="grid grid-cols-3 gap-2.5">
            {CIRCUIT_PARTS.map((part) => {
              const isSelected = selectedParts.includes(part.id);
              const isWrong = wrongShake === part.id;
              const Icon = part.icon;

              return (
                <motion.button
                  key={part.id}
                  onClick={() => handlePartClick(part.id, part.correct)}
                  disabled={isSelected || circuitComplete}
                  animate={
                    isWrong ? { x: [-5, 5, -5, 5, 0] } :
                    isSelected ? { scale: [1, 1.15, 1] } : { scale: 1 }
                  }
                  transition={{ duration: 0.4 }}
                  className={`relative p-3 rounded-2xl border-2 shadow-md transition-all ${
                    isSelected
                      ? 'bg-forest-50 border-forest-400 opacity-50'
                      : 'bg-white border-cream-300 hover:border-terracotta-300'
                  }`}
                >
                  <Icon className="w-6 h-6 mx-auto text-terracotta-600" />
                  <p className="text-xs font-bold mt-1 text-stone-700">{part.label}</p>
                  {isSelected && <CheckCircle2 className="absolute top-1 right-1 w-4 h-4 text-forest-500" />}
                  {isWrong && <XCircle className="absolute top-1 right-1 w-4 h-4 text-terracotta-500" />}
                </motion.button>
              );
            })}
          </div>

          {circuitComplete && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center p-3 bg-forest-50 border-2 border-forest-300 rounded-2xl"
            >
              <p className="text-forest-700 font-bold text-sm flex items-center justify-center gap-2">
                <Zap className="w-5 h-5" />
                Circuit complete! The bulb is glowing!
              </p>
            </motion.div>
          )}
        </div>
      )}

      {/* ARRANGEMENT GAME */}
      {phase === 'arrangement' && (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-xl font-bold text-stone-800">Choose the Safe Arrangement</h3>
            <p className="text-sm text-stone-600 mt-1">How should household appliances be connected?</p>
          </div>

          {/* Visual comparison */}
          <div className="grid grid-cols-2 gap-4">
            {/* Series option */}
            <motion.button
              onClick={() => handleArrangementSelect('series')}
              disabled={arrangementComplete}
              animate={arrWrong === 'series' ? { x: [-5, 5, -5, 5, 0] } : {}}
              transition={{ duration: 0.4 }}
              className={`p-4 rounded-2xl border-2 shadow-md transition-all ${
                arrangementComplete
                  ? 'bg-cream-50 border-cream-300 opacity-50'
                  : 'bg-white border-cream-300 hover:border-terracotta-300'
              }`}
            >
              <h4 className="font-bold text-stone-800 mb-2">Series</h4>
              <svg width="100%" height="80" viewBox="0 0 120 80">
                {/* Series circuit: appliances in a line */}
                <line x1="10" y1="40" x2="30" y2="40" stroke="#D4B565" strokeWidth="2" />
                <circle cx="40" cy="40" r="8" fill="#FCD34D" stroke="#9A3412" strokeWidth="1.5" />
                <line x1="48" y1="40" x2="62" y2="40" stroke="#D4B565" strokeWidth="2" />
                <circle cx="72" cy="40" r="8" fill="#FCD34D" stroke="#9A3412" strokeWidth="1.5" />
                <line x1="80" y1="40" x2="94" y2="40" stroke="#D4B565" strokeWidth="2" />
                <circle cx="104" cy="40" r="8" fill="#FCD34D" stroke="#9A3412" strokeWidth="1.5" />
                <line x1="112" y1="40" x2="112" y2="65" stroke="#D4B565" strokeWidth="2" />
                <line x1="112" y1="65" x2="10" y2="65" stroke="#D4B565" strokeWidth="2" />
                <line x1="10" y1="65" x2="10" y2="40" stroke="#D4B565" strokeWidth="2" />
              </svg>
              <p className="text-xs text-stone-500 mt-2">All in one path — if one breaks, all stop</p>
            </motion.button>

            {/* Parallel option */}
            <motion.button
              onClick={() => handleArrangementSelect('parallel')}
              disabled={arrangementComplete}
              animate={arrWrong === 'parallel' ? { x: [-5, 5, -5, 5, 0] } : {}}
              transition={{ duration: 0.4 }}
              className={`p-4 rounded-2xl border-2 shadow-md transition-all ${
                arrangementComplete
                  ? 'bg-forest-50 border-forest-500 ring-2 ring-forest-300'
                  : 'bg-white border-cream-300 hover:border-forest-300'
              }`}
            >
              <h4 className="font-bold text-stone-800 mb-2">Parallel</h4>
              <svg width="100%" height="80" viewBox="0 0 120 80">
                {/* Parallel circuit: each appliance has its own path */}
                <line x1="10" y1="10" x2="110" y2="10" stroke="#D4B565" strokeWidth="2" />
                <line x1="10" y1="65" x2="110" y2="65" stroke="#D4B565" strokeWidth="2" />
                {/* Branch 1 */}
                <line x1="30" y1="10" x2="30" y2="25" stroke="#D4B565" strokeWidth="2" />
                <circle cx="30" cy="35" r="8" fill={arrangementComplete ? '#FCD34D' : '#F5ECD4'} stroke="#9A3412" strokeWidth="1.5" />
                <line x1="30" y1="43" x2="30" y2="65" stroke="#D4B565" strokeWidth="2" />
                {/* Branch 2 */}
                <line x1="60" y1="10" x2="60" y2="25" stroke="#D4B565" strokeWidth="2" />
                <circle cx="60" cy="35" r="8" fill={arrangementComplete ? '#FCD34D' : '#F5ECD4'} stroke="#9A3412" strokeWidth="1.5" />
                <line x1="60" y1="43" x2="60" y2="65" stroke="#D4B565" strokeWidth="2" />
                {/* Branch 3 */}
                <line x1="90" y1="10" x2="90" y2="25" stroke="#D4B565" strokeWidth="2" />
                <circle cx="90" cy="35" r="8" fill={arrangementComplete ? '#FCD34D' : '#F5ECD4'} stroke="#9A3412" strokeWidth="1.5" />
                <line x1="90" y1="43" x2="90" y2="65" stroke="#D4B565" strokeWidth="2" />
              </svg>
              <p className="text-xs text-stone-500 mt-2">Each has its own path — independent!</p>
            </motion.button>
          </div>

          {arrangementComplete && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center p-3 bg-forest-50 border-2 border-forest-300 rounded-2xl"
            >
              <p className="text-forest-700 font-bold text-sm">
                Correct! Parallel circuits let each appliance work independently — perfect for homes!
              </p>
            </motion.div>
          )}
        </div>
      )}

      {/* POWER THE BULB GAME */}
      {phase === 'power' && (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-xl font-bold text-stone-800">Power the Bulb</h3>
            <p className="text-sm text-stone-600 mt-1">Use Ohm's Law to calculate the current</p>
          </div>

          {/* Given values */}
          <div className="flex justify-center gap-6 py-2">
            <div className="bg-white rounded-2xl p-4 border-2 border-terracotta-200 shadow-md text-center">
              <p className="text-xs text-stone-500 font-semibold">Voltage</p>
              <p className="text-2xl font-extrabold text-terracotta-700">6 V</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border-2 border-terracotta-200 shadow-md text-center">
              <p className="text-xs text-stone-500 font-semibold">Resistance</p>
              <p className="text-2xl font-extrabold text-terracotta-700">2 Ω</p>
            </div>
          </div>

          {/* Formula hint */}
          <div className="text-center bg-cream-100 rounded-xl p-3 border-2 border-cream-200">
            <p className="text-sm font-bold text-stone-700">Ohm's Law: I = V / R</p>
          </div>

          {/* Bulb visual */}
          <div className="flex justify-center py-2">
            <motion.svg width="100" height="120" viewBox="0 0 100 120">
              <motion.circle cx="50" cy="45" r="30"
                fill={powerComplete ? '#FCD34D' : '#F5ECD4'}
                stroke="#9A3412" strokeWidth="2"
                animate={powerComplete ? { scale: [1, 1.1, 1] } : {}}
                style={{ transformOrigin: '50px 45px' }}
              />
              {powerComplete && (
                <motion.circle cx="50" cy="45" r="40" fill="#FCD34D" opacity="0.2"
                  animate={{ r: [35, 50, 35], opacity: [0.2, 0.05, 0.2] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
              <rect x="40" y="75" width="20" height="20" rx="2" fill="#9A3412" />
              <line x1="40" y1="85" x2="60" y2="85" stroke="#7C2D12" strokeWidth="1" />
              <line x1="40" y1="90" x2="60" y2="90" stroke="#7C2D12" strokeWidth="1" />
            </motion.svg>
          </div>

          {/* Input */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-stone-700">I =</span>
              <input
                type="number"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                disabled={powerComplete}
                onKeyDown={(e) => e.key === 'Enter' && handlePowerSubmit()}
                placeholder="?"
                className={`w-24 px-4 py-3 text-center text-xl font-bold rounded-2xl border-2 outline-none transition-all ${
                  powerWrong
                    ? 'border-terracotta-500 bg-terracotta-50'
                    : powerComplete
                    ? 'border-forest-500 bg-forest-50 text-forest-700'
                    : 'border-cream-300 bg-white focus:border-terracotta-500'
                }`}
                aria-label="Current in amps"
              />
              <span className="text-lg font-bold text-stone-700">A</span>
            </div>

            {!powerComplete && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePowerSubmit}
                disabled={!currentInput}
                className="px-8 py-3 bg-terracotta-600 text-white font-bold rounded-2xl shadow-lg disabled:opacity-50"
              >
                Power the Bulb!
              </motion.button>
            )}
          </div>

          {powerComplete && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center p-3 bg-forest-50 border-2 border-forest-300 rounded-2xl"
            >
              <p className="text-forest-700 font-bold text-sm flex items-center justify-center gap-2">
                <Lightbulb className="w-5 h-5" />
                I = 6V / 2Ω = 3A. The bulb is glowing! School is lit!
              </p>
            </motion.div>
          )}
        </div>
      )}
    </MissionShell>
  );
}
