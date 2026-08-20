import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { World } from '@/types';
import { MissionShell } from '@/components/game/MissionShell';
import { CheckCircle2, XCircle, Wrench, Droplet, Sun, Cloud } from 'lucide-react';

interface TechWorkshopProps {
  world: World;
  onComplete: (score: number) => void;
  onExit: () => void;
}

const PROBLEMS = [
  { id: 'water', label: 'No clean drinking water', icon: Droplet, solutions: ['filter', 'rainwater'] as const },
  { id: 'power', label: 'No electricity for lights', icon: Sun, solutions: ['solar'] as const },
  { id: 'irrigation', label: 'Crops not getting enough water', icon: Cloud, solutions: ['drip'] as const },
];

const TOOLS = [
  { id: 'filter', label: 'Water Filter', icon: Droplet, color: 'text-teal-600', bgColor: 'bg-teal-100', borderColor: 'border-teal-400', desc: 'Removes impurities from water' },
  { id: 'rainwater', label: 'Rainwater Tank', icon: Cloud, color: 'text-indigo-600', bgColor: 'bg-indigo-100', borderColor: 'border-indigo-400', desc: 'Collects and stores rain' },
  { id: 'solar', label: 'Solar Panel', icon: Sun, color: 'text-saffron-600', bgColor: 'bg-saffron-100', borderColor: 'border-saffron-400', desc: 'Clean renewable energy' },
  { id: 'drip', label: 'Drip Irrigation', icon: Wrench, color: 'text-forest-600', bgColor: 'bg-forest-100', borderColor: 'border-forest-400', desc: 'Water directly to roots' },
];

const MASCOT_TEXTS = [
  "Our village has three problems! For each problem, choose the RIGHT technology tool. Click a problem, then click the tool that solves it. Some tools work for multiple problems!",
  "Great choices! You're matching the right technology to each village problem. That's what innovation is all about!",
];

