import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { World } from '@/types';
import { MissionShell } from '@/components/game/MissionShell';
import { CheckCircle2, XCircle, Hammer, Weight } from 'lucide-react';

interface EngineeringHubProps {
  world: World;
  onComplete: (score: number) => void;
  onExit: () => void;
}

const DESIGNS = [
  {
    id: 'flat',
    label: 'Flat Beam',
    desc: 'A simple flat plank across the gap',
    strength: 1,
    color: 'text-stone-600',
    bgColor: 'bg-stone-100',
    borderColor: 'border-stone-400',
    result: 'The flat beam bends quickly under load. Not suitable for long spans!',
  },
  {
    id: 'ibeam',
    label: 'I-Beam',
    desc: 'Beam with I-shaped cross-section for more support',
    strength: 2,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
    borderColor: 'border-indigo-400',
    result: 'The I-Beam holds more weight than the flat beam, but still bends under heavy load.',
  },
  {
    id: 'truss',
    label: 'Triangular Truss',
    desc: 'Triangle pattern distributes force evenly',
    strength: 3,
    color: 'text-forest-600',
    bgColor: 'bg-forest-100',
    borderColor: 'border-forest-400',
    result: 'The triangular truss is the strongest! Triangles distribute force evenly — the bridge is stable!',
  },
];

const MASCOT_TEXTS = [
  "Our village needs a bridge across the river so children can reach school! Choose a design, then we'll test it with a load. Which structure will be strongest?",
  "Let's run the load test! Watch how the bridge handles the weight of villagers and carts crossing.",
];

