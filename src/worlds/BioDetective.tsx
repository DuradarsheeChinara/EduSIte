import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { World } from '@/types';
import { MissionShell } from '@/components/game/MissionShell';
import { CheckCircle2, XCircle, Sun, Droplet, Wind, Leaf, ArrowRight } from 'lucide-react';

interface BioDetectiveProps {
  world: World;
  onComplete: (score: number) => void;
  onExit: () => void;
}

const RESOURCES = [
  { id: 'co2', label: 'CO₂', icon: Wind, color: 'text-stone-600', bgColor: 'bg-stone-100', borderColor: 'border-stone-400', correct: true },
  { id: 'water', label: 'Water', icon: Droplet, color: 'text-blue-600', bgColor: 'bg-blue-100', borderColor: 'border-blue-400', correct: true },
  { id: 'sunlight', label: 'Sunlight', icon: Sun, color: 'text-saffron-600', bgColor: 'bg-saffron-100', borderColor: 'border-saffron-400', correct: true },
  { id: 'chlorophyll', label: 'Chlorophyll', icon: Leaf, color: 'text-forest-600', bgColor: 'bg-forest-100', borderColor: 'border-forest-400', correct: true },
  { id: 'soil', label: 'Soil', icon: Leaf, color: 'text-terracotta-600', bgColor: 'bg-terracotta-100', borderColor: 'border-terracotta-400', correct: false },
  { id: 'oxygen', label: 'Oxygen', icon: Wind, color: 'text-teal-600', bgColor: 'bg-teal-100', borderColor: 'border-teal-400', correct: false },
];

const WATER_PATH = ['Roots', 'Xylem', 'Stem', 'Leaves'];
const PATH_OPTIONS = [
  ['Roots', 'Xylem', 'Stem', 'Leaves'],
  ['Leaves', 'Stem', 'Xylem', 'Roots'],
  ['Roots', 'Phloem', 'Stem', 'Leaves'],
  ['Xylem', 'Roots', 'Leaves', 'Stem'],
];

const LEAF_STRUCTURES = [
  { id: 'cuticle', label: 'Cuticle', desc: 'A waxy protective layer — not for gas exchange', correct: false, x: 50, y: 15 },
  { id: 'palisade', label: 'Palisade Layer', desc: 'Cells that contain chloroplasts for photosynthesis', correct: false, x: 50, y: 35 },
  { id: 'vein', label: 'Vein', desc: 'Transports water and food — not gas exchange', correct: false, x: 75, y: 50 },
  { id: 'stomata', label: 'Stomata', desc: 'Tiny pores that allow gas exchange and transpiration!', correct: true, x: 50, y: 75 },
  { id: 'epidermis', label: 'Epidermis', desc: 'Outer protective layer of the leaf', correct: false, x: 25, y: 50 },
];

const MASCOT_TEXTS = [
  "Our garden plant looks unhealthy! Help me give it everything it needs to make food through photosynthesis. Select the correct inputs — avoid the wrong ones!",
  "Now let's trace how water travels through the plant. Select the correct route from root to leaf. Water moves upward — which path is right?",
  "Look at this leaf! Find the structure responsible for gas exchange. Click the correct part of the leaf.",
];

