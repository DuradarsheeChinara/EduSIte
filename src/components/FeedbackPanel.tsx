import { CheckCircle2, XCircle } from 'lucide-react';
import correctRemarkImage from '../../game feedbacks [part l]/remark_correct.jpeg';
import notQuiteRemarkImage from '../../game feedbacks [part l]/remark_not_quite.jpeg';

const REMARK_IMAGES = {
  correct: correctRemarkImage,
  incorrect: notQuiteRemarkImage,
};

interface FeedbackPanelProps {
  isCorrect: boolean;
  correctAnswer?: string;
  explanation: string;
}

export function FeedbackPanel({ isCorrect, correctAnswer, explanation }: FeedbackPanelProps) {
  const remarkImage = isCorrect ? REMARK_IMAGES.correct : REMARK_IMAGES.incorrect;

  return (
    <div
      className={`p-5 rounded-2xl border-2 animate-pop-in ${
        isCorrect
          ? 'bg-forest-50 border-forest-300'
          : 'bg-terracotta-50 border-terracotta-300'
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        {isCorrect ? (
          <CheckCircle2 className="w-7 h-7 text-forest-600 flex-shrink-0 mt-0.5" />
        ) : (
          <XCircle className="w-7 h-7 text-terracotta-600 flex-shrink-0 mt-0.5" />
        )}
        <img src={remarkImage} alt="" className="h-20 w-28 flex-shrink-0 rounded-xl object-cover" />
        <div className="flex-1">
          <p
            className={`font-bold text-lg ${
              isCorrect ? 'text-forest-700' : 'text-terracotta-700'
            }`}
          >
            {isCorrect ? 'Correct! Well done!' : 'Not quite right'}
          </p>
          {!isCorrect && correctAnswer && (
            <p className="text-sm text-stone-600 mt-1">
              <span className="font-semibold">Correct answer:</span> {correctAnswer}
            </p>
          )}
          <p className="text-stone-700 text-sm mt-2 leading-relaxed">{explanation}</p>
        </div>
      </div>
    </div>
  );
}