export function TechWorkshop({ world, onComplete, onExit }: TechWorkshopProps) {
  const [phase, setPhase] = useState<'intro' | 'matching' | 'complete'>('intro');
  const [stage, setStage] = useState(0);
  const [score, setScore] = useState(0);
  const [pointsTrigger, setPointsTrigger] = useState(0);
  const [mascotReaction, setMascotReaction] = useState<'idle' | 'happy' | 'sad'>('idle');

  const [selectedProblem, setSelectedProblem] = useState<string | null>(null);
  const [solved, setSolved] = useState<Record<string, string>>({});
  const [wrongShake, setWrongShake] = useState<string | null>(null);
  const [showDemo, setShowDemo] = useState<string | null>(null);

  const totalStages = 1;
  const maxScore = world.points;

  const handleBegin = () => {
    setPhase('matching');
    setStage(1);
  };

  const handleProblemClick = (problemId: string) => {
    if (solved[problemId]) return;
    setSelectedProblem(problemId);
  };

  const handleToolClick = (toolId: string) => {
    if (!selectedProblem) return;
    const problem = PROBLEMS.find((p) => p.id === selectedProblem);
    if (!problem) return;

    if ((problem.solutions as readonly string[]).includes(toolId)) {
      setSolved((prev) => ({ ...prev, [selectedProblem]: toolId }));
      setScore((prev) => prev + 50);
      setPointsTrigger((prev) => prev + 1);
      setMascotReaction('happy');
      setShowDemo(toolId);
      setSelectedProblem(null);

      if (Object.keys(solved).length + 1 === PROBLEMS.length) {
        setTimeout(() => setPhase('complete'), 2500);
      }
    } else {
      setWrongShake(toolId);
      setMascotReaction('sad');
      setTimeout(() => {
        setWrongShake(null);
        setMascotReaction('idle');
      }, 500);
      setSelectedProblem(null);
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
      mascotText={MASCOT_TEXTS[0]}
      mascotReaction={mascotReaction}
      hint="Think about what each tool does: Water Filter cleans water, Rainwater Tank stores rain, Solar Panel makes electricity, Drip Irrigation waters crops efficiently."
      pointsTrigger={pointsTrigger}
      onExit={onExit}
      onBegin={handleBegin}
      onComplete={() => onComplete(score)}
    >
      {phase === 'matching' && (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-xl font-bold text-stone-800 flex items-center justify-center gap-2">
              <Wrench className="w-6 h-6 text-teal-600" />
              Choose the Right Tool
            </h3>
            <p className="text-sm text-stone-600 mt-1">Click a problem, then click the tool that solves it</p>
          </div>

          {/* Problems */}
          <div className="grid grid-cols-1 gap-3">
            {PROBLEMS.map((problem) => {
              const isSolved = solved[problem.id];
              const isSelected = selectedProblem === problem.id;
              const Icon = problem.icon;

              return (
                <motion.div
                  key={problem.id}
                  onClick={() => handleProblemClick(problem.id)}
                  animate={isSelected ? { scale: 1.02 } : { scale: 1 }}
                  className={`relative p-4 rounded-2xl border-2 shadow-md cursor-pointer transition-all ${
                    isSolved
                      ? 'bg-forest-50 border-forest-400'
                      : isSelected
                      ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-300'
                      : 'bg-white border-cream-300 hover:border-teal-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isSolved ? 'bg-forest-200' : 'bg-cream-100'
                    }`}>
                      <Icon className={`w-5 h-5 ${isSolved ? 'text-forest-600' : 'text-stone-600'}`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-stone-800 text-sm">{problem.label}</p>
                      {isSolved && (
                        <p className="text-xs text-forest-600 mt-0.5">
                          Solved with: {TOOLS.find((t) => t.id === isSolved)?.label}
                        </p>
                      )}
                    </div>
                    {isSolved && <CheckCircle2 className="w-5 h-5 text-forest-500" />}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Tools */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            {TOOLS.map((tool) => {
              const Icon = tool.icon;
              const isWrong = wrongShake === tool.id;
              const usedCount = Object.values(solved).filter((v) => v === tool.id).length;
              const isDisabled = usedCount > 0 && !PROBLEMS.some((p) => (p.solutions as readonly string[]).includes(tool.id) && !solved[p.id]);

              return (
                <motion.button
                  key={tool.id}
                  onClick={() => handleToolClick(tool.id)}
                  animate={isWrong ? { x: [-5, 5, -5, 5, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  disabled={isDisabled}
                  className={`relative p-3 rounded-2xl border-2 shadow-md transition-all ${
                    usedCount > 0
                      ? 'bg-cream-50 border-cream-200 opacity-60'
                      : 'bg-white border-cream-300 hover:border-teal-300'
                  } ${selectedProblem ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                >
                  <Icon className={`w-7 h-7 mx-auto ${tool.color}`} />
                  <p className="text-xs font-bold mt-1 text-stone-700">{tool.label}</p>
                  <p className="text-[10px] text-stone-500">{tool.desc}</p>
                  {usedCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-forest-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                      {usedCount}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Demo animation */}
          <AnimatePresence>
            {showDemo && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-4 bg-teal-50 border-2 border-teal-300 rounded-2xl text-center"
              >
                <p className="text-sm font-bold text-teal-700">
                  {showDemo === 'filter' && '💧 Water Filter: Impurities removed! Clean water flows!'}
                  {showDemo === 'rainwater' && '🌧️ Rainwater Tank: Rain collected and stored for dry days!'}
                  {showDemo === 'solar' && '☀️ Solar Panel: Clean energy powering the village!'}
                  {showDemo === 'drip' && '🌱 Drip Irrigation: Water reaching plant roots efficiently!'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {Object.keys(solved).length === PROBLEMS.length && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center p-3 bg-forest-50 border-2 border-forest-300 rounded-2xl"
            >
              <p className="text-forest-700 font-bold text-sm">
                All village problems solved! You're a true Community Innovator!
              </p>
            </motion.div>
          )}
        </div>
      )}
    </MissionShell>
  );
}
