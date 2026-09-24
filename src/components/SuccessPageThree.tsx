import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { SurveyState } from '../types/survey';

interface SuccessPageThreeProps {
  surveyState?: SurveyState;
  onReset?: () => void;
}

export const SuccessPageThree: React.FC<SuccessPageThreeProps> = () => {
  useEffect(() => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#059669', '#10B981', '#1F2937', '#F59E0B'],
      });
    } catch (e) {
      console.log('Confetti error:', e);
    }
  }, []);

  return (
    <div className="flex-1 flex flex-col justify-between p-5 bg-bankBg text-center">
      <div className="my-auto space-y-4 max-w-sm mx-auto w-full">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 border-4 border-emerald-50 shadow-inner">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>

        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5" /> Feedback Submitted
        </span>

        <h2 className="text-xl font-extrabold text-textPrimary tracking-tight">
          Thank You For Your Feedback!
        </h2>
      </div>
    </div>
  );
};
