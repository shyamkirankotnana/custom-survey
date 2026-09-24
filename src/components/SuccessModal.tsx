import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, ShieldCheck, RefreshCw, Building2 } from 'lucide-react';
import { SurveyState } from '../types/survey';

interface SuccessModalProps {
  surveyState: SurveyState;
  onReset: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  surveyState,
  onReset,
}) => {
  useEffect(() => {
    // Fire confetti celebration on launch
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D71920', '#22C55E', '#1F2937', '#F59E0B'],
      });
    } catch (e) {
      console.log('Confetti error:', e);
    }
  }, []);

  const refNumber = `FB-SRV-${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-bankBorder text-center relative overflow-hidden">
        {/* Top Accent Gradient */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-primary to-emerald-600" />

        {/* Icon */}
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-emerald-50 shadow-inner">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>

        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold mb-2">
          <ShieldCheck className="w-3.5 h-3.5" /> Response Submitted
        </span>

        <h3 className="text-xl font-extrabold text-textPrimary mb-2 tracking-tight">
          Thank You For Your Feedback!
        </h3>

        <p className="text-xs text-textSecondary leading-relaxed mb-4">
          Your valuable insights help us elevate our relationship banking services and deliver exceptional experiences.
        </p>

        {/* Reference Receipt Card */}
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200/80 mb-5 text-left space-y-2">
          <div className="flex items-center justify-between text-[11px] text-textSecondary font-semibold pb-2 border-b border-gray-200">
            <span>Reference ID</span>
            <span className="font-mono text-textPrimary font-bold">{refNumber}</span>
          </div>

          <div className="flex items-center justify-between text-xs font-medium pt-1">
            <span className="text-textSecondary">NPS Score:</span>
            <span className="font-bold text-primary">{surveyState.npsScore} / 10</span>
          </div>

          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-textSecondary">Resolution Ease:</span>
            <span className="font-bold text-textPrimary">{surveyState.resolutionEase || 'Not rated'}</span>
          </div>

          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-textSecondary">Aspects Evaluated:</span>
            <span className="font-bold text-emerald-600">
              {Object.keys(surveyState.aspectRatings).length} of 8 cards
            </span>
          </div>
        </div>

        {/* Reset / Test Again Action Button */}
        <button
          type="button"
          onClick={onReset}
          className="w-full min-h-[48px] bg-primary text-white font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 shadow-brand hover:bg-primary-hover transition-all active:scale-95 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Test Survey Again</span>
        </button>

        <p className="text-[11px] text-gray-400 mt-3 flex items-center justify-center gap-1 font-medium">
          <Building2 className="w-3 h-3" />
          First Bank Ltd • Customer Excellence Cell
        </p>
      </div>
    </div>
  );
};
