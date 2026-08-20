import { motion, AnimatePresence } from 'framer-motion';
import type { StationMap } from './types';
import { REACTION_ORDER, STATION_META } from './types';

interface LabStatusProps {
  stations: StationMap;
  power: number;
  reactorActive: boolean;
}

const STATION_ICONS: Record<string, React.ReactNode> = {
  combination: (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      <circle cx="12" cy="22" r="7" fill="#FB923C" stroke="#C2410C" strokeWidth="1.5" />
      <circle cx="32" cy="22" r="7" fill="#FED7AA" stroke="#C2410C" strokeWidth="1.5" />
      <path d="M19 22 L25 22" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 2" />
      <circle cx="22" cy="22" r="2" fill="#9A3412" />
    </svg>
  ),
  decomposition: (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      <circle cx="22" cy="22" r="7" fill="#E0745C" stroke="#8F2F1F" strokeWidth="1.5" />
      <path d="M15 22 L8 14" stroke="#8F2F1F" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 2" />
      <path d="M29 22 L36 14" stroke="#8F2F1F" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 2" />
      <circle cx="6" cy="12" r="3" fill="#FAE5DC" stroke="#8F2F1F" strokeWidth="1" />
      <circle cx="38" cy="12" r="3" fill="#FAE5DC" stroke="#8F2F1F" strokeWidth="1" />
    </svg>
  ),
  displacement: (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      <rect x="8" y="16" width="10" height="10" rx="2" fill="#A5B4FC" stroke="#4338CA" strokeWidth="1.5" />
      <path d="M18 21 L26 21" stroke="#4338CA" strokeWidth="2" strokeLinecap="round" />
      <path d="M22 17 L26 21 L22 25" fill="none" stroke="#4338CA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="28" y="16" width="10" height="10" rx="2" fill="#C7D2FE" stroke="#4338CA" strokeWidth="1.5" />
    </svg>
  ),
  'double-displacement': (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      <circle cx="12" cy="14" r="5" fill="#5EEAD4" stroke="#0F766E" strokeWidth="1.5" />
      <circle cx="32" cy="14" r="5" fill="#99F6E4" stroke="#0F766E" strokeWidth="1.5" />
      <circle cx="12" cy="30" r="5" fill="#99F6E4" stroke="#0F766E" strokeWidth="1.5" />
      <circle cx="32" cy="30" r="5" fill="#5EEAD4" stroke="#0F766E" strokeWidth="1.5" />
      <path d="M17 14 Q22 22 27 30" fill="none" stroke="#0F766E" strokeWidth="1.5" strokeDasharray="3 2" />
      <path d="M17 30 Q22 22 27 14" fill="none" stroke="#0F766E" strokeWidth="1.5" strokeDasharray="3 2" />
    </svg>
  ),
};