export function BioDetective({ world, onComplete, onExit }: BioDetectiveProps) {
  const [phase, setPhase] = useState<'intro' | 'photosynthesis' | 'water' | 'leaf' | 'complete'>('intro');
  const [stage, setStage] = useState(0);
  const [score, setScore] = useState(0);
  const [pointsTrigger, setPointsTrigger] = useState(0);
  const [mascotReaction, setMascotReaction] = useState<'idle' | 'happy' | 'sad'>('idle');

  // Photosynthesis state
  const [selectedResources, setSelectedResources] = useState<string[]>([]);
  const [photoComplete, setPhotoComplete] = useState(false);
  const [wrongShake, setWrongShake] = useState<string | null>(null);
  const [plantHealthy, setPlantHealthy] = useState(false);

  // Water transport state
  const [selectedPath, setSelectedPath] = useState<number | null>(null);
  const [waterComplete, setWaterComplete] = useState(false);
  const [pathWrong, setPathWrong] = useState<number | null>(null);

  // Leaf state
  const [selectedStructure, setSelectedStructure] = useState<string | null>(null);
  const [leafComplete, setLeafComplete] = useState(false);
  const [structureWrong, setStructureWrong] = useState<string | null>(null);
  const [zoomedStructure, setZoomedStructure] = useState<string | null>(null);

  const totalStages = 3;
  const maxScore = world.points;

  const handleBegin = () => {
    setPhase('photosynthesis');
    setStage(1);
  };

  // Photosynthesis handlers
  const handleResourceClick = (resourceId: string, isCorrect: boolean) => {
    if (selectedResources.includes(resourceId) || photoComplete) return;

    if (isCorrect) {
      setSelectedResources((prev) => [...prev, resourceId]);
      setScore((prev) => prev + 25);
      setPointsTrigger((prev) => prev + 1);
      setMascotReaction('happy');

      const correctSelected = [...selectedResources, resourceId];
      const allCorrect = RESOURCES.filter((r) => r.correct).every((r) => correctSelected.includes(r.id));

      if (allCorrect) {
        setPhotoComplete(true);
        setPlantHealthy(true);
        setTimeout(() => {
          setPhase('water');
          setStage(2);
          setMascotReaction('idle');
        }, 2000);
      }
    } else {
      setWrongShake(resourceId);
      setMascotReaction('sad');
      setTimeout(() => {
        setWrongShake(null);
        setMascotReaction('idle');
      }, 500);
    }
  };

  // Water transport handlers
  const handlePathSelect = (idx: number) => {
    if (waterComplete) return;
    setSelectedPath(idx);

    if (idx === 0) {
      setWaterComplete(true);
      setScore((prev) => prev + 25);
      setPointsTrigger((prev) => prev + 1);
      setMascotReaction('happy');
      setTimeout(() => {
        setPhase('leaf');
        setStage(3);
        setMascotReaction('idle');
      }, 2000);
    } else {
      setPathWrong(idx);
      setMascotReaction('sad');
      setTimeout(() => {
        setPathWrong(null);
        setMascotReaction('idle');
      }, 500);
      setSelectedPath(null);
    }
  };

  // Leaf handlers
  const handleStructureClick = (structureId: string, isCorrect: boolean) => {
    if (leafComplete) return;
    setSelectedStructure(structureId);
    setZoomedStructure(structureId);

    if (isCorrect) {
      setLeafComplete(true);
      setScore((prev) => prev + 25);
      setPointsTrigger((prev) => prev + 1);
      setMascotReaction('happy');
      setTimeout(() => {
        setPhase('complete');
      }, 2500);
    } else {
      setStructureWrong(structureId);
      setMascotReaction('sad');
      setTimeout(() => {
        setStructureWrong(null);
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
        phase === 'water' ? MASCOT_TEXTS[1] :
        phase === 'leaf' ? MASCOT_TEXTS[2] :
        MASCOT_TEXTS[0]
      }
      mascotReaction={mascotReaction}
      hint={
        phase === 'photosynthesis' ? 'Plants need CO₂, water, sunlight, and chlorophyll to make food. Soil and oxygen are NOT inputs.' :
        phase === 'water' ? 'Water is absorbed by roots, travels up through xylem in the stem, and reaches the leaves.' :
        'Stomata are tiny pores usually on the underside of the leaf. They open and close to allow gas exchange.'
      }
      pointsTrigger={pointsTrigger}
      onExit={onExit}
      onBegin={handleBegin}
      onComplete={() => onComplete(score)}
    >
      {/* PHOTOSYNTHESIS GAME */}
      {phase === 'photosynthesis' && (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-xl font-bold text-stone-800">Build Photosynthesis</h3>
            <p className="text-sm text-stone-600 mt-1">Help Mayuri give the plant everything it needs to make food</p>
          </div>

          {/* Plant visual */}
          <div className="flex justify-center py-4">
            <div className="relative">
              {/* Sun */}
              {selectedResources.includes('sunlight') && (
                <motion.div
                  initial={{ scale: 0, rotate: 0 }}
                  animate={{ scale: 1, rotate: 360 }}
                  transition={{ duration: 1 }}
                  className="absolute -top-8 left-1/2 -translate-x-1/2"
                >
                  <Sun className="w-12 h-12 text-saffron-400 fill-saffron-300" />
                </motion.div>
              )}

              {/* Plant SVG */}
              <motion.svg
                width="160"
                height="200"
                viewBox="0 0 160 200"
                animate={{ scale: photoComplete ? [1, 1.05, 1] : 1 }}
                transition={{ duration: 1, repeat: photoComplete ? Infinity : 0 }}
              >
                {/* Pot */}
                <path d="M 50 160 L 55 190 L 105 190 L 110 160 Z" fill="#9A3412" stroke="#7C2D12" strokeWidth="2" />
                {/* Stem */}
                <line x1="80" y1="160" x2="80" y2="80" stroke="#15803D" strokeWidth="4" />
                {/* Leaves */}
                <motion.ellipse
                  cx="60" cy="100" rx="20" ry="10"
                  fill={plantHealthy ? "#22C55E" : "#86EFAC"}
                  stroke="#15803D" strokeWidth="2"
                  animate={photoComplete ? { rotate: [0, 5, 0] } : {}}
                  style={{ transformOrigin: '70px 100px' }}
                />
                <motion.ellipse
                  cx="100" cy="120" rx="20" ry="10"
                  fill={plantHealthy ? "#22C55E" : "#86EFAC"}
                  stroke="#15803D" strokeWidth="2"
                  animate={photoComplete ? { rotate: [0, -5, 0] } : {}}
                  style={{ transformOrigin: '90px 120px' }}
                />
                <motion.ellipse
                  cx="80" cy="70" rx="25" ry="12"
                  fill={plantHealthy ? "#16A34A" : "#86EFAC"}
                  stroke="#15803D" strokeWidth="2"
                  animate={photoComplete ? { scale: [1, 1.1, 1] } : {}}
                  style={{ transformOrigin: '80px 70px' }}
                />
                {/* Water droplets */}
                {selectedResources.includes('water') && (
                  <>
                    <motion.circle cx="80" cy="150" r="3" fill="#3B82F6"
                      animate={{ y: [0, -60, 0], opacity: [1, 0, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <motion.circle cx="70" cy="155" r="2" fill="#3B82F6"
                      animate={{ y: [0, -50, 0], opacity: [1, 0, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    />
                  </>
                )}
                {/* Food/energy icon when complete */}
                {photoComplete && (
                  <motion.text x="80" y="50" textAnchor="middle" fontSize="20"
                    initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    ✨
                  </motion.text>
                )}
              </motion.svg>

              {/* CO2 label */}
              {selectedResources.includes('co2') && (
                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="absolute top-20 -left-8 text-xs font-bold text-stone-600"
                >
                  CO₂ →
                </motion.div>
              )}
            </div>
          </div>

          {/* Resource tokens */}
          <div className="grid grid-cols-3 gap-2.5">
            {RESOURCES.map((resource) => {
              const isSelected = selectedResources.includes(resource.id);
              const isWrong = wrongShake === resource.id;
              const Icon = resource.icon;

              return (
                <motion.button
                  key={resource.id}
                  onClick={() => handleResourceClick(resource.id, resource.correct)}
                  disabled={isSelected || photoComplete}
                  animate={
                    isWrong ? { x: [-5, 5, -5, 5, 0] } :
                    isSelected ? { scale: [1, 1.15, 1], y: [0, -10, 0] } : { scale: 1 }
                  }
                  transition={{ duration: 0.4 }}
                  className={`relative p-3 rounded-2xl border-2 shadow-md transition-all ${
                    isSelected
                      ? 'bg-forest-50 border-forest-400 opacity-50'
                      : `${resource.bgColor} ${resource.borderColor} hover:scale-105`
                  }`}
                >
                  <Icon className={`w-6 h-6 mx-auto ${resource.color}`} />
                  <p className={`text-xs font-bold mt-1 ${resource.color}`}>{resource.label}</p>
                  {isSelected && <CheckCircle2 className="absolute top-1 right-1 w-4 h-4 text-forest-500" />}
                  {isWrong && <XCircle className="absolute top-1 right-1 w-4 h-4 text-terracotta-500" />}
                </motion.button>
              );
            })}
          </div>

          {photoComplete && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center p-3 bg-forest-50 border-2 border-forest-300 rounded-2xl"
            >
              <p className="text-forest-700 font-bold text-sm">The plant is making food! Photosynthesis is working!</p>
            </motion.div>
          )}
        </div>
      )}

      {/* WATER TRANSPORT GAME */}
      {phase === 'water' && (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-xl font-bold text-stone-800">Trace Water Transport</h3>
            <p className="text-sm text-stone-600 mt-1">Select the correct route water takes through the plant</p>
          </div>

          {/* Plant diagram with water animation */}
          {waterComplete && (
            <div className="flex justify-center py-2">
              <svg width="120" height="180" viewBox="0 0 120 180">
                {/* Root */}
                <path d="M 60 160 Q 40 170 30 165 M 60 160 Q 80 170 90 165" fill="none" stroke="#9A3412" strokeWidth="3" />
                {/* Stem */}
                <line x1="60" y1="160" x2="60" y2="30" stroke="#15803D" strokeWidth="4" />
                {/* Xylem (inside stem) */}
                <line x1="60" y1="160" x2="60" y2="30" stroke="#3B82F6" strokeWidth="2" strokeDasharray="3 3" />
                {/* Leaves */}
                <ellipse cx="40" cy="60" rx="18" ry="8" fill="#22C55E" stroke="#15803D" strokeWidth="2" />
                <ellipse cx="80" cy="80" rx="18" ry="8" fill="#22C55E" stroke="#15803D" strokeWidth="2" />
                {/* Water droplets traveling up */}
                <motion.circle cx="60" cy="155" r="4" fill="#3B82F6"
                  animate={{ cy: [155, 30], opacity: [1, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.circle cx="60" cy="155" r="3" fill="#60A5FA"
                  animate={{ cy: [155, 30], opacity: [1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
                />
                {/* Labels */}
                <text x="70" y="160" fontSize="9" fill="#9A3412" fontWeight="bold">Roots</text>
                <text x="68" y="100" fontSize="9" fill="#3B82F6" fontWeight="bold">Xylem</text>
                <text x="65" y="50" fontSize="9" fill="#15803D" fontWeight="bold">Stem</text>
                <text x="20" y="40" fontSize="9" fill="#15803D" fontWeight="bold">Leaves</text>
              </svg>
            </div>
          )}

          {/* Path options */}
          <div className="space-y-2.5">
            {PATH_OPTIONS.map((path, idx) => {
              const isSelected = selectedPath === idx;
              const isWrong = pathWrong === idx;
              const isCorrect = waterComplete && idx === 0;

              return (
                <motion.button
                  key={idx}
                  onClick={() => handlePathSelect(idx)}
                  disabled={waterComplete}
                  animate={
                    isWrong ? { x: [-5, 5, -5, 5, 0] } :
                    isCorrect ? { scale: [1, 1.03, 1] } : { scale: 1 }
                  }
                  transition={{ duration: 0.4 }}
                  className={`w-full p-3 rounded-2xl border-2 shadow-md transition-all ${
                    isCorrect
                      ? 'bg-forest-50 border-forest-500'
                      : isWrong
                      ? 'bg-terracotta-50 border-terracotta-400'
                      : 'bg-white border-cream-300 hover:border-forest-300'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    {path.map((step, stepIdx) => (
                      <div key={stepIdx} className="flex items-center gap-2">
                        {stepIdx > 0 && <ArrowRight className="w-4 h-4 text-stone-400" />}
                        <span className={`text-sm font-bold ${
                          isCorrect ? 'text-forest-700' : isWrong ? 'text-terracotta-700' : 'text-stone-700'
                        }`}>
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {waterComplete && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center p-3 bg-forest-50 border-2 border-forest-300 rounded-2xl"
            >
              <p className="text-forest-700 font-bold text-sm">Water flows: Roots → Xylem → Stem → Leaves!</p>
            </motion.div>
          )}
        </div>
      )}

      {/* LEAF INVESTIGATION GAME */}
      {phase === 'leaf' && (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-xl font-bold text-stone-800">Investigate the Leaf</h3>
            <p className="text-sm text-stone-600 mt-1">Find the structure responsible for gas exchange. Click the correct part.</p>
          </div>

          {/* Leaf diagram */}
          <div className="flex justify-center py-4">
            <div className="relative">
              <svg width="260" height="200" viewBox="0 0 260 200">
                {/* Leaf shape */}
                <path d="M 130 20 Q 220 60 200 150 Q 130 180 60 150 Q 40 60 130 20 Z"
                  fill="#86EFAC" stroke="#15803D" strokeWidth="2" />
                {/* Vein */}
                <line x1="130" y1="25" x2="130" y2="170" stroke="#15803D" strokeWidth="2" />
                <path d="M 130 60 Q 100 70 70 80 M 130 90 Q 160 100 190 105 M 130 120 Q 100 130 75 135"
                  fill="none" stroke="#15803D" strokeWidth="1.5" opacity="0.5" />

                {/* Gas exchange animation when stomata found */}
                {leafComplete && (
                  <>
                    <motion.path d="M 130 150 L 120 165 L 140 165 Z"
                      fill="#15803D"
                      animate={{ scale: [1, 1.3, 1] }}
                      style={{ transformOrigin: '130px 157px' }}
                    />
                    {/* Gas arrows */}
                    <motion.text x="100" y="175" fontSize="14"
                      animate={{ x: [100, 80], opacity: [1, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}>CO₂→</motion.text>
                    <motion.text x="145" y="175" fontSize="14"
                      animate={{ x: [145, 165], opacity: [1, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}>←O₂</motion.text>
                  </>
                )}

                {/* Clickable structure markers */}
                {LEAF_STRUCTURES.map((structure) => {
                  const cx = (structure.x / 100) * 260;
                  const cy = (structure.y / 100) * 200;
                  const isSelected = selectedStructure === structure.id;
                  const isWrong = structureWrong === structure.id;
                  const isZoomed = zoomedStructure === structure.id;
                  const isCorrect = structure.correct && leafComplete;

                  return (
                    <g key={structure.id}>
                      <motion.circle
                        cx={cx} cy={cy}
                        r={isZoomed ? 12 : 8}
                        fill={isCorrect ? '#22C55E' : isWrong ? '#E0745C' : isSelected ? '#F97316' : '#FCD34D'}
                        stroke="#15803D" strokeWidth="2"
                        animate={isWrong ? { x: [-3, 3, -3, 3, 0] } : {}}
                        className="cursor-pointer"
                        onClick={() => handleStructureClick(structure.id, structure.correct)}
                      />
                      {isZoomed && (
                        <text x={cx} y={cy - 15} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1A1A1A">
                          {structure.label}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Structure info */}
          {zoomedStructure && (() => {
            const structure = LEAF_STRUCTURES.find((s) => s.id === zoomedStructure);
            if (!structure) return null;
            return (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-2xl border-2 text-center ${
                  structure.correct && leafComplete
                    ? 'bg-forest-50 border-forest-300'
                    : structure.correct
                    ? 'bg-forest-50 border-forest-300'
                    : 'bg-cream-50 border-cream-300'
                }`}
              >
                <p className="font-bold text-sm text-stone-800">{structure.label}</p>
                <p className="text-xs text-stone-600 mt-1">{structure.desc}</p>
              </motion.div>
            );
          })()}

          {leafComplete && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center p-3 bg-forest-50 border-2 border-forest-300 rounded-2xl"
            >
              <p className="text-forest-700 font-bold text-sm">
                Stomata allow gas exchange and help in transpiration!
              </p>
            </motion.div>
          )}
        </div>
      )}
    </MissionShell>
  );
}
