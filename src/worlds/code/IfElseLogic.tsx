import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IfElseLogicProps {
  onComplete: () => void;
}

type Step = 'scenario1' | 'run1' | 'scenario2' | 'run2' | 'done';
type Choice = 'yes' | 'no' | null;

export function IfElseLogic({ onComplete }: IfElseLogicProps) {
  const [step, setStep] = useState<Step>('scenario1');
  const [choice, setChoice] = useState<Choice>(null);
  const [wrong, setWrong] = useState(false);
  const [pumpOn, setPumpOn] = useState(false);
  const [running, setRunning] = useState(false);

  const moisture = step === 'scenario1' || step === 'run1' ? 60 : 20;
  const threshold = 30;
  const isDry = moisture < threshold;
  const correctChoice: Choice = isDry ? 'yes' : 'no';

  const handleChoose = useCallback((c: Choice) => {
    if (step !== 'scenario1' && step !== 'scenario2') return;
    setChoice(c);
    if (c === correctChoice) {
      const currentStep = step;
      setRunning(true);
      if (currentStep === 'scenario1') {
        setStep('run1');
        if (c === 'no') setPumpOn(false);
        setTimeout(() => {
          setStep('scenario2');
          setChoice(null);
          setRunning(false);
        }, 2000);
      } else {
        setStep('run2');
        if (c === 'yes') setPumpOn(true);
        setTimeout(() => {
          setStep('done');
          setTimeout(onComplete, 2000);
        }, 2000);
      }
    } else {
      setWrong(true);
      setTimeout(() => {
        setWrong(false);
        setChoice(null);
      }, 500);
    }
  }, [step, correctChoice, onComplete]);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-bold text-stone-800">Stage 3: IF / ELSE Logic</h3>
        <p className="text-sm text-stone-600 mt-0.5">
          {step === 'scenario1' ? 'Moisture is 60%. Threshold is 30%. Should the pump start?' :
           step === 'run1' ? 'Correct! 60% > 30% so the pump stays OFF — no wasted water.' :
           step === 'scenario2' ? 'Now moisture is 20%. Threshold is 30%. Should the pump start?' :
           step === 'run2' ? 'Correct! 20% < 30% so the pump turns ON — crops need water!' :
           'Both scenarios handled! The system makes smart decisions.'}
        </p>
      </div>

      {/* System visualization */}
      <div className="flex justify-center">
        <svg width="280" height="160" viewBox="0 0 280 160">
          {/* Sensor reading */}
          <rect x="10" y="55" width="55" height="40" rx="4" fill="#4F46E5" stroke="#3730A3" strokeWidth="2" />
          <text x="37" y="72" textAnchor="middle" fontSize="7" fontWeight="bold" fill="white">SENSOR</text>
          <motion.text x="37" y="87" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white"
            key={moisture}
            initial={{ scale: 0.5 }} animate={{ scale: 1 }}
          >
            {moisture}%
          </motion.text>

          {/* Arrow to decision */}
          <line x1="65" y1="75" x2="95" y2="75" stroke="#4F46E5" strokeWidth="1.5" strokeDasharray="3 2" />

          {/* Decision diamond */}
          <polygon points="120,45 160,75 120,105 80,75" fill="#FFEDD5" stroke="#F97316" strokeWidth="2.5" />
          <text x="120" y="73" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#9A3412">
            {'<'} {threshold}%?
          </text>
          <text x="120" y="85" textAnchor="middle" fontSize="7" fill="#9A3412">{moisture}%</text>

          {/* YES / NO branches */}
          <text x="165" y="50" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#22C55E">YES → PUMP ON</text>
          <text x="165" y="110" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#78716C">NO → PUMP OFF</text>

          {/* Pump */}
          <rect x="200" y="55" width="45" height="40" rx="4" fill={pumpOn ? '#22C55E' : '#D4B565'} stroke={pumpOn ? '#15803D' : '#78716C'} strokeWidth="2" />
          <text x="222" y="78" textAnchor="middle" fontSize="8" fontWeight="bold" fill={pumpOn ? 'white' : '#4B5563'}>
            {pumpOn ? 'PUMP ON' : 'PUMP OFF'}
          </text>

          {/* Water flow when pump on */}
          {pumpOn && (
            <motion.circle cx="248" cy="75" r="3" fill="#3B82F6"
              animate={{ x: [0, 20], opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          )}

          {/* Crops */}
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <line x1={250 + i * 10} y1="75" x2={250 + i * 10} y2={pumpOn ? 55 : 68} stroke="#15803D" strokeWidth="2" />
              <ellipse cx={250 + i * 10} cy={pumpOn ? 53 : 66} rx="3" ry="2" fill={pumpOn ? '#22C55E' : '#86EFAC'} />
            </g>
          ))}
        </svg>
      </div>

      {/* Choice buttons */}
      {(step === 'scenario1' || step === 'scenario2') && (
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleChoose('yes')}
            animate={wrong && choice === null ? { x: [-5, 5, -5, 5, 0] } : {}}
            className={`p-4 rounded-2xl border-2 shadow-md font-bold transition-all ${
              choice === 'yes'
                ? 'bg-forest-50 border-forest-500 text-forest-700'
                : 'bg-white border-cream-300 hover:border-teal-300 text-stone-700'
            }`}
          >
            YES — Start Pump
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleChoose('no')}
            animate={wrong && choice === null ? { x: [-5, 5, -5, 5, 0] } : {}}
            className={`p-4 rounded-2xl border-2 shadow-md font-bold transition-all ${
              choice === 'no'
                ? 'bg-forest-50 border-forest-500 text-forest-700'
                : 'bg-white border-cream-300 hover:border-teal-300 text-stone-700'
            }`}
          >
            NO — Keep Pump Off
          </motion.button>
        </div>
      )}

      {/* Result */}
      <AnimatePresence>
        {step === 'done' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-3 bg-forest-50 border-2 border-forest-300 rounded-2xl"
          >
            <p className="text-sm font-bold text-forest-700">
              The system uses IF/ELSE to decide automatically!
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