export function LabStatus({ stations, power, reactorActive }: LabStatusProps) {
  const completedCount = REACTION_ORDER.filter((r) => stations[r].phase === 'complete').length;

  return (
    <div className="relative w-full">
      {/* Power meter */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xs font-bold text-stone-600 whitespace-nowrap">Lab Power</span>
        <div className="flex-1 h-5 bg-stone-200/70 rounded-full overflow-hidden border-2 border-cream-300 relative">
          <motion.div
            className="h-full rounded-full relative overflow-hidden"
            style={{
              background: reactorActive
                ? 'linear-gradient(90deg, #22C55E, #4ADE80, #22C55E)'
                : 'linear-gradient(90deg, #F97316, #FB923C, #FED7AA)',
            }}
            initial={{ width: '0%' }}
            animate={{ width: `${power}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </motion.div>
          <span className="absolute inset-0 flex items-center justify-center text-[11px] font-extrabold text-stone-800 tabular-nums">
            {power}%
          </span>
        </div>
      </div>

      {/* Station row + reactor */}
      <div className="flex items-end justify-between gap-1 sm:gap-2">
        {REACTION_ORDER.map((type, idx) => {
          const meta = STATION_META[type];
          const state = stations[type];
          const isComplete = state.phase === 'complete';
          const isActive = state.phase === 'active';
          const isLocked = state.phase === 'locked';

          return (
            <div key={type} className="flex items-end gap-1 sm:gap-2 flex-1">
              {/* Station */}
              <motion.div
                animate={
                  isActive
                    ? { y: [0, -3, 0], boxShadow: [
                        '0 0 0 0 rgba(249,115,22,0.4)',
                        '0 0 0 6px rgba(249,115,22,0)',
                      ] }
                    : {}
                }
                transition={isActive ? { duration: 1.5, repeat: Infinity } : {}}
                className={`relative flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 ${
                  isComplete
                    ? `${meta.accentBg} ${meta.accentBorder} shadow-md`
                    : isActive
                    ? `bg-white ${meta.accentBorder} ring-2 ${meta.accentRing}`
                    : 'bg-stone-100 border-stone-300 opacity-50'
                }`}
              >
                <div className={isLocked ? 'opacity-40' : ''}>{STATION_ICONS[type]}</div>
                <p className={`text-[8px] sm:text-[9px] font-bold mt-0.5 ${isComplete ? meta.accentText : 'text-stone-500'}`}>
                  {meta.shortLabel}
                </p>
                {isComplete && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-forest-500 rounded-full flex items-center justify-center"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6 L5 9 L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>
                )}
                {isLocked && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-stone-900/10">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <rect x="5" y="11" width="14" height="9" rx="2" fill="#78716C" />
                      <path d="M8 11 V8 a4 4 0 0 1 8 0 V11" stroke="#78716C" strokeWidth="2" fill="none" />
                    </svg>
                  </div>
                )}
              </motion.div>

              {/* Pipe segment */}
              {idx < REACTION_ORDER.length - 1 && (
                <div className="flex-1 h-2 rounded-full relative overflow-hidden bg-stone-200/70 min-w-[8px]">
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ background: 'linear-gradient(90deg, #F97316, #FB923C)' }}
                    initial={{ width: '0%' }}
                    animate={{ width: isComplete ? '100%' : '0%' }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              )}
            </div>
          );
        })}

        {/* Pipe to reactor */}
        <div className="flex-1 h-2 rounded-full relative overflow-hidden bg-stone-200/70 min-w-[8px] mx-1">
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: 'linear-gradient(90deg, #F97316, #FB923C)' }}
            initial={{ width: '0%' }}
            animate={{ width: completedCount === REACTION_ORDER.length ? '100%' : `${(completedCount / REACTION_ORDER.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Central reactor */}
        <motion.div
          animate={
            reactorActive
              ? { scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }
              : completedCount === REACTION_ORDER.length
              ? { scale: [1, 1.08, 1] }
              : {}
          }
          transition={reactorActive ? { duration: 2, repeat: Infinity } : { duration: 0.5 }}
          className={`relative flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 ${
            reactorActive
              ? 'bg-forest-100 border-forest-500 shadow-lg'
              : completedCount === REACTION_ORDER.length
              ? 'bg-saffron-100 border-saffron-500 ring-4 ring-saffron-300'
              : 'bg-stone-200 border-stone-400'
          }`}
        >
          <motion.div
            animate={reactorActive ? { rotate: 360 } : {}}
            transition={reactorActive ? { duration: 4, repeat: Infinity, ease: 'linear' } : {}}
          >
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="6" fill={reactorActive ? '#22C55E' : '#A8A29E'} />
              <circle cx="18" cy="18" r="11" fill="none" stroke={reactorActive ? '#16A34A' : '#78716C'} strokeWidth="2" strokeDasharray="4 3" />
              <circle cx="18" cy="18" r="15" fill="none" stroke={reactorActive ? '#4ADE80' : '#A8A29E'} strokeWidth="1.5" strokeDasharray="2 4" />
            </svg>
          </motion.div>
          <p className={`text-[8px] sm:text-[9px] font-bold mt-0.5 ${reactorActive ? 'text-forest-700' : 'text-stone-500'}`}>
            Reactor
          </p>
        </motion.div>
      </div>
    </div>
  );
}