export function EngineeringHub({ world, onComplete, onExit }: EngineeringHubProps) {
  const [phase, setPhase] = useState<'intro' | 'design' | 'test' | 'complete'>('intro');
  const [stage, setStage] = useState(0);
  const [score, setScore] = useState(0);
  const [pointsTrigger, setPointsTrigger] = useState(0);
  const [mascotReaction, setMascotReaction] = useState<'idle' | 'happy' | 'sad'>('idle');

  const [selectedDesign, setSelectedDesign] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);
  const [testComplete, setTestComplete] = useState(false);
  const [loadLevel, setLoadLevel] = useState(0);

  const totalStages = 2;
  const maxScore = world.points;

  const handleBegin = () => {
    setPhase('design');
    setStage(1);
  };

  const handleDesignSelect = (designId: string) => {
    if (selectedDesign) return;
    setSelectedDesign(designId);
    setScore((prev) => prev + 25);
    setPointsTrigger((prev) => prev + 1);
    setMascotReaction('happy');
    setTimeout(() => {
      setPhase('test');
      setStage(2);
      setMascotReaction('idle');
    }, 1500);
  };

  const handleRunTest = () => {
    if (testing || testComplete) return;
    setTesting(true);
    setMascotReaction('idle');

    const design = DESIGNS.find((d) => d.id === selectedDesign);
    const maxLoad = design?.strength || 1;

    let step = 0;
    const interval = setInterval(() => {
      step++;
      setLoadLevel(step);

      if (step >= maxLoad * 2) {
        clearInterval(interval);
        setTesting(false);
        setTestComplete(true);
        setScore((prev) => prev + 25);
        setPointsTrigger((prev) => prev + 1);

        if (selectedDesign === 'truss') {
          setMascotReaction('happy');
        } else {
          setMascotReaction('sad');
        }

        setTimeout(() => setPhase('complete'), 3000);
      }
    }, 600);
  };

  const selectedDesignData = DESIGNS.find((d) => d.id === selectedDesign);
  const bendAmount = selectedDesign ? (loadLevel / (selectedDesignData?.strength || 1)) * 8 : 0;

  return (
    <MissionShell
      world={world}
      phase={phase === 'complete' ? 'complete' : phase === 'intro' ? 'intro' : 'playing'}
      currentStage={stage}
      totalStages={totalStages}
      score={score}
      maxScore={maxScore}
      mascotText={phase === 'test' ? MASCOT_TEXTS[1] : MASCOT_TEXTS[0]}
      mascotReaction={mascotReaction}
      hint="Triangles are the strongest shape in engineering — they distribute force evenly. Flat beams bend, I-beams are better, but trusses are best!"
      pointsTrigger={pointsTrigger}
      onExit={onExit}
      onBegin={handleBegin}
      onComplete={() => onComplete(score)}
    >
      {/* DESIGN SELECTION */}
      {phase === 'design' && (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-xl font-bold text-stone-800 flex items-center justify-center gap-2">
              <Hammer className="w-6 h-6 text-saffron-600" />
              Choose a Bridge Design
            </h3>
            <p className="text-sm text-stone-600 mt-1">Select the structure you think will be strongest</p>
          </div>

          {/* River scene */}
          <div className="flex justify-center py-2">
            <svg width="280" height="80" viewBox="0 0 280 80">
              {/* Village */}
              <rect x="5" y="30" width="35" height="40" fill="#D4B565" stroke="#9A3412" strokeWidth="1.5" />
              <polygon points="5,30 22,15 40,30" fill="#CC5238" stroke="#9A3412" strokeWidth="1.5" />
              <text x="22" y="55" textAnchor="middle" fontSize="7" fill="#9A3412" fontWeight="bold">VILLAGE</text>
              {/* School */}
              <rect x="240" y="30" width="35" height="40" fill="#D4B565" stroke="#9A3412" strokeWidth="1.5" />
              <polygon points="240,30 257,15 275,30" fill="#CC5238" stroke="#9A3412" strokeWidth="1.5" />
              <text x="257" y="55" textAnchor="middle" fontSize="7" fill="#9A3412" fontWeight="bold">SCHOOL</text>
              {/* River */}
              <path d="M 40 70 Q 140 60 240 70" fill="none" stroke="#3B82F6" strokeWidth="3" opacity="0.5" />
              <path d="M 40 75 Q 140 65 240 75" fill="none" stroke="#60A5FA" strokeWidth="2" opacity="0.3" />
            </svg>
          </div>

          {/* Design options */}
          <div className="grid grid-cols-1 gap-3">
            {DESIGNS.map((design) => (
              <motion.button
                key={design.id}
                onClick={() => handleDesignSelect(design.id)}
                disabled={!!selectedDesign}
                whileHover={{ scale: selectedDesign ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-2xl border-2 shadow-md text-left transition-all ${
                  selectedDesign === design.id
                    ? 'bg-saffron-50 border-saffron-500 ring-2 ring-saffron-300'
                    : 'bg-white border-cream-300 hover:border-saffron-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Design visual */}
                  <div className="flex-shrink-0">
                    <svg width="80" height="30" viewBox="0 0 80 30">
                      {design.id === 'flat' && (
                        <rect x="5" y="12" width="70" height="6" fill="#9CA3AF" stroke="#4B5563" strokeWidth="1.5" />
                      )}
                      {design.id === 'ibeam' && (
                        <g>
                          <rect x="5" y="10" width="70" height="3" fill="#6B7280" stroke="#4B5563" strokeWidth="1" />
                          <rect x="5" y="14" width="70" height="3" fill="#9CA3AF" stroke="#4B5563" strokeWidth="1" />
                          <rect x="5" y="18" width="70" height="3" fill="#6B7280" stroke="#4B5563" strokeWidth="1" />
                        </g>
                      )}
                      {design.id === 'truss' && (
                        <g>
                          <line x1="5" y1="15" x2="75" y2="15" stroke="#15803D" strokeWidth="2" />
                          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                            <g key={i}>
                              <line x1={5 + i * 10} y1="15" x2={10 + i * 10} y2="5" stroke="#15803D" strokeWidth="1.5" />
                              <line x1={10 + i * 10} y1="5" x2={15 + i * 10} y2="15" stroke="#15803D" strokeWidth="1.5" />
                            </g>
                          ))}
                        </g>
                      )}
                    </svg>
                  </div>
                  <div>
                    <p className={`font-bold text-sm ${design.color}`}>{design.label}</p>
                    <p className="text-xs text-stone-500">{design.desc}</p>
                  </div>
                  {selectedDesign === design.id && <CheckCircle2 className="w-5 h-5 text-saffron-500 ml-auto" />}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* LOAD TEST */}
      {phase === 'test' && selectedDesignData && (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-xl font-bold text-stone-800 flex items-center justify-center gap-2">
              <Weight className="w-6 h-6 text-saffron-600" />
              Load Test: {selectedDesignData.label}
            </h3>
            <p className="text-sm text-stone-600 mt-1">Watch how the bridge handles weight</p>
          </div>

          {/* Bridge test visual */}
          <div className="flex justify-center py-4">
            <svg width="280" height="120" viewBox="0 0 280 120">
              {/* Banks */}
              <rect x="0" y="80" width="40" height="40" fill="#D4B565" />
              <rect x="240" y="80" width="40" height="40" fill="#D4B565" />
              {/* River */}
              <path d="M 40 100 Q 140 90 240 100" fill="none" stroke="#3B82F6" strokeWidth="2" opacity="0.4" />

              {/* Bridge with bending */}
              <motion.path
                d={`M 40 70 Q 140 ${70 + bendAmount} 240 70`}
                fill="none"
                stroke={
                  selectedDesign === 'truss' ? '#15803D' :
                  selectedDesign === 'ibeam' ? '#4F46E5' : '#6B7280'
                }
                strokeWidth={selectedDesign === 'truss' ? 4 : 3}
                animate={{ d: `M 40 70 Q 140 ${70 + bendAmount} 240 70` }}
                transition={{ duration: 0.3 }}
              />

              {/* Truss triangles */}
              {selectedDesign === 'truss' && (
                <g>
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <motion.g key={i}>
                      <line x1={40 + i * 25} y1={70 + bendAmount * 0.5} x2={52.5 + i * 25} y2={50} stroke="#15803D" strokeWidth="1.5" />
                      <line x1={52.5 + i * 25} y1={50} x2={65 + i * 25} y2={70 + bendAmount * 0.5} stroke="#15803D" strokeWidth="1.5" />
                    </motion.g>
                  ))}
                </g>
              )}

              {/* Carts/villagers crossing */}
              {testComplete && selectedDesign === 'truss' && (
                <motion.g
                  initial={{ x: 0 }}
                  animate={{ x: 200 }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <rect x="45" y="55" width="12" height="10" fill="#CC5238" stroke="#9A3412" strokeWidth="1" />
                  <circle cx="48" cy="68" r="2.5" fill="#4B5563" />
                  <circle cx="55" cy="68" r="2.5" fill="#4B5563" />
                </motion.g>
              )}

              {/* Load indicator */}
              {testing && (
                <g>
                  {[...Array(loadLevel)].map((_, i) => (
                    <motion.rect
                      key={i}
                      x={130 - i * 5}
                      y={50 - i * 8}
                      width="20"
                      height="6"
                      fill="#EA580C"
                      stroke="#9A3412"
                      strokeWidth="1"
                      initial={{ y: 20 }}
                      animate={{ y: 50 - i * 8 }}
                    />
                  ))}
                </g>
              )}
            </svg>
          </div>

          {/* Load meter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-600">Load:</span>
            <div className="flex-1 h-4 bg-cream-200 rounded-full overflow-hidden border border-cream-300">
              <motion.div
                className={`h-full rounded-full ${loadLevel > 2 ? 'bg-terracotta-500' : 'bg-forest-500'}`}
                animate={{ width: `${(loadLevel / 6) * 100}%` }}
              />
            </div>
            <span className="text-xs font-bold text-stone-700 tabular-nums">{loadLevel}/6</span>
          </div>

          {/* Run test button */}
          {!testComplete && (
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRunTest}
                disabled={testing}
                className="px-8 py-3 bg-saffron-600 text-white font-bold rounded-2xl shadow-lg disabled:opacity-50"
              >
                {testing ? 'Testing...' : 'Run Load Test'}
              </motion.button>
            </div>
          )}

          {/* Result */}
          {testComplete && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-2xl border-2 text-center ${
                selectedDesign === 'truss'
                  ? 'bg-forest-50 border-forest-300'
                  : 'bg-terracotta-50 border-terracotta-300'
              }`}
            >
              <p className={`font-bold text-sm ${
                selectedDesign === 'truss' ? 'text-forest-700' : 'text-terracotta-700'
              }`}>
                {selectedDesignData.result}
              </p>
            </motion.div>
          )}
        </div>
      )}
    </MissionShell>
  );
}
