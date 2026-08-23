import { motion } from 'framer-motion';
import { useState } from 'react';
import hintIcon from '../../../UI icons[part e]/hint icon.jpeg';

interface HintButtonProps {
  hint: string;
  accentColor?: string;
}

const colorMap: Record<string, { bg: string; border: string; text: string; hintBg: string }> = {
  forest: { bg: 'bg-forest-100', border: 'border-forest-300', text: 'text-forest-700', hintBg: 'bg-forest-50' },
  saffron: { bg: 'bg-saffron-100', border: 'border-saffron-300', text: 'text-saffron-700', hintBg: 'bg-saffron-50' },
  terracotta: { bg: 'bg-terracotta-100', border: 'border-terracotta-300', text: 'text-terracotta-700', hintBg: 'bg-terracotta-50' },
  indigo: { bg: 'bg-indigo-100', border: 'border-indigo-300', text: 'text-indigo-700', hintBg: 'bg-indigo-50' },
  teal: { bg: 'bg-teal-100', border: 'border-teal-300', text: 'text-teal-700', hintBg: 'bg-teal-50' },
};

export function HintButton({ hint, accentColor = 'saffron' }: HintButtonProps) {
  const [show, setShow] = useState(false);
  const colors = colorMap[accentColor] || colorMap.saffron;

  return (
    <div className="absolute bottom-3 right-3 z-20">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShow(!show)}
        className={`flex items-center gap-1.5 px-3 py-2 ${colors.bg} ${colors.text} font-semibold rounded-xl border-2 ${colors.border} text-xs shadow-sm`}
        aria-expanded={show}
      >
        <img src={hintIcon} alt="" className="w-4 h-4" />
        {show ? 'Hide' : 'Hint'}
      </motion.button>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`absolute bottom-12 right-0 w-56 p-3 ${colors.hintBg} border-2 ${colors.border} rounded-xl shadow-lg`}
        >
          <p className="text-xs text-stone-700 leading-relaxed">{hint}</p>
        </motion.div>
      )}
    </div>
  );
}
