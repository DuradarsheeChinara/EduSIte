import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FinalAutomationProps {
  onActivate: () => void;
}

type Stage = 'scanning' | 'online' | 'ready';

export function FinalAutomation({ onActivate }: FinalAutomationProps) {
  const [stage, setStage] = useState<Stage>('scanning');
  const [activeField, setActiveField] = useState(-1);

  useEffect(() => {
    const t1 = setTimeout(() => setStage('online'), 2500);
    const t2 = setTimeout(() => setStage('ready'), 3500);
    const t3 = setTimeout(onActivate, 4500);

    // Animate scanning fields
    let field = 0;
    const scanInterval = setInterval(() => {
      setActiveField(field);
      field = (field + 1) % 4;
    }, 400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearInterval(scanInterval);
    };
  }, [onActivate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #134E4A 0%, #0D9488 50%, #115E59 100%)' }}
    >
      {/* Particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 4 + (i % 3) * 2,
            height: 4 + (i % 3) * 2,
            left: `${(i * 41) % 100}%`,
            top: `${(i * 67) % 100}%`,
            background: ['#5EEAD4', '#2DD4BF', '#4ADE80'][i % 3],
          }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: (i * 0.1) % 2 }}
        />
      ))}

      <div className="relative flex flex-col items-center">
        {/* Smart farm visualization */}
        <svg width="280" height="140" viewBox="0 0 280 140">
          {/* Control box */}
          <rect x="115" y="10" width="50" height="30" rx="4" fill={stage === 'online' ? '#22C55E' : '#0D9488'} stroke="#0F766E" strokeWidth="2" />
          <text x="140" y="28" textAnchor="middle" fontSize="7" fontWeight="bold" fill="white">CONTROL</text>

          {/* Pipes to fields */}
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1={140} y1={40} x2={40 + i * 65} y2={70} stroke={stage === 'online' ? '#5EEAD4' : '#475569'} strokeWidth="2" strokeDasharray="3 2" />
          ))}

          {/* Fields */}
          {[0, 1, 2, 3].map((i) => {
            const isDry = i % 2 === 0;
            const isScanning = stage === 'scanning' && activeField === i;
            const isWatered = stage === 'online' && isDry;
            return (
              <g key={i}>
                <rect x={20 + i * 65} y={65} width={50} height={50} rx="4" fill={isWatered ? '#16A34A' : '#4A2D1A'} stroke="#3730A3" strokeWidth="1.5" opacity={isScanning ? 1 : 0.7} />
                {/* Plants */}
                {[0, 1, 2].map((p) => (
                  <g key={p}>
                    <line x1={28 + i * 65 + p * 14} y1={65} x2={28 + i * 65 + p * 14} y2={isWatered ? 48 : 58} stroke={isWatered ? '#22C55E' : '#15803D'} strokeWidth="2" />
                    <ellipse cx={28 + i * 65 + p * 14} cy={isWatered ? 46 : 56} rx="4" ry="3" fill={isWatered ? '#4ADE80' : '#86EFAC'} />
                  </g>
                ))}
                {/* Scan indicator */}
                {isScanning && (
                  <motion.circle cx={45 + i * 65} cy={90} r="3" fill="#FBBF24"
                    animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.4, repeat: Infinity }}
                  />
                )}
                {/* Water drop when watering */}
                {isWatered && (
                  <motion.circle cx={45 + i * 65} cy={55} r="2" fill="#3B82F6"
                    animate={{ y: [0, 15], opacity: [1, 0] }} transition={{ duration: 0.6, repeat: Infinity }}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Status text */}
        <AnimatePresence mode="wait">
          {stage === 'scanning' && (
            <motion.p key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-lg font-bold text-teal-200 mt-4"
            >
              Scanning fields...
            </motion.p>
          )}
          {stage === 'online' && (
            <motion.p key="online" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="text-xl font-extrabold text-forest-200 mt-4"
            >
              SMART IRRIGATION ONLINE!
            </motion.p>
          )}
          {stage === 'ready' && (
            <motion.p key="ready" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="text-sm font-bold text-white mt-4"
            >
              Preparing your badge...
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Confetti */}
      {stage === 'online' && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-sm"
              style={{
                left: `${(i * 31) % 100}%`,
                top: '-5%',
                background: ['#5EEAD4', '#4ADE80', '#22C55E', '#FBBF24'][i % 4],
              }}
              animate={{ y: ['0vh', '110vh'], rotate: [0, 360], opacity: [1, 1, 0] }}
              transition={{ duration: 2 + (i % 3), repeat: Infinity, delay: (i * 0.05) % 2, ease: 'easeIn' }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
