import { useState } from 'react';
import { Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';

interface HintButtonProps {
  hint: string;
}

export function HintButton({ hint }: HintButtonProps) {
  const [showHint, setShowHint] = useState(false);

  return (
    <div className="w-full">
      <button
        onClick={() => setShowHint(!showHint)}
        className="flex items-center gap-2 px-4 py-2.5 bg-cream-100 hover:bg-cream-200 text-stone-700 font-semibold rounded-xl border-2 border-cream-300 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        aria-expanded={showHint}
        aria-controls="hint-content"
      >
        <Lightbulb className="w-5 h-5 text-saffron-500" />
        <span>{showHint ? 'Hide Hint' : 'Need a Hint?'}</span>
        {showHint ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {showHint && (
        <div
          id="hint-content"
          className="mt-3 p-4 bg-saffron-50 border-2 border-saffron-200 rounded-xl animate-slide-up"
        >
          <div className="flex gap-2 items-start">
            <Lightbulb className="w-5 h-5 text-saffron-500 flex-shrink-0 mt-0.5" />
            <p className="text-stone-700 text-sm leading-relaxed">{hint}</p>
          </div>
        </div>
      )}
    </div>
  );
}
